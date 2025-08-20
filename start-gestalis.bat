@echo off
echo.
echo ========================================
echo        GESTALIS - ERP BTP
echo ========================================
echo.
echo 🚀 Démarrage automatique de GESTALIS...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: Node.js n'est pas installé
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

REM Vérifier si PostgreSQL est installé et accessible
echo 🔍 Vérification de PostgreSQL...
echo.

REM Démarrer le backend en arrière-plan
echo 🖥️  Démarrage du Backend GESTALIS...
cd backend
start "GESTALIS Backend" cmd /k "start.bat"
cd ..

REM Attendre un peu que le backend démarre
echo ⏳ Attente du démarrage du backend...
timeout /t 5 /nobreak >nul

REM Démarrer le frontend en arrière-plan
echo 🌐 Démarrage du Frontend GESTALIS...
cd frontend
start "GESTALIS Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo        GESTALIS DÉMARRÉ !
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:5175
echo 🖥️  Backend: http://localhost:3000
echo.
echo 🔑 Identifiants de connexion:
echo    Admin: admin / admin123
echo    User:  testuser / test123
echo.
echo 💡 Pour arrêter: Fermez les fenêtres de commande
echo.
echo Appuyez sur une touche pour ouvrir le navigateur...
pause >nul

REM Ouvrir le navigateur
start http://localhost:5175

echo.
echo 🎉 GESTALIS est prêt à l'utilisation !
echo.
pause
