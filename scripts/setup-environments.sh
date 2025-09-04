#!/bin/bash

# =====================================================
# SCRIPT DE CONFIGURATION AUTOMATIQUE DES ENVIRONNEMENTS
# Configure automatiquement dev et prod
# =====================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 CONFIGURATION AUTOMATIQUE DES ENVIRONNEMENTS${NC}"
echo "======================================================"

# =====================================================
# 1. CONFIGURATION ENVIRONNEMENT DE DÉVELOPPEMENT
# =====================================================

echo -e "${YELLOW}📋 Configuration environnement de développement...${NC}"

# Créer le fichier .env.development
ENV_DEV_FILE=".env.development"
echo "📝 Création de $ENV_DEV_FILE..."

cat > "$ENV_DEV_FILE" << EOF
# =====================================================
# ENVIRONNEMENT DE DÉVELOPPEMENT GESTALIS
# =====================================================

# Configuration Supabase Dev
VITE_SUPABASE_URL=https://[dev-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[dev-anon-key]

# Configuration de l'environnement
VITE_ENVIRONMENT=development
VITE_APP_NAME=Gestalis Dev
VITE_DEBUG_MODE=true

# Configuration des API
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3

# Configuration des logs
VITE_LOG_LEVEL=debug
VITE_ENABLE_CONSOLE_LOGS=true
EOF

echo -e "${GREEN}✅ Fichier $ENV_DEV_FILE créé${NC}"

# =====================================================
# 2. CONFIGURATION ENVIRONNEMENT DE PRODUCTION
# =====================================================

echo -e "${YELLOW}📋 Configuration environnement de production...${NC}"

# Créer le fichier .env.production
ENV_PROD_FILE=".env.production"
echo "📝 Création de $ENV_PROD_FILE..."

cat > "$ENV_PROD_FILE" << EOF
# =====================================================
# ENVIRONNEMENT DE PRODUCTION GESTALIS
# =====================================================

# Configuration Supabase Prod
VITE_SUPABASE_URL=https://esczdkgknrozwovlfbki.supabase.co
VITE_SUPABASE_ANON_KEY=[prod-anon-key]

# Configuration de l'environnement
VITE_ENVIRONMENT=production
VITE_APP_NAME=Gestalis Production
VITE_DEBUG_MODE=false

# Configuration des API
VITE_API_TIMEOUT=15000
VITE_API_RETRY_ATTEMPTS=5

# Configuration des logs
VITE_LOG_LEVEL=error
VITE_ENABLE_CONSOLE_LOGS=false

# Configuration de sécurité
VITE_ENABLE_HTTPS=true
VITE_ENABLE_CSP=true
EOF

echo -e "${GREEN}✅ Fichier $ENV_PROD_FILE créé${NC}"

# =====================================================
# 3. CONFIGURATION VERCEL
# =====================================================

echo -e "${YELLOW}📋 Configuration Vercel...${NC}"

# Créer le fichier vercel.json optimisé
VERCEL_FILE="vercel.json"
echo "📝 Mise à jour de $VERCEL_FILE..."

cat > "$VERCEL_FILE" << EOF
{
  "name": "gestalis-btp-2024-frontend",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "https://esczdkgknrozwovlfbki.supabase.co",
    "VITE_ENVIRONMENT": "production"
  }
}
EOF

echo -e "${GREEN}✅ Fichier $VERCEL_FILE mis à jour${NC}"

# =====================================================
# 4. CONFIGURATION PACKAGE.JSON
# =====================================================

echo -e "${YELLOW}📋 Configuration package.json...${NC}"

# Vérifier si package.json existe
if [[ -f "package.json" ]]; then
    echo "📝 Mise à jour des scripts package.json..."
    
    # Ajouter les scripts de configuration des environnements
    npm pkg set scripts.dev:dev="vite --mode development"
    npm pkg set scripts.dev:prod="vite --mode production"
    npm pkg set scripts.build:dev="vite build --mode development"
    npm pkg set scripts.build:prod="vite build --mode production"
    npm pkg set scripts.preview:dev="vite preview --mode development"
    npm pkg set scripts.preview:prod="vite preview --mode production"
    
    echo -e "${GREEN}✅ Scripts package.json mis à jour${NC}"
else
    echo -e "${RED}❌ package.json non trouvé${NC}"
fi

# =====================================================
# 5. CONFIGURATION VITE
# =====================================================

echo -e "${YELLOW}📋 Configuration Vite...${NC}"

# Créer le fichier vite.config.js optimisé
VITE_FILE="vite.config.js"
echo "📝 Mise à jour de $VITE_FILE..."

cat > "$VITE_FILE" << EOF
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // Configuration des alias
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@services': path.resolve(__dirname, './src/services'),
        '@utils': path.resolve(__dirname, './src/utils')
      }
    },
    
    // Configuration du serveur de développement
    server: {
      port: 5175,
      host: true,
      open: true
    },
    
    // Configuration de la build
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['lucide-react']
          }
        }
      }
    },
    
    // Configuration des variables d'environnement
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    },
    
    // Configuration des optimisations
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  }
})
EOF

echo -e "${GREEN}✅ Fichier $VITE_FILE mis à jour${NC}"

# =====================================================
# 6. CONFIGURATION GIT
# =====================================================

echo -e "${YELLOW}📋 Configuration Git...${NC}"

# Créer le fichier .gitignore optimisé
GITIGNORE_FILE=".gitignore"
echo "📝 Mise à jour de $GITIGNORE_FILE..."

cat >> "$GITIGNORE_FILE" << EOF

# =====================================================
# ENVIRONNEMENTS ET CONFIGURATION
# =====================================================

# Fichiers d'environnement
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Fichiers de configuration sensibles
.env.production
.env.development

# Logs et rapports
*.log
logs/
reports/
diagnostic-*.log
migration-*.log
backup-*.sql

# Fichiers temporaires
*.tmp
*.temp
temp/
tmp/

# Fichiers de sauvegarde
*.backup
*.bak
backups/
EOF

echo -e "${GREEN}✅ Fichier $GITIGNORE_FILE mis à jour${NC}"

# =====================================================
# 7. RAPPORT DE CONFIGURATION
# =====================================================

echo -e "${BLUE}📊 RAPPORT DE CONFIGURATION${NC}"
echo "======================================================"

echo -e "✅ Environnement dev: ${GREEN}Configuré${NC}"
echo -e "✅ Environnement prod: ${GREEN}Configuré${NC}"
echo -e "✅ Vercel: ${GREEN}Configuré${NC}"
echo -e "✅ Package.json: ${GREEN}Mis à jour${NC}"
echo -e "✅ Vite: ${GREEN}Configuré${NC}"
echo -e "✅ Git: ${GREEN}Configuré${NC}"

echo ""
echo -e "${GREEN}🎉 CONFIGURATION DES ENVIRONNEMENTS TERMINÉE !${NC}"

# =====================================================
# 8. INSTRUCTIONS POST-CONFIGURATION
# =====================================================

echo -e "${YELLOW}📋 PROCHAINES ÉTAPES :${NC}"
echo "1. Configurer les clés Supabase dans les fichiers .env"
echo "2. Tester l'environnement de développement"
echo "3. Valider l'environnement de production"
echo "4. Exécuter les tests automatisés"
echo "5. Déployer en production"

echo ""
echo -e "${BLUE}💡 COMMANDES UTILES :${NC}"
echo "npm run dev:dev      # Démarrer en mode développement"
echo "npm run dev:prod     # Démarrer en mode production"
echo "npm run build:prod   # Build pour la production"
echo "./scripts/diagnostic-automatique.sh  # Diagnostic automatique"

echo ""
echo -e "${GREEN}🎯 ENVIRONNEMENTS PRÊTS POUR LE DÉVELOPPEMENT !${NC}"
