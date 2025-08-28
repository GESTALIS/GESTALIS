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