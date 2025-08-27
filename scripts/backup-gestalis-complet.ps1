# Script de sauvegarde complète GESTALIS ERP
# Auteur: Assistant IA
# Date: $(Get-Date -Format "yyyy-MM-dd HH:mm")

param(
    [string]$BackupPath = "$env:USERPROFILE\Desktop\GESTALIS_Backups",
    [switch]$SkipGit = $false,
    [switch]$SkipZip = $false,
    [switch]$SkipDB = $false
)

Write-Host "🚀 DÉMARRAGE SAUVEGARDE COMPLÈTE GESTALIS" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "Chemin de sauvegarde: $BackupPath" -ForegroundColor Yellow
Write-Host "Date: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Yellow
Write-Host ""

# Créer le dossier de sauvegarde s'il n'existe pas
if (!(Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    Write-Host "✅ Dossier de sauvegarde créé: $BackupPath" -ForegroundColor Green
}

# Créer le sous-dossier pour cette sauvegarde
$BackupDate = Get-Date -Format "yyyy-MM-dd_HHmm"
$CurrentBackupPath = Join-Path $BackupPath "GESTALIS_$BackupDate"
New-Item -ItemType Directory -Path $CurrentBackupPath -Force | Out-Null
Write-Host "✅ Dossier de sauvegarde actuelle: $CurrentBackupPath" -ForegroundColor Green

# ÉTAPE 1: Sauvegarde Git
if (!$SkipGit) {
    Write-Host ""
    Write-Host "📝 ÉTAPE 1: Sauvegarde Git..." -ForegroundColor Cyan
    
    try {
        # Aller dans le dossier frontend
        Set-Location "frontend"
        
        # Vérifier le statut Git
        $gitStatus = git status --porcelain
        if ($gitStatus) {
            Write-Host "   📤 Changements détectés, création du commit..." -ForegroundColor Yellow
            
            # Ajouter tous les fichiers
            git add .
            
            # Créer le commit
            $commitMessage = "backup GESTALIS – $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
            git commit -m $commitMessage
            
            # Pousser vers GitHub
            Write-Host "   📤 Push vers GitHub..." -ForegroundColor Yellow
            git push origin main
            
            Write-Host "   ✅ Sauvegarde Git réussie!" -ForegroundColor Green
        } else {
            Write-Host "   ℹ️  Aucun changement à commiter" -ForegroundColor Blue
        }
        
        # Retourner au dossier racine
        Set-Location ".."
        
    } catch {
        Write-Host "   ❌ Erreur lors de la sauvegarde Git: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ÉTAPE 2: Sauvegarde ZIP complète
if (!$SkipZip) {
    Write-Host ""
    Write-Host "📦 ÉTAPE 2: Création de l'archive ZIP..." -ForegroundColor Cyan
    
    try {
        $zipPath = Join-Path $CurrentBackupPath "GESTALIS_full_backup_$BackupDate.zip"
        
        # Exclure les dossiers et fichiers inutiles
        $excludeItems = @(
            "node_modules",
            ".git",
            "dist",
            "build",
            ".cache",
            "*.log",
            ".env*",
            "*.tmp",
            "*.temp"
        )
        
        # Créer l'archive avec 7-Zip si disponible, sinon avec PowerShell
        if (Get-Command "7z" -ErrorAction SilentlyContinue) {
            Write-Host "   🔧 Utilisation de 7-Zip pour la compression..." -ForegroundColor Yellow
            
            $excludeArgs = $excludeItems | ForEach-Object { "-xr!$_" }
            $args = @("a", "-tzip", $zipPath, ".", $excludeArgs)
            & 7z @args
            
        } else {
            Write-Host "   🔧 Utilisation de PowerShell pour la compression..." -ForegroundColor Yellow
            
            # Créer une archive temporaire
            $tempPath = Join-Path $CurrentBackupPath "temp_backup"
            if (Test-Path $tempPath) { Remove-Item $tempPath -Recurse -Force }
            
            # Copier les fichiers en excluant les éléments inutiles
            Copy-Item "." $tempPath -Recurse -Force
            
            # Supprimer les éléments exclus
            foreach ($item in $excludeItems) {
                $excludePath = Join-Path $tempPath $item
                if (Test-Path $excludePath) {
                    Remove-Item $excludePath -Recurse -Force
                    Write-Host "      🗑️  Exclu: $item" -ForegroundColor Gray
                }
            }
            
            # Créer l'archive ZIP
            Compress-Archive -Path "$tempPath\*" -DestinationPath $zipPath -Force
            
            # Nettoyer le dossier temporaire
            Remove-Item $tempPath -Recurse -Force
        }
        
        $zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
        Write-Host "   ✅ Archive ZIP créée: $zipPath ($zipSize MB)" -ForegroundColor Green
        
    } catch {
        Write-Host "   ❌ Erreur lors de la création de l'archive: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ÉTAPE 3: Sauvegarde des fichiers .env
Write-Host ""
Write-Host "🔐 ÉTAPE 3: Sauvegarde des fichiers .env..." -ForegroundColor Cyan

try {
    $envBackupPath = Join-Path $CurrentBackupPath "env_backup"
    New-Item -ItemType Directory -Path $envBackupPath -Force | Out-Null
    
    # Sauvegarder les fichiers .env du frontend
    $frontendEnv = "frontend\.env"
    if (Test-Path $frontendEnv) {
        Copy-Item $frontendEnv (Join-Path $envBackupPath "frontend.env")
        Write-Host "   ✅ .env frontend sauvegardé" -ForegroundColor Green
    }
    
    # Sauvegarder les fichiers .env du backend
    $backendEnvFiles = @("backend\.env", "backend\.env.postgres", "backend\.env.supabase")
    foreach ($envFile in $backendEnvFiles) {
        if (Test-Path $envFile) {
            $fileName = Split-Path $envFile -Leaf
            Copy-Item $envFile (Join-Path $envBackupPath $fileName)
            Write-Host "   ✅ $fileName sauvegardé" -ForegroundColor Green
        }
    }
    
    Write-Host "   ✅ Fichiers .env sauvegardés dans: $envBackupPath" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Erreur lors de la sauvegarde des .env: $($_.Exception.Message)" -ForegroundColor Red
}

# ÉTAPE 4: Sauvegarde de la base de données (si Docker est disponible)
if (!$SkipDB) {
    Write-Host ""
    Write-Host "🗄️  ÉTAPE 4: Sauvegarde de la base de données..." -ForegroundColor Cyan
    
    try {
        # Vérifier si Docker est disponible
        if (Get-Command "docker" -ErrorAction SilentlyContinue) {
            # Vérifier si PostgreSQL est en cours d'exécution
            $postgresContainer = docker ps --filter "name=postgres" --format "{{.Names}}" 2>$null
            
            if ($postgresContainer) {
                Write-Host "   🐳 Container PostgreSQL détecté: $postgresContainer" -ForegroundColor Yellow
                
                $dbBackupPath = Join-Path $CurrentBackupPath "db_backup_$BackupDate.sql"
                
                # Créer le dump de la base
                docker exec $postgresContainer pg_dump -U postgres -d gestalis > $dbBackupPath
                
                if (Test-Path $dbBackupPath) {
                    $dbSize = [math]::Round((Get-Item $dbBackupPath).Length / 1KB, 2)
                    Write-Host "   ✅ Dump de la base créé: $dbBackupPath ($dbSize KB)" -ForegroundColor Green
                } else {
                    Write-Host "   ⚠️  Dump de la base non créé" -ForegroundColor Yellow
                }
            } else {
                Write-Host "   ℹ️  Aucun container PostgreSQL en cours d'exécution" -ForegroundColor Blue
            }
        } else {
            Write-Host "   ℹ️  Docker non disponible" -ForegroundColor Blue
        }
        
    } catch {
        Write-Host "   ❌ Erreur lors de la sauvegarde de la base: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ÉTAPE 5: Génération du rapport
Write-Host ""
Write-Host "📊 ÉTAPE 5: Génération du rapport..." -ForegroundColor Cyan

try {
    $reportPath = Join-Path $CurrentBackupPath "RAPPORT_SAUVEGARDE.txt"
    
    $report = @"
=== RAPPORT DE SAUVEGARDE GESTALIS ===
Date: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')
Chemin: $CurrentBackupPath

📝 SAUVEGARDE GIT:
- Statut: $(if (!$SkipGit) { 'Effectuée' } else { 'Ignorée' })
- Commit: $(if (!$SkipGit) { git log --oneline -1 --format='%h %s' 2>$null } else { 'N/A' })

📦 SAUVEGARDE ZIP:
- Statut: $(if (!$SkipZip) { 'Effectuée' } else { 'Ignorée' })
- Fichier: $(if (!$SkipZip) { "GESTALIS_full_backup_$BackupDate.zip" } else { 'N/A' })

🔐 SAUVEGARDE .ENV:
- Statut: Effectuée
- Dossier: env_backup/

🗄️ SAUVEGARDE BASE DE DONNÉES:
- Statut: $(if (!$SkipDB) { 'Tentée' } else { 'Ignorée' })
- Fichier: $(if (!$SkipDB) { "db_backup_$BackupDate.sql" } else { 'N/A' })

📁 CONTENU DE LA SAUVEGARDE:
$(Get-ChildItem $CurrentBackupPath -Recurse | ForEach-Object { "  - $($_.Name)" })

⚠️ IMPORTANT:
- Les fichiers .env sont sauvegardés localement uniquement
- Ne jamais pousser les fichiers .env sur GitHub
- Conserver cette sauvegarde dans un endroit sûr

🔄 RESTAURATION:
- Décompresser l'archive ZIP
- Recréer les fichiers .env à partir des sauvegardes
- Réinstaller les dépendances (npm install)
- Importer la base de données si nécessaire

Fin du rapport - $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')
"@

    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "   ✅ Rapport généré: $reportPath" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Erreur lors de la génération du rapport: $($_.Exception.Message)" -ForegroundColor Red
}

# FINALISATION
Write-Host ""
Write-Host "🎉 SAUVEGARDE TERMINÉE AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "📁 Dossier de sauvegarde: $CurrentBackupPath" -ForegroundColor Yellow
Write-Host "📊 Rapport: $reportPath" -ForegroundColor Yellow
Write-Host "⏰ Durée: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 CONSEILS:" -ForegroundColor Cyan
Write-Host "   - Gardez cette sauvegarde dans un endroit sûr" -ForegroundColor White
Write-Host "   - Testez la restauration sur une machine de test" -ForegroundColor White
Write-Host "   - Planifiez des sauvegardes régulières" -ForegroundColor White
Write-Host ""

# Nettoyage des anciennes sauvegardes (garder seulement les 5 plus récentes)
Write-Host "🧹 Nettoyage des anciennes sauvegardes..." -ForegroundColor Cyan
try {
    $oldBackups = Get-ChildItem $BackupPath -Directory | Sort-Object CreationTime -Descending | Select-Object -Skip 5
    
    if ($oldBackups) {
        foreach ($oldBackup in $oldBackups) {
            Write-Host "   🗑️  Suppression: $($oldBackup.Name)" -ForegroundColor Gray
            Remove-Item $oldBackup.FullName -Recurse -Force
        }
        Write-Host "   ✅ Nettoyage terminé" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  Aucune ancienne sauvegarde à supprimer" -ForegroundColor Blue
    }
} catch {
    Write-Host "   ⚠️  Erreur lors du nettoyage: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ SAUVEGARDE COMPLÈTE TERMINÉE!" -ForegroundColor Green

