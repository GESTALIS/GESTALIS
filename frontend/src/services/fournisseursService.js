/**
 * Service de gestion des fournisseurs
 * Utilise Supabase pour la persistance des données
 */

import { supabase } from './supabase';

class FournisseursService {
  constructor() {
    // Plus d'initialisation de données de test
    // Les données viennent maintenant de Supabase
  }

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
      console.error('❌ Erreur récupération fournisseurs:', error);
      return [];
    }
  }

  // Récupérer un fournisseur par ID depuis Supabase
  async recupererParId(id) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Erreur récupération fournisseur:', error);
      return null;
    }
  }

  // Créer un fournisseur dans Supabase
  async creer(fournisseur) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .insert([{
          code_fournisseur: fournisseur.codeFournisseur,
          raison_sociale: fournisseur.raisonSociale,
          siret: fournisseur.siret,
          adresse: fournisseur.adresseSiege || fournisseur.adresse,
          code_postal: fournisseur.codePostal,
          ville: fournisseur.ville,
          pays: fournisseur.pays || 'France',
          telephone: fournisseur.telephone,
          email: fournisseur.email,
          contact_principal: fournisseur.contactPrincipal,
          conditions_paiement: fournisseur.conditionsPaiement || '30 jours',
          notes: fournisseur.notes,
          statut: fournisseur.actif ? 'actif' : 'inactif'
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Erreur création fournisseur:', error);
      throw error;
    }
  }

  // Mettre à jour un fournisseur dans Supabase
  async mettreAJour(id, fournisseur) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .update({
          code_fournisseur: fournisseur.codeFournisseur,
          raison_sociale: fournisseur.raisonSociale,
          siret: fournisseur.siret,
          adresse: fournisseur.adresseSiege || fournisseur.adresse,
          code_postal: fournisseur.codePostal,
          ville: fournisseur.ville,
          pays: fournisseur.pays,
          telephone: fournisseur.telephone,
          email: fournisseur.email,
          contact_principal: fournisseur.contactPrincipal,
          conditions_paiement: fournisseur.conditionsPaiement,
          notes: fournisseur.notes,
          statut: fournisseur.actif ? 'actif' : 'inactif'
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Erreur mise à jour fournisseur:', error);
      throw error;
    }
  }

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
      console.error('❌ Erreur suppression fournisseur:', error);
      throw error;
    }
  }

  // Rechercher des fournisseurs dans Supabase
  async rechercher(terme) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .select('*')
        .or(`raison_sociale.ilike.%${terme}%,code_fournisseur.ilike.%${terme}%`)
        .order('raison_sociale');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Erreur recherche fournisseurs:', error);
      return [];
    }
  }

  // Obtenir les suggestions pour l'autocomplétion
  async obtenirSuggestions(terme) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .select('id, raison_sociale, code_fournisseur')
        .or(`raison_sociale.ilike.%${terme}%,code_fournisseur.ilike.%${terme}%`)
        .limit(10)
        .order('raison_sociale');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Erreur suggestions fournisseurs:', error);
      return [];
    }
  }

  // Vérifier si un code fournisseur existe déjà
  async codeExiste(codeFournisseur, idExclu = null) {
    try {
      let query = supabase
        .from('fournisseurs')
        .select('id')
        .eq('code_fournisseur', codeFournisseur);
      
      if (idExclu) {
        query = query.neq('id', idExclu);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('❌ Erreur vérification code fournisseur:', error);
      return false;
    }
  }

  // Obtenir les statistiques des fournisseurs
  async obtenirStatistiques() {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .select('statut');
      
      if (error) throw error;
      
      const total = data.length;
      const actifs = data.filter(f => f.statut === 'actif').length;
      const inactifs = total - actifs;
      
      return {
        total,
        actifs,
        inactifs,
        pourcentageActifs: total > 0 ? Math.round((actifs / total) * 100) : 0
      };
    } catch (error) {
      console.error('❌ Erreur statistiques fournisseurs:', error);
      return { total: 0, actifs: 0, inactifs: 0, pourcentageActifs: 0 };
    }
  }
}

// Créer et exporter une instance unique
const fournisseursService = new FournisseursService();
export default fournisseursService;
