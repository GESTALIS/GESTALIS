const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requirePermission } = require('../middleware/auth');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const crypto = require('crypto');

const router = express.Router();
const prisma = new PrismaClient();

// Configuration Multer pour l'upload de fichiers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez CSV ou XLSX.'), false);
    }
  }
});

// POST /api/imports-banque/previsualiser - Preview de l'import
router.post('/previsualiser', 
  requireAuth,
  requirePermission('imports', 'preview'),
  upload.single('fichier'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'Fichier requis',
          code: 'FILE_REQUIRED'
        });
      }

      const { file } = req;
      const lignes = [];
      let checksum = '';

      // Calcul du checksum pour l'idempotency
      checksum = crypto.createHash('sha256').update(file.buffer).digest('hex');

      // Vérifier si l'import existe déjà
      const existingImport = await prisma.importBanque.findFirst({
        where: { checksum }
      });

      if (existingImport) {
        return res.status(409).json({
          error: 'Fichier déjà importé',
          code: 'FILE_ALREADY_IMPORTED',
          importId: existingImport.id
        });
      }

      // Parser le fichier selon son type
      if (file.mimetype === 'text/csv') {
        // Parser CSV
        const csvText = file.buffer.toString('utf-8');
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const ligne = {};
            headers.forEach((header, index) => {
              ligne[header] = values[index] || '';
            });
            lignes.push(ligne);
          }
        }
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Parser XLSX
        const workbook = xlsx.read(file.buffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        lignes.push(...data);
      }

      // Validation et transformation des données
      const lignesValidees = lignes.map((ligne, index) => {
        // Normaliser les données
        const dateOperation = new Date(ligne.date || ligne.dateOperation || ligne.Date);
        const montant = parseFloat(ligne.montant || ligne.Montant || 0);
        const libelle = ligne.libelle || ligne.Libelle || ligne.description || '';
        const reference = ligne.reference || ligne.Reference || ligne.ref || '';

        return {
          ligneId: index + 1,
          dateOperation: isNaN(dateOperation.getTime()) ? null : dateOperation,
          montant: isNaN(montant) ? 0 : montant,
          libelle: libelle.trim(),
          reference: reference.trim(),
          statut: 'preview'
        };
      }).filter(ligne => ligne.montant !== 0 && ligne.dateOperation);

      // Créer l'import en statut preview
      const importBanque = await prisma.importBanque.create({
        data: {
          nomFichier: file.originalname,
          statut: 'preview',
          checksum,
          lignes: {
            create: lignesValidees.map(ligne => ({
              dateOperation: ligne.dateOperation,
              montant: ligne.montant,
              libelle: ligne.libelle,
              reference: ligne.reference
            }))
          }
        },
        include: {
          lignes: true
        }
      });

      res.json({
        success: true,
        message: 'Fichier prévisualisé avec succès',
        data: {
          importId: importBanque.id,
          nomFichier: importBanque.nomFichier,
          nombreLignes: importBanque.lignes.length,
          checksum: importBanque.checksum,
          lignes: importBanque.lignes
        },
        meta: {
          total: lignesValidees.length,
          validees: lignesValidees.length,
          rejetees: lignes.length - lignesValidees.length
        }
      });

    } catch (error) {
      console.error('Erreur lors de la prévisualisation:', error);
      res.status(500).json({
        error: 'Erreur lors de la prévisualisation du fichier',
        code: 'PREVIEW_ERROR',
        details: error.message
      });
    }
  }
);

// POST /api/imports-banque/integrer - Intégration de l'import
router.post('/integrer/:importId', 
  requireAuth,
  requirePermission('imports', 'integrer'),
  async (req, res) => {
    try {
      const { importId } = req.params;
      const idempotencyKey = req.headers['idempotency-key'];

      if (!idempotencyKey) {
        return res.status(400).json({
          error: 'Header Idempotency-Key requis',
          code: 'IDEMPOTENCY_KEY_REQUIRED'
        });
      }

      // Vérifier l'idempotency
      const existingReglements = await prisma.reglement.findMany({
        where: { sourceImportId: importId }
      });

      if (existingReglements.length > 0) {
        return res.status(409).json({
          error: 'Import déjà intégré',
          code: 'IMPORT_ALREADY_INTEGRATED',
          reglements: existingReglements
        });
      }

      // Récupérer l'import
      const importBanque = await prisma.importBanque.findUnique({
        where: { id: importId },
        include: { lignes: true }
      });

      if (!importBanque) {
        return res.status(404).json({
          error: 'Import non trouvé',
          code: 'IMPORT_NOT_FOUND'
        });
      }

      if (importBanque.statut !== 'preview') {
        return res.status(400).json({
          error: 'Import doit être en statut preview',
          code: 'INVALID_IMPORT_STATUS'
        });
      }

      // Transaction ACID pour l'intégration
      const result = await prisma.$transaction(async (tx) => {
        // Créer les règlements pour chaque ligne
        const reglements = [];
        
        for (const ligne of importBanque.lignes) {
          const reglement = await tx.reglement.create({
            data: {
              montant: ligne.montant,
              dateReglement: ligne.dateOperation,
              modeReglement: 'import_banque',
              reference: ligne.reference || `Import ${importBanque.nomFichier} - Ligne ${ligne.id}`,
              sourceImportId: importId
            }
          });
          
          reglements.push(reglement);
        }

        // Mettre à jour le statut de l'import
        await tx.importBanque.update({
          where: { id: importId },
          data: { statut: 'integre' }
        });

        // Créer un log d'audit
        await tx.auditLog.create({
          data: {
            userId: req.user.id,
            action: 'import_integre',
            resource: 'ImportBanque',
            resourceId: importId,
            details: {
              nombreReglements: reglements.length,
              montantTotal: reglements.reduce((sum, r) => sum + parseFloat(r.montant), 0),
              idempotencyKey
            }
          }
        });

        return reglements;
      });

      res.json({
        success: true,
        message: 'Import intégré avec succès',
        data: {
          importId,
          nombreReglements: result.length,
          reglements: result
        },
        meta: {
          total: result.length,
          montantTotal: result.reduce((sum, r) => sum + parseFloat(r.montant), 0)
        }
      });

    } catch (error) {
      console.error('Erreur lors de l\'intégration:', error);
      res.status(500).json({
        error: 'Erreur lors de l\'intégration de l\'import',
        code: 'INTEGRATION_ERROR',
        details: error.message
      });
    }
  }
);

// GET /api/imports-banque - Liste des imports
router.get('/', 
  requireAuth,
  requirePermission('imports', 'read'),
  async (req, res) => {
    try {
      const { page = 1, limit = 20, statut } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (statut) where.statut = statut;

      const [imports, total] = await Promise.all([
        prisma.importBanque.findMany({
          where,
          include: {
            _count: {
              select: { lignes: true, reglements: true }
            }
          },
          orderBy: { dateImport: 'desc' },
          skip: offset,
          take: parseInt(limit)
        }),
        prisma.importBanque.count({ where })
      ]);

      res.json({
        success: true,
        data: imports,
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des imports:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des imports',
        code: 'FETCH_ERROR'
      });
    }
  }
);

// GET /api/imports-banque/:id - Détails d'un import
router.get('/:id', 
  requireAuth,
  requirePermission('imports', 'read'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const importBanque = await prisma.importBanque.findUnique({
        where: { id },
        include: {
          lignes: true,
          reglements: true
        }
      });

      if (!importBanque) {
        return res.status(404).json({
          error: 'Import non trouvé',
          code: 'IMPORT_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: importBanque
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'import:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération de l\'import',
        code: 'FETCH_ERROR'
      });
    }
  }
);

module.exports = router;
