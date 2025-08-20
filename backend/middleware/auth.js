// middleware/auth.js (CommonJS)

const jwt = require('jsonwebtoken');

/**
 * Renseigne req.user si un JWT valide est présent (Authorization: Bearer <token>)
 * En DEV, si pas de JWT, lit éventuel header X-Role pour tester (ex: X-Role: admin)
 */
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      // attendu: payload = { id, email, role, ... }
      req.user = payload;
      return next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // Fallback DEV: autoriser si X-Role présent (ex: "admin", "user")
  const devRole = req.headers['x-role'];
  if (process.env.NODE_ENV !== 'production' && devRole) {
    req.user = { id: 'dev', role: String(devRole) };
    return next();
  }

  return res.status(401).json({ error: 'Authentication required' });
}

/**
 * Fabrique un middleware qui exige un rôle parmi allowedRoles
 * Usage: router.get('/admin', requireAuth, requireRole(['admin']), handler)
 */
function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Forbidden: no role' });
    }
    const ok = allowedRoles.includes(req.user.role);
    if (!ok) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    return next();
  };
}

/**
 * Fabrique un middleware qui exige une permission spécifique
 * Usage: router.post('/lettrages', requireAuth, requirePermission('lettrages', 'create'), handler)
 */
function requirePermission(resource, action) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Forbidden: no role' });
    }

    // Admin a tous les droits
    if (req.user.role === 'admin') {
      return next();
    }

    // Permissions par rôle (simplifié pour le développement)
    const rolePermissions = {
      manager: {
        situations: ['create', 'read', 'update'],
        marches: ['create', 'read', 'update'], 
        lettrages: ['create', 'read', 'update', 'delete_created_only'],
        imports: ['preview', 'integrer', 'read']
      },
      user: {
        situations: ['read'],
        marches: ['read'],
        lettrages: ['read'],
        imports: ['read']
      },
      viewer: {
        situations: ['read'],
        marches: ['read'],
        lettrages: ['read'],
        imports: ['read']
      }
    };

    const userPermissions = rolePermissions[req.user.role] || {};
    const resourcePermissions = userPermissions[resource] || [];
    
    if (!resourcePermissions.includes(action)) {
      return res.status(403).json({ 
        error: 'Forbidden: insufficient permission',
        required: `${resource}:${action}`,
        userRole: req.user.role
      });
    }

    return next();
  };
}

module.exports = { requireAuth, requireRole, requirePermission };
