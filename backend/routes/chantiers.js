const express = require('express');
const { query } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Validation des données de chantier
const chantierValidation = {
  nom: { required: true, minLength: 3, maxLength: 200 },
  adresse: { required: true, minLength: 10, maxLength: 500 },
  code_postal: { required: true, pattern: /^\d{5}$/ },
  ville: { required: true, minLength: 2, maxLength: 100 },
  budget_initial: { required: true }
};

// GET /api/chantiers - Liste des chantiers avec pagination et filtres
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', statut = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Construction des filtres
    const whereClause = {};
    
    if (search) {
      whereClause.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (statut && statut !== 'all') {
      whereClause.statut = statut;
    }

    // Requête Prisma avec jointures
    const [chantiers, total] = await Promise.all([
      prisma.chantier.findMany({
        where: whereClause,
        include: {
          marches: {
            include: {
              client: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.chantier.count({ where: whereClause })
    ]);

    // Transformation des données pour la compatibilité frontend
    const results = chantiers.map(chantier => ({
      ...chantier,
      client: chantier.marches[0]?.client || null,
      budget_initial: chantier.budgetInitial,
      budget_actuel: chantier.budgetActuel,
      date_debut: chantier.dateDebut,
      date_fin_prevue: chantier.dateFinPrevue,
      date_fin_reelle: chantier.dateFinReelle,
      created_at: chantier.createdAt,
      updated_at: chantier.updatedAt
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
    console.error('Erreur lors de la récupération des chantiers:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des chantiers',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/chantiers/:id - Détails d'un chantier
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        c.*,
        cl.nom as client_nom,
        cl.siret as client_siret,
        cl.adresse as client_adresse,
        cl.code_postal as client_code_postal,
        cl.ville as client_ville,
        cl.telephone as client_telephone,
        cl.email as client_email,
        cl.contact_principal as client_contact,
        u.username as responsable_username,
        u.first_name as responsable_first_name,
        u.last_name as responsable_last_name,
        u.email as responsable_email
       FROM chantiers c
       LEFT JOIN clients cl ON c.client_id = cl.id
       LEFT JOIN users u ON c.responsable_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Chantier non trouvé',
        code: 'CHANTIER_NOT_FOUND'
      });
    }

    // Récupération des demandes de prix associées
    const demandesResult = await query(
      `SELECT dp.*, f.nom as fournisseur_nom
       FROM demandes_prix dp
       LEFT JOIN fournisseurs f ON dp.fournisseur_id = f.id
       WHERE dp.chantier_id = $1
       ORDER BY dp.created_at DESC`,
      [id]
    );

    // Récupération des équipes affectées
    const equipesResult = await query(
      `SELECT ae.*, e.nom as equipe_nom, e.specialite
       FROM affectations_equipes ae
       LEFT JOIN equipes e ON ae.equipe_id = e.id
       WHERE ae.chantier_id = $1
       ORDER BY ae.date_debut DESC`,
      [id]
    );

    const chantier = result.rows[0];
    chantier.demandes_prix = demandesResult.rows;
    chantier.equipes_affectees = equipesResult.rows;

    res.json(chantier);

  } catch (error) {
    console.error('Erreur lors de la récupération du chantier:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du chantier',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/chantiers - Création d'un chantier
router.post('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      nom,
      description,
      adresse,
      code_postal,
      ville,
      client_id,
      date_debut,
      date_fin_prevue,
      budget_initial,
      responsable_id,
      notes
    } = req.body;

    // Vérification que le client existe
    if (client_id) {
      const clientResult = await query('SELECT id FROM clients WHERE id = $1', [client_id]);
      if (clientResult.rows.length === 0) {
        return res.status(400).json({
          error: 'Client non trouvé',
          code: 'CLIENT_NOT_FOUND'
        });
      }
    }

    // Vérification que le responsable existe
    if (responsable_id) {
      const userResult = await query('SELECT id FROM users WHERE id = $1', [responsable_id]);
      if (userResult.rows.length === 0) {
        return res.status(400).json({
          error: 'Responsable non trouvé',
          code: 'RESPONSABLE_NOT_FOUND'
        });
      }
    }

    // Création du chantier
    const result = await query(
      `INSERT INTO chantiers (
        nom, description, adresse, code_postal, ville, client_id, 
        date_debut, date_fin_prevue, budget_initial, budget_actuel,
        responsable_id, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $11, $12)
      RETURNING *`,
      [nom, description, adresse, code_postal, ville, client_id, 
       date_debut, date_fin_prevue, budget_initial, responsable_id, 
       notes, req.user.id]
    );

    res.status(201).json({
      message: 'Chantier créé avec succès',
      chantier: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la création du chantier:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du chantier',
      code: 'CREATION_ERROR'
    });
  }
});

// PUT /api/chantiers/:id - Mise à jour d'un chantier
router.put('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      description,
      adresse,
      code_postal,
      ville,
      client_id,
      statut,
      date_debut,
      date_fin_prevue,
      date_fin_reelle,
      budget_initial,
      budget_actuel,
      pourcentage_avancement,
      responsable_id,
      notes
    } = req.body;

    // Vérification que le chantier existe
    const existingChantier = await query('SELECT id FROM chantiers WHERE id = $1', [id]);
    if (existingChantier.rows.length === 0) {
      return res.status(404).json({
        error: 'Chantier non trouvé',
        code: 'CHANTIER_NOT_FOUND'
      });
    }

    // Mise à jour du chantier
    const result = await query(
      `UPDATE chantiers SET
        nom = COALESCE($1, nom),
        description = COALESCE($2, description),
        adresse = COALESCE($3, adresse),
        code_postal = COALESCE($4, code_postal),
        ville = COALESCE($5, ville),
        client_id = COALESCE($6, client_id),
        statut = COALESCE($7, statut),
        date_debut = COALESCE($8, date_debut),
        date_fin_prevue = COALESCE($9, date_fin_prevue),
        date_fin_reelle = COALESCE($10, date_fin_reelle),
        budget_initial = COALESCE($11, budget_initial),
        budget_actuel = COALESCE($12, budget_actuel),
        pourcentage_avancement = COALESCE($13, pourcentage_avancement),
        responsable_id = COALESCE($14, responsable_id),
        notes = COALESCE($15, notes),
        updated_at = NOW()
       WHERE id = $16
       RETURNING *`,
      [nom, description, adresse, code_postal, ville, client_id, 
       statut, date_debut, date_fin_prevue, date_fin_reelle,
       budget_initial, budget_actuel, pourcentage_avancement,
       responsable_id, notes, id]
    );

    res.json({
      message: 'Chantier mis à jour avec succès',
      chantier: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du chantier:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du chantier',
      code: 'UPDATE_ERROR'
    });
  }
});

// DELETE /api/chantiers/:id - Suppression d'un chantier
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification que le chantier existe
    const existingChantier = await query('SELECT id, statut FROM chantiers WHERE id = $1', [id]);
    if (existingChantier.rows.length === 0) {
      return res.status(404).json({
        error: 'Chantier non trouvé',
        code: 'CHANTIER_NOT_FOUND'
      });
    }

    // Vérification que le chantier peut être supprimé
    if (existingChantier.rows[0].statut === 'en_cours') {
      return res.status(400).json({
        error: 'Impossible de supprimer un chantier en cours',
        code: 'CHANTIER_IN_PROGRESS'
      });
    }

    // Suppression du chantier
    await query('DELETE FROM chantiers WHERE id = $1', [id]);

    res.json({
      message: 'Chantier supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du chantier:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du chantier',
      code: 'DELETE_ERROR'
    });
  }
});

// GET /api/chantiers/:id/statistiques - Statistiques d'un chantier
router.get('/:id/statistiques', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Statistiques des demandes de prix
    const demandesStats = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN statut = 'acceptee' THEN 1 END) as acceptees,
        COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
        COUNT(CASE WHEN statut = 'refusee' THEN 1 END) as refusees,
        SUM(CASE WHEN statut = 'acceptee' THEN montant_total ELSE 0 END) as montant_total_accepte
       FROM demandes_prix
       WHERE chantier_id = $1`,
      [id]
    );

    // Statistiques des commandes
    const commandesStats = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN statut = 'livree' THEN 1 END) as livrees,
        COUNT(CASE WHEN statut = 'en_cours' THEN 1 END) as en_cours,
        SUM(CASE WHEN statut = 'livree' THEN montant_total ELSE 0 END) as montant_total_livre
       FROM commandes_fournisseurs
       WHERE chantier_id = $1`,
      [id]
    );

    // Statistiques financières
    const financesStats = await query(
      `SELECT 
        c.budget_initial,
        c.budget_actuel,
        c.pourcentage_avancement,
        COALESCE(SUM(dp.montant_total), 0) as total_demandes,
        COALESCE(SUM(cf.montant_total), 0) as total_commandes
       FROM chantiers c
       LEFT JOIN demandes_prix dp ON c.id = dp.chantier_id AND dp.statut = 'acceptee'
       LEFT JOIN commandes_fournisseurs cf ON c.id = cf.chantier_id AND cf.statut = 'livree'
       WHERE c.id = $1
       GROUP BY c.id, c.budget_initial, c.budget_actuel, c.pourcentage_avancement`,
      [id]
    );

    res.json({
      demandes_prix: demandesStats.rows[0],
      commandes: commandesStats.rows[0],
      finances: financesStats.rows[0] || {}
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des statistiques',
      code: 'STATS_ERROR'
    });
  }
});

module.exports = router;
