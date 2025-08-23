# Script de sauvegarde simple GESTALIS
param(
    [string]$TypeSauvegarde = "complete"
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupDir = "$env:USERPROFILE\Desktop\Gestalis_Backups"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupName = "Gestalis_$TypeSauvegarde`_$Timestamp"

Write-Host "Demarrage de la sauvegarde GESTALIS..." -ForegroundColor Green
Write-Host "Projet: $ProjectRoot" -ForegroundColor Cyan
Write-Host "Type: $TypeSauvegarde" -ForegroundColor Cyan
Write-Host "Timestamp: $Timestamp" -ForegroundColor Cyan

# Creation du dossier de sauvegarde
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force
    Write-Host "Dossier de sauvegarde cree: $BackupDir" -ForegroundColor Green
}

$BackupPath = Join-Path $BackupDir $BackupName
New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null

try {
    if ($TypeSauvegarde -eq "complete") {
        Write-Host "Sauvegarde complete en cours..." -ForegroundColor Yellow
        Copy-Item -Path $ProjectRoot\* -Destination $BackupPath -Recurse -Exclude @("node_modules", ".git", "*.log", "*.tmp")
    }
    elseif ($TypeSauvegarde -eq "git") {
        Write-Host "Sauvegarde Git en cours..." -ForegroundColor Yellow
        if (Test-Path "$ProjectRoot\.git") {
            Set-Location $ProjectRoot
            git log --oneline > "$BackupPath\commits.txt"
            git status > "$BackupPath\status.txt"
            git branch -a > "$BackupPath\branches.txt"
        }
    }
    
    $Size = (Get-ChildItem $BackupPath -Recurse | Measure-Object -Property Length -Sum).Sum
    $SizeMB = [math]::Round($Size / 1MB, 2)
    
    Write-Host "Sauvegarde terminee avec succes!" -ForegroundColor Green
    Write-Host "Dossier: $BackupPath" -ForegroundColor Cyan
    Write-Host "Taille: $SizeMB MB" -ForegroundColor Cyan
    
} catch {
    Write-Host "Erreur lors de la sauvegarde: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Sauvegarde terminee! Dossier: $BackupPath" -ForegroundColor Green
