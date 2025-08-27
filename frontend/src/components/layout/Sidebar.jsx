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
  ArrowRight,
  Target,
  ClipboardList,
  Database
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../ui/GestalisCard';
import { Button } from '../ui/button';
import comptabiliteService from '../../services/comptabiliteService';

// Structure des pôles avec la palette GESTALIS unifiée
const poles = [
  {
    id: 'dashboard',
    name: 'TABLEAU DE BORD',
    icon: Home,
    color: 'gestalis-gray',
    bgColor: 'bg-[#9CA3AF]',
    hoverColor: 'hover:bg-[#6B7280]',
    route: '/dashboard',
    subModules: [
      { name: 'Vue d\'ensemble', route: '/dashboard' },
      { name: 'Actions rapides', route: '/dashboard/actions' }
    ]
  },
  {
    id: 'etude-prix',
    name: 'ÉTUDE DE PRIX',
    icon: Calculator,
    color: 'gestalis-accent-green',
    bgColor: 'bg-[#4CAF50]',
    hoverColor: 'hover:bg-[#3C7DD9]',
    route: '/etude-prix',
    subModules: [
      { name: 'Nouvelle étude', route: '/etude-prix/nouvelle' },
      { name: 'Études en cours', route: '/etude-prix/encours' },
      { name: 'Historique', route: '/etude-prix/historique' },
      { name: 'Modèles', route: '/etude-prix/modeles' }
    ]
  },
  {
    id: 'vente',
    name: 'VENTE',
    icon: FileText,
    color: 'gestalis-accent-green',
    bgColor: 'bg-[#4CAF50]',
    hoverColor: 'hover:bg-[#3C7DD9]',
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
    id: 'chantiers',
    name: 'CHANTIERS',
    icon: Building2,
    color: 'gestalis-accent-green',
    bgColor: 'bg-[#4CAF50]',
    hoverColor: 'hover:bg-[#3C7DD9]',
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
    id: 'achats',
    name: 'ACHAT',
    icon: ShoppingCart,
    color: 'gestalis-primary-light',
    bgColor: 'bg-[#3C7DD9]',
    hoverColor: 'hover:bg-[#1B275A]',
    route: '/achats',
    subModules: [
      { name: 'Vue d\'ensemble', route: '/achats' },
      { name: 'Fournisseurs', route: '/achats?tab=fournisseurs' },
      { name: 'Demandes de prix', route: '/achats/demandes-prix' },
      { name: 'Bons de commande', route: '/achats?tab=commandes' },
      { name: 'Factures', route: '/achats?tab=factures' },
      { name: 'Analytics', route: '/achats?tab=analytics' }
    ]
  },
  {
    id: 'cession-creance',
    name: 'CESSION DE CRÉANCE',
    icon: FileSpreadsheet,
    color: 'gestalis-primary-light',
    bgColor: 'bg-[#3C7DD9]',
    hoverColor: 'hover:bg-[#1B275A]',
    route: '/cession-creance',
    subModules: [
      { name: 'Nouvelle cession', route: '/cession-creance/nouvelle' },
      { name: 'Cessions en cours', route: '/cession-creance/encours' },
      { name: 'Historique', route: '/cession-creance/historique' },
      { name: 'Rapports', route: '/cession-creance/rapports' }
    ]
  },
  {
    id: 'sous-traitant',
    name: 'SOUS-TRAITANT',
    icon: Users,
    color: 'gestalis-primary-light',
    bgColor: 'bg-[#3C7DD9]',
    hoverColor: 'hover:bg-[#1B275A]',
    route: '/sous-traitants',
    subModules: [
      { name: 'Vue d\'ensemble', route: '/sous-traitants' },
      { name: 'Sous-traitants', route: '/sous-traitants?tab=sous-traitants' },
      { name: 'Contrats', route: '/sous-traitants?tab=contrats' },
      { name: 'Situations', route: '/sous-traitants?tab=situations' },
      { name: 'Demandes de prix', route: '/sous-traitants?tab=demandes-prix' },
      { name: 'Analytics', route: '/sous-traitants?tab=analytics' }
    ]
  },
  {
    id: 'tresorerie',
    name: 'TRÉSORERIE',
    icon: CreditCard,
    color: 'gestalis-accent-orange',
    bgColor: 'bg-[#F8A23B]',
    hoverColor: 'hover:bg-[#E63946]',
    route: '/tresorerie',
    subModules: [
      { name: 'Comptes bancaires', route: '/tresorerie/comptes' },
      { name: 'Mouvements', route: '/tresorerie/mouvements' },
      { name: 'Prévisions', route: '/tresorerie/previsions' },
      { name: 'Rapprochements', route: '/tresorerie/rapprochements' }
    ]
  },
  {
    id: 'logistique',
    name: 'LOGISTIQUE',
    icon: Package,
    color: 'gestalis-accent-orange',
    bgColor: 'bg-[#F8A23B]',
    hoverColor: 'hover:bg-[#E63946]',
    route: '/logistique',
    subModules: [
      { name: 'Stock', route: '/logistique/stock' },
      { name: 'Entrées', route: '/logistique/entrees' },
      { name: 'Sorties', route: '/logistique/sorties' },
      { name: 'Inventaires', route: '/logistique/inventaires' },
      { name: 'Transports', route: '/logistique/transports' }
    ]
  },
  {
    id: 'rh',
    name: 'RESSOURCES HUMAINES',
    icon: UserCheck,
    color: 'gestalis-accent-orange',
    bgColor: 'bg-[#F8A23B]',
    hoverColor: 'hover:bg-[#E63946]',
    route: '/rh',
    subModules: [
      { name: 'Employés', route: '/rh/employes' },
      { name: 'Congés', route: '/rh/conges' },
      { name: 'Formations', route: '/rh/formations' },
      { name: 'Paie', route: '/rh/paie' },
      { name: 'Planning', route: '/rh/planning' }
    ]
  },
  {
    id: 'analyse',
    name: 'ANALYSE & RAPPORTS',
    icon: BarChart3,
    color: 'gestalis-accent-orange',
    bgColor: 'bg-[#F8A23B]',
    hoverColor: 'hover:bg-[#E63946]',
    route: '/analyse',
    subModules: [
      { name: 'Tableaux de bord', route: '/analyse/dashboards' },
      { name: 'Rapports', route: '/analyse/rapports' },
      { name: 'Indicateurs', route: '/analyse/indicateurs' },
      { name: 'Exports', route: '/analyse/exports' }
    ]
  },
  {
    id: 'ia',
    name: 'INTELLIGENCE ARTIFICIELLE',
    icon: Brain,
    color: 'gestalis-accent-orange',
    bgColor: 'bg-[#F8A23B]',
    hoverColor: 'hover:bg-[#E63946]',
    route: '/ia',
    subModules: [
      { name: 'Prédictions', route: '/ia/predictions' },
      { name: 'Analyse avancée', route: '/ia/analyse' },
      { name: 'Recommandations', route: '/ia/recommandations' }
    ]
  },
  {
    id: 'comptabilite',
    name: 'COMPTABILITÉ',
    icon: Database,
    color: 'gestalis-accent-orange',
    bgColor: 'bg-[#F8A23B]',
    hoverColor: 'hover:bg-[#E63946]',
    route: '/comptabilite',
    subModules: [
      { name: 'Vue d\'ensemble', route: '/comptabilite' },
      { name: 'Plan comptable', route: '/comptabilite?tab=plan-comptable' },
      { name: 'Journaux', route: '/comptabilite?tab=journaux' },
      { name: 'Factures à intégrer', route: '/comptabilite?tab=factures' },
      { name: 'Export comptable', route: '/comptabilite?tab=export' },
      { name: 'Contrôles', route: '/comptabilite?tab=controles' },
      { name: 'Rapports', route: '/comptabilite?tab=rapports' }
    ]
  },
  {
    id: 'admin',
    name: 'ADMINISTRATION',
    icon: Settings,
    color: 'gestalis-accent-red',
    bgColor: 'bg-[#E63946]',
    hoverColor: 'hover:bg-[#1B275A]',
    route: '/admin',
    subModules: [
      { name: 'Paramètres Société', route: '/admin/parametres-societe' },
      { name: 'Utilisateurs', route: '/admin/utilisateurs' },
      { name: 'Gestion Entreprises', route: '/gestion-entreprises' },
      { name: 'Sécurité', route: '/admin/securite' },
      { name: 'Sauvegardes', route: '/admin/sauvegardes' }
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

  const getActiveClass = (pole) => {
    // Pour le TABLEAU DE BORD, on utilise le dégradé de la barre latérale
    if (pole.id === 'dashboard') {
      return `bg-gradient-to-b from-[#1B275A] to-[#3C7DD9] text-white shadow-lg transform scale-105`;
    }
    // Pour les modules gris, on utilise un dégradé gris → gris clair quand actif
    else if (pole.bgColor.includes('9CA3AF') || pole.bgColor.includes('6B7280')) {
      return `bg-gradient-to-r from-[#6B7280] to-[#9CA3AF] text-white shadow-lg transform scale-105`;
    }
    // Pour les modules verts, on utilise un dégradé vert → vert clair
    else if (pole.bgColor.includes('4CAF50')) {
      return `bg-gradient-to-r from-[#4CAF50] to-[#6EE7B7] text-white shadow-lg transform scale-105`;
    }
    // Pour les modules bleus, on utilise le même dégradé que "Nouveau chantier"
    else if (pole.bgColor.includes('3C7DD9')) {
      return `bg-gradient-to-r from-[#1B275A] to-[#06B6D4] text-white shadow-lg transform scale-105`;
    }
    // Pour les modules orange, on utilise un dégradé orange → orange clair
    else if (pole.bgColor.includes('F8A23B')) {
      return `bg-gradient-to-r from-[#F8A23B] to-[#FCD34D] text-white shadow-lg transform scale-105`;
    }
    // Pour les modules rouges, on utilise un dégradé rouge → rouge clair
    else if (pole.bgColor.includes('E63946')) {
      return `bg-gradient-to-r from-[#E63946] to-[#F87171] text-white shadow-lg transform scale-105`;
    }
    // Pour les autres modules, on garde leur couleur normale
    return `${pole.bgColor} text-white shadow-lg transform scale-105`;
  };

  const getInactiveClass = (pole) => {
    return `text-white hover:${pole.hoverColor} hover:text-white border-l-4 border-transparent hover:border-white transition-all duration-300 hover:shadow-lg hover:scale-105`;
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
      <div key={pole.id} className="mb-2">
        <button
          onClick={() => pole.subModules ? togglePole(pole.id) : null}
          className={`w-full group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
            isActive
              ? getActiveClass(pole)
              : getInactiveClass(pole)
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
            isActive ? 'bg-white/20' : `${pole.bgColor}`
          }`}>
            <pole.icon className="h-5 w-5" />
          </div>
          <span className="flex-1 text-left">{pole.name}</span>
          {pole.subModules && showSubModules && (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isActive ? 'bg-white/20' : 'bg-white/10'
            }`}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          )}
        </button>
        
        {pole.subModules && isExpanded && showSubModules && (
          <div className="ml-8 mt-2 space-y-1 animate-fadeIn">
            {pole.subModules.map((subModule) => (
              <Link
                key={subModule.route}
                to={subModule.route}
                className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isSubModuleActive(subModule)
                    ? `${pole.bgColor} text-white font-medium shadow-md`
                    : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-sm'
                }`}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    isSubModuleActive(subModule) ? 'bg-white' : pole.bgColor
                  }`}></div>
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
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1B275A] transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header moderne avec dégradé signature GESTALIS */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">GESTALIS</h1>
                <p className="text-xs text-blue-100">ERP BTP</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation principale avec scroll personnalisé */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {poles.map((pole) => renderPoleItem(pole))}
        </nav>

        {/* Footer utilisateur avec style GESTALIS */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 shadow-sm border border-white/20">
            <div className="w-10 h-10 bg-[#3C7DD9] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">testuser</p>
              <p className="text-xs text-white/70">viewer</p>
            </div>
            <button
              onClick={() => {/* Logout logic */}}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;