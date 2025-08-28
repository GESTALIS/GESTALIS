#!/bin/bash

# =====================================================
# SCRIPT DE DÉPLOIEMENT AUTOMATIQUE GESTALIS
# Déploiement complet sur Supabase + Vercel
# =====================================================

set -e  # Arrêter en cas d'erreur

echo "🚀 DÉPLOIEMENT AUTOMATIQUE GESTALIS EN COURS..."
echo "================================================"

# =====================================================
# VÉRIFICATIONS PRÉALABLES
# =====================================================

echo "🔍 Vérifications préalables..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installez Node.js 18+ et réessayez."
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Installez npm et réessayez."
    exit 1
fi

# Vérifier que Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installez Git et réessayez."
    exit 1
fi

echo "✅ Toutes les vérifications sont passées !"

# =====================================================
# CONFIGURATION SUPABASE
# =====================================================

echo ""
echo "☁️ CONFIGURATION SUPABASE..."
echo "============================="

# Demander les informations Supabase
read -p "🌐 URL Supabase (ex: https://abc123.supabase.co): " SUPABASE_URL
read -p "🔑 Clé anonyme Supabase: " SUPABASE_ANON_KEY

# Vérifier que les informations sont fournies
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Les informations Supabase sont obligatoires !"
    exit 1
fi

echo "✅ Configuration Supabase saisie !"

# =====================================================
# MISE À JOUR DES VARIABLES D'ENVIRONNEMENT
# =====================================================

echo ""
echo "🔧 Mise à jour des variables d'environnement..."

# Mettre à jour le fichier env.production
sed -i "s|VOTRE_URL_SUPABASE_ICI|$SUPABASE_URL|g" frontend/env.production
sed -i "s|VOTRE_CLE_ANONYME_SUPABASE_ICI|$SUPABASE_ANON_KEY|g" frontend/env.production

echo "✅ Variables d'environnement mises à jour !"

# =====================================================
# INSTALLATION DES DÉPENDANCES
# =====================================================

echo ""
echo "📦 Installation des dépendances..."

cd frontend
npm install
npm install @supabase/supabase-js

echo "✅ Dépendances installées !"

# =====================================================
# BUILD DE L'APPLICATION
# =====================================================

echo ""
echo "🏗️ Build de l'application..."

npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
else
    echo "❌ Erreur lors du build !"
    exit 1
fi

# =====================================================
# DÉPLOIEMENT SUPABASE
# =====================================================

echo ""
echo "🗄️ DÉPLOIEMENT SUPABASE..."
echo "============================"

echo "📋 Création des tables dans Supabase..."

# Exécuter le schéma SQL sur Supabase
echo "⚠️  IMPORTANT : Vous devez maintenant :"
echo "1. Aller sur https://supabase.com"
echo "2. Créer un nouveau projet"
echo "3. Copier l'URL et la clé anonyme"
echo "4. Aller dans SQL Editor"
echo "5. Copier-coller le contenu de supabase-schema.sql"
echo "6. Exécuter le script"

read -p "✅ Appuyez sur Entrée quand c'est fait..."

# =====================================================
# DÉPLOIEMENT VERCEL
# =====================================================

echo ""
echo "🌐 DÉPLOIEMENT VERCEL..."
echo "========================"

echo "⚠️  IMPORTANT : Vous devez maintenant :"
echo "1. Aller sur https://vercel.com"
echo "2. Créer un compte ou vous connecter"
echo "3. Installer Vercel CLI : npm i -g vercel"
echo "4. Exécuter : vercel --prod"

read -p "✅ Appuyez sur Entrée quand c'est fait..."

# =====================================================
# MIGRATION DES DONNÉES
# =====================================================

echo ""
echo "🔄 MIGRATION DES DONNÉES..."
echo "============================"

echo "⚠️  IMPORTANT : Pour migrer vos données :"
echo "1. Ouvrez la console de votre navigateur"
echo "2. Exécutez : migrerTout()"
echo "3. Vérifiez que toutes les données sont migrées"

# =====================================================
# FINALISATION
# =====================================================

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ !"
echo "========================"
echo ""
echo "✅ Votre application Gestalis est maintenant en ligne !"
echo ""
echo "📋 RÉCAPITULATIF :"
echo "- Base de données : Supabase configurée"
echo "- Frontend : Déployé sur Vercel"
echo "- Migration : Prête à être exécutée"
echo ""
echo "🌐 PROCHAINES ÉTAPES :"
echo "1. Tester l'application en ligne"
echo "2. Migrer vos données existantes"
echo "3. Former votre secrétaire"
echo "4. Commencer la saisie de données réelles"
echo ""
echo "🚀 Bonne utilisation de Gestalis !"

cd ..
