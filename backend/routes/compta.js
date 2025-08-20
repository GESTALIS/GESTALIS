const express = require('express');
const { query } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/compta/societes - Liste des sociétés
router.get('/societes', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, raison_sociale, siret, tva_intra, tva_mode, created_at
       FROM societes
       ORDER BY raison_sociale`
    );

    res.json({
      results: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des sociétés:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des sociétés',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/compta/societes/:id - Détails d'une société
router.get('/societes/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM societes WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Société non trouvée',
        code: 'SOCIETE_NOT_FOUND'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erreur lors de la récupération de la société:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de la société',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/compta/societes - Création d'une société
router.post('/societes', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const {
      raison_sociale,
      siret,
      tva_intra,
      plan_comptable,
      journals,
      tva_mode
    } = req.body;

    // Création de la société
    const result = await query(
      `INSERT INTO societes (
        raison_sociale, siret, tva_intra, plan_comptable, journals, tva_mode
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [raison_sociale, siret, tva_intra, plan_comptable, journals, tva_mode]
    );

    res.status(201).json({
      message: 'Société créée avec succès',
      societe: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la création de la société:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de la société',
      code: 'CREATION_ERROR'
    });
  }
});

// GET /api/compta/exports - Liste des exports comptables
router.get('/exports', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, societe_id, type, statut } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    // Filtre par société
    if (societe_id) {
      whereClause += ` AND ec.societe_id = $${paramIndex}`;
      params.push(societe_id);
      paramIndex++;
    }

    // Filtre par type
    if (type) {
      whereClause += ` AND ec.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Filtre par statut
    if (statut) {
      whereClause += ` AND ec.statut = $${paramIndex}`;
      params.push(statut);
      paramIndex++;
    }

    // Requête principale avec jointures
    const result = await query(
      `SELECT 
        ec.*,
        s.raison_sociale as societe_nom
       FROM export_comptables ec
       LEFT JOIN societes s ON ec.societe_id = s.id
       ${whereClause}
       ORDER BY ec.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    // Compte total pour la pagination
    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM export_comptables ec
       LEFT JOIN societes s ON ec.societe_id = s.id
       ${whereClause}`,
      params
    );

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      results: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des exports:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des exports',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/compta/exports - Création d'un export comptable
router.post('/exports', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      societe_id,
      type,
      exercice,
      periode_debut,
      periode_fin
    } = req.body;

    // Vérification que la société existe
    const societeResult = await query('SELECT id FROM societes WHERE id = $1', [societe_id]);
    if (societeResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Société non trouvée',
        code: 'SOCIETE_NOT_FOUND'
      });
    }

    // Création de l'export
    const result = await query(
      `INSERT INTO export_comptables (
        societe_id, type, exercice, periode_debut, periode_fin, statut
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [societe_id, type, exercice, periode_debut, periode_fin, 'en_cours']
    );

    res.status(201).json({
      message: 'Export comptable créé avec succès',
      export: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'export:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de l\'export',
      code: 'CREATION_ERROR'
    });
  }
});

// PUT /api/compta/exports/:id/status - Mise à jour du statut d'un export
router.put('/exports/:id/status', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, fichier_url, checksum } = req.body;

    // Vérification que l'export existe
    const existingExport = await query('SELECT id FROM export_comptables WHERE id = $1', [id]);
    if (existingExport.rows.length === 0) {
      return res.status(404).json({
        error: 'Export comptable non trouvé',
        code: 'EXPORT_NOT_FOUND'
      });
    }

    // Mise à jour du statut
    const result = await query(
      `UPDATE export_comptables SET
        statut = $1,
        fichier_url = COALESCE($2, fichier_url),
        checksum = COALESCE($3, checksum),
        updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [statut, fichier_url, checksum, id]
    );

    res.json({
      message: 'Statut de l\'export mis à jour avec succès',
      export: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du statut',
      code: 'UPDATE_ERROR'
    });
  }
});

// GET /api/compta/plan-comptable/:societe_id - Plan comptable d'une société
router.get('/plan-comptable/:societe_id', requireAuth, async (req, res) => {
  try {
    const { societe_id } = req.params;

    const result = await query(
      `SELECT plan_comptable FROM societes WHERE id = $1`,
      [societe_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Société non trouvée',
        code: 'SOCIETE_NOT_FOUND'
      });
    }

    res.json({
      plan_comptable: result.rows[0].plan_comptable
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du plan comptable:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du plan comptable',
      code: 'FETCH_ERROR'
    });
  }
});

module.exports = router;
