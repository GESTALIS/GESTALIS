const express = require('express');
const { query } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/cessions - Liste des cessions de créances
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, statut, facture_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    // Filtre par statut
    if (statut && statut !== 'all') {
      whereClause += ` AND cc.statut = $${paramIndex}`;
      params.push(statut);
      paramIndex++;
    }

    // Filtre par facture
    if (facture_id) {
      whereClause += ` AND cc.facture_client_id = $${paramIndex}`;
      params.push(facture_id);
      paramIndex++;
    }

    // Requête principale avec jointures
    const result = await query(
      `SELECT 
        cc.*,
        fc.numero as facture_numero,
        fc.montant_total as facture_montant,
        c.nom as chantier_nom,
        t.nom as client_nom
       FROM cession_creances cc
       LEFT JOIN factures_clients fc ON cc.facture_client_id = fc.id
       LEFT JOIN chantiers c ON fc.chantier_id = c.id
       LEFT JOIN tiers t ON fc.tiers_id = t.id
       ${whereClause}
       ORDER BY cc.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    // Compte total pour la pagination
    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM cession_creances cc
       LEFT JOIN factures_clients fc ON cc.facture_client_id = fc.id
       LEFT JOIN chantiers c ON fc.chantier_id = c.id
       LEFT JOIN tiers t ON fc.tiers_id = t.id
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
    console.error('Erreur lors de la récupération des cessions:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des cessions',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/cessions/:id - Détails d'une cession
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        cc.*,
        fc.numero as facture_numero,
        fc.montant_total as facture_montant,
        fc.date_facture as facture_date,
        c.nom as chantier_nom,
        t.nom as client_nom,
        t.siret as client_siret
       FROM cession_creances cc
       LEFT JOIN factures_clients fc ON cc.facture_client_id = fc.id
       LEFT JOIN chantiers c ON fc.chantier_id = c.id
       LEFT JOIN tiers t ON fc.tiers_id = t.id
       WHERE cc.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Cession de créance non trouvée',
        code: 'CESSION_NOT_FOUND'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erreur lors de la récupération de la cession:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de la cession',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/cessions - Création d'une cession
router.post('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      facture_client_id,
      cessionnaire,
      reference,
      date_cession,
      montant_cede,
      statut,
      piece_url,
      notes
    } = req.body;

    // Vérification que la facture existe
    const factureResult = await query('SELECT id FROM factures_clients WHERE id = $1', [facture_client_id]);
    if (factureResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Facture client non trouvée',
        code: 'FACTURE_NOT_FOUND'
      });
    }

    // Vérification que la facture n'a pas déjà une cession active
    const existingCession = await query(
      'SELECT id FROM cession_creances WHERE facture_client_id = $1 AND statut = $2',
      [facture_client_id, 'active']
    );
    if (existingCession.rows.length > 0) {
      return res.status(400).json({
        error: 'Cette facture a déjà une cession active',
        code: 'CESSION_ALREADY_EXISTS'
      });
    }

    // Création de la cession
    const result = await query(
      `INSERT INTO cession_creances (
        facture_client_id, cessionnaire, reference, date_cession,
        montant_cede, statut, piece_url, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [facture_client_id, cessionnaire, reference, date_cession,
       montant_cede, statut, piece_url, notes, req.user.id]
    );

    res.status(201).json({
      message: 'Cession de créance créée avec succès',
      cession: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la création de la cession:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de la cession',
      code: 'CREATION_ERROR'
    });
  }
});

// PUT /api/cessions/:id - Mise à jour d'une cession
router.put('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cessionnaire,
      reference,
      date_cession,
      montant_cede,
      statut,
      piece_url,
      notes
    } = req.body;

    // Vérification que la cession existe
    const existingCession = await query('SELECT id FROM cession_creances WHERE id = $1', [id]);
    if (existingCession.rows.length === 0) {
      return res.status(404).json({
        error: 'Cession de créance non trouvée',
        code: 'CESSION_NOT_FOUND'
      });
    }

    // Mise à jour de la cession
    const result = await query(
      `UPDATE cession_creances SET
        cessionnaire = COALESCE($1, cessionnaire),
        reference = COALESCE($2, reference),
        date_cession = COALESCE($3, date_cession),
        montant_cede = COALESCE($4, montant_cede),
        statut = COALESCE($5, statut),
        piece_url = COALESCE($6, piece_url),
        notes = COALESCE($7, notes),
        updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [cessionnaire, reference, date_cession, montant_cede, statut, piece_url, notes, id]
    );

    res.json({
      message: 'Cession de créance mise à jour avec succès',
      cession: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la cession:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour de la cession',
      code: 'UPDATE_ERROR'
    });
  }
});

// DELETE /api/cessions/:id - Suppression d'une cession
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification que la cession existe
    const existingCession = await query('SELECT id, statut FROM cession_creances WHERE id = $1', [id]);
    if (existingCession.rows.length === 0) {
      return res.status(404).json({
        error: 'Cession de créance non trouvée',
        code: 'CESSION_NOT_FOUND'
      });
    }

    // Vérification que la cession peut être supprimée
    if (existingCession.rows[0].statut === 'active') {
      return res.status(400).json({
        error: 'Impossible de supprimer une cession active',
        code: 'CESSION_ACTIVE'
      });
    }

    // Suppression de la cession
    await query('DELETE FROM cession_creances WHERE id = $1', [id]);

    res.json({
      message: 'Cession de créance supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la cession:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression de la cession',
      code: 'DELETE_ERROR'
    });
  }
});

module.exports = router;
