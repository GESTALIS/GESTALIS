// Service de recherche pour les entités
import { supabase } from './supabase';

// Service de recherche pour les fournisseurs
export const searchFournisseurs = async (query) => {
  try {
    // Recherche directe dans Supabase
    const { data, error } = await supabase
      .from('fournisseurs')
      .select('id, code_fournisseur, raison_sociale, siret')
      .or(`raison_sociale.ilike.%${query}%,code_fournisseur.ilike.%${query}%,siret.ilike.%${query}%`)
      .limit(20);
    
    if (error) {
      console.error('Erreur lors de la recherche de fournisseurs:', error);
      return [];
    }
    
    return (data || []).map(fournisseur => ({
      id: fournisseur.id,
      label: `${fournisseur.code_fournisseur} — ${fournisseur.raison_sociale}`,
      data: fournisseur
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche de fournisseurs:', error);
    return [];
  }
};

// Service de recherche pour les chantiers
export const searchChantiers = async (query) => {
  try {
    // Utiliser les vraies données Supabase
    const { data, error } = await supabase
      .from('chantiers')
      .select('id, code, nom, client, statut')
      .or(`nom.ilike.%${query}%,code.ilike.%${query}%,client.ilike.%${query}%`)
      .limit(20);
    
    if (error) {
      console.error('Erreur lors de la recherche de chantiers:', error);
      return [];
    }
    
    return (data || []).map(chantier => ({
      id: chantier.id,
      label: `${chantier.code} — ${chantier.nom}${chantier.client ? ` (${chantier.client})` : ''}`,
      data: chantier
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche de chantiers:', error);
    return [];
  }
};

// Service de recherche pour les employés (demandeurs)
export const searchEmployes = async (query) => {
  try {
    // ⚠️ DONNÉES MOCKÉES - Table 'employes' n'existe pas encore dans Supabase
    // TODO: Créer la table 'employes' dans Supabase et remplacer par l'appel API réel
    const mockEmployes = [
      { id: 1, nom: 'Dupont', prenom: 'Jean', service: 'Achats' },
      { id: 2, nom: 'Martin', prenom: 'Marie', service: 'Production' },
      { id: 3, nom: 'Bernard', prenom: 'Pierre', service: 'Logistique' },
    ];
    
    const filtered = mockEmployes.filter(employe => 
      employe.nom.toLowerCase().includes(query.toLowerCase()) ||
      employe.prenom.toLowerCase().includes(query.toLowerCase()) ||
      (employe.service && employe.service.toLowerCase().includes(query.toLowerCase()))
    );
    
    return filtered.map(employe => ({
      id: employe.id,
      label: `${employe.prenom} ${employe.nom} — ${employe.service}`,
      data: employe
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche d\'employés:', error);
    return [];
  }
};

// Service de recherche pour les utilisateurs (créateurs)
export const searchUtilisateurs = async (query) => {
  try {
    // ⚠️ DONNÉES MOCKÉES - Table 'users' n'existe pas encore dans Supabase
    // TODO: Créer la table 'users' dans Supabase et remplacer par l'appel API réel
    const mockUtilisateurs = [
      { id: 1, nom: 'Admin', prenom: 'Super', email: 'admin@gestalis.com' },
      { id: 2, nom: 'User', prenom: 'Test', email: 'user@gestalis.com' },
    ];
    
    const filtered = mockUtilisateurs.filter(utilisateur => 
      utilisateur.nom.toLowerCase().includes(query.toLowerCase()) ||
      utilisateur.prenom.toLowerCase().includes(query.toLowerCase()) ||
      (utilisateur.email && utilisateur.email.toLowerCase().includes(query.toLowerCase()))
    );
    
    return filtered.map(utilisateur => ({
      id: utilisateur.id,
      label: `${utilisateur.prenom} ${utilisateur.nom} (${utilisateur.email})`,
      data: utilisateur
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    return [];
  }
};

// Service de recherche pour les produits
export const searchProduits = async (query) => {
  try {
    // ⚠️ DONNÉES MOCKÉES - Table 'produits' n'existe pas encore dans Supabase
    // TODO: Créer la table 'produits' dans Supabase et remplacer par l'appel API réel
    const mockProduits = [
      { id: 1, reference: 'PROD001', nom: 'Produit A', uom: 'PIECE' },
      { id: 2, reference: 'PROD002', nom: 'Produit B', uom: 'KG' },
      { id: 3, reference: 'PROD003', nom: 'Produit C', uom: 'M' },
    ];
    
    const filtered = mockProduits.filter(produit => 
      produit.nom.toLowerCase().includes(query.toLowerCase()) ||
      produit.reference.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.map(produit => ({
      id: produit.id,
      label: `${produit.reference} — ${produit.nom} (${produit.uom})`,
      data: produit
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche de produits:', error);
    return [];
  }
};
