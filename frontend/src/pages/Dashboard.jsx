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
  User,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [selectedPole, setSelectedPole] = useState(null);
  const navigate = useNavigate();

  // KPIs globaux modernisés avec design premium
  const globalKPIs = [
    {
      title: 'Chantiers actifs',
      value: '8',
      change: '+2',
      icon: Building2,
      color: 'gestalis-primary',
      trend: 'up',
      description: 'En cours de réalisation',
      bgGradient: 'from-gestalis-primary via-gestalis-primary-light to-gestalis-primary-dark',
      accentColor: 'text-gestalis-primary'
    },
    {
      title: 'CA mensuel',
      value: '€450K',
      change: '+12%',
      icon: DollarSign,
      color: 'gestalis-secondary',
      trend: 'up',
      description: 'Chiffre d\'affaires',
      bgGradient: 'from-gestalis-secondary via-gestalis-secondary-light to-gestalis-secondary-dark',
      accentColor: 'text-gestalis-secondary'
    },
    {
      title: 'Équipes terrain',
      value: '45',
      change: '+3',
      icon: Users,
      color: 'gestalis-accent',
      trend: 'up',
      description: 'Salariés actifs',
      bgGradient: 'from-gestalis-accent via-gestalis-accent-light to-gestalis-accent-dark',
      accentColor: 'text-gestalis-accent'
    },
    {
      title: 'Trésorerie',
      value: '€125K',
      change: '-5%',
      icon: CreditCard,
      color: 'gestalis-tertiary',
      trend: 'down',
      description: 'Disponible',
      bgGradient: 'from-gestalis-tertiary via-gestalis-tertiary-light to-gestalis-tertiary-dark',
      accentColor: 'text-gestalis-tertiary'
    }
  ];

  // Définition des modules avec design moderne et métriques enrichies
  const modules = [
    {
      id: 'chantiers',
      name: 'CHANTIERS',
      icon: Building2,
      color: 'gestalis-primary',
      description: 'Gestion complète des chantiers et planning',
      metrics: {
        active: '8 chantiers',
        progress: '75%',
        status: 'En cours'
      },
      route: '/chantiers',
      priority: 'high',
      bgGradient: 'from-gestalis-primary/10 via-gestalis-primary/5 to-transparent',
      borderColor: 'border-gestalis-primary/20'
    },
    {
      id: 'vente',
      name: 'VENTE',
      icon: FileText,
      color: 'gestalis-secondary',
      description: 'Gestion des devis, factures et suivi commercial',
      metrics: {
        devis: '2 en cours',
        factures: '€23.5K',
        status: 'Actif'
      },
      route: '/vente',
      priority: 'high',
      bgGradient: 'from-gestalis-secondary/10 via-gestalis-secondary/5 to-transparent',
      borderColor: 'border-gestalis-secondary/20'
    },
    {
      id: 'achats',
      name: 'ACHAT',
      icon: ShoppingCart,
      color: 'blue-teal',
      description: 'Gestion des achats et fournisseurs',
      metrics: {
        commandes: '12 en cours',
        fournisseurs: '18 actifs',
        status: 'En cours'
      },
      route: '/achats',
      priority: 'medium',
      bgGradient: 'from-blue-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'commercial',
      name: 'GESTION COMMERCIALE',
      icon: TrendingUp,
      color: 'gestalis-tertiary',
      description: 'Analyse commerciale et marges',
      metrics: {
        rentabilite: '18%',
        marges: '+5%',
        status: 'Excellent'
      },
      route: '/commercial',
      priority: 'medium',
      bgGradient: 'from-gestalis-tertiary/10 via-gestalis-tertiary/5 to-transparent',
      borderColor: 'border-gestalis-tertiary/20'
    },
    {
      id: 'tresorerie',
      name: 'RÈGLEMENTS & TRÉSORERIE',
      icon: CreditCard,
      color: 'gestalis-quaternary',
      description: 'Gestion financière et trésorerie',
      metrics: {
        comptes: '3 comptes',
        flux: '€125K',
        status: 'Stable'
      },
      route: '/tresorerie',
      priority: 'medium',
      bgGradient: 'from-gestalis-quaternary/10 via-gestalis-quaternary/5 to-transparent',
      borderColor: 'border-gestalis-quaternary/20'
    },
    {
      id: 'tiers',
      name: 'TIERS',
      icon: Users,
      color: 'gestalis-quinary',
      description: 'Gestion des relations commerciales et administratives',
      metrics: {
        clients: '25 actifs',
        fournisseurs: '18 actifs',
        status: 'Actif'
      },
      route: '/tiers',
      priority: 'high',
      bgGradient: 'from-gestalis-quinary/10 via-gestalis-quinary/5 to-transparent',
      borderColor: 'border-gestalis-quinary/20'
    },
    {
      id: 'rh',
      name: 'RESSOURCES HUMAINES',
      icon: User,
      color: 'gestalis-senary',
      description: 'Gestion des équipes et planning',
      metrics: {
        equipes: '45 personnes',
        chantiers: '8 actifs',
        status: 'En cours'
      },
      route: '/rh',
      priority: 'medium',
      bgGradient: 'from-gestalis-senary/10 via-gestalis-senary/5 to-transparent',
      borderColor: 'border-gestalis-senary/20'
    },
    {
      id: 'analyse',
      name: 'ANALYSE & REPORTING',
      icon: BarChart3,
      color: 'gestalis-septenary',
      description: 'KPI et tableaux de bord',
      metrics: {
        kpis: '12 indicateurs',
        rapports: '5 actifs',
        status: 'Actif'
      },
      route: '/analyse',
      priority: 'low',
      bgGradient: 'from-gestalis-septenary/10 via-gestalis-septenary/5 to-transparent',
      borderColor: 'border-gestalis-septenary/20'
    }
  ];

  // Alertes récentes modernisées
  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Chantier Rue de la Paix',
      message: 'Retard de 3 jours détecté',
      time: 'Il y a 2h',
      icon: AlertTriangle,
      priority: 'high'
    },
    {
      id: 2,
      type: 'success',
      title: 'Facture FA-001234',
      message: 'Paiement reçu',
      time: 'Il y a 4h',
      icon: CheckCircle,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'Nouveau fournisseur',
      message: 'BTP Matériaux Plus ajouté',
      time: 'Il y a 6h',
      icon: Plus,
      priority: 'low'
    }
  ];

  // Activités récentes enrichies
  const recentActivities = [
    {
      id: 1,
      type: 'chantier',
      title: 'Chantier Rue de la Paix',
      description: 'Fondations terminées',
      progress: 75,
      time: 'Il y a 1h',
      icon: Building2,
      color: 'gestalis-primary'
    },
    {
      id: 2,
      type: 'facture',
      title: 'Facture FA-001234',
      description: 'Paiement reçu',
      amount: '€18,500',
      time: 'Il y a 4h',
      icon: Receipt,
      color: 'gestalis-secondary'
    },
    {
      id: 3,
      type: 'achat',
      title: 'Commande BC-001',
      description: 'Matériaux livrés',
      supplier: 'BTP Matériaux Plus',
      time: 'Il y a 6h',
      icon: ShoppingCart,
      color: 'gestalis-accent'
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[priority] || colors.low;
  };

  const getAlertIcon = (type) => {
    const icons = {
      warning: AlertTriangle,
      success: CheckCircle,
      info: Plus,
      error: AlertTriangle
    };
    return icons[type] || Plus;
  };

  const getActivityIcon = (type) => {
    const icons = {
      chantier: Building2,
      facture: Receipt,
      achat: ShoppingCart,
      default: FileText
    };
    return icons[type] || icons.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header moderne avec espacement généreux */}
      <div className="px-8 py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-gestalis-primary to-gestalis-secondary rounded-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
          <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gestalis-primary to-gestalis-secondary bg-clip-text text-transparent">
                    Tableau de bord
                  </h1>
                  <p className="text-xl text-gray-600 mt-2">
                    Vue d'ensemble de votre activité GESTALIS
                  </p>
                </div>
              </div>
          </div>
            
            <div className="flex items-center gap-4">
              <GestalisButton variant="outline" className="flex items-center gap-2 px-6 py-3">
                <Settings className="h-5 w-5" />
              Paramètres
            </GestalisButton>
              <GestalisButton className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gestalis-primary to-gestalis-secondary">
                <Plus className="h-5 w-5" />
                Nouveau projet
            </GestalisButton>
          </div>
          </div>
        </div>
      </div>

      {/* Contenu principal avec espacement moderne */}
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-16">
        
        {/* KPIs globaux avec design premium */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h2>
            <p className="text-lg text-gray-600">Indicateurs clés de performance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {globalKPIs.map((kpi, index) => {
              const IconComponent = kpi.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  {/* Fond avec gradient subtil */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgGradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative p-8 space-y-6">
                    {/* Icône avec fond coloré */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${kpi.bgGradient} shadow-lg`}>
                      <IconComponent className={`h-8 w-8 text-white`} />
        </div>

                    {/* Contenu */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        {kpi.title}
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-gray-900">
                          {kpi.value}
                        </span>
                        <span className={`text-lg font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                  </div>
                      <p className="text-sm text-gray-500">
                        {kpi.description}
                      </p>
                </div>
                </div>
              </div>
              );
            })}
          </div>
        </section>

        {/* Modules avec design moderne et espacement généreux */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Modules GESTALIS</h2>
            <p className="text-lg text-gray-600">Accédez à toutes vos fonctionnalités</p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Link
              key={module.id} 
                  to={module.route}
                  className="group block"
                >
                  <div className={`relative overflow-hidden rounded-3xl bg-white border-2 ${module.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer`}>
                    {/* Fond avec gradient subtil */}
                    <div className={`absolute inset-0 ${module.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative p-8 space-y-6">
                      {/* En-tête du module */}
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-${module.color} to-${module.color}-dark shadow-lg`}>
                          <IconComponent className="h-8 w-8 text-white" />
                  </div>
                        {module.priority === 'high' && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            Priorité
                          </span>
                        )}
                </div>
                
                      {/* Contenu du module */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-gestalis-primary transition-colors duration-300">
                          {module.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {module.description}
                        </p>
                        
                        {/* Métriques */}
                <div className="space-y-2">
                  {Object.entries(module.metrics).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 capitalize">
                                {key === 'active' ? 'Actifs' : key === 'progress' ? 'Progression' : key === 'status' ? 'Statut' : key}
                              </span>
                              <span className="font-semibold text-gray-900">
                                {value}
                              </span>
                    </div>
                  ))}
                </div>
              </div>
                      
                      {/* Indicateur de navigation */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-gestalis-primary">
                          Accéder
                        </span>
                        <ArrowRight className="h-5 w-5 text-gestalis-primary group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Section d'alertes et activités avec layout moderne */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Alertes récentes */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Alertes récentes</h3>
              <GestalisButton variant="outline" size="sm">
                Voir tout
              </GestalisButton>
        </div>

              <div className="space-y-4">
              {recentAlerts.map((alert) => {
                const IconComponent = getAlertIcon(alert.type);
                return (
                  <div
                    key={alert.id}
                    className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-${alert.type === 'warning' ? 'red' : alert.type === 'success' ? 'green' : 'blue'}-100 to-${alert.type === 'warning' ? 'red' : alert.type === 'success' ? 'green' : 'blue'}-200`}>
                        <IconComponent className={`h-5 w-5 text-${alert.type === 'warning' ? 'red' : alert.type === 'success' ? 'green' : 'blue'}-600`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">
                            {alert.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}>
                            {alert.priority === 'high' ? 'Haute' : alert.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Activités récentes */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Activités récentes</h3>
              <GestalisButton variant="outline" size="sm">
                Voir tout
              </GestalisButton>
              </div>
            
              <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-${activity.color}-100 to-${activity.color}-200`}>
                        <IconComponent className={`h-5 w-5 text-${activity.color}`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">
                            {activity.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                        {activity.progress && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Progression</span>
                              <span className="font-medium text-gray-900">{activity.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-gestalis-primary to-gestalis-secondary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${activity.progress}%` }}
                              />
                    </div>
                  </div>
                        )}
                        {activity.amount && (
                          <p className="text-sm font-semibold text-gestalis-secondary">
                            {activity.amount}
                          </p>
                        )}
                        {activity.supplier && (
                          <p className="text-xs text-gray-500">
                            Fournisseur: {activity.supplier}
                          </p>
                        )}
        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Section d'actions rapides */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Actions rapides</h2>
            <p className="text-lg text-gray-600">Accédez rapidement aux fonctionnalités essentielles</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <GestalisButton className="px-8 py-4 text-lg bg-gradient-to-r from-gestalis-primary to-gestalis-secondary hover:from-gestalis-primary-dark hover:to-gestalis-secondary-dark transition-all duration-300 hover:scale-105">
              <Plus className="h-6 w-6 mr-2" />
              Nouveau chantier
            </GestalisButton>
            <GestalisButton variant="outline" className="px-8 py-4 text-lg border-2 hover:border-gestalis-primary hover:text-gestalis-primary transition-all duration-300 hover:scale-105">
              <FileText className="h-6 w-6 mr-2" />
              Nouveau devis
            </GestalisButton>
            <GestalisButton variant="outline" className="px-8 py-4 text-lg border-2 hover:border-gestalis-secondary hover:text-gestalis-secondary transition-all duration-300 hover:scale-105">
              <ShoppingCart className="h-6 w-6 mr-2" />
              Nouvelle commande
            </GestalisButton>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 