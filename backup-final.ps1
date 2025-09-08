# Script de sauvegarde final pour GESTALIS
Write-Host "SAUVEGARDE GESTALIS - SmartPicker System" -ForegroundColor Green

# Variables
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "C:\Users\PRO97\Desktop\Gestalis\backups"
$projectDir = "C:\Users\PRO97\Desktop\Gestalis"

# Creer le dossier de sauvegarde
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
    Write-Host "Dossier de sauvegarde cree" -ForegroundColor Green
}

# 1. Sauvegarde Git
Write-Host "`nSauvegarde Git..." -ForegroundColor Yellow
Set-Location $projectDir
git add .
git commit -m "Sauvegarde automatique - $timestamp"
git push origin main
Write-Host "Code pousse vers GitHub" -ForegroundColor Green

# 2. Creer une archive
Write-Host "`nCreation de l'archive..." -ForegroundColor Yellow
$archivePath = "$backupDir\GESTALIS_SmartPicker_$timestamp.zip"
Compress-Archive -Path "$projectDir\*" -DestinationPath $archivePath -Exclude @("node_modules", ".git", "backups")
Write-Host "Archive creee: $archivePath" -ForegroundColor Green

# 3. Rapport
$archiveSize = [math]::Round((Get-Item $archivePath).Length / 1MB, 2)
Write-Host "`nRAPPORT DE SAUVEGARDE" -ForegroundColor Yellow
Write-Host "Date: $timestamp" -ForegroundColor White
Write-Host "Taille: $archiveSize MB" -ForegroundColor White
Write-Host "Emplacement: $archivePath" -ForegroundColor White
Write-Host "GitHub: https://github.com/GESTALIS/GESTALIS" -ForegroundColor White

Write-Host "`nSAUVEGARDE TERMINEE !" -ForegroundColor Green
