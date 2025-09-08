// =====================================================
// SERVICE SUPABASE PRINCIPAL GESTALIS
// Gestion centralisÃ©e de toutes les opÃ©rations BDD
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (clÃ©s du projet GESTALIS BTP)
const SUPABASE_URL = 'https://esczdkgknrozwovlfbki.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzY3pka2drbnJvendvdmxmYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjM2NTIsImV4cCI6MjA3MTM5OTY1Mn0.OUoTvXOayb9u6zjNgp646qYRg6pIVRKFYyFn8u0-zCA';

// CrÃ©er une seule instance Supabase partagÃ©e
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction de vÃ©rification de connexion
export const verifierConnexion = async () => {
  try {
    const { data, error } = await supabase.from('fournisseurs').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('âŒ Erreur connexion Supabase:', error);
    return false;
  }
};

// Fonction de gestion d'erreur Supabase
export const gererErreurSupabase = (error, operation) => {
  console.error(`âŒ Erreur ${operation}:`, error);
  throw new Error(`Erreur ${operation}: ${error.message}`);
};

// Service des fournisseurs
export const fournisseursService = {
  // RÃ©cupÃ©rer tous les fournisseurs actifs depuis Supabase (soft delete)
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
      gererErreurSupabase(error, 'rÃ©cupÃ©ration fournisseurs');
    }
  },

  // CrÃ©er un fournisseur dans Supabase
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
      
      if (error) throw error;
      
      // Transformer la rÃ©ponse pour correspondre au format local
      const createdFournisseur = data[0];
      return {
        id: createdFournisseur.id,
        codeFournisseur: createdFournisseur.code_fournisseur,
        raisonSociale: createdFournisseur.raison_sociale,
        siret: createdFournisseur.siret,
        adresse: createdFournisseur.adresse,
        codePostal: createdFournisseur.code_postal,
        ville: createdFournisseur.ville,
        pays: createdFournisseur.pays,
        telephone: createdFournisseur.telephone,
        email: createdFournisseur.email,
        contactPrincipal: createdFournisseur.contact_principal,
        conditionsPaiement: createdFournisseur.conditions_paiement,
        notes: createdFournisseur.notes,
        statut: createdFournisseur.statut,
        dateCreation: createdFournisseur.created_at,
        tvaIntracommunautaire: createdFournisseur.tva_intracommunautaire || '',
        codeApeNaf: createdFournisseur.code_ape_naf || '',
        formeJuridique: createdFournisseur.forme_juridique || '',
        capitalSocial: createdFournisseur.capital_social || '',
        adresseSiege: createdFournisseur.adresse_siege || '',
        adresseLivraison: createdFournisseur.adresse_livraison || '',
        plafondCredit: createdFournisseur.plafond_credit || '',
        devise: createdFournisseur.devise || 'EUR',
        estSousTraitant: createdFournisseur.est_sous_traitant || false,
        compteComptable: createdFournisseur.compte_comptable || '',
        pasDeTvaGuyane: createdFournisseur.pas_de_tva_guyane || false
      };
    } catch (error) {
      gererErreurSupabase(error, 'crÃ©ation fournisseur');
    }
  },

  // Mettre Ã  jour un fournisseur dans Supabase
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
      
      if (error) throw error;
      
      // Transformer la rÃ©ponse pour correspondre au format local
      const updatedFournisseur = data[0];
      return {
        id: updatedFournisseur.id,
        codeFournisseur: updatedFournisseur.code_fournisseur,
        raisonSociale: updatedFournisseur.raison_sociale,
        siret: updatedFournisseur.siret,
        adresse: updatedFournisseur.adresse,
        codePostal: updatedFournisseur.code_postal,
        ville: updatedFournisseur.ville,
        pays: updatedFournisseur.pays,
        telephone: updatedFournisseur.telephone,
        email: updatedFournisseur.email,
        contactPrincipal: updatedFournisseur.contact_principal,
        conditionsPaiement: updatedFournisseur.conditions_paiement,
        notes: updatedFournisseur.notes,
        statut: updatedFournisseur.statut,
        dateCreation: updatedFournisseur.created_at,
        tvaIntracommunautaire: updatedFournisseur.tva_intracommunautaire || '',
        codeApeNaf: updatedFournisseur.code_ape_naf || '',
        formeJuridique: updatedFournisseur.forme_juridique || '',
        capitalSocial: updatedFournisseur.capital_social || '',
        adresseSiege: updatedFournisseur.adresse_siege || '',
        adresseLivraison: updatedFournisseur.adresse_livraison || '',
        plafondCredit: updatedFournisseur.plafond_credit || '',
        devise: updatedFournisseur.devise || 'EUR',
        estSousTraitant: updatedFournisseur.est_sous_traitant || false,
        compteComptable: updatedFournisseur.compte_comptable || '',
        pasDeTvaGuyane: updatedFournisseur.pas_de_tva_guyane || false
      };
    } catch (error) {
      gererErreurSupabase(error, 'mise Ã  jour fournisseur');
    }
  },

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
  },

  // Lister tous les fournisseurs depuis Supabase
  async lister() {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transformer les donnÃ©es Supabase vers le format local
      return data.map(fournisseur => ({
        id: fournisseur.id,
        codeFournisseur: fournisseur.code_fournisseur,
        raisonSociale: fournisseur.raison_sociale,
        siret: fournisseur.siret,
        adresse: fournisseur.adresse,
        codePostal: fournisseur.code_postal,
        ville: fournisseur.ville,
        pays: fournisseur.pays,
        telephone: fournisseur.telephone,
        email: fournisseur.email,
        contactPrincipal: fournisseur.contact_principal,
        conditionsPaiement: fournisseur.conditions_paiement,
        notes: fournisseur.notes,
        statut: fournisseur.statut,
        dateCreation: fournisseur.created_at,
        // Ajouter les champs manquants avec des valeurs par dÃ©faut
        tvaIntracommunautaire: fournisseur.tva_intracommunautaire || '',
        codeApeNaf: fournisseur.code_ape_naf || '',
        formeJuridique: fournisseur.forme_juridique || '',
        capitalSocial: fournisseur.capital_social || '',
        adresseSiege: fournisseur.adresse_siege || '',
        adresseLivraison: fournisseur.adresse_livraison || '',
        plafondCredit: fournisseur.plafond_credit || '',
        devise: fournisseur.devise || 'EUR',
        estSousTraitant: fournisseur.est_sous_traitant || false,
        compteComptable: fournisseur.compte_comptable || '',
        pasDeTvaGuyane: fournisseur.pas_de_tva_guyane || false
      }));
    } catch (error) {
      gererErreurSupabase(error, 'rÃ©cupÃ©ration fournisseurs');
      return [];
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
      gererErreurSupabase(error, 'rÃ©cupÃ©ration chantiers');
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
      gererErreurSupabase(error, 'crÃ©ation chantier');
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
      gererErreurSupabase(error, 'rÃ©cupÃ©ration cessions');
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
      gererErreurSupabase(error, 'crÃ©ation cession');
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
      gererErreurSupabase(error, 'rÃ©cupÃ©ration produits');
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
      gererErreurSupabase(error, 'rÃ©cupÃ©ration factures');
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
          utilisateur: entry.utilisateur || 'systÃ¨me'
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

