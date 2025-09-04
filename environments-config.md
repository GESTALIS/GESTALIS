# =====================================================
# CONFIGURATION DES ENVIRONNEMENTS GESTALIS
# Guide complet pour séparer dev et production
# =====================================================

## 🎯 OBJECTIF

Séparer complètement les environnements de développement et de production pour éviter les problèmes de permissions et de configuration.

## 🏗️ ARCHITECTURE RECOMMANDÉE

### 1️⃣ ENVIRONNEMENT DE DÉVELOPPEMENT
```
Frontend: http://localhost:5175
Base: Supabase DEV (nouveau projet)
URL: https://[dev-project-id].supabase.co
```

### 2️⃣ ENVIRONNEMENT DE PRODUCTION
```
Frontend: https://gestalis-btp-2024-frontend.vercel.app
Base: Supabase PROD (projet actuel)
URL: https://esczdkgknrozwovlfbki.supabase.co
```

## 🔧 CONFIGURATION AUTOMATIQUE

### ÉTAPE 1: Créer l'environnement de développement

```bash
# 1. Créer un nouveau projet Supabase pour le dev
# Allez sur https://supabase.com
# Créez un nouveau projet: "gestalis-dev"

# 2. Récupérer les clés de dev
DEV_SUPABASE_URL="https://[dev-project-id].supabase.co"
DEV_SUPABASE_ANON_KEY="[dev-anon-key]"

# 3. Configurer les variables d'environnement locales
```

### ÉTAPE 2: Configuration des variables d'environnement

#### Fichier `.env.development`
```env
# Environnement de développement
VITE_SUPABASE_URL=https://[dev-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[dev-anon-key]
VITE_ENVIRONMENT=development
```

#### Fichier `.env.production`
```env
# Environnement de production
VITE_SUPABASE_URL=https://esczdkgknrozwovlfbki.supabase.co
VITE_SUPABASE_ANON_KEY=[prod-anon-key]
VITE_ENVIRONMENT=production
```

### ÉTAPE 3: Script de migration automatique

```bash
# Script pour migrer la structure de dev vers prod
./scripts/migrate-dev-to-prod.sh
```

## 🚀 AUTOMATISATION COMPLÈTE

### Script de configuration automatique

```bash
#!/bin/bash
# configure-environments.sh

echo "🚀 Configuration automatique des environnements..."

# 1. Configuration dev
echo "📋 Configuration environnement de développement..."
./scripts/setup-dev-environment.sh

# 2. Configuration prod
echo "📋 Configuration environnement de production..."
./scripts/setup-prod-environment.sh

# 3. Tests automatiques
echo "🧪 Tests automatiques..."
./scripts/run-tests.sh

echo "✅ Configuration terminée !"
```

## 📋 CHECKLIST DE CONFIGURATION

### ✅ Environnement de développement
- [ ] Nouveau projet Supabase créé
- [ ] Variables d'environnement configurées
- [ ] Script de configuration exécuté
- [ ] Tests de base validés

### ✅ Environnement de production
- [ ] Variables d'environnement Vercel configurées
- [ ] Permissions Supabase vérifiées
- [ ] Tests de production validés
- [ ] Monitoring activé

## 🔍 VÉRIFICATIONS AUTOMATIQUES

### Script de vérification des environnements

```bash
#!/bin/bash
# verify-environments.sh

echo "🔍 Vérification des environnements..."

# Vérifier dev
echo "📋 Vérification environnement de développement..."
curl -s "$DEV_SUPABASE_URL/rest/v1/fournisseurs" \
  -H "apikey: $DEV_SUPABASE_ANON_KEY" | jq 'length'

# Vérifier prod
echo "📋 Vérification environnement de production..."
curl -s "$PROD_SUPABASE_URL/rest/v1/fournisseurs" \
  -H "apikey: $PROD_SUPABASE_ANON_KEY" | jq 'length'

echo "✅ Vérifications terminées !"
```

## 🚨 GESTION DES ERREURS

### Problèmes courants et solutions

#### 1️⃣ Erreur de permissions
```bash
# Solution automatique
./scripts/fix-permissions.sh
```

#### 2️⃣ Erreur de connexion
```bash
# Vérification automatique
./scripts/check-connection.sh
```

#### 3️⃣ Erreur de migration
```bash
# Rollback automatique
./scripts/rollback-migration.sh
```

## 📊 MONITORING ET ALERTES

### Configuration des alertes

```yaml
# .github/workflows/monitor-environments.yml
name: Monitor Environments

on:
  schedule:
    - cron: '*/30 * * * *'  # Toutes les 30 minutes

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Check Dev Environment
        run: ./scripts/check-dev.sh
      
      - name: Check Prod Environment
        run: ./scripts/check-prod.sh
      
      - name: Send Alerts
        if: failure()
        run: ./scripts/send-alert.sh
```

## 🎯 AVANTAGES DE CETTE APPROCHE

### ✅ Séparation claire
- **Développement** → Tests sans risque
- **Production** → Stabilité garantie

### ✅ Tests automatisés
- **Vérifications** avant déploiement
- **Validation** automatique des permissions

### ✅ Gestion des erreurs
- **Rollback** automatique en cas de problème
- **Alertes** immédiates

### ✅ Maintenance simplifiée
- **Scripts** de configuration automatisés
- **Documentation** complète

## 🚀 PROCHAINES ÉTAPES

1. **Créer** l'environnement de développement
2. **Configurer** les variables d'environnement
3. **Automatiser** les tests et vérifications
4. **Mettre en place** le monitoring
5. **Documenter** les procédures

## 📞 SUPPORT

En cas de problème :
1. **Vérifiez** les logs automatiques
2. **Exécutez** les scripts de diagnostic
3. **Consultez** la documentation
4. **Contactez** l'équipe technique
