// =====================================================
// SCRIPT DE MIGRATION COMPLET
// localStorage → Supabase
// Tous les modules Gestalis
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (clés du projet GESTALIS BTP)
const SUPABASE_URL = 'https://esczdkgknrozwovlfbki.supabase.co';
const SUPABASE_ANON_KEY = '9uGziNgoG46oYBg0plVBKEYxEp8uO-zCA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================
// FONCTIONS DE MIGRATION
// =====================================================

// Migration des fournisseurs
async function migrerFournisseurs() {
    console.log('🔄 Migration des fournisseurs...');
    
    try {
        const fournisseursData = localStorage.getItem('fournisseurs');
        if (!fournisseursData) {
            console.log('❌ Aucun fournisseur trouvé dans localStorage');
            return;
        }

        const fournisseurs = JSON.parse(fournisseursData);
        console.log(`📊 ${fournisseurs.length} fournisseurs à migrer`);

        for (const fournisseur of fournisseurs) {
            const { data, error } = await supabase
                .from('fournisseurs')
                .insert({
                    code_fournisseur: fournisseur.codeFournisseur || fournisseur.code,
                    raison_sociale: fournisseur.raisonSociale || fournisseur.nom,
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
                });

            if (error) {
                console.error(`❌ Erreur migration fournisseur ${fournisseur.codeFournisseur}:`, error);
            } else {
                console.log(`✅ Fournisseur migré: ${fournisseur.codeFournisseur}`);
            }
        }
    } catch (error) {
        console.error('❌ Erreur migration fournisseurs:', error);
    }
}

// Migration des chantiers
async function migrerChantiers() {
    console.log('🔄 Migration des chantiers...');
    
    try {
        const chantiersData = localStorage.getItem('chantiers');
        if (!chantiersData) {
            console.log('❌ Aucun chantier trouvé dans localStorage');
            return;
        }

        const chantiers = JSON.parse(chantiersData);
        console.log(`📊 ${chantiers.length} chantiers à migrer`);

        for (const chantier of chantiers) {
            const { data, error } = await supabase
                .from('chantiers')
                .insert({
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
                });

            if (error) {
                console.error(`❌ Erreur migration chantier ${chantier.code}:`, error);
            } else {
                console.log(`✅ Chantier migré: ${chantier.code}`);
            }
        }
    } catch (error) {
        console.error('❌ Erreur migration chantiers:', error);
    }
}

// Migration des cessions
async function migrerCessions() {
    console.log('🔄 Migration des cessions...');
    
    try {
        const cessionsData = localStorage.getItem('cessions');
        if (!cessionsData) {
            console.log('❌ Aucune cession trouvée dans localStorage');
            return;
        }

        const cessions = JSON.parse(cessionsData);
        console.log(`📊 ${cessions.length} cessions à migrer`);

        for (const cession of cessions) {
            const { data, error } = await supabase
                .from('cessions_creance')
                .insert({
                    reference: cession.reference,
                    date_cession: cession.dateCession,
                    montant: cession.montant,
                    client: cession.client,
                    chantier: cession.chantier,
                    fournisseur: cession.fournisseur,
                    statut: cession.statut || 'en_cours',
                    notes: cession.notes
                });

            if (error) {
                console.error(`❌ Erreur migration cession ${cession.reference}:`, error);
            } else {
                console.log(`✅ Cession migrée: ${cession.reference}`);
            }
        }
    } catch (error) {
        console.error('❌ Erreur migration cessions:', error);
    }
}

// Migration des produits
async function migrerProduits() {
    console.log('🔄 Migration des produits...');
    
    try {
        const produitsData = localStorage.getItem('produits');
        if (!produitsData) {
            console.log('❌ Aucun produit trouvé dans localStorage');
            return;
        }

        const produits = JSON.parse(produitsData);
        console.log(`📊 ${produits.length} produits à migrer`);

        for (const produit of produits) {
            const { data, error } = await supabase
                .from('produits')
                .insert({
                    code: produit.code,
                    nom: produit.nom,
                    description: produit.description,
                    prix_ht: produit.prixHT,
                    prix_ttc: produit.prixTTC,
                    unite: produit.unite,
                    categorie_id: produit.categorieId || 1,
                    fournisseur_id: produit.fournisseurId,
                    statut: produit.statut || 'actif'
                });

            if (error) {
                console.error(`❌ Erreur migration produit ${produit.code}:`, error);
            } else {
                console.log(`✅ Produit migré: ${produit.code}`);
            }
        }
    } catch (error) {
        console.error('❌ Erreur migration produits:', error);
    }
}

// Migration des factures
async function migrerFactures() {
    console.log('🔄 Migration des factures...');
    
    try {
        const facturesData = localStorage.getItem('factures');
        if (!facturesData) {
            console.log('❌ Aucune facture trouvée dans localStorage');
            return;
        }

        const factures = JSON.parse(facturesData);
        console.log(`📊 ${factures.length} factures à migrer`);

        for (const facture of factures) {
            const { data, error } = await supabase
                .from('factures')
                .insert({
                    numero: facture.numero,
                    date_facture: facture.dateFacture,
                    date_echeance: facture.dateEcheance,
                    fournisseur_id: facture.fournisseurId,
                    chantier_id: facture.chantierId,
                    montant_ht: facture.montantHT,
                    montant_ttc: facture.montantTTC,
                    statut: facture.statut || 'en_attente',
                    notes: facture.notes
                });

            if (error) {
                console.error(`❌ Erreur migration facture ${facture.numero}:`, error);
            } else {
                console.log(`✅ Facture migrée: ${facture.numero}`);
            }
        }
    } catch (error) {
        console.error('❌ Erreur migration factures:', error);
    }
}

// Migration de l'historique des prix
async function migrerHistoriquePrix() {
    console.log('🔄 Migration de l\'historique des prix...');
    
    try {
        const historiqueData = localStorage.getItem('historiquePrix');
        if (!historiqueData) {
            console.log('❌ Aucun historique de prix trouvé dans localStorage');
            return;
        }

        const historique = JSON.parse(historiqueData);
        console.log(`📊 ${historique.length} entrées d'historique à migrer`);

        for (const entry of historique) {
            const { data, error } = await supabase
                .from('historique_prix')
                .insert({
                    produit_id: entry.produitId,
                    ancien_prix: entry.ancienPrix,
                    nouveau_prix: entry.nouveauPrix,
                    date_changement: entry.dateChangement,
                    utilisateur: entry.utilisateur || 'système'
                });

            if (error) {
                console.error(`❌ Erreur migration historique prix:`, error);
            } else {
                console.log(`✅ Historique prix migré pour produit ${entry.produitId}`);
            }
        }
    } catch (error) {
        console.error('❌ Erreur migration historique prix:', error);
    }
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function migrerTout() {
    console.log('🚀 DÉBUT DE LA MIGRATION COMPLÈTE...');
    console.log('=====================================');
    
    try {
        // Migration dans l'ordre des dépendances
        await migrerFournisseurs();
        await migrerChantiers();
        await migrerCessions();
        await migrerProduits();
        await migrerFactures();
        await migrerHistoriquePrix();
        
        console.log('=====================================');
        console.log('✅ MIGRATION TERMINÉE AVEC SUCCÈS !');
        console.log('🎯 Votre application est maintenant connectée à Supabase !');
        
    } catch (error) {
        console.error('❌ ERREUR LORS DE LA MIGRATION:', error);
    }
}

// Lancer la migration
migrerTout();
