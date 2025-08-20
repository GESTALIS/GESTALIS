const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login - Connexion avec cookies
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email et mot de passe requis',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Recherche de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.active) {
      return res.status(401).json({
        error: 'Identifiants invalides',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Vérification du mot de passe
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Identifiants invalides',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Génération des tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TTL || '10m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, tokenType: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TTL || '7d' }
    );

    // Hash du refresh token pour stockage sécurisé
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    // Stockage du refresh token en base
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
        deviceFingerprint: req.headers['user-agent'] || 'unknown'
      }
    });

    // Configuration des cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAME_SITE || 'strict',
      path: '/',
      domain: process.env.COOKIE_DOMAIN || 'localhost'
    };

    // Access token (10 minutes)
    res.cookie('access', accessToken, {
      ...cookieOptions,
      maxAge: 10 * 60 * 1000 // 10 minutes
    });

    // Refresh token (7 jours)
    res.cookie('refresh', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      path: '/api/auth/refresh'
    });

    // Réponse sans les tokens (ils sont dans les cookies)
    res.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        active: user.active
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'LOGIN_ERROR'
    });
  }
});

// POST /api/auth/refresh - Renouvellement du token avec rotation
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token manquant',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Vérification du refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.tokenType !== 'refresh') {
      return res.status(401).json({
        error: 'Token invalide',
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    // Recherche de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, active: true }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Utilisateur non trouvé ou inactif',
        code: 'USER_NOT_FOUND'
      });
    }

    // Vérification du refresh token en base
    const storedRefreshToken = await prisma.refreshToken.findFirst({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
        revokedAt: null
      }
    });

    if (!storedRefreshToken) {
      return res.status(401).json({
        error: 'Refresh token invalide ou expiré',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Vérification du hash
    const isValidToken = await bcrypt.compare(refreshToken, storedRefreshToken.tokenHash);
    if (!isValidToken) {
      return res.status(401).json({
        error: 'Refresh token invalide',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // RÉVOQUER l'ancien refresh token (rotation)
    await prisma.refreshToken.update({
      where: { id: storedRefreshToken.id },
      data: { revokedAt: new Date() }
    });

    // Générer un nouveau access token
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TTL || '10m' }
    );

    // Générer un nouveau refresh token
    const newRefreshToken = jwt.sign(
      { userId: user.id, tokenType: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TTL || '7d' }
    );

    // Hash et stockage du nouveau refresh token
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        deviceFingerprint: req.headers['user-agent'] || 'unknown'
      }
    });

    // Mise à jour des cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAME_SITE || 'strict',
      path: '/',
      domain: process.env.COOKIE_DOMAIN || 'localhost'
    };

    res.cookie('access', newAccessToken, {
      ...cookieOptions,
      maxAge: 10 * 60 * 1000
    });

    res.cookie('refresh', newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh'
    });

    res.json({
      success: true,
      message: 'Tokens renouvelés avec succès'
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Refresh token expiré',
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    }

    console.error('Erreur lors du refresh:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'REFRESH_ERROR'
    });
  }
});

// POST /api/auth/logout - Déconnexion avec révocation
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const { user } = req;

    // Révoquer tous les refresh tokens de l'utilisateur
    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revokedAt: new Date() }
    });

    // Effacer les cookies
    res.clearCookie('access', {
      path: '/',
      domain: process.env.COOKIE_DOMAIN || 'localhost'
    });

    res.clearCookie('refresh', {
      path: '/api/auth/refresh',
      domain: process.env.COOKIE_DOMAIN || 'localhost'
    });

    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'LOGOUT_ERROR'
    });
  }
});

// GET /api/auth/me - Informations de l'utilisateur connecté
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { user } = req;

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      code: 'USER_INFO_ERROR'
    });
  }
});

module.exports = router;
