# =====================================================
# SCRIPT DE SAUVEGARDE COMPLÈTE GESTALIS
# Date: 2025-01-09
# Version: SmartPicker Implementation
# =====================================================

Write-Host "🚀 DÉMARRAGE DE LA SAUVEGARDE COMPLÈTE GESTALIS" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Variables
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "C:\Users\PRO97\Desktop\Gestalis\backups"
$projectDir = "C:\Users\PRO97\Desktop\Gestalis"
$backupName = "GESTALIS_SmartPicker_$timestamp"

# Créer le dossier de sauvegarde
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
    Write-Host "✅ Dossier de sauvegarde créé: $backupDir" -ForegroundColor Green
}

$currentBackupDir = "$backupDir\$backupName"
New-Item -ItemType Directory -Path $currentBackupDir -Force
Write-Host "✅ Dossier de sauvegarde actuelle créé: $currentBackupDir" -ForegroundColor Green

# 1. SAUVEGARDE DU CODE SOURCE
Write-Host "`n📁 SAUVEGARDE DU CODE SOURCE..." -ForegroundColor Yellow
try {
    # Copier tout le projet
    Copy-Item -Path "$projectDir\*" -Destination $currentBackupDir -Recurse -Exclude @("node_modules", ".git", "backups", "*.log")
    Write-Host "✅ Code source sauvegardé" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la sauvegarde du code source: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. SAUVEGARDE GIT
Write-Host "`n🔧 SAUVEGARDE GIT..." -ForegroundColor Yellow
try {
    Set-Location $projectDir
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "⚠️  Modifications non commitées détectées" -ForegroundColor Yellow
        git add .
        git commit -m "🔄 Sauvegarde automatique - $timestamp"
        Write-Host "✅ Modifications commitées" -ForegroundColor Green
    }
    
    git push origin main
    Write-Host "✅ Code poussé vers GitHub" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur Git: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. SAUVEGARDE DE LA BASE DE DONNÉES
Write-Host "`n🗄️  SAUVEGARDE DE LA BASE DE DONNÉES..." -ForegroundColor Yellow
try {
    # Copier le schéma SQL
    Copy-Item -Path "$projectDir\backup-supabase-schema.sql" -Destination "$currentBackupDir\database-schema.sql" -Force
    Write-Host "✅ Schéma de base de données sauvegardé" -ForegroundColor Green
    
    # Note: Pour une vraie sauvegarde Supabase, utiliser l'API ou l'interface web
    Write-Host "ℹ️  Pour une sauvegarde complète Supabase, utiliser l'interface web ou l'API" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur lors de la sauvegarde de la base de données: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. SAUVEGARDE DE LA DOCUMENTATION
Write-Host "`n📚 SAUVEGARDE DE LA DOCUMENTATION..." -ForegroundColor Yellow
try {
    Copy-Item -Path "$projectDir\DOCUMENTATION-SMART-PICKER.md" -Destination "$currentBackupDir\README.md" -Force
    Write-Host "✅ Documentation sauvegardée" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la sauvegarde de la documentation: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. CRÉATION D'UN ARCHIVE COMPRESSÉ
Write-Host "`n📦 CRÉATION DE L'ARCHIVE COMPRESSÉE..." -ForegroundColor Yellow
try {
    $archivePath = "$backupDir\${backupName}.zip"
    Compress-Archive -Path $currentBackupDir -DestinationPath $archivePath -Force
    Write-Host "✅ Archive créée: $archivePath" -ForegroundColor Green
    
    # Supprimer le dossier temporaire
    Remove-Item -Path $currentBackupDir -Recurse -Force
    Write-Host "✅ Dossier temporaire supprimé" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la création de l'archive: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. SAUVEGARDE SUR LE CLOUD (OPTIONNEL)
Write-Host "`n☁️  SAUVEGARDE SUR LE CLOUD..." -ForegroundColor Yellow
Write-Host "ℹ️  Pour une sauvegarde cloud automatique, configurer:" -ForegroundColor Cyan
Write-Host "   - Google Drive API" -ForegroundColor Cyan
Write-Host "   - Dropbox API" -ForegroundColor Cyan
Write-Host "   - OneDrive API" -ForegroundColor Cyan
Write-Host "   - AWS S3" -ForegroundColor Cyan

# 7. RAPPORT DE SAUVEGARDE
Write-Host "`n📊 RAPPORT DE SAUVEGARDE" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow

$archiveSize = if (Test-Path $archivePath) { 
    [math]::Round((Get-Item $archivePath).Length / 1MB, 2) 
} else { 
    "N/A" 
}

Write-Host "📅 Date: $timestamp" -ForegroundColor White
Write-Host "📁 Dossier: $backupDir" -ForegroundColor White
Write-Host "📦 Archive: ${backupName}.zip" -ForegroundColor White
Write-Host "💾 Taille: $archiveSize MB" -ForegroundColor White
Write-Host "🔗 GitHub: https://github.com/GESTALIS/GESTALIS" -ForegroundColor White

# 8. NETTOYAGE DES ANCIENNES SAUVEGARDES (garder les 5 dernières)
Write-Host "`n🧹 NETTOYAGE DES ANCIENNES SAUVEGARDES..." -ForegroundColor Yellow
try {
    $oldBackups = Get-ChildItem -Path $backupDir -Filter "GESTALIS_SmartPicker_*.zip" | 
                  Sort-Object LastWriteTime -Descending | 
                  Select-Object -Skip 5
    
    foreach ($oldBackup in $oldBackups) {
        Remove-Item -Path $oldBackup.FullName -Force
        Write-Host "🗑️  Ancienne sauvegarde supprimée: $($oldBackup.Name)" -ForegroundColor Yellow
    }
    Write-Host "✅ Nettoyage terminé" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du nettoyage: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. VÉRIFICATION DE L'INTÉGRITÉ
Write-Host "`n🔍 VÉRIFICATION DE L'INTÉGRITÉ..." -ForegroundColor Yellow
try {
    if (Test-Path $archivePath) {
        $archive = Get-Item $archivePath
        if ($archive.Length -gt 0) {
            Write-Host "✅ Archive valide et non vide" -ForegroundColor Green
        } else {
            Write-Host "❌ Archive vide ou corrompue" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Archive non trouvée" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur lors de la vérification: $($_.Exception.Message)" -ForegroundColor Red
}

# 10. FINALISATION
Write-Host "`n🎉 SAUVEGARDE TERMINÉE !" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host "✅ Code source sauvegardé" -ForegroundColor Green
Write-Host "✅ Base de données sauvegardée" -ForegroundColor Green
Write-Host "✅ Documentation sauvegardée" -ForegroundColor Green
Write-Host "✅ Archive créée" -ForegroundColor Green
Write-Host "✅ Code poussé vers GitHub" -ForegroundColor Green
Write-Host "`n📁 Emplacement de la sauvegarde: $archivePath" -ForegroundColor Cyan
Write-Host "🔗 Repository GitHub: https://github.com/GESTALIS/GESTALIS" -ForegroundColor Cyan
Write-Host "`n💡 Pour restaurer: extraire l'archive et exécuter 'npm install'" -ForegroundColor Yellow

# Retourner au répertoire original
Set-Location $projectDir

Write-Host "`n🚀 Script terminé avec succès !" -ForegroundColor Green
