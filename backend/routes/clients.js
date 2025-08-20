const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/clients - Liste des clients
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', type = 'all' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Construction des filtres
    const whereClause = {
      type: 'CLIENT' // Seulement les clients
    };
    
    if (search) {
      whereClause.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { siret: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Requête Prisma
    const [clients, total] = await Promise.all([
      prisma.tiers.findMany({
        where: whereClause,
        include: {
          marches: {
            include: {
              chantier: true
            }
          }
        },
        orderBy: { nom: 'asc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.tiers.count({ where: whereClause })
    ]);

    // Transformation des données pour la compatibilité frontend
    const results = clients.map(client => ({
      ...client,
      nb_chantiers: client.marches.length,
      created_at: client.createdAt,
      updated_at: client.updatedAt
    }));

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des clients',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/clients/:id - Détails d'un client
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.tiers.findUnique({
      where: { 
        id: id,
        type: 'CLIENT'
      },
      include: {
        marches: {
          include: {
            chantier: true
          }
        }
      }
    });

    if (!client) {
      return res.status(404).json({
        error: 'Client non trouvé',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    // Transformation des données pour la compatibilité frontend
    const result = {
      ...client,
      nb_chantiers: client.marches.length,
      created_at: client.createdAt,
      updated_at: client.updatedAt
    };

    res.json(result);

  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du client',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/clients - Création d'un client
router.post('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      nom,
      siret,
      adresse,
      telephone,
      email,
      contact_principal,
      notes
    } = req.body;

    const result = await prisma.tiers.create({
      data: {
        nom,
        siret,
        adresse,
        telephone,
        email,
        contact_principal,
        notes,
        type: 'CLIENT'
      }
    });

    res.status(201).json({
      message: 'Client créé avec succès',
      client: result
    });

  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du client',
      code: 'CREATION_ERROR'
    });
  }
});

// PUT /api/clients/:id - Mise à jour d'un client
router.put('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      siret,
      adresse,
      telephone,
      email,
      contact_principal,
      notes
    } = req.body;

    // Vérification que le client existe
    const existingClient = await prisma.tiers.findUnique({
      where: {
        id: id,
        type: 'CLIENT'
      }
    });
    if (!existingClient) {
      return res.status(404).json({
        error: 'Client non trouvé',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    // Mise à jour du client
    const result = await prisma.tiers.update({
      where: {
        id: id,
        type: 'CLIENT'
      },
      data: {
        nom: nom || existingClient.nom,
        siret: siret || existingClient.siret,
        adresse: adresse || existingClient.adresse,
        telephone: telephone || existingClient.telephone,
        email: email || existingClient.email,
        contact_principal: contact_principal || existingClient.contact_principal,
        notes: notes || existingClient.notes,
        updated_at: new Date()
      }
    });

    res.json({
      message: 'Client mis à jour avec succès',
      client: result
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du client',
      code: 'UPDATE_ERROR'
    });
  }
});

// DELETE /api/clients/:id - Suppression d'un client
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification que le client existe
    const existingClient = await prisma.tiers.findUnique({
      where: {
        id: id,
        type: 'CLIENT'
      }
    });
    if (!existingClient) {
      return res.status(404).json({
        error: 'Client non trouvé',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    // Vérification que le client n'a pas de chantiers associés
    const chantiersResult = await prisma.chantiers.findMany({
      where: { client_id: id }
    });
    if (chantiersResult.length > 0) {
      return res.status(400).json({
        error: 'Impossible de supprimer un client ayant des chantiers associés',
        code: 'CLIENT_HAS_CHANTIERS'
      });
    }

    // Suppression du client
    await prisma.tiers.delete({
      where: {
        id: id,
        type: 'CLIENT'
      }
    });

    res.json({
      message: 'Client supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du client',
      code: 'DELETE_ERROR'
    });
  }
});

module.exports = router;