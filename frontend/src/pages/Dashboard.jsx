import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  ShoppingCart, 
  Receipt, 
  CreditCard, 
  Users,
  TrendingUp,
  Package,
  Brain,
  Plus,
  Eye,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Truck,
  UserCheck,
  BarChart3,
  Settings,
  Smartphone,
  Database,
  ArrowRight,
  User
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [selectedPole, setSelectedPole] = useState(null);
  const navigate = useNavigate();

  // KPIs globaux améliorés
  const globalKPIs = [
    {
      title: 'Chantiers actifs',
      value: '8',
      change: '+2',
      icon: Building2,
      color: 'gestalis-primary',
      trend: 'up',
      description: 'En cours de réalisation',
      bgColor: 'from-gestalis-primary to-gestalis-primary'
    },
    {
      title: 'CA mensuel',
      value: '€450K',
      change: '+12%',
      icon: DollarSign,
      color: 'gestalis-secondary',
      trend: 'up',
      description: 'Chiffre d\'affaires',
      bgColor: 'from-gestalis-secondary to-gestalis-secondary'
    },
    {
      title: 'Équipes terrain',
      value: '45',
      change: '+3',
      icon: Users,
      color: 'gestalis-accent',
      trend: 'up',
      description: 'Salariés actifs',
      bgColor: 'from-gestalis-accent to-gestalis-accent'
    },
    {
      title: 'Trésorerie',
      value: '€125K',
      change: '-5%',
      icon: CreditCard,
      color: 'gestalis-tertiary',
      trend: 'down',
      description: 'Disponible',
      bgColor: 'from-gestalis-tertiary to-gestalis-tertiary'
    }
  ];

  // Définition des modules (simplifiés et modernes)
  const modules = [
    {
      id: 'chantiers',
      name: 'CHANTIERS',
      icon: Building2,
      color: 'gestalis-primary-dark',
      description: 'Gestion complète des chantiers',
      metrics: {
        active: '8 chantiers',
        progress: '75%'
      },
      route: '/chantiers'
    },
    {
      id: 'vente',
      name: 'VENTE',
      icon: FileText,
      color: 'gestalis-secondary-dark',
      description: 'Gestion des devis, factures et suivi commercial',
      metrics: {
        devis: '2 en cours',
        factures: '€23.5K'
      },
      route: '/vente'
    },
    {
      id: 'achats',
      name: 'ACHAT & FOURNISSEURS',
      icon: ShoppingCart,
      color: 'gestalis-accent-dark',
      description: 'Gestion des achats et fournisseurs',
      metrics: {
        commandes: '12 en cours',
        fournisseurs: '18 actifs'
      },
      route: '/achats'
    },
    {
      id: 'commercial',
      name: 'GESTION COMMERCIALE',
      icon: TrendingUp,
      color: 'gestalis-tertiary-dark',
      description: 'Analyse commerciale et marges',
      metrics: {
        rentabilite: '18%',
        marges: '+5%'
      },
      route: '/commercial'
    },
    {
      id: 'tresorerie',
      name: 'RÈGLEMENTS & TRÉSORERIE',
      icon: CreditCard,
      color: 'gestalis-quaternary-dark',
      description: 'Gestion financière et trésorerie',
      metrics: {
        comptes: '3 comptes',
        flux: '€125K'
      },
      route: '/tresorerie'
    },
    {
      id: 'tiers',
      name: 'TIERS',
      icon: Users,
      color: 'gestalis-quinary-dark',
      description: 'Gestion des relations commerciales et administratives',
      metrics: {
        clients: '25 actifs',
        fournisseurs: '18 actifs'
      },
      route: '/tiers'
    },
    {
      id: 'rh',
      name: 'RESSOURCES HUMAINES',
      icon: User,
      color: 'gestalis-senary-dark',
      description: 'Gestion des équipes et planning',
      metrics: {
        equipes: '45 personnes',
        chantiers: '8 actifs'
      },
      route: '/rh'
    },
    {
      id: 'analyse',
      name: 'ANALYSE & REPORTING',
      icon: BarChart3,
      color: 'gestalis-septenary-dark',
      description: 'KPI et tableaux de bord',
      metrics: {
        kpis: '12 indicateurs',
        rapports: '5 actifs'
      },
      route: '/analyse'
    }
  ];

  // Alertes récentes
  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Chantier Rue de la Paix',
      message: 'Retard de 3 jours détecté',
      time: 'Il y a 2h',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'success',
      title: 'Facture FA-001234',
      message: 'Paiement reçu',
      time: 'Il y a 4h',
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'info',
      title: 'Livraison matériaux',
      message: 'En route vers chantier',
      time: 'Il y a 6h',
      icon: Truck
    }
  ];

  // Activités récentes simplifiées
  const recentActivities = [
    {
      id: 1,
      type: 'success',
      title: 'Nouveau chantier créé',
      time: 'Rue de la Paix - 2h'
    },
    {
      id: 2,
      type: 'info',
      title: 'Facture envoyée',
      time: 'FA-001234 - 4h'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Livraison en cours',
      time: 'Matériaux chantier - 6h'
    }
  ];

  // Alertes importantes simplifiées
  const alerts = [
    {
      id: 1,
      priority: 'warning',
      title: 'Chantier Rue de la Paix',
      description: 'Retard de 3 jours détecté'
    },
    {
      id: 2,
      priority: 'success',
      title: 'Facture FA-001234',
      description: 'Paiement reçu'
    },
    {
      id: 3,
      priority: 'info',
      title: 'Livraison matériaux',
      description: 'En route vers chantier'
    }
  ];

  const getAlertColor = (type) => {
    const colors = {
      warning: 'bg-yellow-500 text-white',
      success: 'bg-green-500 text-white',
      info: 'bg-blue-500 text-white',
      error: 'bg-red-500 text-white'
    };
    return colors[type] || colors.info;
  };

  const getModuleColor = (color) => {
    switch (color) {
      case 'gestalis-primary-dark':
        return 'bg-gradient-to-br from-gestalis-primary-dark/20 to-gestalis-primary-dark/10 border-gestalis-primary-dark/30 hover:from-gestalis-primary-dark/30 hover:to-gestalis-primary-dark/20';
      case 'gestalis-secondary-dark':
        return 'bg-gradient-to-br from-gestalis-secondary-dark/20 to-gestalis-secondary-dark/10 border-gestalis-secondary-dark/30 hover:from-gestalis-secondary-dark/30 hover:to-gestalis-secondary-dark/20';
      case 'gestalis-accent-dark':
        return 'bg-gradient-to-br from-gestalis-accent-dark/20 to-gestalis-accent-dark/10 border-gestalis-accent-dark/30 hover:from-gestalis-accent-dark/30 hover:to-gestalis-accent-dark/20';
      case 'gestalis-tertiary-dark':
        return 'bg-gradient-to-br from-gestalis-tertiary-dark/20 to-gestalis-tertiary-dark/10 border-gestalis-tertiary-dark/30 hover:from-gestalis-tertiary-dark/30 hover:to-gestalis-tertiary-dark/20';
      case 'gestalis-quaternary-dark':
        return 'bg-gradient-to-br from-gestalis-quaternary-dark/20 to-gestalis-quaternary-dark/10 border-gestalis-quaternary-dark/30 hover:from-gestalis-quaternary-dark/30 hover:to-gestalis-quaternary-dark/20';
      case 'gestalis-quinary-dark':
        return 'bg-gradient-to-br from-gestalis-quinary-dark/20 to-gestalis-quinary-dark/10 border-gestalis-quinary-dark/30 hover:from-gestalis-quinary-dark/30 hover:to-gestalis-quinary-dark/20';
      case 'gestalis-senary-dark':
        return 'bg-gradient-to-br from-gestalis-senary-dark/20 to-gestalis-senary-dark/10 border-gestalis-senary-dark/30 hover:from-gestalis-senary-dark/30 hover:to-gestalis-senary-dark/20';
      case 'gestalis-septenary-dark':
        return 'bg-gradient-to-br from-gestalis-septenary-dark/20 to-gestalis-septenary-dark/10 border-gestalis-septenary-dark/30 hover:from-gestalis-septenary-dark/30 hover:to-gestalis-septenary-dark/20';
      default:
        return 'bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 hover:from-slate-200 hover:to-slate-100';
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case 'gestalis-primary-dark':
        return 'bg-gradient-to-br from-gestalis-primary-dark to-gestalis-primary-dark/90';
      case 'gestalis-secondary-dark':
        return 'bg-gradient-to-br from-gestalis-secondary-dark to-gestalis-secondary-dark/90';
      case 'gestalis-accent-dark':
        return 'bg-gradient-to-br from-gestalis-accent-dark to-gestalis-accent-dark/90';
      case 'gestalis-tertiary-dark':
        return 'bg-gradient-to-br from-gestalis-tertiary-dark to-gestalis-tertiary-dark/90';
      case 'gestalis-quaternary-dark':
        return 'bg-gradient-to-br from-gestalis-quaternary-dark to-gestalis-quaternary-dark/90';
      case 'gestalis-quinary-dark':
        return 'bg-gradient-to-br from-gestalis-quinary-dark to-gestalis-quinary-dark/90';
      case 'gestalis-senary-dark':
        return 'bg-gradient-to-br from-gestalis-senary-dark to-gestalis-senary-dark/90';
      case 'gestalis-septenary-dark':
        return 'bg-gradient-to-br from-gestalis-septenary-dark to-gestalis-septenary-dark/90';
      default:
        return 'bg-gradient-to-br from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6 space-y-6">
        {/* Header moderne */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Tableau de bord</h1>
            <p className="text-slate-600 mt-1">Vue d'ensemble de vos activités</p>
          </div>
          <div className="flex gap-3">
            <GestalisButton variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </GestalisButton>
            <GestalisButton size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau chantier
            </GestalisButton>
          </div>
        </div>

        {/* KPIs simplifiés avec effets de survol */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {globalKPIs.map((kpi) => (
            <GestalisCard key={kpi.title} variant="default" className="p-6 group hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors duration-300">{kpi.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1 group-hover:text-slate-900 transition-colors duration-300">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${kpi.bgColor} group-hover:shadow-lg transition-shadow duration-300`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </GestalisCard>
          ))}
        </div>

        {/* Modules avec couleurs d'arrière-plan et effets de survol */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => (
            <GestalisCard 
              key={module.id} 
              variant="default" 
              className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border ${getModuleColor(module.color)}`}
              onClick={() => navigate(module.route)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getIconColor(module.color)} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-300" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-300">{module.name}</h3>
                <p className="text-sm text-slate-600 mb-4 group-hover:text-slate-700 transition-colors duration-300">{module.description}</p>
                
                <div className="space-y-2">
                  {Object.entries(module.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-500 capitalize">{key}:</span>
                      <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GestalisCard>
          ))}
        </div>

        {/* Activités récentes simplifiées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GestalisCard variant="default">
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-slate-600" />
                Activités récentes
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getAlertColor(activity.type)}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GestalisCardContent>
          </GestalisCard>

          <GestalisCard variant="default">
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-slate-600" />
                Alertes importantes
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getAlertColor(alert.priority)}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                      <p className="text-xs text-slate-500">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GestalisCardContent>
          </GestalisCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 