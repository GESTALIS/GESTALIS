const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation des données utilisateur
const userValidation = {
  username: { required: true, minLength: 3, maxLength: 50 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  first_name: { required: true, minLength: 2, maxLength: 50 },
  last_name: { required: true, minLength: 2, maxLength: 50 },
  role: { required: true }
};

// GET /api/users - Liste des utilisateurs (admin seulement)
router.get('/', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    // Filtre par rôle
    if (role && role !== 'all') {
      whereClause += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    // Recherche textuelle
    if (search) {
      whereClause += ` AND (username ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Requête principale
    const result = await query(
      `SELECT id, username, email, first_name, last_name, role, is_active, phone, created_at, last_login
       FROM users
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    // Compte total pour la pagination
    const countResult = await query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
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
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des utilisateurs',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/users/:id - Détails d'un utilisateur
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification des permissions
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        error: 'Accès non autorisé',
        code: 'ACCESS_DENIED'
      });
    }

    const result = await query(
      `SELECT id, username, email, first_name, last_name, role, is_active, phone, avatar_url, created_at, last_login
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de l\'utilisateur',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/users - Création d'un utilisateur (admin seulement)
router.post('/', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, role, phone } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'Nom d\'utilisateur ou email déjà utilisé',
        code: 'USER_ALREADY_EXISTS'
      });
    }

    // Hachage du mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Création de l'utilisateur
    const result = await query(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, role, phone, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id, username, email, first_name, last_name, role, phone, created_at`,
      [username, email, hashedPassword, first_name, last_name, role, phone]
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de l\'utilisateur',
      code: 'CREATION_ERROR'
    });
  }
});

// PUT /api/users/:id - Mise à jour d'un utilisateur
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, avatar_url } = req.body;

    // Vérification des permissions
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        error: 'Accès non autorisé',
        code: 'ACCESS_DENIED'
      });
    }

    // Vérification que l'utilisateur existe
    const existingUser = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Mise à jour de l'utilisateur
    const result = await query(
      `UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        avatar_url = COALESCE($4, avatar_url),
        updated_at = NOW()
       WHERE id = $5
       RETURNING id, username, email, first_name, last_name, role, phone, avatar_url, updated_at`,
      [first_name, last_name, phone, avatar_url, id]
    );

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour de l\'utilisateur',
      code: 'UPDATE_ERROR'
    });
  }
});

// PUT /api/users/:id/role - Modification du rôle (admin seulement)
router.put('/:id/role', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validation du rôle
    const validRoles = ['admin', 'manager', 'user', 'viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Rôle invalide',
        code: 'INVALID_ROLE'
      });
    }

    // Vérification que l'utilisateur existe
    const existingUser = await query('SELECT id, username FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Empêcher la modification de son propre rôle
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        error: 'Impossible de modifier son propre rôle',
        code: 'SELF_ROLE_MODIFICATION'
      });
    }

    // Mise à jour du rôle
    await query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2',
      [role, id]
    );

    res.json({
      message: 'Rôle mis à jour avec succès',
      user: { id, username: existingUser.rows[0].username, role }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du rôle',
      code: 'UPDATE_ERROR'
    });
  }
});

// PUT /api/users/:id/password - Modification du mot de passe
router.put('/:id/password', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Vérification des permissions
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        error: 'Accès non autorisé',
        code: 'ACCESS_DENIED'
      });
    }

    // Vérification que l'utilisateur existe
    const existingUser = await query('SELECT password_hash FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Vérification du mot de passe actuel (sauf pour les admins)
    if (req.user.role !== 'admin') {
      const isValidPassword = await bcrypt.compare(currentPassword, existingUser.rows[0].password_hash);
      if (!isValidPassword) {
        return res.status(400).json({
          error: 'Mot de passe actuel incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }
    }

    // Hachage du nouveau mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mise à jour du mot de passe
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, id]
    );

    res.json({
      message: 'Mot de passe mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du mot de passe',
      code: 'UPDATE_ERROR'
    });
  }
});

// PUT /api/users/:id/status - Activation/désactivation (admin seulement)
router.put('/:id/status', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Vérification que l'utilisateur existe
    const existingUser = await query('SELECT id, username FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Empêcher la désactivation de son propre compte
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        error: 'Impossible de désactiver son propre compte',
        code: 'SELF_DEACTIVATION'
      });
    }

    // Mise à jour du statut
    await query(
      'UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2',
      [is_active, id]
    );

    res.json({
      message: `Utilisateur ${is_active ? 'activé' : 'désactivé'} avec succès`,
      user: { id, username: existingUser.rows[0].username, is_active }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du statut',
      code: 'UPDATE_ERROR'
    });
  }
});

// DELETE /api/users/:id - Suppression d'un utilisateur (admin seulement)
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification que l'utilisateur existe
    const existingUser = await query('SELECT id, username FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Empêcher la suppression de son propre compte
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        error: 'Impossible de supprimer son propre compte',
        code: 'SELF_DELETION'
      });
    }

    // Suppression de l'utilisateur
    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression de l\'utilisateur',
      code: 'DELETE_ERROR'
    });
  }
});

// GET /api/users/profile - Profil de l'utilisateur connecté
router.get('/profile/me', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, username, email, first_name, last_name, role, is_active, phone, avatar_url, created_at, last_login
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du profil',
      code: 'FETCH_ERROR'
    });
  }
});

module.exports = router;
