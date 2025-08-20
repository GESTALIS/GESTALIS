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
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

// Structure des pôles avec leurs sous-modules (sans numéros)
const poles = [
  {
    id: 'dashboard',
    name: 'Tableau de bord',
    icon: Home,
    color: 'gestalis-primary',
    route: '/',
    isMain: true
  },
  {
    id: 'chantiers',
    name: 'CHANTIERS',
    icon: Building2,
    color: 'gestalis-primary',
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
    color: 'gestalis-secondary',
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
    name: 'ACHAT & FOURNISSEURS',
    icon: ShoppingCart,
    color: 'gestalis-accent',
    route: '/achats',
    subModules: [
      { name: 'Demandes de prix', route: '/achats/demandes-prix' },
      { name: 'Bons de commande', route: '/achats/commandes' },
      { name: 'Factures d\'achat', route: '/achats/factures' },
      { name: 'Réceptions/Livraisons', route: '/achats/receptions' },
      { name: 'Avenants fournisseurs', route: '/achats/avenants' },
      { name: 'Suivi des marges', route: '/achats/marges' }
    ]
  },
  {
    id: 'commercial',
    name: 'GESTION COMMERCIALE',
    icon: TrendingUp,
    color: 'gestalis-tertiary',
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
    color: 'gestalis-primary',
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
    color: 'gestalis-secondary',
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
    color: 'gestalis-accent',
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
    color: 'gestalis-tertiary',
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
    color: 'gestalis-primary',
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
    color: 'gestalis-secondary',
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
    color: 'gestalis-tertiary',
    route: '/admin',
    subModules: [
      { name: 'Paramètres', route: '/admin/parametres' },
      { name: 'Utilisateurs', route: '/admin/utilisateurs' },
      { name: 'Sécurité', route: '/admin/securite' },
      { name: 'Sauvegardes', route: '/admin/sauvegardes' }
    ]
  }
];

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [expandedPoles, setExpandedPoles] = useState(['dashboard']);

  // Nouvelle logique : les sous-modules ne s'affichent que si on est dans le module parent
  const shouldShowSubModules = (pole) => {
    // Sur le dashboard principal, on ne montre pas les sous-modules
    if (location.pathname === '/') {
      return false;
    }
    
    // On montre les sous-modules seulement si on est dans le module parent
    return location.pathname.startsWith(pole.route) && pole.route !== '/';
  };

  const getActiveClass = (color) => {
    switch (color) {
      case 'gestalis-primary':
        return 'bg-gradient-to-r from-gestalis-primary to-gestalis-primary/90 text-white shadow-lg';
      case 'gestalis-secondary':
        return 'bg-gradient-to-r from-gestalis-secondary to-gestalis-secondary/90 text-white shadow-lg';
      case 'gestalis-accent':
        return 'bg-gradient-to-r from-gestalis-accent to-gestalis-accent/90 text-white shadow-lg';
      case 'gestalis-tertiary':
        return 'bg-gradient-to-r from-gestalis-tertiary to-gestalis-tertiary/90 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg';
    }
  };

  const getInactiveClass = (color) => {
    switch (color) {
      case 'gestalis-primary':
        return 'text-gestalis-primary hover:bg-gestalis-primary/10 hover:text-gestalis-primary border-l-2 border-transparent hover:border-gestalis-primary';
      case 'gestalis-secondary':
        return 'text-gestalis-secondary hover:bg-gestalis-secondary/10 hover:text-gestalis-secondary border-l-2 border-transparent hover:border-gestalis-secondary';
      case 'gestalis-accent':
        return 'text-gestalis-accent hover:bg-gestalis-accent/10 hover:text-gestalis-accent border-l-2 border-transparent hover:border-gestalis-accent';
      case 'gestalis-tertiary':
        return 'text-gestalis-tertiary hover:bg-gestalis-tertiary/10 hover:text-gestalis-tertiary border-l-2 border-transparent hover:border-gestalis-tertiary';
      default:
        return 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-l-2 border-transparent hover:border-slate-400';
    }
  };

  const togglePole = (poleId) => {
    setExpandedPoles(prev => 
      prev.includes(poleId) 
        ? prev.filter(id => id !== poleId)
        : [...prev, poleId]
    );
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

    return (
      <div key={pole.id}>
        <button
          onClick={() => pole.subModules ? togglePole(pole.id) : null}
          className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
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
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-3"></div>
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
          {poles.map((pole) => {
            const isActive = isPoleActive(pole);
            const isExpanded = expandedPoles.includes(pole.id);
            const showSubModules = shouldShowSubModules(pole);

            return (
              <div key={pole.id}>
                {/* Élément principal */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive ? getActiveClass(pole.color) : getInactiveClass(pole.color)
                  }`}
                  onClick={() => togglePole(pole.id)}
                >
                  <div className="flex items-center space-x-3">
                    <pole.icon className="w-5 h-5" />
                    <span className="font-medium">{pole.name}</span>
                  </div>
                  {pole.subModules && showSubModules && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      expandedPoles.includes(pole.id) ? 'rotate-180' : ''
                    }`} />
                  )}
                </div>

                {/* Sous-modules */}
                {pole.subModules && expandedPoles.includes(pole.id) && showSubModules && (
                  <div className="ml-8 mt-2 space-y-1">
                    {pole.subModules.map((subModule, index) => (
                      <Link
                        key={index}
                        to={subModule.route}
                        className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                          isSubModuleActive(subModule)
                            ? 'bg-slate-100 text-slate-800 font-medium'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        {subModule.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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