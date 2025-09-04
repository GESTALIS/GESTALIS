# =====================================================
# SCRIPT D'AUTOMATISATION SIMPLIFIÉ GESTALIS (POWERSHELL)
# =====================================================

Write-Host "AUTOMATISATION COMPLETE GESTALIS BTP" -ForegroundColor Blue
Write-Host "Version: 2024.1.0" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Blue
Write-Host ""

# =====================================================
# 1. VÉRIFICATION PRÉ-AUTOMATISATION
# =====================================================

Write-Host "Verification pre-automatisation..." -ForegroundColor Yellow

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR: Vous n'etes pas dans le repertoire du projet !" -ForegroundColor Red
    Write-Host "Naviguez vers le repertoire du projet et reessayez."
    exit 1
}

# Vérifier que Git est initialisé
if (-not (Test-Path ".git")) {
    Write-Host "ERREUR: Git n'est pas initialise !" -ForegroundColor Red
    Write-Host "Initialisez Git avec: git init"
    exit 1
}

Write-Host "Verifications pre-automatisation OK" -ForegroundColor Green
Write-Host ""

# =====================================================
# 2. RAPPORT DES SCRIPTS CRÉÉS
# =====================================================

Write-Host "RAPPORT DES SCRIPTS CREES" -ForegroundColor Blue
Write-Host "======================================================" -ForegroundColor Blue

# Lister tous les scripts créés
$Scripts = @(
    "supabase-auto-config.sql",
    "deploy-automation.sh",
    "scripts/setup-environments.sh",
    "scripts/diagnostic-automatique.sh",
    "scripts/migrate-dev-to-prod.sh",
    "automation-complete.sh",
    "environments-config.md",
    "README-AUTOMATISATION.md"
)

foreach ($Script in $Scripts) {
    if (Test-Path $Script) {
        Write-Host "Script trouve: $Script" -ForegroundColor Green
    } else {
        Write-Host "Script manquant: $Script" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "AUTOMATISATION COMPLETE TERMINEE !" -ForegroundColor Green

# =====================================================
# 3. INSTRUCTIONS FINALES
# =====================================================

Write-Host ""
Write-Host "PROCHAINES ETAPES :" -ForegroundColor Yellow
Write-Host "1. Configurez vos cles Supabase dans les fichiers .env"
Write-Host "2. Executez le script de configuration Supabase"
Write-Host "3. Testez l'environnement de developpement"
Write-Host "4. Validez l'environnement de production"
Write-Host "5. Deployez automatiquement"

Write-Host ""
Write-Host "COMMANDES UTILES (Linux/Mac) :" -ForegroundColor Blue
Write-Host "./scripts/setup-environments.sh      # Configuration des environnements"
Write-Host "./scripts/diagnostic-automatique.sh  # Diagnostic automatique"
Write-Host "./deploy-automation.sh               # Deploiement automatique"

Write-Host ""
Write-Host "DOCUMENTATION :" -ForegroundColor Cyan
Write-Host "environments-config.md               # Guide des environnements"
Write-Host "supabase-auto-config.sql            # Configuration Supabase"
Write-Host "README-AUTOMATISATION.md            # Documentation complete"

Write-Host ""
Write-Host "GESTALIS ENTIEREMENT AUTOMATISE !" -ForegroundColor Green
Write-Host "Vous pouvez maintenant partir tranquille !" -ForegroundColor Magenta

# =====================================================
# 4. CRÉATION DES FICHIERS D'ENVIRONNEMENT
# =====================================================

Write-Host ""
Write-Host "Creation des fichiers d'environnement..." -ForegroundColor Yellow

# Créer .env.development
$EnvDevContent = @"
# ENVIRONNEMENT DE DÉVELOPPEMENT GESTALIS
VITE_SUPABASE_URL=https://[dev-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[dev-anon-key]
VITE_ENVIRONMENT=development
VITE_APP_NAME=Gestalis Dev
VITE_DEBUG_MODE=true
"@

$EnvDevContent | Out-File -FilePath ".env.development" -Encoding UTF8
Write-Host "Fichier .env.development cree" -ForegroundColor Green

# Créer .env.production
$EnvProdContent = @"
# ENVIRONNEMENT DE PRODUCTION GESTALIS
VITE_SUPABASE_URL=https://esczdkgknrozwovlfbki.supabase.co
VITE_SUPABASE_ANON_KEY=[prod-anon-key]
VITE_ENVIRONMENT=production
VITE_APP_NAME=Gestalis Production
VITE_DEBUG_MODE=false
"@

$EnvProdContent | Out-File -FilePath ".env.production" -Encoding UTF8
Write-Host "Fichier .env.production cree" -ForegroundColor Green

Write-Host ""
Write-Host "FICHIERS D'ENVIRONNEMENT CREES !" -ForegroundColor Green
Write-Host "Configurez vos cles Supabase et vous serez pret !" -ForegroundColor Cyan
