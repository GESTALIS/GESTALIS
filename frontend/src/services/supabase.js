// =====================================================
// SERVICE SUPABASE PRINCIPAL GESTALIS
// Gestion centralisée de toutes les opérations BDD
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase depuis les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification de la configuration
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Configuration Supabase manquante !');
    console.error('Vérifiez vos variables d\'environnement :');
    console.error('- VITE_SUPABASE_URL');
    console.error('- VITE_SUPABASE_ANON_KEY');
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================
// FONCTIONS UTILITAIRES SUPABASE
// =====================================================

// Vérifier la connexion
export const verifierConnexion = async () => {
    try {
        const { data, error } = await supabase.from('fournisseurs').select('count').limit(1);
        if (error) throw error;
        return { success: true, message: 'Connexion Supabase établie' };
    } catch (error) {
        console.error('❌ Erreur connexion Supabase:', error);
        return { success: false, message: error.message };
    }
};

// Gestion des erreurs Supabase
export const gererErreurSupabase = (error, operation = 'opération') => {
    console.error(`❌ Erreur Supabase lors de ${operation}:`, error);
    
    if (error.code === '23505') {
        return 'Cette entrée existe déjà dans la base de données.';
    } else if (error.code === '23503') {
        return 'Impossible de supprimer cette entrée car elle est référencée ailleurs.';
    } else if (error.code === '42P01') {
        return 'Table non trouvée. Vérifiez la configuration de la base de données.';
    } else {
        return `Erreur lors de ${operation}: ${error.message}`;
    }
};

// =====================================================
// GESTIONNAIRES DE DONNÉES PAR MODULE
// =====================================================

// Gestionnaire Fournisseurs
export const fournisseursService = {
    // Récupérer tous les fournisseurs
    async recupererTous() {
        try {
            const { data, error } = await supabase
                .from('fournisseurs')
                .select('*')
                .order('raison_sociale');
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'récupération des fournisseurs') };
        }
    },

    // Récupérer un fournisseur par ID
    async recupererParId(id) {
        try {
            const { data, error } = await supabase
                .from('fournisseurs')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'récupération du fournisseur') };
        }
    },

    // Créer un fournisseur
    async creer(fournisseur) {
        try {
            const { data, error } = await supabase
                .from('fournisseurs')
                .insert(fournisseur)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'création du fournisseur') };
        }
    },

    // Mettre à jour un fournisseur
    async mettreAJour(id, modifications) {
        try {
            const { data, error } = await supabase
                .from('fournisseurs')
                .update(modifications)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'mise à jour du fournisseur') };
        }
    },

    // Supprimer un fournisseur
    async supprimer(id) {
        try {
            const { error } = await supabase
                .from('fournisseurs')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'suppression du fournisseur') };
        }
    }
};

// Gestionnaire Chantiers
export const chantiersService = {
    // Récupérer tous les chantiers
    async recupererTous() {
        try {
            const { data, error } = await supabase
                .from('chantiers')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'récupération des chantiers') };
        }
    },

    // Récupérer un chantier par ID
    async recupererParId(id) {
        try {
            const { data, error } = await supabase
                .from('chantiers')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'récupération du chantier') };
        }
    },

    // Créer un chantier
    async creer(chantier) {
        try {
            const { data, error } = await supabase
                .from('chantiers')
                .insert(chantier)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'création du chantier') };
        }
    },

    // Mettre à jour un chantier
    async mettreAJour(id, modifications) {
        try {
            const { data, error } = await supabase
                .from('chantiers')
                .update(modifications)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'mise à jour du chantier') };
        }
    },

    // Supprimer un chantier
    async supprimer(id) {
        try {
            const { error } = await supabase
                .from('chantiers')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'suppression du chantier') };
        }
    }
};

// Gestionnaire Cessions de Créance
export const cessionsService = {
    // Récupérer toutes les cessions
    async recupererToutes() {
        try {
            const { data, error } = await supabase
                .from('cessions_creance')
                .select(`
                    *,
                    chantiers (code, nom),
                    fournisseurs (code_fournisseur, raison_sociale)
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'récupération des cessions') };
        }
    },

    // Créer une cession
    async creer(cession) {
        try {
            const { data, error } = await supabase
                .from('cessions_creance')
                .insert(cession)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'création de la cession') };
        }
    }
};

// Gestionnaire Produits
export const produitsService = {
    // Récupérer tous les produits
    async recupererTous() {
        try {
            const { data, error } = await supabase
                .from('produits')
                .select(`
                    *,
                    categories_produits (nom, couleur)
                `)
                .order('designation');
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'récupération des produits') };
        }
    },

    // Créer un produit
    async creer(produit) {
        try {
            const { data, error } = await supabase
                .from('produits')
                .insert(produit)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'création du produit') };
        }
    }
};

// Gestionnaire Factures
export const facturesService = {
    // Récupérer toutes les factures
    async recupererToutes() {
        try {
            const { data, error } = await supabase
                .from('factures')
                .select(`
                    *,
                    fournisseurs (code_fournisseur, raison_sociale),
                    chantiers (code, nom)
                `)
                .order('date_facture', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'récupération des factures') };
        }
    },

    // Créer une facture avec ses lignes
    async creerAvecLignes(facture, lignes) {
        try {
            // Créer la facture
            const { data: factureData, error: factureError } = await supabase
                .from('factures')
                .insert(facture)
                .select()
                .single();
            
            if (factureError) throw factureError;

            // Ajouter les lignes si elles existent
            if (lignes && lignes.length > 0) {
                const lignesAvecFactureId = lignes.map(ligne => ({
                    ...ligne,
                    facture_id: factureData.id
                }));

                const { error: lignesError } = await supabase
                    .from('lignes_facture')
                    .insert(lignesAvecFactureId);
                
                if (lignesError) throw lignesError;
            }

            return { success: true, data: factureData };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'création de la facture') };
        }
    }
};

// Gestionnaire Historique des Prix
export const historiquePrixService = {
    // Récupérer l'historique des prix pour un produit/fournisseur
    async recupererHistorique(fournisseurId, designation) {
        try {
            const { data, error } = await supabase
                .from('historique_prix')
                .select('*')
                .eq('fournisseur_id', fournisseurId)
                .eq('produit_designation', designation)
                .order('date_prix', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'récupération de l\'historique des prix') };
        }
    },

    // Ajouter un prix à l'historique
    async ajouterPrix(prixData) {
        try {
            const { data, error } = await supabase
                .from('historique_prix')
                .insert(prixData)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: gererErreurSupabase(error, 'ajout du prix à l\'historique') };
        }
    }
};

// =====================================================
// EXPORT DES SERVICES
// =====================================================

export default {
    supabase,
    verifierConnexion,
    fournisseursService,
    chantiersService,
    cessionsService,
    produitsService,
    facturesService,
    historiquePrixService
};
