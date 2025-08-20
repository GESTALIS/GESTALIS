import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  ShoppingCart, 
  Receipt, 
  CreditCard, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';

const Achats = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Données de test pour les statistiques
  const stats = [
    {
      title: 'Fournisseurs',
      value: '12',
      change: '+2',
      icon: Building2,
      color: 'gestalis-primary'
    },
    {
      title: 'Commandes en cours',
      value: '8',
      change: '+1',
      icon: ShoppingCart,
      color: 'gestalis-secondary'
    },
    {
      title: 'Factures à payer',
      value: '15',
      change: '-3',
      icon: Receipt,
      color: 'gestalis-accent'
    },
    {
      title: 'Montant total',
      value: '€125,450',
      change: '+12%',
      icon: DollarSign,
      color: 'gestalis-tertiary'
    }
  ];

  // Données de test pour les dernières activités
  const recentActivities = [
    {
      id: 1,
      type: 'commande',
      title: 'BC-040ABD43',
      description: 'Commande matériaux fondation',
      supplier: 'BTP Matériaux Plus',
      amount: '€18,000',
      status: 'confirme',
      date: '2024-01-15'
    },
    {
      id: 2,
      type: 'facture',
      title: 'FA-DBCDD316',
      description: 'Facture matériaux fondation',
      supplier: 'BTP Matériaux Plus',
      amount: '€18,000',
      status: 'validee',
      date: '2024-01-10'
    },
    {
      id: 3,
      type: 'demande',
      title: 'DP-13428AD5',
      description: 'Demande prix terrassement',
      supplier: 'Services BTP Express',
      amount: '€9,600',
      status: 'acceptee',
      date: '2024-01-08'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'confirme': 'bg-green-100 text-green-800',
      'en_livraison': 'bg-blue-100 text-blue-800',
      'validee': 'bg-green-100 text-green-800',
      'payee': 'bg-green-100 text-green-800',
      'partiellement_payee': 'bg-yellow-100 text-yellow-800',
      'acceptee': 'bg-green-100 text-green-800',
      'en_attente': 'bg-gray-100 text-gray-800',
      'brouillon': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'confirme': 'Confirmé',
      'en_livraison': 'En livraison',
      'validee': 'Validée',
      'payee': 'Payée',
      'partiellement_payee': 'Partiellement payée',
      'acceptee': 'Acceptée',
      'en_attente': 'En attente',
      'brouillon': 'Brouillon'
    };
    return texts[status] || status;
  };

  const getTypeIcon = (type) => {
    const icons = {
      'commande': ShoppingCart,
      'facture': Receipt,
      'demande': FileText
    };
    return icons[type] || FileText;
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achats</h1>
          <p className="text-gray-600 mt-2">Gestion des fournisseurs, commandes et factures d'achat</p>
        </div>
        <div className="flex gap-3">
          <GestalisButton variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </GestalisButton>
          <GestalisButton className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle commande
          </GestalisButton>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <GestalisCard key={index}>
            <GestalisCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>
        ))}
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-gestalis-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Vue d'ensemble
        </button>
        <button
          onClick={() => setActiveTab('fournisseurs')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'fournisseurs'
              ? 'bg-white text-gestalis-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Fournisseurs
        </button>
        <button
          onClick={() => setActiveTab('commandes')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'commandes'
              ? 'bg-white text-gestalis-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Commandes
        </button>
        <button
          onClick={() => setActiveTab('factures')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'factures'
              ? 'bg-white text-gestalis-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Factures
        </button>
        <button
          onClick={() => setActiveTab('demandes')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'demandes'
              ? 'bg-white text-gestalis-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Demandes de prix
        </button>
      </div>

      {/* Contenu principal */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Activités récentes */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle>Activités récentes</GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const IconComponent = getTypeIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gestalis-primary bg-opacity-10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-gestalis-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-sm text-gray-500">{activity.supplier}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-semibold text-gray-900">{activity.amount}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {getStatusText(activity.status)}
                          </span>
                          <div className="flex space-x-2">
                            <GestalisButton variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </GestalisButton>
                            <GestalisButton variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </GestalisButton>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Graphiques et analyses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle>Évolution des achats</GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique en cours de développement</p>
                    </div>
                  </div>
                </GestalisCardContent>
              </GestalisCard>

              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle>Top fournisseurs</GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gestalis-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">1</span>
                        </div>
                        <div>
                          <p className="font-medium">BTP Matériaux Plus</p>
                          <p className="text-sm text-gray-600">€45,200</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600">+15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gestalis-secondary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">2</span>
                        </div>
                        <div>
                          <p className="font-medium">Sous-traitance Pro</p>
                          <p className="text-sm text-gray-600">€32,800</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600">+8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gestalis-accent rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">3</span>
                        </div>
                        <div>
                          <p className="font-medium">Services BTP Express</p>
                          <p className="text-sm text-gray-600">€28,400</p>
                        </div>
                      </div>
                      <span className="text-sm text-red-600">-3%</span>
                    </div>
                  </div>
                </GestalisCardContent>
              </GestalisCard>
            </div>
          </>
        )}

        {activeTab === 'fournisseurs' && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des fournisseurs</h3>
            <p className="text-gray-600">Page en cours de développement</p>
          </div>
        )}

        {activeTab === 'commandes' && (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des commandes</h3>
            <p className="text-gray-600">Page en cours de développement</p>
          </div>
        )}

        {activeTab === 'factures' && (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des factures</h3>
            <p className="text-gray-600">Page en cours de développement</p>
          </div>
        )}

        {activeTab === 'demandes' && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Demandes de prix</h3>
            <p className="text-gray-600">Page en cours de développement</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achats; 