# 🏗️ GESTALIS Backend

Backend robuste et professionnel pour l'ERP GESTALIS BTP.

## 🚀 **Fonctionnalités**

### **🔐 Authentification & Sécurité**
- **JWT** avec refresh automatique
- **Hachage** des mots de passe (bcrypt)
- **Gestion des rôles** (admin, manager, user, viewer)
- **Rate limiting** et protection CORS
- **Validation** des données entrantes

### **🗄️ Base de Données**
- **PostgreSQL** avec pool de connexions
- **Schéma complet** : utilisateurs, chantiers, clients, fournisseurs
- **Relations** et contraintes d'intégrité
- **Index** optimisés pour les performances
- **Triggers** automatiques

### **📊 API REST Complète**
- **CRUD** complet pour tous les modules
- **Pagination** et filtres avancés
- **Recherche** textuelle intelligente
- **Statistiques** en temps réel
- **Gestion d'erreurs** standardisée

### **🛡️ Sécurité Production**
- **Helmet** pour la sécurité HTTP
- **Validation** des entrées
- **Logging** complet avec Winston
- **Compression** et optimisation
- **Middleware** de sécurité

## 📋 **Prérequis**

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **npm** ou **yarn**

## 🛠️ **Installation**

### **1. Cloner le projet**
```bash
git clone <repository-url>
cd gestalis/backend
```

### **2. Installer les dépendances**
```bash
npm install
```

### **3. Configuration de la base de données**

#### **Créer la base PostgreSQL :**
```sql
CREATE DATABASE gestalis_db;
CREATE USER gestalis_user WITH PASSWORD 'gestalis_password';
GRANT ALL PRIVILEGES ON DATABASE gestalis_db TO gestalis_user;
```

#### **Initialiser le schéma :**
```bash
# Se connecter à PostgreSQL
psql -U gestalis_user -d gestalis_db

# Exécuter le script d'initialisation
\i scripts/init-db.sql
```

### **4. Configuration des variables d'environnement**

#### **Créer le fichier `.env` :**
```bash
cp env.example .env
```

#### **Modifier `.env` avec vos valeurs :**
```env
NODE_ENV=development
PORT=3000

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestalis_db
DB_USER=gestalis_user
DB_PASSWORD=gestalis_password

# JWT
JWT_SECRET=votre-secret-jwt-super-securise
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5175
```

## 🚀 **Démarrage**

### **Mode développement :**
```bash
npm run dev
```

### **Mode production :**
```bash
npm start
```

### **Tests :**
```bash
npm test
```

## 🌐 **Endpoints API**

### **🔐 Authentification**
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérification token
- `POST /api/auth/refresh` - Rafraîchissement token
- `POST /api/auth/logout` - Déconnexion

### **👥 Utilisateurs**
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails utilisateur
- `PUT /api/users/:id` - Mise à jour utilisateur
- `DELETE /api/users/:id` - Suppression utilisateur

### **🏗️ Chantiers**
- `GET /api/chantiers` - Liste des chantiers
- `GET /api/chantiers/:id` - Détails chantier
- `POST /api/chantiers` - Création chantier
- `PUT /api/chantiers/:id` - Mise à jour chantier
- `DELETE /api/chantiers/:id` - Suppression chantier
- `GET /api/chantiers/:id/statistiques` - Statistiques

### **🛒 Achats**
- `GET /api/achats/demandes-prix` - Demandes de prix
- `GET /api/achats/commandes` - Commandes fournisseurs
- `GET /api/achats/factures` - Factures fournisseurs

### **👥 Clients & Fournisseurs**
- `GET /api/clients` - Liste des clients
- `GET /api/fournisseurs` - Liste des fournisseurs

## 🔑 **Utilisateurs par défaut**

### **Administrateur :**
- **Username :** `admin`
- **Password :** `admin123`
- **Rôle :** `admin`

### **Utilisateur test :**
- **Username :** `testuser`
- **Password :** `test123`
- **Rôle :** `user`

## 📊 **Structure de la Base de Données**

```
users (utilisateurs)
├── clients (clients)
├── fournisseurs (fournisseurs)
├── chantiers (chantiers)
│   ├── demandes_prix (demandes de prix)
│   ├── commandes_fournisseurs (commandes)
│   └── affectations_equipes (affectations)
├── devis_clients (devis)
├── factures_clients (factures clients)
├── factures_fournisseurs (factures fournisseurs)
├── reglements (règlements)
└── equipes (équipes)
```

## 🛡️ **Sécurité**

- **JWT** avec expiration configurable
- **Hachage** des mots de passe (bcrypt)
- **Validation** des données entrantes
- **Rate limiting** par IP
- **CORS** configuré
- **Helmet** pour la sécurité HTTP
- **Logging** des actions sensibles

## 📈 **Performance**

- **Pool de connexions** PostgreSQL
- **Index** optimisés sur les colonnes de recherche
- **Pagination** pour les grandes listes
- **Compression** des réponses
- **Cache** des requêtes fréquentes

## 🧪 **Tests**

```bash
# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 🚀 **Déploiement**

### **Docker (recommandé) :**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### **Variables d'environnement production :**
```env
NODE_ENV=production
JWT_SECRET=secret-super-securise-production
DB_HOST=your-db-host
DB_PASSWORD=your-secure-password
```

## 📝 **Logs**

Les logs sont gérés par Winston et stockés dans :
- **Console** en développement
- **Fichiers** en production (`logs/gestalis.log`)
- **Niveaux** : error, warn, info, debug

## 🔧 **Maintenance**

### **Sauvegarde de la base :**
```bash
pg_dump -U gestalis_user -d gestalis_db > backup_$(date +%Y%m%d).sql
```

### **Restoration :**
```bash
psql -U gestalis_user -d gestalis_db < backup_YYYYMMDD.sql
```

## 📞 **Support**

Pour toute question ou problème :
- **Issues** GitHub
- **Documentation** API : `/api/docs` (à implémenter)
- **Logs** : `logs/gestalis.log`

---

**GESTALIS Backend** - Une architecture robuste et professionnelle pour votre ERP BTP ! 🏗️✨
