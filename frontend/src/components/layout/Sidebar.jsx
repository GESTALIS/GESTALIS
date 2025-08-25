import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  FileText, 
  ShoppingCart,
  Receipt,
  CreditCard,
  Users,
  TrendingUp,
  Package,
  Brain,
  UserCheck,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  User,
  LogOut,
  Calculator,
  Download,
  FileSpreadsheet,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  History,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { gradients, moduleGradient } from '../../theme/gradients.js';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../ui/GestalisCard';
import { Button } from '../ui/button';
import comptabiliteService from '../../services/comptabiliteService';

// Structure des pôles avec les nouvelles couleurs professionnelles
const poles = [
  {
    id: 'dashboard',
    name: 'TABLEAU DE BORD',
    icon: Home,
    color: gradients.brand,
    route: '/dashboard',
    subModules: [
      { name: 'Vue d\'ensemble', route: '/dashboard' },
      { name: 'Actions rapides', route: '/dashboard/actions' }
    ]
  },
  {
    id: 'chantiers',
    name: 'CHANTIERS',
    icon: Building2,
    color: gradients.ops,
    route: '/chantiers',
    subModules: [
      { name: 'Gestion chantiers', route: '/chantiers' },
      { name: 'Planning & planning', route: '/chantiers/planning' },
      { name: 'Suivi travaux', route: '/chantiers/suivi' },
      { name: 'Contrôle qualité', route: '/chantiers/qualite' },
      { name: 'Sécurité', route: '/chantiers/securite' },
      { name: 'App mobile terrain', route: '/chantiers/mobile' }
    ]
  },
  {
    id: 'vente',
    name: 'VENTE',
    icon: FileText,
    color: gradients.sales,
    route: '/vente',
    subModules: [
      { name: 'Devis', route: '/vente/devis' },
      { name: 'Factures', route: '/vente/factures' },
      { name: 'Suivi commercial', route: '/vente/suivi' },
      { name: 'Relances', route: '/vente/relances' },
      { name: 'Rapports', route: '/vente/rapports' }
    ]
  },
  {
    id: 'achats',
    name: 'ACHAT',
    icon: ShoppingCart,
    color: gradients.ops,
    route: '/achats',
    subModules: [
      { name: 'Vue d\'ensemble', route: '/achats' },
      { name: 'Fournisseurs', route: '/achats?tab=fournisseurs' },
      { name: 'Bons de commande', route: '/achats?tab=commandes' },
      { name: 'Création bon de commande', route: '/achats/creation-bon-commande' },
      { name: 'Demandes de prix', route: '/achats/demandes-prix' },
      { name: 'Factures d\'achat', route: '/achats?tab=factures' },
      { name: 'Analytics', route: '/achats?tab=analytics' }
    ]
  },
  {
    id: 'commercial',
    name: 'GESTION COMMERCIALE',
    icon: TrendingUp,
    color: gradients.sales,
    route: '/commercial',
    subModules: [
      { name: 'Analyse de rentabilité', route: '/commercial/rentabilite' },
      { name: 'Calcul prix de revient', route: '/commercial/prix-revient' },
      { name: 'Tableaux de bord', route: '/commercial/dashboard' },
      { name: 'Équilibre achat/vente', route: '/commercial/equilibre' },
      { name: 'KPI commerciaux', route: '/commercial/kpis' }
    ]
  },
  {
    id: 'tresorerie',
    name: 'RÈGLEMENTS & TRÉSORERIE',
    icon: CreditCard,
    color: gradients.finance,
    route: '/tresorerie',
    subModules: [
      { name: 'Import bancaire', route: '/tresorerie/import' },
      { name: 'Lettrage auto/manuel', route: '/tresorerie/lettrage' },
      { name: 'Gestion trésorerie', route: '/tresorerie/gestion' },
      { name: 'Cash-flow prévisionnel', route: '/tresorerie/cashflow' },
      { name: 'Alertes financières', route: '/tresorerie/alertes' },
      { name: 'Gestion avoirs', route: '/tresorerie/avoirs' }
    ]
  },
  {
    id: 'tiers',
    name: 'TIERS',
    icon: Users,
    color: gradients.sales,
    route: '/tiers',
    subModules: [
      { name: 'Fiches complètes', route: '/tiers/fiches' },
      { name: 'Synthèses financières', route: '/tiers/syntheses' },
      { name: 'Communication intégrée', route: '/tiers/communication' },
      { name: 'Signature électronique', route: '/tiers/signature' },
      { name: 'Historique relationnel', route: '/tiers/historique' },
      { name: 'Gestion avoirs', route: '/tiers/avoirs' }
    ]
  },
  {
    id: 'rh',
    name: 'RESSOURCES HUMAINES',
    icon: UserCheck,
    color: gradients.brand,
    route: '/rh',
    subModules: [
      { name: 'Fiches salariés', route: '/rh/fiches' },
      { name: 'Planning & affectations', route: '/rh/planning' },
      { name: 'Masse salariale', route: '/rh/masse-salariale' },
      { name: 'Gestion véhicules', route: '/rh/vehicules' },
      { name: 'Suivi des heures', route: '/rh/heures' }
    ]
  },
  {
    id: 'analyse',
    name: 'ANALYSE & REPORTING',
    icon: BarChart3,
    color: gradients.finance,
    route: '/analyse',
    subModules: [
      { name: 'KPI personnalisés', route: '/analyse/kpis' },
      { name: 'Tableaux de bord', route: '/analyse/dashboard' },
      { name: 'Rapports automatisés', route: '/analyse/rapports' },
      { name: 'Analyses comparatives', route: '/analyse/comparaisons' },
      { name: 'Notifications push', route: '/analyse/notifications' }
    ]
  },
  {
    id: 'logistique',
    name: 'LOGISTIQUE & STOCKS',
    icon: Package,
    color: gradients.ops,
    route: '/logistique',
    subModules: [
      { name: 'Gestion matériaux', route: '/logistique/materiaux' },
      { name: 'Suivi livraisons', route: '/logistique/livraisons' },
      { name: 'Géolocalisation', route: '/logistique/geolocalisation' },
      { name: 'Gestion entrepôts', route: '/logistique/entrepots' },
      { name: 'App mobile logistique', route: '/logistique/mobile' }
    ]
  },
  {
    id: 'ia',
    name: 'AUTOMATISATION & IA',
    icon: Brain,
    color: gradients.admin,
    route: '/ia',
    subModules: [
      { name: 'OCR documents', route: '/ia/ocr' },
      { name: 'Analyse photos', route: '/ia/photos' },
      { name: 'Prédictions IA', route: '/ia/predictions' },
      { name: 'Optimisations', route: '/ia/optimisations' }
    ]
  },
  {
    id: 'admin',
    name: 'ADMINISTRATION',
    icon: Settings,
    color: gradients.admin,
    route: '/admin',
    subModules: [
      { name: 'Paramètres Société', route: '/admin/parametres-societe' },
      { name: 'Utilisateurs', route: '/admin/utilisateurs' },
      { name: 'Gestion Entreprises', route: '/gestion-entreprises' },
      { name: 'Sécurité', route: '/admin/securite' },
      { name: 'Sauvegardes', route: '/admin/sauvegardes' }
    ]
  },
  {
    id: 'comptabilite',
    name: 'COMPTABILITÉ',
    icon: Calculator,
    color: gradients.finance,
    route: '/comptabilite',
    subModules: [
      { name: 'Gestion comptable', route: '/comptabilite' },
      { name: 'Historique exports', route: '/comptabilite/historique' },
      { name: 'Statistiques', route: '/comptabilite/stats' }
    ]
  }
];

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [expandedPoles, setExpandedPoles] = useState(['dashboard', 'admin']);

  // Logique simplifiée : on montre toujours les sous-modules pour tous les modules
  const shouldShowSubModules = (pole) => {
    // On montre toujours les sous-modules pour tous les modules
    return pole.subModules && pole.subModules.length > 0;
  };

  const getActiveClass = (color) => {
    return `${color} text-white shadow-lg`;
  };

  const getInactiveClass = (color) => {
    return `text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-l-2 border-transparent hover:border-transparent transition-all duration-300`;
  };

  const togglePole = (poleId) => {
    console.log('togglePole appelé avec:', poleId);
    setExpandedPoles(prev => {
      const newExpanded = prev.includes(poleId) 
        ? prev.filter(id => id !== poleId)
        : [...prev, poleId];
      console.log('Nouveaux expandedPoles:', newExpanded);
      return newExpanded;
    });
  };

  const isPoleActive = (pole) => {
    if (pole.isMain) {
      return location.pathname === pole.route;
    }
    return location.pathname.startsWith(pole.route) || 
           pole.subModules?.some(sub => location.pathname.startsWith(sub.route));
  };

  const isSubModuleActive = (subModule) => {
    return location.pathname === subModule.route;
  };

  const renderPoleItem = (pole) => {
    const isActive = isPoleActive(pole);
    const isExpanded = expandedPoles.includes(pole.id);
    const showSubModules = shouldShowSubModules(pole);
    
    console.log('renderPoleItem:', {
      poleId: pole.id,
      poleName: pole.name,
      isActive,
      isExpanded,
      showSubModules,
      expandedPoles
    });

    return (
      <div key={pole.id}>
        <button
          onClick={() => pole.subModules ? togglePole(pole.id) : null}
          className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            isActive
              ? getActiveClass(pole.color)
              : getInactiveClass(pole.color)
          }`}
        >
          <pole.icon className="mr-3 h-5 w-5" />
          <span className="flex-1 text-left">{pole.name}</span>
          {pole.subModules && showSubModules && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        {pole.subModules && isExpanded && showSubModules && (
          <div className="ml-6 mt-1 space-y-1">
            {pole.subModules.map((subModule) => (
              <Link
                key={subModule.route}
                to={subModule.route}
                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                  isSubModuleActive(subModule)
                    ? 'bg-slate-100 text-slate-800 font-medium'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-slate-400 rounded-full mr-3"></div>
                  {subModule.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header moderne */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gestalis-primary to-gestalis-secondary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">GESTALIS</h1>
              <p className="text-xs text-slate-500">ERP BTP</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {poles.map((pole) => renderPoleItem(pole))}
        </nav>

        {/* Footer utilisateur */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gestalis-primary to-gestalis-secondary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">testuser</p>
              <p className="text-xs text-slate-500">viewer</p>
            </div>
            <button
              onClick={() => {/* Logout logic */}}
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;