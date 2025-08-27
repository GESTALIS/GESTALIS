# 🏗️ GESTALIS - ERP BTP

ERP robuste et professionnel pour la gestion de chantiers BTP avec architecture moderne et sécurisée.

## 🎯 **Fonctionnalités**

- **🔐 Authentification sécurisée** : Cookies HttpOnly + Refresh rotatif
- **👥 RBAC/ABAC** : Gestion fine des permissions par ressource
- **📊 Import bancaire** : Preview → Intégration avec idempotency
- **🔗 Lettrage ACID** : Gestion des règlements et factures
- **📈 Observabilité** : Métriques Prometheus, logs structurés
- **🧪 Tests complets** : Backend + Frontend + E2E

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   React + Vite  │◄──►│   Node.js +     │◄──►│   données       │
│   Tailwind CSS  │    │   Express       │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   Redis         │              │
         │              │   Cache +       │              │
         │              │   Sessions      │              │
         │              └─────────────────┘              │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Nginx         │
                    │   Proxy         │
                    │   Reverse       │
                    └─────────────────┘
```

## 🚀 **Installation et démarrage**

### **Prérequis**

- Node.js 18+ et npm
- Docker et Docker Compose
- PostgreSQL 14 (via Docker)

### **1. Cloner le projet**

```bash
git clone <repository-url>
cd Gestalis
```

### **2. Configuration des variables d'environnement**

**Backend** (copier `backend/env.postgres` vers `backend/.env`) :
```bash
# Configuration de la base de données PostgreSQL
DATABASE_URL=postgresql://gestalis:gestalis@localhost:5432/gestalis?schema=public

# Configuration Redis
REDIS_URL=redis://localhost:6379

# Configuration JWT
JWT_SECRET=gestalis_super_secret_key_change_in_production_2024
JWT_ACCESS_TTL=10m
JWT_REFRESH_TTL=7d

# Configuration des cookies
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAME_SITE=strict

# Configuration du serveur
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5175
```

**Frontend** (copier `frontend/env.api` vers `frontend/.env`) :
```bash
# Configuration de l'API
VITE_API_BASE=/api

# Configuration de l'environnement
VITE_NODE_ENV=development
```

### **3. Démarrage de l'infrastructure**

```bash
# Démarrer PostgreSQL et Redis
docker compose up -d db redis

# Attendre que les services soient prêts
docker compose ps
```

### **4. Configuration de la base de données**

```bash
cd backend

# Installer les dépendances
npm install

# Générer le client Prisma
npm run db:generate

# Créer et appliquer les migrations
npm run db:migrate

# Peupler la base avec des données de test
npm run db:seed
```

### **5. Démarrage des services**

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm install
npm run dev
```

### **6. Accès à l'application**

- **Frontend** : http://localhost:5175
- **Backend API** : http://localhost:3000
- **Health Check** : http://localhost:3000/health
- **Métriques** : http://localhost:3000/metrics
- **Version** : http://localhost:3000/version

## 🔑 **Identifiants de connexion**

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@gestalis.com | admin123 |
| **Manager** | manager@gestalis.com | test123 |
| **User** | user@gestalis.com | test123 |
| **Viewer** | viewer@gestalis.com | test123 |

## 📚 **API Endpoints**

### **Authentification**
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Renouvellement du token
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Informations utilisateur

### **Chantiers**
- `GET /api/chantiers` - Liste des chantiers
- `POST /api/chantiers` - Créer un chantier
- `GET /api/chantiers/:id` - Détails d'un chantier
- `PUT /api/chantiers/:id` - Modifier un chantier
- `DELETE /api/chantiers/:id` - Supprimer un chantier

### **Import bancaire**
- `POST /api/imports-banque/previsualiser` - Preview d'un fichier
- `POST /api/imports-banque/integrer/:id` - Intégration (avec idempotency)

### **Lettrage**
- `POST /api/lettrages` - Créer un lettrage
- `GET /api/lettrages` - Liste des lettrages
- `DELETE /api/lettrages/:id` - Supprimer un lettrage

### **Observabilité**
- `GET /health` - État des services
- `GET /version` - Version de l'application
- `GET /metrics` - Métriques Prometheus

## 🛡️ **Sécurité**

- **Cookies HttpOnly** : Protection contre XSS
- **Refresh rotatif** : Sécurité des sessions
- **RBAC/ABAC** : Contrôle d'accès granulaire
- **Rate limiting** : Protection contre les attaques
- **Validation des entrées** : Protection contre l'injection
- **Audit logs** : Traçabilité complète

## 🧪 **Tests**

```bash
# Tests backend
cd backend
npm test

# Tests frontend
cd frontend
npm test

# Tests E2E (Playwright)
npm run test:e2e
```

## 📊 **Monitoring**

- **Logs structurés** : Winston avec JSON
- **Métriques** : Prometheus format
- **Health checks** : Liveness et readiness
- **Audit trail** : Traçabilité des actions

## 🔧 **Développement**

### **Scripts utiles**

```bash
# Backend
npm run db:studio    # Interface Prisma Studio
npm run db:reset     # Reset complet de la base
npm run db:seed      # Repeupler la base

# Frontend
npm run build        # Build de production
npm run preview      # Preview du build
```

### **Structure des dossiers**

```
Gestalis/
├── backend/                 # API Node.js + Express
│   ├── prisma/             # Schéma et migrations
│   ├── routes/             # Routes API
│   ├── middleware/         # Middleware d'auth
│   └── scripts/            # Scripts utilitaires
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/          # Pages de l'app
│   │   ├── stores/         # État global (Zustand)
│   │   └── utils/          # Utilitaires
│   └── public/             # Assets statiques
├── infra/                  # Configuration Docker
│   ├── docker-compose.yml  # Services
│   └── nginx.conf         # Configuration Nginx
└── README.md              # Ce fichier
```

## 🚨 **Dépannage**

### **Problèmes courants**

1. **Port déjà utilisé** : Vérifier `netstat -an | findstr :3000`
2. **Base de données** : Vérifier `docker compose ps`
3. **Permissions** : Vérifier les droits sur les dossiers
4. **Variables d'environnement** : Vérifier les fichiers `.env`

### **Logs**

```bash
# Backend
cd backend && npm run dev

# Docker
docker compose logs -f

# Base de données
docker compose logs db
```

## 📈 **Performance**

- **Compression** : Gzip des réponses
- **Cache Redis** : Sessions et données fréquentes
- **Pagination** : Limitation des résultats
- **Indexation** : Optimisation des requêtes

## 🔄 **Migrations**

```bash
# Créer une migration
npm run db:migrate

# Appliquer les migrations
npm run db:migrate

# Reset complet
npm run db:reset
```

## 📝 **Contribution**

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 **Licence**

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🆘 **Support**

- **Documentation** : Ce README
- **Issues** : GitHub Issues
- **Discussions** : GitHub Discussions

---

**GESTALIS** - ERP BTP professionnel et robuste 🚀✨
