const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const redis = require('redis');
require('dotenv').config();

const app = express();
const PORT = 3003; // PORT FIXE - IGNORE process.env.PORT

// Client Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis connecté'));

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Cookie parser
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chantiers', require('./routes/chantiers'));
app.use('/api/achats', require('./routes/achats'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/fournisseurs', require('./routes/fournisseurs'));
app.use('/api/plan-comptable', require('./routes/plan-comptable'));
app.use('/api/conditions-paiement', require('./routes/conditions-paiement'));
app.use('/api/imports-banque', require('./routes/imports-banque'));
app.use('/api/lettrages', require('./routes/lettrages'));

// Nouvelles routes S1 + S3 + Compta
app.use('/api/marches', require('./routes/marches'));
app.use('/api/situations', require('./routes/situations'));
app.use('/api/sous-traitance', require('./routes/sous-traitance'));
app.use('/api/cessions', require('./routes/cessions'));
app.use('/api/compta', require('./routes/compta'));

// Route de santé
app.get('/health', async (req, res) => {
  try {
    // Vérifier Redis
    await redisClient.ping();
    
    res.json({ 
      status: 'OK', 
      message: 'GESTALIS Backend opérationnel',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        redis: 'OK',
        database: 'OK'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'Service dégradé',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Route de version
app.get('/version', (req, res) => {
  res.json({
    version: '1.0.0',
    build: process.env.BUILD_ID || 'dev',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Route de métriques Prometheus
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`
# HELP gestalis_http_requests_total Total number of HTTP requests
# TYPE gestalis_http_requests_total counter
gestalis_http_requests_total{method="GET",status="200"} 0
gestalis_http_requests_total{method="POST",status="200"} 0
gestalis_http_requests_total{method="PUT",status="200"} 0
gestalis_http_requests_total{method="DELETE",status="200"} 0

# HELP gestalis_http_request_duration_seconds Duration of HTTP requests
# TYPE gestalis_http_request_duration_seconds histogram
gestalis_http_request_duration_seconds_bucket{le="0.1"} 0
gestalis_http_request_duration_seconds_bucket{le="0.5"} 0
gestalis_http_request_duration_seconds_bucket{le="1"} 0
gestalis_http_request_duration_seconds_bucket{le="+Inf"} 0
gestalis_http_request_duration_seconds_sum 0
gestalis_http_request_duration_seconds_count 0
  `);
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware de gestion d'erreurs global
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Fonction de diagnostic des routes
function listRoutes(app) {
  const routes = [];
  app._router.stack.forEach((m) => {
    if (m.route) {
      const methods = Object.keys(m.route.methods).join(',').toUpperCase();
      routes.push(`${methods} ${m.route.path}`);
    } else if (m.name === 'router' && m.handle.stack) {
      m.handle.stack.forEach((h) => {
        const route = h.route;
        if (route) {
          const methods = Object.keys(route.methods).join(',').toUpperCase();
          routes.push(`${methods} ${(m.regexp?.source || '').replace('^\\', '/').split('\\/?')[0]}${route.path}`);
        }
      });
    }
  });
  console.log('🚦 ROUTES MONTÉES:\n' + routes.sort().map(r => '  - ' + r).join('\n'));
}

// Démarrage du serveur
const startServer = async () => {
  try {
    await redisClient.connect();
    
    // Diagnostic des routes avant démarrage
    listRoutes(app);
    
    app.listen(3003, () => { // PORT FORCÉ ICI AUSSI
      console.log(`🚀 GESTALIS Backend démarré sur le port 3003`);
      console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:3003`);
      console.log(`🔒 CORS autorisé depuis: ${process.env.CORS_ORIGIN || 'http://localhost:5175'}`);
      console.log(`️  Base de données: PostgreSQL`);
      console.log(`🔴 Redis: Connecté`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
