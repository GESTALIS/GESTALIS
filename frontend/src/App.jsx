import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chantiers from './pages/Chantiers';
import Tiers from './pages/Tiers';
import Vente from './pages/Vente';
import GestionCommerciale from './pages/GestionCommerciale';
import Achats from './pages/Achats';
import DemandesPrix from './pages/achats/DemandesPrix';
import Commandes from './pages/achats/Commandes';
import Layout from './components/layout/Layout';
import './styles/tailwind.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
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
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/chantiers" element={<Chantiers />} />
                  <Route path="/achats" element={<Achats />} />
                  <Route path="/achats/demandes-prix" element={<DemandesPrix />} />
                  <Route path="/achats/commandes" element={<Commandes />} />
                  <Route path="/vente" element={<Vente />} />
                  <Route path="/commercial" element={<GestionCommerciale />} />
                  <Route path="/tresorerie" element={<div>Règlements & Trésorerie</div>} />
                  <Route path="/tiers" element={<Tiers />} />
                  <Route path="/rh" element={<div>Ressources Humaines</div>} />
                  <Route path="/analyse" element={<div>Analyse & Reporting</div>} />
                  <Route path="/logistique" element={<div>Logistique & Stocks</div>} />
                  <Route path="/ia" element={<div>Automatisation & IA</div>} />
                  <Route path="/admin" element={<div>Administration</div>} />
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