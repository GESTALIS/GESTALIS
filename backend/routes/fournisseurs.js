const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// ===== VALIDATION SCHEMAS =====

const fournisseurValidation = [
  body('raisonSociale').trim().isLength({ min: 2, max: 200 }).withMessage('Raison sociale requise (2-200 caractères)'),
  body('siret').optional().isLength({ min: 14, max: 14 }).withMessage('SIRET doit faire 14 caractères'),
  body('tvaIntracommunautaire').optional().matches(/^[A-Z]{2}[0-9A-Z]+$/).withMessage('Format TVA invalide'),
  body('codeApeNaf').optional().isLength({ min: 4, max: 5 }).withMessage('Code APE/NAF invalide'),
  body('plafondCredit').optional().isFloat({ min: 0 }).withMessage('Plafond de crédit invalide'),
  body('devise').optional().isIn(['EUR', 'USD', 'GBP']).withMessage('Devise non supportée')
];

const contactValidation = [
  body('type').isIn(['COMMERCIAL', 'TECHNIQUE', 'COMPTABILITE', 'AUTRE']).withMessage('Type de contact invalide'),
  body('nom').trim().isLength({ min: 2, max: 100 }).withMessage('Nom requis (2-100 caractères)'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('telephone').optional().matches(/^[+]?[0-9\s\-\(\)]{10,}$/).withMessage('Téléphone invalide')
];

const documentValidation = [
  body('type').isIn(['KBIS', 'URSSAF', 'RC_PRO', 'QUALIBAT', 'ISO', 'AUTRE']).withMessage('Type de document invalide'),
  body('nom').trim().isLength({ min: 2, max: 200 }).withMessage('Nom du document requis'),
  body('dateEmission').optional().isISO8601().withMessage('Date d\'émission invalide'),
  body('dateExpiration').optional().isISO8601().withMessage('Date d\'expiration invalide')
];

// ===== UTILITAIRES =====

const generateCodeFournisseur = async () => {
  const lastFournisseur = await prisma.fournisseurDetails.findFirst({
    orderBy: { codeFournisseur: 'desc' }
  });
  
  if (!lastFournisseur) return 'FR001';
  
  const lastNumber = parseInt(lastFournisseur.codeFournisseur.substring(2));
  return `FR${String(lastNumber + 1).padStart(3, '0')}`;
};

const generateCompteComptable = async () => {
  const lastFournisseur = await prisma.fournisseurDetails.findFirst({
    orderBy: { compteComptable: 'desc' }
  });
  
  if (!lastFournisseur) return 'F0001';
  
  const lastNumber = parseInt(lastFournisseur.compteComptable.substring(1));
  return `F${String(lastNumber + 1).padStart(4, '0')}`;
};

const checkDocumentExpiration = (dateExpiration) => {
  if (!dateExpiration) return 'EN_COURS';
  
  const today = new Date();
  const expiration = new Date(dateExpiration);
  const daysUntilExpiration = Math.ceil((expiration - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiration < 0) return 'EXPIRE';
  if (daysUntilExpiration <= 30) return 'A_RENOUVELER';
  return 'VALIDE';
};

// ===== ROUTES PRINCIPALES FOURNISSEURS =====

// GET /api/fournisseurs - Liste des fournisseurs avec filtres
router.get('/', requireAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      statut, 
      type,
      sortBy = 'raisonSociale',
      sortOrder = 'asc'
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Construction des filtres
    const where = {
      tiers: {
        type: 'FOURNISSEUR'
      }
    };

    if (search) {
      where.OR = [
        { raisonSociale: { contains: search, mode: 'insensitive' } },
        { tiers: { nom: { contains: search, mode: 'insensitive' } } },
        { codeFournisseur: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (statut) {
      where.statut = statut;
    }

    // Requête avec relations
    const fournisseurs = await prisma.fournisseurDetails.findMany({
      where,
      include: {
        tiers: {
          include: {
            contacts: true,
            documents: true,
            conditionsCommerciales: true,
            historiqueQualite: {
              orderBy: { dateEvaluation: 'desc' },
              take: 1
            }
          }
        },
        ribs: true
      },
      orderBy: { [sortBy]: sortOrder },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    // Compte total pour pagination
    const total = await prisma.fournisseurDetails.count({ where });

    res.json({
      results: fournisseurs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des fournisseurs:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// GET /api/fournisseurs/:id - Détails d'un fournisseur
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const fournisseur = await prisma.fournisseurDetails.findUnique({
      where: { id },
      include: {
        tiers: {
          include: {
            contacts: true,
            documents: true,
            conditionsCommerciales: true,
            historiqueQualite: {
              orderBy: { dateEvaluation: 'desc' }
            },
            litiges: {
              orderBy: { dateLitige: 'desc' }
            },
            journalActions: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        ribs: true
      }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    res.json(fournisseur);

  } catch (error) {
    console.error('Erreur lors de la récupération du fournisseur:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// POST /api/fournisseurs - Créer un nouveau fournisseur
router.post('/', requireAuth, fournisseurValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      raisonSociale,
      siret,
      tvaIntracommunautaire,
      codeApeNaf,
      formeJuridique,
      capitalSocial,
      rcs,
      greffe,
      adresseSiege,
      adresseLivraison,
      plafondCredit,
      devise,
      estSousTraitant,
      contacts,
      documents
    } = req.body;

    // Vérification unicité SIRET
    if (siret) {
      const existingSiret = await prisma.fournisseurDetails.findFirst({
        where: { siret }
      });
      if (existingSiret) {
        return res.status(400).json({ error: 'Ce SIRET est déjà utilisé' });
      }
    }

    // Génération des codes uniques
    const codeFournisseur = await generateCodeFournisseur();
    const compteComptable = await generateCompteComptable();

    // Création transactionnelle
    const result = await prisma.$transaction(async (tx) => {
      // 1. Créer le tiers
      const tiers = await tx.tiers.create({
        data: {
          nom: raisonSociale,
          type: 'FOURNISSEUR',
          siret,
          adresse: adresseSiege,
          description: `Fournisseur créé le ${new Date().toLocaleDateString('fr-FR')}`
        }
      });

      // 2. Créer les détails fournisseur
      const fournisseurDetails = await tx.fournisseurDetails.create({
        data: {
          tiersId: tiers.id,
          codeFournisseur,
          compteComptable,
          raisonSociale,
          siret,
          tvaIntracommunautaire,
          codeApeNaf,
          formeJuridique,
          capitalSocial: capitalSocial ? parseFloat(capitalSocial) : null,
          rcs,
          greffe,
          adresseSiege,
          adresseLivraison,
          plafondCredit: plafondCredit ? parseFloat(plafondCredit) : null,
          devise,
          estSousTraitant: estSousTraitant || false
        }
      });

      // 3. Créer les contacts
      if (contacts && Array.isArray(contacts)) {
        for (const contact of contacts) {
          await tx.contactFournisseur.create({
            data: {
              tiersId: tiers.id,
              type: contact.type,
              nom: contact.nom,
              prenom: contact.prenom,
              telephone: contact.telephone,
              email: contact.email,
              fonction: contact.fonction,
              estContactPrincipal: contact.estContactPrincipal || false
            }
          });
        }
      }

      // 4. Créer les documents
      if (documents && Array.isArray(documents)) {
        for (const doc of documents) {
          await tx.documentFournisseur.create({
            data: {
              tiersId: tiers.id,
              type: doc.type,
              nom: doc.nom,
              pieceUrl: doc.pieceUrl,
              dateEmission: doc.dateEmission ? new Date(doc.dateEmission) : null,
              dateExpiration: doc.dateExpiration ? new Date(doc.dateExpiration) : null,
              statut: checkDocumentExpiration(doc.dateExpiration),
              version: doc.version,
              commentaires: doc.commentaires,
              ajoutePar: req.user.id
            }
          });
        }
      }

      // 5. Créer les conditions commerciales par défaut
      await tx.conditionsCommerciales.create({
        data: {
          tiersId: tiers.id,
          conditionsPaiement: '30j',
          escompte: null
        }
      });

      // 6. Journaliser l'action
      await tx.journalActionFournisseur.create({
        data: {
          tiersId: tiers.id,
          action: 'CREATION',
          details: { raisonSociale, codeFournisseur, compteComptable },
          userId: req.user.id
        }
      });

      return { tiers, fournisseurDetails };
    });

    res.status(201).json({
      message: 'Fournisseur créé avec succès',
      fournisseur: result.fournisseurDetails,
      codeFournisseur,
      compteComptable
    });

  } catch (error) {
    console.error('Erreur lors de la création du fournisseur:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// PUT /api/fournisseurs/:id - Modifier un fournisseur
router.put('/:id', requireAuth, fournisseurValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Vérifier que le fournisseur existe
    const existingFournisseur = await prisma.fournisseurDetails.findUnique({
      where: { id },
      include: { tiers: true }
    });

    if (!existingFournisseur) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    // Vérification unicité SIRET si modifié
    if (updateData.siret && updateData.siret !== existingFournisseur.siret) {
      const existingSiret = await prisma.fournisseurDetails.findFirst({
        where: { siret: updateData.siret }
      });
      if (existingSiret) {
        return res.status(400).json({ error: 'Ce SIRET est déjà utilisé' });
      }
    }

    // Mise à jour transactionnelle
    const result = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour les détails fournisseur
      const fournisseurDetails = await tx.fournisseurDetails.update({
        where: { id },
        data: {
          raisonSociale: updateData.raisonSociale,
          siret: updateData.siret,
          tvaIntracommunautaire: updateData.tvaIntracommunautaire,
          codeApeNaf: updateData.codeApeNaf,
          formeJuridique: updateData.formeJuridique,
          capitalSocial: updateData.capitalSocial ? parseFloat(updateData.capitalSocial) : null,
          rcs: updateData.rcs,
          greffe: updateData.greffe,
          adresseSiege: updateData.adresseSiege,
          adresseLivraison: updateData.adresseLivraison,
          plafondCredit: updateData.plafondCredit ? parseFloat(updateData.plafondCredit) : null,
          devise: updateData.devise,
          estSousTraitant: updateData.estSousTraitant,
          updatedAt: new Date()
        }
      });

      // 2. Mettre à jour le tiers
      await tx.tiers.update({
        where: { id: existingFournisseur.tiersId },
        data: {
          nom: updateData.raisonSociale,
          siret: updateData.siret,
          adresse: updateData.adresseSiege,
          updatedAt: new Date()
        }
      });

      // 3. Journaliser l'action
      await tx.journalActionFournisseur.create({
        data: {
          tiersId: existingFournisseur.tiersId,
          action: 'MODIFICATION',
          details: { raisonSociale: updateData.raisonSociale },
          userId: req.user.id
        }
      });

      return fournisseurDetails;
    });

    res.json({
      message: 'Fournisseur modifié avec succès',
      fournisseur: result
    });

  } catch (error) {
    console.error('Erreur lors de la modification du fournisseur:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// DELETE /api/fournisseurs/:id - Supprimer un fournisseur (archivage)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le fournisseur existe
    const fournisseur = await prisma.fournisseurDetails.findUnique({
      where: { id },
      include: { tiers: true }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    // Vérifier qu'il n'y a pas de factures en cours
    const facturesEnCours = await prisma.factureFournisseur.findFirst({
      where: {
        tiersId: fournisseur.tiersId,
        statut: { not: 'reglee' }
      }
    });

    if (facturesEnCours) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer ce fournisseur : il a des factures en cours' 
      });
    }

    // Archivage (changement de statut)
    await prisma.$transaction(async (tx) => {
      await tx.fournisseurDetails.update({
        where: { id },
        data: { statut: 'ARCHIVE' }
      });

      await tx.journalActionFournisseur.create({
        data: {
          tiersId: fournisseur.tiersId,
          action: 'ARCHIVAGE',
          details: { raison: 'Suppression demandée' },
          userId: req.user.id
        }
      });
    });

    res.json({ message: 'Fournisseur archivé avec succès' });

  } catch (error) {
    console.error('Erreur lors de l\'archivage du fournisseur:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// ===== ROUTES CONTACTS =====

// POST /api/fournisseurs/:id/contacts - Ajouter un contact
router.post('/:id/contacts', requireAuth, contactValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const contactData = req.body;

    // Vérifier que le fournisseur existe
    const fournisseur = await prisma.fournisseurDetails.findUnique({
      where: { id }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    // Si c'est le contact principal, désactiver les autres
    if (contactData.estContactPrincipal) {
      await prisma.contactFournisseur.updateMany({
        where: { tiersId: fournisseur.tiersId },
        data: { estContactPrincipal: false }
      });
    }

    const contact = await prisma.contactFournisseur.create({
      data: {
        tiersId: fournisseur.tiersId,
        type: contactData.type,
        nom: contactData.nom,
        prenom: contactData.prenom,
        telephone: contactData.telephone,
        email: contactData.email,
        fonction: contactData.fonction,
        estContactPrincipal: contactData.estContactPrincipal || false
      }
    });

    res.status(201).json({
      message: 'Contact ajouté avec succès',
      contact
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout du contact:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// ===== ROUTES DOCUMENTS =====

// POST /api/fournisseurs/:id/documents - Ajouter un document
router.post('/:id/documents', requireAuth, documentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const documentData = req.body;

    // Vérifier que le fournisseur existe
    const fournisseur = await prisma.fournisseurDetails.findUnique({
      where: { id }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    const document = await prisma.documentFournisseur.create({
      data: {
        tiersId: fournisseur.tiersId,
        type: documentData.type,
        nom: documentData.nom,
        pieceUrl: documentData.pieceUrl,
        dateEmission: documentData.dateEmission ? new Date(documentData.dateEmission) : null,
        dateExpiration: documentData.dateExpiration ? new Date(documentData.dateExpiration) : null,
        statut: checkDocumentExpiration(documentData.dateExpiration),
        version: documentData.version,
        commentaires: documentData.commentaires,
        ajoutePar: req.user.id
      }
    });

    res.status(201).json({
      message: 'Document ajouté avec succès',
      document
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout du document:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// ===== ROUTES QUALITÉ =====

// POST /api/fournisseurs/:id/qualite - Ajouter une évaluation qualité
router.post('/:id/qualite', requireAuth, [
  body('notePrix').isInt({ min: 1, max: 5 }).withMessage('Note prix invalide (1-5)'),
  body('noteQualite').isInt({ min: 1, max: 5 }).withMessage('Note qualité invalide (1-5)'),
  body('noteDelais').isInt({ min: 1, max: 5 }).withMessage('Note délais invalide (1-5)'),
  body('noteReactivite').isInt({ min: 1, max: 5 }).withMessage('Note réactivité invalide (1-5)'),
  body('commentaires').optional().isLength({ max: 500 }).withMessage('Commentaires trop longs')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { notePrix, noteQualite, noteDelais, noteReactivite, commentaires } = req.body;

    // Vérifier que le fournisseur existe
    const fournisseur = await prisma.fournisseurDetails.findUnique({
      where: { id }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    // Calculer le score global (moyenne pondérée)
    const scoreGlobal = ((notePrix + noteQualite + noteDelais + noteReactivite) / 4).toFixed(2);

    const evaluation = await prisma.historiqueQualite.create({
      data: {
        tiersId: fournisseur.tiersId,
        dateEvaluation: new Date(),
        notePrix,
        noteQualite,
        noteDelais,
        noteReactivite,
        scoreGlobal: parseFloat(scoreGlobal),
        commentaires,
        evaluePar: req.user.id
      }
    });

    res.status(201).json({
      message: 'Évaluation qualité ajoutée avec succès',
      evaluation,
      scoreGlobal
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'évaluation qualité:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// ===== ROUTES LITIGES =====

// POST /api/fournisseurs/:id/litiges - Ajouter un litige
router.post('/:id/litiges', requireAuth, [
  body('type').isIn(['RETARD', 'ERREUR', 'NON_CONFORMITE', 'AUTRE']).withMessage('Type de litige invalide'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description requise (10-1000 caractères)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { type, description, commentaires } = req.body;

    // Vérifier que le fournisseur existe
    const fournisseur = await prisma.fournisseurDetails.findUnique({
      where: { id }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    const litige = await prisma.litigeFournisseur.create({
      data: {
        tiersId: fournisseur.tiersId,
        type,
        description,
        statut: 'OUVERT',
        dateLitige: new Date(),
        responsable: req.user.id,
        commentaires
      }
    });

    res.status(201).json({
      message: 'Litige ajouté avec succès',
      litige
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout du litige:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// ===== ROUTES RIB/IBAN =====

// POST /api/fournisseurs/:id/ribs - Ajouter un RIB
router.post('/:id/ribs', requireAuth, [
  body('iban').isIBAN().withMessage('IBAN invalide'),
  body('bic').isBIC().withMessage('BIC invalide'),
  body('titulaire').trim().isLength({ min: 2, max: 100 }).withMessage('Titulaire requis (2-100 caractères)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { iban, bic, titulaire, estParDefaut } = req.body;

    // Vérifier que le fournisseur existe
    const fournisseur = await prisma.fournisseurDetails.findUnique({
      where: { id }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    // Si c'est le RIB par défaut, désactiver les autres
    if (estParDefaut) {
      await prisma.ribFournisseur.updateMany({
        where: { fournisseurDetailsId: id },
        data: { estParDefaut: false }
      });
    }

    const rib = await prisma.ribFournisseur.create({
      data: {
        fournisseurDetailsId: id,
        iban,
        bic,
        titulaire,
        estParDefaut: estParDefaut || false
      }
    });

    res.status(201).json({
      message: 'RIB ajouté avec succès',
      rib
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout du RIB:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// ===== ROUTES STATISTIQUES =====

// GET /api/fournisseurs/:id/stats - Statistiques du fournisseur
router.get('/:id/stats', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le fournisseur existe
    const fournisseur = await prisma.fournisseurDetails.findUnique({
      where: { id }
    });

    if (!fournisseur) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    // Statistiques des factures
    const facturesStats = await prisma.factureFournisseur.aggregate({
      where: { tiersId: fournisseur.tiersId },
      _sum: { montantTotal: true },
      _count: true
    });

    // Dernière facture
    const derniereFacture = await prisma.factureFournisseur.findFirst({
      where: { tiersId: fournisseur.tiersId },
      orderBy: { dateFacture: 'desc' },
      select: { dateFacture: true, montantTotal: true }
    });

    // Factures en cours
    const facturesEnCours = await prisma.factureFournisseur.aggregate({
      where: { 
        tiersId: fournisseur.tiersId,
        statut: { not: 'reglee' }
      },
      _sum: { resteALetrer: true },
      _count: true
    });

    // Score qualité moyen
    const scoreQualite = await prisma.historiqueQualite.aggregate({
      where: { tiersId: fournisseur.tiersId },
      _avg: { scoreGlobal: true }
    });

    // Documents expirés
    const documentsExpires = await prisma.documentFournisseur.count({
      where: {
        tiersId: fournisseur.tiersId,
        statut: 'EXPIRE'
      }
    });

    res.json({
      totalAchats: facturesStats._sum.montantTotal || 0,
      nombreFactures: facturesStats._count || 0,
      derniereFacture,
      facturesEnCours: {
        montant: facturesEnCours._sum.resteALetrer || 0,
        nombre: facturesEnCours._count || 0
      },
      scoreQualiteMoyen: scoreQualite._avg.scoreGlobal || 0,
      documentsExpires
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

module.exports = router;
