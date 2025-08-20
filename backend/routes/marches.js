const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requirePermission } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

// Validation des données
const createMarcheSchema = z.object({
  chantierId: z.string().cuid(),
  clientId: z.string().cuid(),
  reference: z.string().min(1),
  devise: z.string().default("EUR"),
  tvaMode: z.enum(["STANDARD", "EXONERE"]).default("STANDARD"),
  retenueGarantiePct: z.number().min(0).max(100).default(5.00)
});

// POST /api/marches - Créer un marché client
router.post('/', 
  requireAuth,
  requirePermission('marches', 'create'),
  async (req, res) => {
    try {
      const validatedData = createMarcheSchema.parse(req.body);
      
      const marche = await prisma.marcheClient.create({
        data: validatedData,
        include: {
          chantier: { select: { nom: true } },
          client: { select: { nom: true } }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Marché créé avec succès',
        data: marche
      });

    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Données invalides',
          code: 'VALIDATION_ERROR',
          details: error.errors
        });
      }

      console.error('Erreur lors de la création du marché:', error);
      res.status(500).json({
        error: 'Erreur lors de la création du marché',
        code: 'MARCHE_CREATION_ERROR'
      });
    }
  }
);

// GET /api/marches/:id/bpu - Récupérer le BPU d'un marché
router.get('/:id/bpu',
  requireAuth,
  requirePermission('marches', 'read'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const bpu = await prisma.bpuPoste.findMany({
        where: { marcheId: id },
        orderBy: { code: 'asc' }
      });

      res.json({
        success: true,
        data: bpu
      });

    } catch (error) {
      console.error('Erreur lors de la récupération du BPU:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération du BPU',
        code: 'BPU_FETCH_ERROR'
      });
    }
  }
);

module.exports = router;