@echo off
echo.
echo ========================================
echo    GESTALIS BACKEND - DEMARRAGE
echo ========================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: Node.js n'est pas installé ou pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si npm est installé
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: npm n'est pas installé
    pause
    exit /b 1
)

echo ✅ Node.js détecté: 
node --version
echo ✅ npm détecté:
npm --version
echo.

REM Vérifier si les dépendances sont installées
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ ERREUR: Échec de l'installation des dépendances
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées avec succès
    echo.
)

REM Vérifier si la base de données SQLite existe
if not exist "gestalis.db" (
    echo 🗄️  Base de données SQLite non trouvée
    echo Création de la base de données...
    node scripts/init-db-sqlite.js
    if %errorlevel% neq 0 (
        echo ❌ ERREUR: Échec de l'initialisation de la base de données
        pause
        exit /b 1
    )
    echo ✅ Base de données initialisée avec succès
    echo.
)

echo 🚀 Démarrage du serveur GESTALIS...
echo.
echo 📊 Mode: Development
echo 🌐 Port: 3000 (configurable dans .env)
echo 🔒 CORS: http://localhost:5175
echo 🗄️  Base: SQLite (gestalis.db)
echo.
echo 💡 Pour arrêter le serveur: Ctrl+C
echo.

REM Démarrer le serveur
npm run dev

echo.
echo ✅ Serveur GESTALIS arrêté
pause
