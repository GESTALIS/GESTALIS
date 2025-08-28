// =====================================================
// SCRIPT DE MIGRATION COMPLET
// localStorage → Supabase
// Tous les modules Gestalis
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (à remplacer par vos vraies clés)
const SUPABASE_URL = 'VOTRE_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANONYME';

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

// Migration des cessions de créance
async function migrerCessions() {
    console.log('🔄 Migration des cessions de créance...');
    
    try {
        const cessionsData = localStorage.getItem('cessions');
        if (!cessionsData) {
            console.log('❌ Aucune cession trouvée dans localStorage');
            return;
        }

        const cessions = JSON.parse(cessionsData);
        console.log(`📊 ${cessions.length} cessions à migrer`);

        for (const cession of cessions) {
            // Récupérer les IDs des références
            const { data: chantierData } = await supabase
                .from('chantiers')
                .select('id')
                .eq('code', cession.chantier)
                .single();

            const { data: fournisseurData } = await supabase
                .from('fournisseurs')
                .select('id')
                .eq('code_fournisseur', cession.fournisseur)
                .single();

            const { data, error } = await supabase
                .from('cessions_creance')
                .insert({
                    reference: cession.reference,
                    chantier_id: chantierData?.id,
                    fournisseur_id: fournisseurData?.id,
                    montant_cession: cession.montantCession,
                    date_cession: cession.dateCession,
                    date_echeance: cession.dateEcheance,
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
            // Récupérer l'ID de la catégorie
            const { data: categorieData } = await supabase
                .from('categories_produits')
                .select('id')
                .eq('nom', produit.categorie || 'Matériaux')
                .single();

            const { data, error } = await supabase
                .from('produits')
                .insert({
                    code_produit: produit.codeProduit || produit.code,
                    designation: produit.designation || produit.nom,
                    description: produit.description,
                    categorie_id: categorieData?.id,
                    prix_unitaire_ht: produit.prixUnitaire || produit.prix,
                    unite: produit.unite || 'unité',
                    tva: produit.tva || 20.00,
                    stock_actuel: produit.stockActuel || 0,
                    stock_minimum: produit.stockMinimum || 0,
                    statut: produit.statut || 'actif'
                });

            if (error) {
                console.error(`❌ Erreur migration produit ${produit.codeProduit}:`, error);
            } else {
                console.log(`✅ Produit migré: ${produit.codeProduit}`);
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
            // Récupérer l'ID du fournisseur
            const { data: fournisseurData } = await supabase
                .from('fournisseurs')
                .select('id')
                .eq('code_fournisseur', facture.fournisseur)
                .single();

            // Récupérer l'ID du chantier
            let chantierId = null;
            if (facture.chantier) {
                const { data: chantierData } = await supabase
                    .from('chantiers')
                    .select('id')
                    .eq('code', facture.chantier)
                    .single();
                chantierId = chantierData?.id;
            }

            // Insérer la facture
            const { data: factureData, error: factureError } = await supabase
                .from('factures')
                .insert({
                    numero_facture: facture.numeroFacture || facture.numero,
                    fournisseur_id: fournisseurData?.id,
                    chantier_id: chantierId,
                    date_facture: facture.dateFacture || facture.date,
                    date_echeance: facture.dateEcheance,
                    montant_ht: facture.montantHt || facture.montant,
                    montant_tva: facture.montantTva || 0,
                    montant_ttc: facture.montantTtc || facture.montant,
                    statut: facture.statut || 'en_attente',
                    conditions_paiement: facture.conditionsPaiement,
                    notes: facture.notes
                })
                .select()
                .single();

            if (factureError) {
                console.error(`❌ Erreur migration facture ${facture.numeroFacture}:`, factureError);
                continue;
            }

            // Migrer les lignes de facture
            if (facture.lignes && Array.isArray(facture.lignes)) {
                for (const ligne of facture.lignes) {
                    const { error: ligneError } = await supabase
                        .from('lignes_facture')
                        .insert({
                            facture_id: factureData.id,
                            designation: ligne.designation || ligne.produit,
                            quantite: ligne.quantite || 1,
                            prix_unitaire_ht: ligne.prixUnitaire || ligne.prix,
                            montant_ht: ligne.montantHt || ligne.montant,
                            tva: ligne.tva || 20.00,
                            montant_tva: ligne.montantTva || 0,
                            montant_ttc: ligne.montantTtc || ligne.montant,
                            ordre: ligne.ordre || 1
                        });

                    if (ligneError) {
                        console.error(`❌ Erreur migration ligne facture:`, ligneError);
                    }
                }
            }

            console.log(`✅ Facture migrée: ${facture.numeroFacture}`);
        }
    } catch (error) {
        console.error('❌ Erreur migration factures:', error);
    }
}

// Migration de l'historique des prix
async function migrerHistoriquePrix() {
    console.log('🔄 Migration de l\'historique des prix...');
    
    try {
        const historiqueData = localStorage.getItem('prixHistorique');
        if (!historiqueData) {
            console.log('❌ Aucun historique de prix trouvé dans localStorage');
            return;
        }

        const historique = JSON.parse(historiqueData);
        console.log(`📊 ${Object.keys(historique).length} entrées d'historique à migrer`);

        for (const [cle, prixData] of Object.entries(historique)) {
            const [fournisseur, designation] = cle.split('|');
            
            // Récupérer l'ID du fournisseur
            const { data: fournisseurData } = await supabase
                .from('fournisseurs')
                .select('id')
                .eq('code_fournisseur', fournisseur)
                .single();

            if (fournisseurData) {
                const { error } = await supabase
                    .from('historique_prix')
                    .insert({
                        fournisseur_id: fournisseurData.id,
                        produit_designation: designation,
                        prix_unitaire: prixData.prix,
                        date_prix: prixData.date || new Date().toISOString().split('T')[0]
                    });

                if (error) {
                    console.error(`❌ Erreur migration historique prix ${cle}:`, error);
                } else {
                    console.log(`✅ Historique prix migré: ${cle}`);
                }
            }
        }
    } catch (error) {
        console.error('❌ Erreur migration historique prix:', error);
    }
}

// =====================================================
// FONCTION PRINCIPALE DE MIGRATION
// =====================================================

async function migrerTout() {
    console.log('🚀 DÉBUT DE LA MIGRATION COMPLÈTE GESTALIS');
    console.log('===========================================');

    try {
        // Vérifier la connexion Supabase
        const { data, error } = await supabase.from('fournisseurs').select('count').limit(1);
        if (error) {
            throw new Error(`Erreur connexion Supabase: ${error.message}`);
        }

        console.log('✅ Connexion Supabase établie');

        // Exécuter les migrations dans l'ordre
        await migrerFournisseurs();
        await migrerChantiers();
        await migrerProduits();
        await migrerFactures();
        await migrerCessions();
        await migrerHistoriquePrix();

        console.log('===========================================');
        console.log('🎉 MIGRATION TERMINÉE AVEC SUCCÈS !');
        console.log('✅ Toutes vos données sont maintenant dans Supabase');
        console.log('🌐 Votre application est prête pour le cloud !');

    } catch (error) {
        console.error('❌ ERREUR CRITIQUE DE MIGRATION:', error);
        console.error('🔧 Vérifiez votre configuration Supabase');
    }
}

// =====================================================
// EXPORT ET UTILISATION
// =====================================================

export { migrerTout };

// Pour utilisation directe dans le navigateur
if (typeof window !== 'undefined') {
    window.migrerTout = migrerTout;
    console.log('🚀 Script de migration chargé !');
    console.log('💡 Utilisez migrerTout() pour lancer la migration');
}
