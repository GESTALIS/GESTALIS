import React from 'react';
import { 
  Building2, 
  ShoppingCart, 
  Users,
  FileText,
  Receipt,
  CreditCard,
  Package,
  Truck,
  Calendar,
  Plus,
  Eye,
  Download,
  Settings,
  Sparkles,
  TrendingUp,
  BarChart3,
  Bell,
  Clock,
  Target,
  Award
} from 'lucide-react';

const DashboardActions = () => {
  // Actions rapides principales
  const mainActions = [
    {
      id: 1,
      title: 'Nouveau chantier',
      description: 'Créer un nouveau projet de construction',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      route: '/chantiers',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Nouvelle commande',
      description: 'Passer une commande fournisseur',
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      route: '/achats/creation-bon-commande',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Nouveau fournisseur',
      description: 'Ajouter un nouveau partenaire',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      route: '/achats?tab=fournisseurs&create=true',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Nouveau devis',
      description: 'Créer un devis client',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      route: '/vente',
      priority: 'medium'
    }
  ];

  // Actions secondaires
  const secondaryActions = [
    {
      id: 5,
      title: 'Gérer les factures',
      description: 'Suivi des factures et paiements',
      icon: Receipt,
      color: 'from-red-500 to-red-600',
      route: '/achats?tab=factures'
    },
    {
      id: 6,
      title: 'Suivi trésorerie',
      description: 'Gestion de la trésorerie',
      icon: CreditCard,
      color: 'from-teal-500 to-teal-600',
      route: '/tresorerie'
    },
    {
      id: 7,
      title: 'Gestion stocks',
      description: 'Suivi des matériaux',
      icon: Package,
      color: 'from-indigo-500 to-indigo-600',
      route: '/logistique'
    },
    {
      id: 8,
      title: 'Planning chantiers',
      description: 'Organisation des travaux',
      icon: Calendar,
      color: 'from-pink-500 to-pink-600',
      route: '/chantiers'
    }
  ];

  // Actions d'analyse
  const analysisActions = [
    {
      id: 9,
      title: 'Rapports KPI',
      description: 'Indicateurs de performance',
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      route: '/analyse'
    },
    {
      id: 10,
      title: 'Tableaux de bord',
      description: 'Vue d\'ensemble métier',
      icon: BarChart3,
      color: 'from-cyan-500 to-cyan-600',
      route: '/dashboard'
    },
    {
      id: 11,
      title: 'Notifications',
      description: 'Alertes et rappels',
      icon: Bell,
      color: 'from-amber-500 to-amber-600',
      route: '/admin'
    },
    {
      id: 12,
      title: 'Paramètres',
      description: 'Configuration système',
      icon: Settings,
      color: 'from-slate-500 to-slate-600',
      route: '/admin'
    }
  ];

  // Actions récentes
  const recentActions = [
    {
      id: 1,
      action: 'Chantier créé',
      description: 'Rue de la Paix - €450K',
      time: 'Il y a 2h',
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      id: 2,
      action: 'Commande validée',
      description: 'BC-001 - BTP Plus',
      time: 'Il y a 4h',
      icon: ShoppingCart,
      color: 'text-green-600'
    },
    {
      id: 3,
      action: 'Fournisseur ajouté',
      description: 'BTP Matériaux',
      time: 'Il y a 6h',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const handleActionClick = (action) => {
    // Navigation vers la route spécifiée
    window.location.href = action.route;
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'high') {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Priorité</span>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="px-8 py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-600 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-600 bg-clip-text text-transparent">
                    Actions Rapides
                  </h1>
                  <p className="text-gray-600">
                    Accédez rapidement à toutes vos fonctionnalités
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Action personnalisée
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="h-4 w-4" />
                Configurer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        
        {/* Actions principales */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Actions principales</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Target className="h-4 w-4" />
              Actions prioritaires
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainActions.map((action) => (
              <div
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 bg-gradient-to-r ${action.color} rounded-xl text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    {getPriorityBadge(action.priority)}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">Cliquez pour accéder</span>
                    <Plus className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions secondaires */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Actions secondaires</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Actions régulières
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryActions.map((action) => (
              <div
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="space-y-4">
                  <div className={`p-3 bg-gradient-to-r ${action.color} rounded-xl text-white`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions d'analyse */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Analyse et reporting</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Award className="h-4 w-4" />
              Outils avancés
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analysisActions.map((action) => (
              <div
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="space-y-4">
                  <div className={`p-3 bg-gradient-to-r ${action.color} rounded-xl text-white`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions récentes */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Actions récentes</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Voir l'historique
            </button>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="space-y-4">
              {recentActions.map((action) => (
                <div key={action.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{action.action}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">{action.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Actions personnalisées */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Actions personnalisées</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-lg hover:from-blue-600 hover:to-teal-700 transition-all duration-300 hover:scale-105">
              <Plus className="h-5 w-5" />
              Créer une action
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-105">
              <Eye className="h-5 w-5" />
              Voir toutes les actions
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 hover:scale-105">
              <Download className="h-5 w-5" />
              Exporter la liste
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardActions;
