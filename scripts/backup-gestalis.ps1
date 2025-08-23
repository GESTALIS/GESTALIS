# Script de sauvegarde automatisee GESTALIS
# Usage: .\scripts\backup-gestalis.ps1 [TYPE_SAUVEGARDE]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("complete", "git", "database", "config")]
    [string]$TypeSauvegarde = "complete"
)

# Configuration
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupDir = "$env:USERPROFILE\Desktop\Gestalis_Backups"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupName = "Gestalis_$TypeSauvegarde`_$Timestamp"

Write-Host "🚀 Demarrage de la sauvegarde GESTALIS..." -ForegroundColor Green
Write-Host "📁 Projet: $ProjectRoot" -ForegroundColor Cyan
Write-Host "💾 Type: $TypeSauvegarde" -ForegroundColor Cyan
Write-Host "⏰ Timestamp: $Timestamp" -ForegroundColor Cyan

# Creation du dossier de sauvegarde
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force
    Write-Host "✅ Dossier de sauvegarde cree: $BackupDir" -ForegroundColor Green
}

$BackupPath = Join-Path $BackupDir $BackupName
New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null

try {
    # 1. SAUVEGARDE COMPLETE
    if ($TypeSauvegarde -eq "complete") {
        Write-Host "📦 Sauvegarde complete en cours..." -ForegroundColor Yellow
        
        # Copie du projet complet
        Copy-Item -Path $ProjectRoot\* -Destination $BackupPath -Recurse -Exclude @("node_modules", ".git", "*.log", "*.tmp")
        
        # Sauvegarde Git
        if (Test-Path "$ProjectRoot\.git") {
            Write-Host "🔧 Sauvegarde Git..." -ForegroundColor Yellow
            $GitBackupPath = Join-Path $BackupPath "git-backup"
            New-Item -ItemType Directory -Path $GitBackupPath -Force | Out-Null
            
            # Export des commits
            Set-Location $ProjectRoot
            git log --oneline > "$GitBackupPath\commits.txt"
            git status > "$GitBackupPath\status.txt"
            git branch -a > "$GitBackupPath\branches.txt"
        }
        
        # Sauvegarde de la base de donnees
        if (Test-Path "$ProjectRoot\backend\prisma") {
            Write-Host "🗄️ Sauvegarde Prisma..." -ForegroundColor Yellow
            $PrismaBackupPath = Join-Path $BackupPath "prisma-backup"
            New-Item -ItemType Directory -Path $PrismaBackupPath -Force | Out-Null
            Copy-Item -Path "$ProjectRoot\backend\prisma\*" -Destination $PrismaBackupPath -Recurse
        }
    }
    
    # 2. SAUVEGARDE GIT SEULE
    elseif ($TypeSauvegarde -eq "git") {
        Write-Host "🔧 Sauvegarde Git en cours..." -ForegroundColor Yellow
        
        if (Test-Path "$ProjectRoot\.git") {
            Set-Location $ProjectRoot
            git log --oneline > "$BackupPath\commits.txt"
            git status > "$BackupPath\status.txt"
            git branch -a > "$BackupPath\branches.txt"
            git diff > "$BackupPath\changes.patch"
        } else {
            Write-Host "❌ Aucun repository Git trouve" -ForegroundColor Red
        }
    }
    
    # 3. SAUVEGARDE BASE DE DONNEES
    elseif ($TypeSauvegarde -eq "database") {
        Write-Host "🗄️ Sauvegarde base de donnees en cours..." -ForegroundColor Yellow
        
        if (Test-Path "$ProjectRoot\backend\prisma") {
            Copy-Item -Path "$ProjectRoot\backend\prisma\*" -Destination $BackupPath -Recurse
        }
        
        if (Test-Path "$ProjectRoot\backend\config") {
            Copy-Item -Path "$ProjectRoot\backend\config\*" -Destination $BackupPath -Recurse
        }
    }
    
    # 4. SAUVEGARDE CONFIGURATION
    elseif ($TypeSauvegarde -eq "config") {
        Write-Host "⚙️ Sauvegarde configuration en cours..." -ForegroundColor Yellow
        
        $ConfigFiles = @(
            "package.json",
            "package-lock.json",
            "tailwind.config.js",
            "vite.config.js",
            "postcss.config.js",
            "docker-compose.yml",
            "nginx.conf"
        )
        
        foreach ($file in $ConfigFiles) {
            if (Test-Path "$ProjectRoot\$file") {
                Copy-Item -Path "$ProjectRoot\$file" -Destination $BackupPath
            }
        }
        
        # Configuration backend
        if (Test-Path "$ProjectRoot\backend\config") {
            Copy-Item -Path "$ProjectRoot\backend\config\*" -Destination $BackupPath -Recurse
        }
    }
    
    # Calcul de la taille
    $Size = (Get-ChildItem $BackupPath -Recurse | Measure-Object -Property Length -Sum).Sum
    $SizeMB = [math]::Round($Size / 1MB, 2)
    
    Write-Host "✅ Sauvegarde terminee avec succes!" -ForegroundColor Green
    Write-Host "📁 Dossier: $BackupPath" -ForegroundColor Cyan
    Write-Host "📊 Taille: $SizeMB MB" -ForegroundColor Cyan
    
    # Creation d'un rapport
    $ReportPath = Join-Path $BackupPath "backup-report.txt"
    $Report = @"
=== RAPPORT DE SAUVEGARDE GESTALIS ===
Date: $(Get-Date)
Type: $TypeSauvegarde
Projet: $ProjectRoot
Taille: $SizeMB MB
Fichiers: $(Get-ChildItem $BackupPath -Recurse | Measure-Object).Count

=== DETAILS ===
$(Get-ChildItem $BackupPath -Recurse | Select-Object FullName, Length | Format-Table -AutoSize | Out-String)

=== FIN RAPPORT ===
"@
    
    $Report | Out-File -FilePath $ReportPath -Encoding UTF8
    Write-Host "📋 Rapport cree: $ReportPath" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Erreur lors de la sauvegarde: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Sauvegarde terminee! Dossier: $BackupPath" -ForegroundColor Green
