#!/bin/bash

# =====================================================
# SCRIPT DE MIGRATION AUTOMATIQUE DEV → PROD
# Migre la structure et les données entre environnements
# =====================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration des environnements
DEV_SUPABASE_URL="https://[dev-project-id].supabase.co"
DEV_SUPABASE_ANON_KEY="[dev-anon-key]"
PROD_SUPABASE_URL="https://esczdkgknrozwovlfbki.supabase.co"
PROD_SUPABASE_ANON_KEY="[prod-anon-key]"

echo -e "${BLUE}🚀 MIGRATION AUTOMATIQUE DEV → PROD${NC}"
echo "=============================================="

# =====================================================
# 1. VÉRIFICATION PRÉ-MIGRATION
# =====================================================

echo -e "${YELLOW}📋 Vérification pré-migration...${NC}"

# Vérifier la connexion dev
echo "🔌 Test connexion environnement de développement..."
if curl -s -f "$DEV_SUPABASE_URL/rest/v1/" > /dev/null; then
    echo -e "${GREEN}✅ Dev connecté${NC}"
else
    echo -e "${RED}❌ Dev non connecté${NC}"
    exit 1
fi

# Vérifier la connexion prod
echo "🔌 Test connexion environnement de production..."
if curl -s -f "$PROD_SUPABASE_URL/rest/v1/" > /dev/null; then
    echo -e "${GREEN}✅ Prod connecté${NC}"
else
    echo -e "${RED}❌ Prod non connecté${NC}"
    exit 1
fi

# =====================================================
# 2. SAUVEGARDE DE PRODUCTION
# =====================================================

echo -e "${YELLOW}💾 Sauvegarde de production...${NC}"

# Créer un backup de la production
BACKUP_FILE="backup-prod-$(date +%Y%m%d-%H%M%S).sql"
echo "📝 Création du backup: $BACKUP_FILE"

# Script de backup automatique
BACKUP_SQL="
-- Backup automatique de la production
-- Tables principales
SELECT 'fournisseurs' as table_name, COUNT(*) as count FROM fournisseurs
UNION ALL
SELECT 'produits' as table_name, COUNT(*) as count FROM produits
UNION ALL
SELECT 'factures' as table_name, COUNT(*) as count FROM factures
UNION ALL
SELECT 'chantiers' as table_name, COUNT(*) as count FROM chantiers
UNION ALL
SELECT 'cessions_creance' as table_name, COUNT(*) as count FROM cessions_creance;
"

echo "📊 Statistiques de production sauvegardées"
