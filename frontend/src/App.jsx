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
import NouvelUtilisateur from './pages/admin/users/NouvelUtilisateur';
import GestionEntreprises from './pages/GestionEntreprises';
import Layout from './components/layout/Layout';
import SidebarTest from './components/layout/SidebarTest';
import NouvelleFacture from './pages/achats/NouvelleFacture';
import './styles/tailwind.css';

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
                  <Route path="/achats" element={<Achats />} />
                  <Route path="/achats/demandes-prix" element={<DemandesPrix />} />
                  <Route path="/achats/commandes" element={<Commandes />} />
                  <Route path="/achats/creation-bon-commande" element={<CreationBonCommande />} />
                  <Route path="/achats/nouvelle-facture" element={<NouvelleFacture />} />
                  <Route path="/achats/test-navigation" element={<TestNavigation />} />
                  <Route path="/achats/fournisseurs/nouveau" element={<NouveauFournisseur />} />
                  <Route path="/achats/chantiers/nouveau" element={<NouveauChantier />} />
                  <Route path="/vente" element={<Vente />} />
                  <Route path="/commercial" element={<GestionCommerciale />} />
                  <Route path="/tresorerie" element={<div>Règlements & Trésorerie</div>} />
                  <Route path="/tiers" element={<Tiers />} />
                  <Route path="/rh" element={<div>Ressources Humaines</div>} />
                  <Route path="/analyse" element={<div>Analyse & Reporting</div>} />
                  <Route path="/logistique" element={<div>Logistique & Stocks</div>} />
                  <Route path="/ia" element={<div>Automatisation & IA</div>} />
                  <Route path="/admin" element={<div>Administration</div>} />
                  <Route path="/admin/users/nouveau" element={<NouvelUtilisateur />} />
                  <Route path="/gestion-entreprises" element={<GestionEntreprises />} />
                  <Route path="/parametres-societe" element={<ParametresSociete />} />
                  <Route path="/test-sidebar" element={<SidebarTest />} />
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