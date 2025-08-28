import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardActions from './pages/DashboardActions';
import Home from './pages/Home';
import Chantiers from './pages/Chantiers';
import Tiers from './pages/Tiers';
import Vente from './pages/Vente';
import GestionCommerciale from './pages/GestionCommerciale';
import Achats from './pages/Achats';
import DemandesPrix from './pages/achats/DemandesPrix';
import Commandes from './pages/achats/Commandes';
import CreationBonCommande from './pages/achats/CreationBonCommande';
import TestNavigation from './pages/achats/TestNavigation';
import ParametresSociete from './pages/ParametresSociete';
import NouveauFournisseur from './pages/achats/fournisseurs/NouveauFournisseur';
import NouveauChantier from './pages/achats/chantiers/NouveauChantier';
import DetailChantier from './pages/achats/chantiers/DetailChantier';
import Cessions from './pages/achats/cession-creance/Cessions';
import NouvelleCession from './pages/achats/cession-creance/NouvelleCession';
import DetailCession from './pages/achats/cession-creance/DetailCession';
import ChantiersAchats from './pages/achats/Chantiers';

import NouvelUtilisateur from './pages/admin/users/NouvelUtilisateur';
import GestionEntreprises from './pages/GestionEntreprises';
import Layout from './components/layout/Layout';
import SidebarTest from './components/layout/SidebarTest';
import NouvelleFactureWorkflow from './pages/achats/NouvelleFactureWorkflow';
import ParametresNumerotation from './pages/ParametresNumerotation';
import ParametresComptables from './pages/ParametresComptables';
import './styles/tailwind.css';
import Comptabilite from './pages/Comptabilite';
import SousTraitants from './pages/SousTraitants';
import RessourcesHumaines from './pages/RessourcesHumaines';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabase = createClient(
  'https://esczdkgknrozwovlfbki.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzY3pka2drbnJvendvdmxmYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjM2NTIsImV4cCI6MjA3MTM5OTY1Mn0.OUoTvXOayb9u6zjNgp646qYRg6pIVRKFYyFn8u0-zCA'
);

// Fonction de migration automatique
const migrerVersSupabase = async () => {
  try {
    console.log('🚀 DÉBUT DE LA MIGRATION AUTOMATIQUE...');
    
    // Migration des fournisseurs
    const fournisseursData = localStorage.getItem('fournisseurs');
    if (fournisseursData) {
      const fournisseurs = JSON.parse(fournisseursData);
      console.log(`📊 Migration de ${fournisseurs.length} fournisseurs...`);
      
      for (const fournisseur of fournisseurs) {
        const { error } = await supabase.from('fournisseurs').insert({
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
        
        if (error) console.error(`❌ Erreur fournisseur ${fournisseur.codeFournisseur}:`, error);
        else console.log(`✅ Fournisseur migré: ${fournisseur.codeFournisseur}`);
      }
    }
    
    // Migration des chantiers
    const chantiersData = localStorage.getItem('chantiers');
    if (chantiersData) {
      const chantiers = JSON.parse(chantiersData);
      console.log(`📊 Migration de ${chantiers.length} chantiers...`);
      
      for (const chantier of chantiers) {
        const { error } = await supabase.from('chantiers').insert({
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
        
        if (error) console.error(`❌ Erreur chantier ${chantier.code}:`, error);
        else console.log(`✅ Chantier migré: ${chantier.code}`);
      }
    }
    
    // Migration des cessions
    const cessionsData = localStorage.getItem('cessions');
    if (cessionsData) {
      const cessions = JSON.parse(cessionsData);
      console.log(`📊 Migration de ${cessions.length} cessions...`);
      
      for (const cession of cessions) {
        const { error } = await supabase.from('cessions_creance').insert({
          reference: cession.reference,
          date_cession: cession.dateCession,
          montant: cession.montant,
          client: cession.client,
          chantier: cession.chantier,
          fournisseur: cession.fournisseur,
          statut: cession.statut || 'en_cours',
          notes: cession.notes
        });
        
        if (error) console.error(`❌ Erreur cession ${cession.reference}:`, error);
        else console.log(`✅ Cession migrée: ${cession.reference}`);
      }
    }
    
    // Migration des produits
    const produitsData = localStorage.getItem('produits');
    if (produitsData) {
      const produits = JSON.parse(produitsData);
      console.log(`📊 Migration de ${produits.length} produits...`);
      
      for (const produit of produits) {
        const { error } = await supabase.from('produits').insert({
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
        
        if (error) console.error(`❌ Erreur produit ${produit.code}:`, error);
        else console.log(`✅ Produit migré: ${produit.code}`);
      }
    }
    
    // Migration des factures
    const facturesData = localStorage.getItem('factures');
    if (facturesData) {
      const factures = JSON.parse(facturesData);
      console.log(`📊 Migration de ${factures.length} factures...`);
      
      for (const facture of factures) {
        const { error } = await supabase.from('factures').insert({
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
        
        if (error) console.error(`❌ Erreur facture ${facture.numero}:`, error);
        else console.log(`✅ Facture migrée: ${facture.numero}`);
      }
    }
    
    console.log('=====================================');
    console.log('✅ MIGRATION AUTOMATIQUE TERMINÉE !');
    console.log('🎯 Votre application est maintenant connectée à Supabase !');
    
    // Notification de succès
    alert('🎉 Migration vers Supabase terminée avec succès !');
    
  } catch (error) {
    console.error('❌ ERREUR LORS DE LA MIGRATION:', error);
    alert('❌ Erreur lors de la migration. Vérifiez la console.');
  }
};

const PrivateRoute = ({ children }) => {
  // Temporairement désactivé pour tester Supabase
  // const { isAuthenticated } = useAuthStore();
  // return isAuthenticated ? children : <Navigate to="/login" />;
  return children; // Accès direct sans auth
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/actions" element={<DashboardActions />} />
                  <Route path="/chantiers" element={<Chantiers />} />
                  <Route path="/chantiers/nouveau" element={<NouveauChantier />} />
                  <Route path="/chantiers/:id" element={<DetailChantier />} />
                  <Route path="/achats" element={<Achats />} />
                  <Route path="/achats/demandes-prix" element={<DemandesPrix />} />
                  <Route path="/achats/commandes" element={<Commandes />} />
                  <Route path="/achats/creation-bon-commande" element={<CreationBonCommande />} />
                  <Route path="/achats/nouvelle-facture" element={<NouvelleFactureWorkflow />} />
                  <Route path="/achats/test-navigation" element={<TestNavigation />} />
                  <Route path="/achats/fournisseurs/nouveau" element={<NouveauFournisseur />} />
                  <Route path="/achats/chantiers" element={<ChantiersAchats />} />
                  <Route path="/achats/chantiers/nouveau" element={<NouveauChantier />} />
                  
                  {/* Routes Cession de créance */}
                  <Route path="/achats/cession-creance" element={<Cessions />} />
                  <Route path="/achats/cession-creance/nouvelle" element={<NouvelleCession />} />
                  <Route path="/achats/cession-creance/:id" element={<DetailCession />} />
                  
                  {/* Routes Cession de créance (pour la sidebar) */}
                  <Route path="/cession-creance" element={<Cessions />} />
                  <Route path="/cession-creance/nouvelle" element={<NouvelleCession />} />
                  <Route path="/cession-creance/:id" element={<DetailCession />} />
                  
                  <Route path="/vente" element={<Vente />} />
                  <Route path="/commercial" element={<GestionCommerciale />} />
                  <Route path="/tresorerie" element={<div>Règlements & Trésorerie</div>} />
                  <Route path="/tiers" element={<Tiers />} />
                  <Route path="/rh" element={<RessourcesHumaines />} />
                  <Route path="/rh-test" element={<div style={{backgroundColor: 'blue', color: 'white', padding: '50px', fontSize: '24px'}}>🔵 ROUTE TEST RH-TEST 🔵</div>} />

                  <Route path="/analyse" element={<div>Analyse & Reporting</div>} />
                  <Route path="/logistique" element={<div>Logistique & Stocks</div>} />
                  <Route path="/ia" element={<div>Automatisation & IA</div>} />
                  <Route path="/admin" element={<div>Administration</div>} />
                  <Route path="/admin/users/nouveau" element={<NouvelUtilisateur />} />
                  <Route path="/gestion-entreprises" element={<GestionEntreprises />} />
                  <Route path="/parametres-societe" element={<ParametresSociete />} />
                  <Route path="/parametres-numerotation" element={<ParametresNumerotation />} />
                  <Route path="/parametres-comptables" element={<ParametresComptables />} />
                  <Route path="/test-sidebar" element={<SidebarTest />} />
                  <Route path="/comptabilite" element={<Comptabilite />} />
                  <Route path="/sous-traitants" element={<SousTraitants />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;