# Script PowerShell pour supprimer le chargement des produits depuis localStorage

$filePath = "frontend/src/pages/Achats.jsx"
$content = Get-Content $filePath -Raw

# Supprimer le chargement des produits depuis localStorage
$oldProduitsLogic = @"
    
    // Charger les produits depuis localStorage
    const produitsLocal = localStorage.getItem('gestalis-produits');
    if (produitsLocal) {
      try {
        const produitsParsed = JSON.parse(produitsLocal);
        setProduits(produitsParsed);
        console.log('📦 Produits chargés au montage du composant:', produitsParsed);
      } catch (error) {
        console.error('❌ Erreur lors du parsing des produits:', error);
      }
    }
"@

$newProduitsLogic = @"
    
    // DÉSACTIVÉ : Plus de chargement des produits depuis localStorage
    // Les produits viennent maintenant uniquement de Supabase
    console.log('🎯 Produits - chargement depuis Supabase uniquement');
"@

# Effectuer le remplacement
$content = $content -replace [regex]::Escape($oldProduitsLogic), $newProduitsLogic

# Sauvegarder le fichier modifié
Set-Content $filePath $content -Encoding UTF8

Write-Host "✅ Chargement des produits depuis localStorage supprimé dans Achats.jsx" -ForegroundColor Green
