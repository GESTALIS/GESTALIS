// =====================================================
// SERVICE SUPABASE PRINCIPAL GESTALIS
// Gestion centralisée de toutes les opérations BDD
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (clés du projet GESTALIS BTP)
const SUPABASE_URL = 'https://esczdkgknrozwovlfbki.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzY3pka2drbnJvendvdmxmYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjM2NTIsImV4cCI6MjA3MTM5OTY1Mn0.OUoTvXOayb9u6zjNgp646qYRg6pIVRKFYyFn8u0-zCA';

// Créer une seule instance Supabase partagée
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction de vérification de connexion
export const verifierConnexion = async () => {
  try {
    const { data, error } = await supabase.from('fournisseurs').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion Supabase:', error);
    return false;
  }
};

// Fonction de gestion d'erreur Supabase
export const gererErreurSupabase = (error, operation) => {
  console.error(`❌ Erreur ${operation}:`, error);
  throw new Error(`Erreur ${operation}: ${error.message}`);
};

// Service des fournisseurs
export const fournisseursService = {
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

  // Créer un fournisseur dans Supabase
  async creer(fournisseur) {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .insert([{
          code_fournisseur: fournisseur.codeFournisseur,
          raison_sociale: fournisseur.raisonSociale,
          siret: fournisseur.siret,
          adresse: fournisseur.adresse,
          code_postal: fournisseur.codePostal,
          ville: fournisseur.ville,
          pays: fournisseur.pays || 'France',
          telephone: fournisseur.telephone,
          email: fournisseur.email,
          contact_principal: fournisseur.contactPrincipal,
          conditions_paiement: fournisseur.conditionsPaiement,
          notes: fournisseur.notes,
          statut: fournisseur.statut || 'actif'
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      gererErreurSupabase(error, 'création fournisseur');
    }
  },

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
          statut: fournisseur.statut
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      gererErreurSupabase(error, 'mise à jour fournisseur');
    }
  },

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
};

// Service des chantiers
export const chantiersService = {
  async recupererTous() {
    try {
      const { data, error } = await supabase
        .from('chantiers')
        .select('*')
        .order('nom');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      gererErreurSupabase(error, 'récupération chantiers');
    }
  },

  async creer(chantier) {
    try {
      const { data, error } = await supabase
        .from('chantiers')
        .insert([{
          code: chantier.code,
          numero_externe: chantier.numeroExterne,
          nom: chantier.nom,
          description: chantier.description,
          adresse: chantier.adresse,
          code_postal: chantier.codePostal,
          ville: chantier.ville,
          client: chantier.client,
          date_debut: chantier.dateDebut,
          date_fin_prevue: chantier.dateFinPrevue,
          date_fin_reelle: chantier.dateFinReelle,
          montant_ht: chantier.montant,
          montant_ttc: chantier.montant,
          statut: chantier.statut || 'en_cours',
          chef_chantier: chantier.chefChantier,
          notes: chantier.notes
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      gererErreurSupabase(error, 'création chantier');
    }
  },

  async supprimer(id) {
    try {
      const { error } = await supabase
        .from('chantiers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      gererErreurSupabase(error, 'suppression chantier');
    }
  }
};

// Service des cessions
export const cessionsService = {
  async recupererToutes() {
    try {
      const { data, error } = await supabase
        .from('cessions_creance')
        .select('*')
        .order('date_cession', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      gererErreurSupabase(error, 'récupération cessions');
    }
  },

  async creer(cession) {
    try {
      const { data, error } = await supabase
        .from('cessions_creance')
        .insert([{
          reference: cession.reference,
          date_cession: cession.dateCession,
          montant: cession.montant,
          client: cession.client,
          chantier: cession.chantier,
          fournisseur: cession.fournisseur,
          statut: cession.statut || 'en_cours',
          notes: cession.notes
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      gererErreurSupabase(error, 'création cession');
    }
  }
};

// Service des produits
export const produitsService = {
  async recupererTous() {
    try {
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .order('nom');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      gererErreurSupabase(error, 'récupération produits');
    }
  }
};

// Service des factures
export const facturesService = {
  async recupererToutes() {
    try {
      const { data, error } = await supabase
        .from('factures')
        .select('*')
        .order('date_facture', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      gererErreurSupabase(error, 'récupération factures');
    }
  }
};

// Service de l'historique des prix
export const historiquePrixService = {
  async ajouter(entry) {
    try {
      const { data, error } = await supabase
        .from('historique_prix')
        .insert([{
          produit_id: entry.produitId,
          ancien_prix: entry.ancienPrix,
          nouveau_prix: entry.nouveauPrix,
          date_changement: entry.dateChangement,
          utilisateur: entry.utilisateur || 'système'
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      gererErreurSupabase(error, 'ajout historique prix');
    }
  }
};

// Exporter l'instance Supabase unique
export { supabase };
export default supabase;
