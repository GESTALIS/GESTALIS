const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requirePermission } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/lettrages - Création d'un lettrage
router.post('/', 
  requireAuth,
  requirePermission('lettrages', 'create'),
  async (req, res) => {
    try {
      const { 
        factureClientId, 
        factureFournisseurId, 
        reglementId, 
        montant 
      } = req.body;

      // Validation des données
      if (!reglementId || !montant) {
        return res.status(400).json({
          error: 'ReglementId et montant requis',
          code: 'MISSING_REQUIRED_FIELDS'
        });
      }

      if (montant <= 0) {
        return res.status(400).json({
          error: 'Le montant doit être positif',
          code: 'INVALID_AMOUNT'
        });
      }

      // Vérifier que le règlement existe
      const reglement = await prisma.reglement.findUnique({
        where: { id: reglementId }
      });

      if (!reglement) {
        return res.status(404).json({
          error: 'Règlement non trouvé',
          code: 'REGLEMENT_NOT_FOUND'
        });
      }

      // Vérifier que le règlement n'est pas déjà lettré
      const existingLettrage = await prisma.lettrage.findFirst({
        where: { reglementId }
      });

      if (existingLettrage) {
        return res.status(409).json({
          error: 'Ce règlement est déjà lettré',
          code: 'REGLEMENT_ALREADY_LETTRE'
        });
      }

      // Vérifier la facture associée
      let facture = null;
      let factureType = null;

      if (factureClientId) {
        facture = await prisma.factureClient.findUnique({
          where: { id: factureClientId }
        });
        factureType = 'client';
      } else if (factureFournisseurId) {
        facture = await prisma.factureFournisseur.findUnique({
          where: { id: factureFournisseurId }
        });
        factureType = 'fournisseur';
      }

      if (!facture) {
        return res.status(404).json({
          error: 'Facture non trouvée',
          code: 'FACTURE_NOT_FOUND'
        });
      }

      // Vérifier que le montant ne dépasse pas le reste à lettrer
      if (montant > parseFloat(facture.resteALetrer)) {
        return res.status(400).json({
          error: 'Le montant du lettrage dépasse le reste à lettrer',
          code: 'AMOUNT_EXCEEDS_REMAINING',
          details: {
            montantLettrage: montant,
            resteALetrer: facture.resteALetrer,
            difference: montant - parseFloat(facture.resteALetrer)
          }
        });
      }

      // Transaction ACID pour le lettrage
      const result = await prisma.$transaction(async (tx) => {
        // Créer le lettrage
        const lettrage = await tx.lettrage.create({
          data: {
            montant,
            factureClientId,
            factureFournisseurId,
            reglementId
          }
        });

        // Mettre à jour le reste à lettrer de la facture
        const nouveauReste = parseFloat(facture.resteALetrer) - montant;
        
        if (factureType === 'client') {
          await tx.factureClient.update({
            where: { id: factureClientId },
            data: { resteALetrer: nouveauReste }
          });
        } else {
          await tx.factureFournisseur.update({
            where: { id: factureFournisseurId },
            data: { resteALetrer: nouveauReste }
          });
        }

        // Créer un log d'audit
        await tx.auditLog.create({
          data: {
            userId: req.user.id,
            action: 'lettrage_created',
            resource: 'Lettrage',
            resourceId: lettrage.id,
            details: {
              montant,
              factureId: factureClientId || factureFournisseurId,
              factureType,
              reglementId,
              nouveauResteALetrer: nouveauReste
            }
          }
        });

        return lettrage;
      });

      res.status(201).json({
        success: true,
        message: 'Lettrage créé avec succès',
        data: result,
        meta: {
          montantLettre: montant,
          nouveauResteALetrer: parseFloat(facture.resteALetrer) - montant
        }
      });

    } catch (error) {
      console.error('Erreur lors de la création du lettrage:', error);
      res.status(500).json({
        error: 'Erreur lors de la création du lettrage',
        code: 'LETTRAGE_CREATION_ERROR',
        details: error.message
      });
    }
  }
);

// GET /api/lettrages - Liste des lettrages
router.get('/', 
  requireAuth,
  requirePermission('lettrages', 'read'),
  async (req, res) => {
    try {
      const { page = 1, limit = 20, factureId, reglementId } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (factureId) {
        where.OR = [
          { factureClientId: factureId },
          { factureFournisseurId: factureId }
        ];
      }
      if (reglementId) where.reglementId = reglementId;

      const [lettrages, total] = await Promise.all([
        prisma.lettrage.findMany({
          where,
          include: {
            factureClient: {
              select: { numero: true, montantTotal: true, resteALetrer: true }
            },
            factureFournisseur: {
              select: { numero: true, montantTotal: true, resteALetrer: true }
            },
            reglement: {
              select: { montant: true, dateReglement: true, reference: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: parseInt(limit)
        }),
        prisma.lettrage.count({ where })
      ]);

      res.json({
        success: true,
        data: lettrages,
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des lettrages:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des lettrages',
        code: 'FETCH_ERROR'
      });
    }
  }
);

// GET /api/lettrages/:id - Détails d'un lettrage
router.get('/:id', 
  requireAuth,
  requirePermission('lettrages', 'read'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const lettrage = await prisma.lettrage.findUnique({
        where: { id },
        include: {
          factureClient: {
            select: { 
              numero: true, 
              montantTotal: true, 
              resteALetrer: true,
              dateFacture: true,
              chantier: { select: { nom: true } }
            }
          },
          factureFournisseur: {
            select: { 
              numero: true, 
              montantTotal: true, 
              resteALetrer: true,
              dateFacture: true,
              chantier: { select: { nom: true } }
            }
          },
          reglement: {
            select: { 
              montant: true, 
              dateReglement: true, 
              reference: true,
              modeReglement: true
            }
          }
        }
      });

      if (!lettrage) {
        return res.status(404).json({
          error: 'Lettrage non trouvé',
          code: 'LETTRAGE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: lettrage
      });

    } catch (error) {
      console.error('Erreur lors de la récupération du lettrage:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération du lettrage',
        code: 'FETCH_ERROR'
      });
    }
  }
);

// DELETE /api/lettrages/:id - Suppression d'un lettrage (seulement si créé par l'utilisateur)
router.delete('/:id', 
  requireAuth,
  requirePermission('lettrages', 'delete_created_only'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const lettrage = await prisma.lettrage.findUnique({
        where: { id },
        include: {
          factureClient: true,
          factureFournisseur: true
        }
      });

      if (!lettrage) {
        return res.status(404).json({
          error: 'Lettrage non trouvé',
          code: 'LETTRAGE_NOT_FOUND'
        });
      }

      // Vérifier que l'utilisateur peut supprimer ce lettrage
      // (seulement les lettrages créés par l'utilisateur ou admin)
      if (req.user.role !== 'admin') {
        // Ici on pourrait ajouter une vérification de propriété
        // Pour l'instant, on permet la suppression aux managers et users
      }

      // Transaction ACID pour la suppression
      await prisma.$transaction(async (tx) => {
        // Récupérer la facture associée
        const facture = lettrage.factureClient || lettrage.factureFournisseur;
        
        // Remettre le montant dans le reste à lettrer
        const nouveauReste = parseFloat(facture.resteALetrer) + parseFloat(lettrage.montant);
        
        if (lettrage.factureClientId) {
          await tx.factureClient.update({
            where: { id: lettrage.factureClientId },
            data: { resteALetrer: nouveauReste }
          });
        } else {
          await tx.factureFournisseur.update({
            where: { id: lettrage.factureFournisseurId },
            data: { resteALetrer: nouveauReste }
          });
        }

        // Supprimer le lettrage
        await tx.lettrage.delete({
          where: { id }
        });

        // Créer un log d'audit
        await tx.auditLog.create({
          data: {
            userId: req.user.id,
            action: 'lettrage_deleted',
            resource: 'Lettrage',
            resourceId: id,
            details: {
              montant: lettrage.montant,
              factureId: lettrage.factureClientId || lettrage.factureFournisseurId,
              nouveauResteALetrer: nouveauReste
            }
          }
        });
      });

      res.json({
        success: true,
        message: 'Lettrage supprimé avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la suppression du lettrage:', error);
      res.status(500).json({
        error: 'Erreur lors de la suppression du lettrage',
        code: 'LETTRAGE_DELETION_ERROR',
        details: error.message
      });
    }
  }
);

// GET /api/lettrages/statistiques - Statistiques des lettrages
router.get('/statistiques/overview', 
  requireAuth,
  requirePermission('lettrages', 'read'),
  async (req, res) => {
    try {
      const [
        totalLettrages,
        montantTotalLettre,
        lettragesCeMois,
        montantCeMois
      ] = await Promise.all([
        prisma.lettrage.count(),
        prisma.lettrage.aggregate({
          _sum: { montant: true }
        }),
        prisma.lettrage.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),
        prisma.lettrage.aggregate({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { montant: true }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalLettrages,
          montantTotalLettre: montantTotalLettre._sum.montant || 0,
          lettragesCeMois,
          montantCeMois: montantCeMois._sum.montant || 0
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des statistiques',
        code: 'STATS_ERROR'
      });
    }
  }
);

module.exports = router;
