const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Validation pour la création/modification de compte
const validateCompte = [
  body('numeroCompte').isString().notEmpty().withMessage('Le numéro de compte est requis'),
  body('intitule').isString().notEmpty().withMessage('L\'intitulé est requis'),
  body('categorie').isString().notEmpty().withMessage('La catégorie est requise')
];

// GET - Liste tous les comptes du plan comptable
router.get('/', async (req, res) => {
  try {
    const comptes = await prisma.planComptable.findMany({
      orderBy: { numeroCompte: 'asc' }
    });
    
    res.json({
      success: true,
      data: comptes
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du plan comptable:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// GET - Liste des catégories disponibles
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.planComptable.findMany({
      select: { categorie: true },
      distinct: ['categorie']
    });
    
    res.json({
      success: true,
      data: categories.map(c => c.categorie)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// GET - Comptes fournisseurs disponibles
router.get('/fournisseurs', async (req, res) => {
  try {
    const comptes = await prisma.planComptable.findMany({
      where: {
        categorie: 'FOURNISSEURS'
      },
      orderBy: { numeroCompte: 'asc' }
    });
    
    res.json({
      success: true,
      data: comptes
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes fournisseurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// POST - Créer un nouveau compte
router.post('/', validateCompte, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { numeroCompte, intitule, categorie, description } = req.body;

    // Vérifier que le numéro de compte n'existe pas déjà
    const existingCompte = await prisma.planComptable.findUnique({
      where: { numeroCompte }
    });

    if (existingCompte) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec ce numéro existe déjà'
      });
    }

    const nouveauCompte = await prisma.planComptable.create({
      data: {
        numeroCompte,
        intitule,
        categorie,
        description: description || ''
      }
    });

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      data: nouveauCompte
    });
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// POST - Générer automatiquement un compte fournisseur
router.post('/auto-generate', async (req, res) => {
  try {
    // Trouver le prochain numéro disponible
    const lastCompte = await prisma.planComptable.findFirst({
      where: {
        numeroCompte: {
          startsWith: 'F'
        }
      },
      orderBy: {
        numeroCompte: 'desc'
      }
    });

    let nextNumber = 1;
    if (lastCompte) {
      const lastNumber = parseInt(lastCompte.numeroCompte.substring(1));
      nextNumber = lastNumber + 1;
    }

    const numeroCompte = `F${String(nextNumber).padStart(4, '0')}`;
    const intitule = `Fournisseur - ${numeroCompte}`;

    const nouveauCompte = await prisma.planComptable.create({
      data: {
        numeroCompte,
        intitule,
        categorie: 'FOURNISSEURS',
        description: 'Compte fournisseur généré automatiquement'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Compte fournisseur généré automatiquement',
      data: nouveauCompte
    });
  } catch (error) {
    console.error('Erreur lors de la génération automatique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// PUT - Modifier un compte
router.put('/:id', validateCompte, async (req, res) => {
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
    const { numeroCompte, intitule, categorie, description } = req.body;

    // Vérifier que le compte existe
    const existingCompte = await prisma.planComptable.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCompte) {
      return res.status(404).json({
        success: false,
        message: 'Compte non trouvé'
      });
    }

    // Vérifier que le nouveau numéro n'existe pas déjà (sauf pour ce compte)
    if (numeroCompte !== existingCompte.numeroCompte) {
      const duplicateCompte = await prisma.planComptable.findUnique({
        where: { numeroCompte }
      });

      if (duplicateCompte) {
        return res.status(400).json({
          success: false,
          message: 'Un compte avec ce numéro existe déjà'
        });
      }
    }

    const compteModifie = await prisma.planComptable.update({
      where: { id: parseInt(id) },
      data: {
        numeroCompte,
        intitule,
        categorie,
        description: description || ''
      }
    });

    res.json({
      success: true,
      message: 'Compte modifié avec succès',
      data: compteModifie
    });
  } catch (error) {
    console.error('Erreur lors de la modification du compte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// DELETE - Supprimer un compte
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le compte existe
    const existingCompte = await prisma.planComptable.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCompte) {
      return res.status(404).json({
        success: false,
        message: 'Compte non trouvé'
      });
    }

    // Vérifier qu'aucun fournisseur n'utilise ce compte
    const fournisseursUsingCompte = await prisma.fournisseurDetails.findFirst({
      where: { compteComptableId: parseInt(id) }
    });

    if (fournisseursUsingCompte) {
      return res.status(400).json({
        success: false,
        message: 'Ce compte ne peut pas être supprimé car il est utilisé par des fournisseurs'
      });
    }

    await prisma.planComptable.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Compte supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

module.exports = router;
