# Script PowerShell pour mettre à jour les services Supabase avec soft delete

$filePath = "frontend/src/services/supabase.js"
$content = Get-Content $filePath -Raw

# 1. Modifier recupererTous() pour filtrer is_deleted = false
$oldRecupererTous = @"
  // Récupérer tous les fournisseurs depuis Supabase
  async recupererTous() {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .select('*')
        .order('raison_sociale');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      gererErreurSupabase(error, 'récupération fournisseurs');
    }
  },
"@

$newRecupererTous = @"
  // Récupérer tous les fournisseurs actifs depuis Supabase (soft delete)
  async recupererTous() {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .select('*')
        .eq('is_deleted', false)
        .order('raison_sociale');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      gererErreurSupabase(error, 'récupération fournisseurs');
    }
  },
"@

# 2. Modifier supprimer() pour faire un soft delete
$oldSupprimer = @"
  // Supprimer un fournisseur de Supabase
  async supprimer(id) {
    try {
      const { error } = await supabase
        .from('fournisseurs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      gererErreurSupabase(error, 'suppression fournisseur');
    }
  }
"@

$newSupprimer = @"
  // Supprimer un fournisseur de Supabase (soft delete)
  async supprimer(id) {
    try {
      const { error } = await supabase
        .from('fournisseurs')
        .update({ 
          is_deleted: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      gererErreurSupabase(error, 'suppression fournisseur');
    }
  }
"@

# 3. Modifier creer() pour ajouter is_deleted = false
$oldCreer = @"
  // Créer un fournisseur dans Supabase
  async creer(fournisseur) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .insert([{
          code_fournisseur: fournisseur.codeFournisseur,
          raison_sociale: fournisseur.raisonSociale,
          siret: fournisseur.siret,
          adresse: fournisseur.adresse || fournisseur.adresseSiege,
          code_postal: fournisseur.codePostal,
          ville: fournisseur.ville,
          pays: fournisseur.pays || 'France',
          telephone: fournisseur.telephone,
          email: fournisseur.email,
          contact_principal: fournisseur.contactPrincipal,
          conditions_paiement: fournisseur.conditionsPaiement,
          notes: fournisseur.notes,
          statut: fournisseur.statut || 'actif'
          // Utiliser seulement les colonnes qui existent dans la table
        }])
        .select();
"@

$newCreer = @"
  // Créer un fournisseur dans Supabase
  async creer(fournisseur) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .insert([{
          code_fournisseur: fournisseur.codeFournisseur,
          raison_sociale: fournisseur.raisonSociale,
          siret: fournisseur.siret,
          adresse: fournisseur.adresse || fournisseur.adresseSiege,
          code_postal: fournisseur.codePostal,
          ville: fournisseur.ville,
          pays: fournisseur.pays || 'France',
          telephone: fournisseur.telephone,
          email: fournisseur.email,
          contact_principal: fournisseur.contactPrincipal,
          conditions_paiement: fournisseur.conditionsPaiement,
          notes: fournisseur.notes,
          statut: fournisseur.statut || 'actif',
          is_deleted: false,
          updated_at: new Date().toISOString()
        }])
        .select();
"@

# 4. Modifier mettreAJour() pour ajouter updated_at
$oldMettreAJour = @"
  // Mettre à jour un fournisseur dans Supabase
  async mettreAJour(id, fournisseur) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .update({
          code_fournisseur: fournisseur.codeFournisseur,
          raison_sociale: fournisseur.raisonSociale,
          siret: fournisseur.siret,
          adresse: fournisseur.adresse,
          code_postal: fournisseur.codePostal,
          ville: fournisseur.ville,
          pays: fournisseur.pays,
          telephone: fournisseur.telephone,
          email: fournisseur.email,
          contact_principal: fournisseur.contactPrincipal,
          conditions_paiement: fournisseur.conditionsPaiement,
          notes: fournisseur.notes,
          statut: fournisseur.statut,
          // Ajouter tous les nouveaux champs
          tva_intracommunautaire: fournisseur.tvaIntracommunautaire,
          code_ape_naf: fournisseur.codeApeNaf,
          forme_juridique: fournisseur.formeJuridique,
          capital_social: fournisseur.capitalSocial,
          adresse_siege: fournisseur.adresseSiege,
          // adresse_livraison: fournisseur.adresseLivraison, // Colonne n'existe pas dans la table
          plafond_credit: fournisseur.plafondCredit,
          devise: fournisseur.devise,
          est_sous_traitant: fournisseur.estSousTraitant,
          compte_comptable: fournisseur.compteComptable,
          pas_de_tva_guyane: fournisseur.pasDeTvaGuyane
        })
        .eq('id', id)
        .select();
"@

$newMettreAJour = @"
  // Mettre à jour un fournisseur dans Supabase
  async mettreAJour(id, fournisseur) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .update({
          code_fournisseur: fournisseur.codeFournisseur,
          raison_sociale: fournisseur.raisonSociale,
          siret: fournisseur.siret,
          adresse: fournisseur.adresse,
          code_postal: fournisseur.codePostal,
          ville: fournisseur.ville,
          pays: fournisseur.pays,
          telephone: fournisseur.telephone,
          email: fournisseur.email,
          contact_principal: fournisseur.contactPrincipal,
          conditions_paiement: fournisseur.conditionsPaiement,
          notes: fournisseur.notes,
          statut: fournisseur.statut,
          // Ajouter tous les nouveaux champs
          tva_intracommunautaire: fournisseur.tvaIntracommunautaire,
          code_ape_naf: fournisseur.codeApeNaf,
          forme_juridique: fournisseur.formeJuridique,
          capital_social: fournisseur.capitalSocial,
          adresse_siege: fournisseur.adresseSiege,
          // adresse_livraison: fournisseur.adresseLivraison, // Colonne n'existe pas dans la table
          plafond_credit: fournisseur.plafondCredit,
          devise: fournisseur.devise,
          est_sous_traitant: fournisseur.estSousTraitant,
          compte_comptable: fournisseur.compteComptable,
          pas_de_tva_guyane: fournisseur.pasDeTvaGuyane,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
"@

# Effectuer les remplacements
$content = $content -replace [regex]::Escape($oldRecupererTous), $newRecupererTous
$content = $content -replace [regex]::Escape($oldSupprimer), $newSupprimer
$content = $content -replace [regex]::Escape($oldCreer), $newCreer
$content = $content -replace [regex]::Escape($oldMettreAJour), $newMettreAJour

# Sauvegarder le fichier modifié
Set-Content $filePath $content -Encoding UTF8

Write-Host "✅ Services Supabase mis à jour avec soft delete" -ForegroundColor Green
