const express = require('express');
const { query } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/clients - Liste des clients
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, type } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    // Filtre par recherche (nom ou siret)
    if (search) {
      whereClause += ` AND (t.nom ILIKE $${paramIndex} OR t.siret ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Filtre par type
    if (type && type !== 'all') {
      whereClause += ` AND t.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Requête principale
    const result = await query(
      `SELECT 
        t.*,
        COUNT(c.id) as nb_chantiers
       FROM tiers t
       LEFT JOIN chantiers c ON t.id = c.client_id
       ${whereClause}
       AND t.type = 'client'
       GROUP BY t.id
       ORDER BY t.nom
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    // Compte total pour la pagination
    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM tiers t
       ${whereClause}
       AND t.type = 'client'`,
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

    const result = await query(
      `SELECT t.*
       FROM tiers t
       WHERE t.id = $1 AND t.type = 'client'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Client non trouvé',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    res.json(result.rows[0]);

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

    const result = await query(
      `INSERT INTO tiers (
        nom, siret, adresse, telephone, email, contact_principal, notes, type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'client')
      RETURNING *`,
      [nom, siret, adresse, telephone, email, contact_principal, notes]
    );

    res.status(201).json({
      message: 'Client créé avec succès',
      client: result.rows[0]
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
    const existingClient = await query('SELECT id FROM tiers WHERE id = $1 AND type = $2', [id, 'client']);
    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        error: 'Client non trouvé',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    // Mise à jour du client
    const result = await query(
      `UPDATE tiers SET
        nom = COALESCE($1, nom),
        siret = COALESCE($2, siret),
        adresse = COALESCE($3, adresse),
        telephone = COALESCE($4, telephone),
        email = COALESCE($5, email),
        contact_principal = COALESCE($6, contact_principal),
        notes = COALESCE($7, notes),
        updated_at = NOW()
       WHERE id = $8 AND type = 'client'
       RETURNING *`,
      [nom, siret, adresse, telephone, email, contact_principal, notes, id]
    );

    res.json({
      message: 'Client mis à jour avec succès',
      client: result.rows[0]
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
    const existingClient = await query('SELECT id FROM tiers WHERE id = $1 AND type = $2', [id, 'client']);
    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        error: 'Client non trouvé',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    // Vérification que le client n'a pas de chantiers associés
    const chantiersResult = await query('SELECT id FROM chantiers WHERE client_id = $1', [id]);
    if (chantiersResult.rows.length > 0) {
      return res.status(400).json({
        error: 'Impossible de supprimer un client ayant des chantiers associés',
        code: 'CLIENT_HAS_CHANTIERS'
      });
    }

    // Suppression du client
    await query('DELETE FROM tiers WHERE id = $1 AND type = $2', [id, 'client']);

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