const express = require('express');
const { query } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/sous-traitance - Liste des contrats de sous-traitance
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, statut, chantier_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    // Filtre par statut
    if (statut && statut !== 'all') {
      whereClause += ` AND st.statut = $${paramIndex}`;
      params.push(statut);
      paramIndex++;
    }

    // Filtre par chantier
    if (chantier_id) {
      whereClause += ` AND st.chantier_id = $${paramIndex}`;
      params.push(chantier_id);
      paramIndex++;
    }

    // Requête principale avec jointures
    const result = await query(
      `SELECT 
        st.*,
        c.nom as chantier_nom,
        f.nom as sous_traitant_nom,
        f.siret as sous_traitant_siret
       FROM sous_traitance_contrats st
       LEFT JOIN chantiers c ON st.chantier_id = c.id
       LEFT JOIN fournisseurs f ON st.sous_traitant_id = f.id
       ${whereClause}
       ORDER BY st.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    // Compte total pour la pagination
    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM sous_traitance_contrats st
       LEFT JOIN chantiers c ON st.chantier_id = c.id
       LEFT JOIN fournisseurs f ON st.sous_traitant_id = f.id
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
    console.error('Erreur lors de la récupération des contrats de sous-traitance:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des contrats de sous-traitance',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/sous-traitance/:id - Détails d'un contrat
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        st.*,
        c.nom as chantier_nom,
        f.nom as sous_traitant_nom,
        f.siret as sous_traitant_siret,
        f.adresse as sous_traitant_adresse
       FROM sous_traitance_contrats st
       LEFT JOIN chantiers c ON st.chantier_id = c.id
       LEFT JOIN fournisseurs f ON st.sous_traitant_id = f.id
       WHERE st.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Contrat de sous-traitance non trouvé',
        code: 'CONTRAT_NOT_FOUND'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erreur lors de la récupération du contrat:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du contrat',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/sous-traitance - Création d'un contrat
router.post('/', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      chantier_id,
      sous_traitant_id,
      reference,
      montant_ttc,
      retenue_garantie_pct,
      caution_remplacement,
      statut,
      notes
    } = req.body;

    // Vérification que le chantier existe
    const chantierResult = await query('SELECT id FROM chantiers WHERE id = $1', [chantier_id]);
    if (chantierResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Chantier non trouvé',
        code: 'CHANTIER_NOT_FOUND'
      });
    }

    // Vérification que le sous-traitant existe
    const fournisseurResult = await query('SELECT id FROM fournisseurs WHERE id = $1', [sous_traitant_id]);
    if (fournisseurResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Sous-traitant non trouvé',
        code: 'SOUS_TRAITANT_NOT_FOUND'
      });
    }

    // Création du contrat
    const result = await query(
      `INSERT INTO sous_traitance_contrats (
        chantier_id, sous_traitant_id, reference, montant_ttc,
        retenue_garantie_pct, caution_remplacement, statut, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [chantier_id, sous_traitant_id, reference, montant_ttc,
       retenue_garantie_pct, caution_remplacement, statut, notes, req.user.id]
    );

    res.status(201).json({
      message: 'Contrat de sous-traitance créé avec succès',
      contrat: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la création du contrat:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du contrat',
      code: 'CREATION_ERROR'
    });
  }
});

// PUT /api/sous-traitance/:id - Mise à jour d'un contrat
router.put('/:id', requireAuth, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      montant_ttc,
      retenue_garantie_pct,
      caution_remplacement,
      statut,
      notes
    } = req.body;

    // Vérification que le contrat existe
    const existingContrat = await query('SELECT id FROM sous_traitance_contrats WHERE id = $1', [id]);
    if (existingContrat.rows.length === 0) {
      return res.status(404).json({
        error: 'Contrat de sous-traitance non trouvé',
        code: 'CONTRAT_NOT_FOUND'
      });
    }

    // Mise à jour du contrat
    const result = await query(
      `UPDATE sous_traitance_contrats SET
        montant_ttc = COALESCE($1, montant_ttc),
        retenue_garantie_pct = COALESCE($2, retenue_garantie_pct),
        caution_remplacement = COALESCE($3, caution_remplacement),
        statut = COALESCE($4, statut),
        notes = COALESCE($5, notes),
        updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [montant_ttc, retenue_garantie_pct, caution_remplacement, statut, notes, id]
    );

    res.json({
      message: 'Contrat de sous-traitance mis à jour avec succès',
      contrat: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du contrat:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du contrat',
      code: 'UPDATE_ERROR'
    });
  }
});

// DELETE /api/sous-traitance/:id - Suppression d'un contrat
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification que le contrat existe
    const existingContrat = await query('SELECT id, statut FROM sous_traitance_contrats WHERE id = $1', [id]);
    if (existingContrat.rows.length === 0) {
      return res.status(404).json({
        error: 'Contrat de sous-traitance non trouvé',
        code: 'CONTRAT_NOT_FOUND'
      });
    }

    // Vérification que le contrat peut être supprimé
    if (existingContrat.rows[0].statut === 'actif') {
      return res.status(400).json({
        error: 'Impossible de supprimer un contrat actif',
        code: 'CONTRAT_ACTIF'
      });
    }

    // Suppression du contrat
    await query('DELETE FROM sous_traitance_contrats WHERE id = $1', [id]);

    res.json({
      message: 'Contrat de sous-traitance supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du contrat:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du contrat',
      code: 'DELETE_ERROR'
    });
  }
});

module.exports = router;
