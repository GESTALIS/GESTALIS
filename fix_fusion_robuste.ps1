# Script PowerShell robuste pour supprimer définitivement la fusion localStorage/Supabase

$filePath = "frontend/src/pages/Achats.jsx"
$content = Get-Content $filePath -Raw -Encoding UTF8

# Remplacer la logique de fusion par Supabase uniquement
$oldPattern = @"
  // Charger les fournisseurs depuis Supabase ET localStorage au montage
  useEffect\(\(\) => \{
    const chargerFournisseurs = async \(\) => \{
      try \{
        // 1\. Charger depuis Supabase
        const fournisseursSupabase = await fournisseursService\.recupererTous\(\);
        console\.log\('✅ Fournisseurs chargés depuis Supabase:', fournisseursSupabase\);
        
        // 2\. Charger depuis localStorage
        const fournisseursLocal = localStorage\.getItem\('gestalis-fournisseurs'\);
        let fournisseursLocalStorage = \[\];
        
        if \(fournisseursLocal\) \{
          try \{
            fournisseursLocalStorage = JSON\.parse\(fournisseursLocal\);
            console\.log\('💾 Fournisseurs chargés depuis localStorage:', fournisseursLocalStorage\);
          \} catch \(error\) \{
            console\.error\('❌ Erreur parsing localStorage fournisseurs:', error\);
          \}
        \}
        
        // 3\. PRIORITÉ AUX DONNÉES LOCALES \(utilisateur a effacé les données de test\)
        // Si localStorage contient des données, utiliser SEULEMENT localStorage
        // Sinon, utiliser Supabase \(première fois\)
        let fournisseursFinaux = \[\];
        
        if \(fournisseursLocalStorage\.length > 0\) \{
          // L'utilisateur a des données locales \(a effacé les données de test\)
          console\.log\('🎯 Utilisation des données locales uniquement \(données de test effacées\)'\);
          fournisseursFinaux = fournisseursLocalStorage;
        \} else \{
          // Première fois ou localStorage vide, utiliser Supabase
          console\.log\('🎯 Première utilisation, chargement depuis Supabase'\);
          fournisseursFinaux = fournisseursSupabase;
        \}
        
        console\.log\('🔄 Fournisseurs finaux chargés:', fournisseursFinaux\);
        
        setFournisseurs\(fournisseursFinaux\);
        setFilteredFournisseurs\(fournisseursFinaux\);
        
      \} catch \(error\) \{
        console\.error\('❌ Erreur chargement fournisseurs:', error\);
        
        // En cas d'erreur Supabase, utiliser uniquement localStorage
        const fournisseursLocal = localStorage\.getItem\('gestalis-fournisseurs'\);
        if \(fournisseursLocal\) \{
          try \{
            const fournisseursLocalStorage = JSON\.parse\(fournisseursLocal\);
            console\.log\('🔄 Utilisation des fournisseurs du localStorage en fallback:', fournisseursLocalStorage\);
            setFournisseurs\(fournisseursLocalStorage\);
            setFilteredFournisseurs\(fournisseursLocalStorage\);
          \} catch \(parseError\) \{
            console\.error\('❌ Erreur parsing localStorage en fallback:', parseError\);
            setFournisseurs\(\[\]\);
            setFilteredFournisseurs\(\[\]\);
          \}
        \} else \{
          setFournisseurs\(\[\]\);
          setFilteredFournisseurs\(\[\]\);
        \}
      \}
    \};
"@

$newLogic = @"
  // Charger les fournisseurs depuis Supabase uniquement (source de vérité)
  useEffect(() => {
    const chargerFournisseurs = async () => {
      try {
        // SUPABASE COMME UNIQUE SOURCE DE VÉRITÉ
        const fournisseursSupabase = await fournisseursService.recupererTous();
        console.log('✅ Fournisseurs chargés depuis Supabase (source de vérité):', fournisseursSupabase);
        
        // Filtrer les fournisseurs non supprimés (soft delete)
        const fournisseursActifs = fournisseursSupabase.filter(f => !f.is_deleted);
        console.log('🎯 Fournisseurs actifs (non supprimés):', fournisseursActifs);
        
        setFournisseurs(fournisseursActifs);
        setFilteredFournisseurs(fournisseursActifs);
        
      } catch (error) {
        console.error('❌ Erreur chargement fournisseurs depuis Supabase:', error);
        setFournisseurs([]);
        setFilteredFournisseurs([]);
      }
    };
"@

# Effectuer le remplacement avec regex
$content = $content -replace $oldPattern, $newLogic

# Sauvegarder le fichier modifié
Set-Content $filePath $content -Encoding UTF8

Write-Host "✅ Fusion localStorage/Supabase définitivement supprimée dans Achats.jsx" -ForegroundColor Green
