#!/bin/bash
echo "🚀 Début du build Render pour GESTALIS..."

# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
echo "📦 Installation des dépendances frontend..."
npm install

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

echo "✅ Build terminé avec succès !"
