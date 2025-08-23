@echo off
chcp 65001 >nul
title GESTALIS - Script de Sauvegarde

echo.
echo ========================================
echo    🚀 GESTALIS - SAUVEGARDE AUTO
echo ========================================
echo.

echo 📋 Types de sauvegarde disponibles:
echo.
echo 1. 📦 Sauvegarde COMPLÈTE (recommandée)
echo 2. 🔧 Sauvegarde GIT uniquement
echo 3. 🗄️ Sauvegarde BASE DE DONNÉES
echo 4. ⚙️ Sauvegarde CONFIGURATION
echo 5. 🚪 Quitter
echo.

set /p choice="Choisissez le type de sauvegarde (1-5): "

if "%choice%"=="1" goto complete
if "%choice%"=="2" goto git
if "%choice%"=="3" goto database
if "%choice%"=="4" goto config
if "%choice%"=="5" goto exit
goto invalid

:complete
echo.
echo 📦 Lancement de la sauvegarde COMPLÈTE...
powershell -ExecutionPolicy Bypass -File "scripts\backup-gestalis.ps1" "complete"
goto end

:git
echo.
echo 🔧 Lancement de la sauvegarde GIT...
powershell -ExecutionPolicy Bypass -File "scripts\backup-gestalis.ps1" "git"
goto end

:database
echo.
echo 🗄️ Lancement de la sauvegarde BASE DE DONNÉES...
powershell -ExecutionPolicy Bypass -File "scripts\backup-gestalis.ps1" "database"
goto end

:config
echo.
echo ⚙️ Lancement de la sauvegarde CONFIGURATION...
powershell -ExecutionPolicy Bypass -File "scripts\backup-gestalis.ps1" "config"
goto end

:invalid
echo.
echo ❌ Choix invalide! Veuillez choisir 1, 2, 3, 4 ou 5.
pause
goto menu

:end
echo.
echo ✅ Sauvegarde terminée!
echo.
echo 📁 Dossier de sauvegarde: %USERPROFILE%\Desktop\Gestalis_Backups
echo.
pause

:exit
echo.
echo 👋 Au revoir!
timeout /t 2 >nul
exit
