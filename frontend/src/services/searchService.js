import { supabase } from './supabase';

export const searchFournisseurs = async (query) => {
  try {
    // Récupérer les fournisseurs depuis le localStorage (store Zustand)
    const storeData = localStorage.getItem('gestalis-fournisseurs-store');
    if (storeData) {
      try {
        const parsed = JSON.parse(storeData);
        const fournisseurs = parsed.state?.fournisseurs || [];
        
        const filtered = fournisseurs.filter(f => 
          f.raisonSociale?.toLowerCase().includes(query.toLowerCase()) ||
          f.codeFournisseur?.toLowerCase().includes(query.toLowerCase()) ||
          f.siret?.toLowerCase().includes(query.toLowerCase())
        );
        
        console.log('🔍 searchFournisseurs - Query:', query, 'Results:', filtered);
        
        return filtered.map(fournisseur => ({
          id: fournisseur.id,
          label: `${fournisseur.codeFournisseur} — ${fournisseur.raisonSociale}`,
          data: fournisseur
        }));
      } catch (parseError) {
        console.error('Erreur parsing store fournisseurs:', parseError);
      }
    }
    
    // Fallback : essayer Supabase si le store n'est pas disponible
    const { data, error } = await supabase
      .from('fournisseurs')
      .select('id, code_fournisseur, raison_sociale, siret')
      .or(`raison_sociale.ilike.%${query}%,code_fournisseur.ilike.%${query}%,siret.ilike.%${query}%`)
      .limit(20);
    
    if (error) {
      console.error('Erreur recherche fournisseurs Supabase:', error);
      return [];
    }
    
    return (data || []).map(fournisseur => ({
      id: fournisseur.id,
      label: `${fournisseur.code_fournisseur} — ${fournisseur.raison_sociale}`,
      data: fournisseur
    }));
  } catch (error) {
    console.error('Erreur recherche fournisseurs:', error);
    return [];
  }
};

export const searchChantiers = async (query) => {
  try {
    // Récupérer les chantiers depuis le localStorage
    const storeData = localStorage.getItem('gestalis-chantiers');
    if (storeData) {
      try {
        const chantiers = JSON.parse(storeData);
        
        const filtered = chantiers.filter(c => 
          c.nom?.toLowerCase().includes(query.toLowerCase()) ||
          c.code?.toLowerCase().includes(query.toLowerCase()) ||
          c.clientNom?.toLowerCase().includes(query.toLowerCase())
        );
        
        console.log('🔍 searchChantiers - Query:', query, 'Results:', filtered);
        
        return filtered.map(chantier => ({
          id: chantier.id,
          label: `${chantier.code} — ${chantier.nom}${chantier.clientNom ? ` (${chantier.clientNom})` : ''}`,
          data: chantier
        }));
      } catch (parseError) {
        console.error('Erreur parsing store chantiers:', parseError);
      }
    }
    
    // Fallback : essayer Supabase si le store n'est pas disponible
    const { data, error } = await supabase
      .from('chantiers')
      .select('id, code, nom, client, statut')
      .or(`nom.ilike.%${query}%,code.ilike.%${query}%,client.ilike.%${query}%`)
      .limit(20);
    
    if (error) {
      console.error('Erreur recherche chantiers Supabase:', error);
      return [];
    }
    
    return (data || []).map(chantier => ({
      id: chantier.id,
      label: `${chantier.code} — ${chantier.nom}${chantier.client ? ` (${chantier.client})` : ''}`,
      data: chantier
    }));
  } catch (error) {
    console.error('Erreur recherche chantiers:', error);
    return [];
  }
};

export const searchEmployes = async (query) => {
  try {
    const { data, error } = await supabase
      .from('employes')
      .select('id, matricule, nom, prenom, poste, departement')
      .or(`nom.ilike.%${query}%,prenom.ilike.%${query}%,matricule.ilike.%${query}%,poste.ilike.%${query}%`)
      .limit(20);
    
    if (error) {
      console.error('Erreur recherche employes:', error);
      return [];
    }
    
    return (data || []).map(employe => ({
      id: employe.id,
      label: `${employe.matricule} — ${employe.prenom} ${employe.nom}${employe.poste ? ` (${employe.poste})` : ''}`,
      data: employe
    }));
  } catch (error) {
    console.error('Erreur recherche employes:', error);
    return [];
  }
};

export const searchUtilisateurs = async (query) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, nom, prenom, role')
      .or(`nom.ilike.%${query}%,prenom.ilike.%${query}%,email.ilike.%${query}%`)
      .eq('actif', true)
      .limit(20);
    
    if (error) {
      console.error('Erreur recherche utilisateurs:', error);
      return [];
    }
    
    return (data || []).map(utilisateur => ({
      id: utilisateur.id,
      label: `${utilisateur.prenom} ${utilisateur.nom} (${utilisateur.email}) — ${utilisateur.role}`,
      data: utilisateur
    }));
  } catch (error) {
    console.error('Erreur recherche utilisateurs:', error);
    return [];
  }
};

export const searchProduits = async (query) => {
  try {
    const { data, error } = await supabase
      .from('produits')
      .select('id, code_produit, designation, unite, prix_unitaire_ht')
      .or(`designation.ilike.%${query}%,code_produit.ilike.%${query}%`)
      .eq('statut', 'actif')
      .limit(20);
    
    if (error) {
      console.error('Erreur recherche produits:', error);
      return [];
    }
    
    return (data || []).map(produit => ({
      id: produit.id,
      label: `${produit.code_produit} — ${produit.designation} (${produit.unite})${produit.prix_unitaire_ht ? ` - ${produit.prix_unitaire_ht}€` : ''}`,
      data: produit
    }));
  } catch (error) {
    console.error('Erreur recherche produits:', error);
    return [];
  }
};
