const express = require('express');
const { query } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/achats/demandes-prix - Liste des demandes de prix
router.get('/demandes-prix', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT dp.*, c.nom as chantier_nom, f.nom as fournisseur_nom
       FROM demandes_prix dp
       LEFT JOIN chantiers c ON dp.chantier_id = c.id
       LEFT JOIN fournisseurs f ON dp.fournisseur_id = f.id
       ORDER BY dp.created_at DESC`
    );

    res.json({
      results: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de prix:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des demandes de prix',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/achats/commandes - Liste des commandes fournisseurs
router.get('/commandes', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT cf.*, c.nom as chantier_nom, f.nom as fournisseur_nom
       FROM commandes_fournisseurs cf
       LEFT JOIN chantiers c ON cf.chantier_id = c.id
       LEFT JOIN fournisseurs f ON cf.fournisseur_id = f.id
       ORDER BY cf.created_at DESC`
    );

    res.json({
      results: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des commandes',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/achats/factures - Liste des factures fournisseurs
router.get('/factures', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT ff.*, f.nom as fournisseur_nom
       FROM factures_fournisseurs ff
       LEFT JOIN fournisseurs f ON ff.fournisseur_id = f.id
       ORDER BY ff.created_at DESC`
    );

    res.json({
      results: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des factures',
      code: 'FETCH_ERROR'
    });
  }
});

module.exports = router;