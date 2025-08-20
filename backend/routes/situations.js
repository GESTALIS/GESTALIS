const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requirePermission } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

// Validation des données
const createSituationSchema = z.object({
  marcheId: z.string().cuid(),
  numero: z.number().int().positive(),
  periodeDebut: z.string().datetime(),
  periodeFin: z.string().datetime(),
  penalites: z.number().min(0).default(0),
  retenuePct: z.number().min(0).max(100).default(0)
});

// POST /api/situations - Créer une situation
router.post('/', 
  requireAuth,
  requirePermission('situations', 'create'),
  async (req, res) => {
    try {
      const validatedData = createSituationSchema.parse(req.body);
      
      // Vérifier que le numéro est unique pour ce marché
      const existingSituation = await prisma.situation.findUnique({
        where: {
          marcheId_numero: {
            marcheId: validatedData.marcheId,
            numero: validatedData.numero
          }
        }
      });

      if (existingSituation) {
        return res.status(409).json({
          error: 'Une situation avec ce numéro existe déjà',
          code: 'SITUATION_NUMBER_EXISTS'
        });
      }

      const situation = await prisma.situation.create({
        data: validatedData,
        include: {
          marche: { 
            select: { 
              reference: true,
              chantier: { select: { nom: true } }
            } 
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Situation créée avec succès',
        data: situation
      });

    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Données invalides',
          code: 'VALIDATION_ERROR',
          details: error.errors
        });
      }

      console.error('Erreur lors de la création de la situation:', error);
      res.status(500).json({
        error: 'Erreur lors de la création de la situation',
        code: 'SITUATION_CREATION_ERROR'
      });
    }
  }
);

// POST /api/situations/:id/valider - Valider une situation
router.post('/:id/valider',
  requireAuth,
  requirePermission('situations', 'update'),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Transaction ACID pour la validation
      const result = await prisma.$transaction(async (tx) => {
        // Vérifier que la situation existe et n'est pas déjà validée
        const situation = await tx.situation.findUnique({
          where: { id },
          include: { lignes: true }
        });

        if (!situation) {
          throw new Error('Situation non trouvée');
        }

        if (situation.statut !== 'brouillon') {
          throw new Error('Situation déjà validée');
        }

        // Calculer les totaux
        const totalHT = situation.lignes.reduce((sum, ligne) => 
          sum + parseFloat(ligne.montantMois), 0
        );

        const retenue = (totalHT * parseFloat(situation.retenuePct)) / 100;
        const totalTTC = totalHT + retenue - parseFloat(situation.penalites);

        // Mettre à jour le statut
        await tx.situation.update({
          where: { id },
          data: { statut: 'validee' }
        });

        // Créer un log d'audit
        await tx.auditLog.create({
          data: {
            userId: req.user.id,
            action: 'situation_validee',
            resource: 'Situation',
            resourceId: id,
            details: {
              totalHT,
              retenue,
              penalites: situation.penalites,
              totalTTC
            }
          }
        });

        return { totalHT, retenue, penalites: situation.penalites, totalTTC };
      });

      res.json({
        success: true,
        message: 'Situation validée avec succès',
        data: result
      });

    } catch (error) {
      console.error('Erreur lors de la validation de la situation:', error);
      res.status(500).json({
        error: 'Erreur lors de la validation de la situation',
        code: 'SITUATION_VALIDATION_ERROR',
        details: error.message
      });
    }
  }
);

module.exports = router;