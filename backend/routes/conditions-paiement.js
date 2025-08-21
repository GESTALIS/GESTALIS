const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Validation pour la création/modification de condition de paiement
const validateCondition = [
  body('libelle').isString().notEmpty().withMessage('Le libellé est requis'),
  body('delai').optional().isInt({ min: 0 }).withMessage('Le délai doit être un nombre positif'),
  body('description').optional().isString(),
  body('actif').optional().isBoolean()
];

// GET - Liste toutes les conditions de paiement
router.get('/', async (req, res) => {
  try {
    const conditions = await prisma.conditionsPaiement.findMany({
      orderBy: { libelle: 'asc' }
    });
    
    res.json({
      success: true,
      data: conditions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des conditions de paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// GET - Conditions de paiement actives uniquement
router.get('/actives', async (req, res) => {
  try {
    const conditions = await prisma.conditionsPaiement.findMany({
      where: { actif: true },
      orderBy: { libelle: 'asc' }
    });
    
    res.json({
      success: true,
      data: conditions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des conditions actives:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// POST - Créer une nouvelle condition de paiement
router.post('/', validateCondition, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { libelle, delai, description, actif = true } = req.body;

    // Vérifier que le libellé n'existe pas déjà
    const existingCondition = await prisma.conditionsPaiement.findFirst({
      where: { libelle }
    });

    if (existingCondition) {
      return res.status(400).json({
        success: false,
        message: 'Une condition de paiement avec ce libellé existe déjà'
      });
    }

    const nouvelleCondition = await prisma.conditionsPaiement.create({
      data: {
        libelle,
        delai: delai || 0,
        description: description || '',
        actif
      }
    });

    res.status(201).json({
      success: true,
      message: 'Condition de paiement créée avec succès',
      data: nouvelleCondition
    });
  } catch (error) {
    console.error('Erreur lors de la création de la condition de paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// POST - Initialiser les conditions de paiement par défaut
router.post('/init-default', async (req, res) => {
  try {
    const conditionsDefaut = [
      {
        libelle: 'Comptant',
        delai: 0,
        description: 'Paiement immédiat à la livraison',
        actif: true
      },
      {
        libelle: '30 jours',
        delai: 30,
        description: 'Paiement sous 30 jours',
        actif: true
      },
      {
        libelle: '45 jours fin de mois',
        delai: 45,
        description: 'Paiement sous 45 jours fin de mois',
        actif: true
      },
      {
        libelle: '60 jours',
        delai: 60,
        description: 'Paiement sous 60 jours',
        actif: true
      },
      {
        libelle: '90 jours',
        delai: 90,
        description: 'Paiement sous 90 jours',
        actif: true
      }
    ];

    const conditionsCreees = [];

    for (const condition of conditionsDefaut) {
      // Vérifier si la condition existe déjà
      const existingCondition = await prisma.conditionsPaiement.findFirst({
        where: { libelle: condition.libelle }
      });

      if (!existingCondition) {
        const nouvelleCondition = await prisma.conditionsPaiement.create({
          data: condition
        });
        conditionsCreees.push(nouvelleCondition);
      }
    }

    res.json({
      success: true,
      message: `${conditionsCreees.length} conditions de paiement par défaut créées`,
      data: conditionsCreees
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des conditions par défaut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// PUT - Modifier une condition de paiement
router.put('/:id', validateCondition, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { libelle, delai, description, actif } = req.body;

    // Vérifier que la condition existe
    const existingCondition = await prisma.conditionsPaiement.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCondition) {
      return res.status(404).json({
        success: false,
        message: 'Condition de paiement non trouvée'
      });
    }

    // Vérifier que le nouveau libellé n'existe pas déjà (sauf pour cette condition)
    if (libelle !== existingCondition.libelle) {
      const duplicateCondition = await prisma.conditionsPaiement.findFirst({
        where: { libelle }
      });

      if (duplicateCondition) {
        return res.status(400).json({
          success: false,
          message: 'Une condition de paiement avec ce libellé existe déjà'
        });
      }
    }

    const conditionModifiee = await prisma.conditionsPaiement.update({
      where: { id: parseInt(id) },
      data: {
        libelle,
        delai: delai || 0,
        description: description || '',
        actif: actif !== undefined ? actif : existingCondition.actif
      }
    });

    res.json({
      success: true,
      message: 'Condition de paiement modifiée avec succès',
      data: conditionModifiee
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la condition de paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// DELETE - Supprimer une condition de paiement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la condition existe
    const existingCondition = await prisma.conditionsPaiement.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCondition) {
      return res.status(404).json({
        success: false,
        message: 'Condition de paiement non trouvée'
      });
    }

    // Vérifier qu'aucun fournisseur n'utilise cette condition
    const fournisseursUsingCondition = await prisma.fournisseurDetails.findFirst({
      where: { conditionsPaiementId: parseInt(id) }
    });

    if (fournisseursUsingCondition) {
      return res.status(400).json({
        success: false,
        message: 'Cette condition ne peut pas être supprimée car elle est utilisée par des fournisseurs'
      });
    }

    await prisma.conditionsPaiement.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Condition de paiement supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la condition de paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

module.exports = router;
