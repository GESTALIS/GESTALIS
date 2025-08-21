import React, { useState, useEffect } from 'react';
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
  DollarSign,
  Users,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  X,
  Upload,
  Download,
  Star,
  Phone,
  Mail,
  MapPin,
  FileText as DocumentIcon,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';
import { Input } from '../components/ui/input';

const Achats = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // États pour la gestion des fournisseurs
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [newFournisseur, setNewFournisseur] = useState({
    raisonSociale: '',
    siret: '',
    tvaIntracommunautaire: '',
    codeApeNaf: '',
    formeJuridique: '',
    capitalSocial: '',
    adresseSiege: '',
    adresseLivraison: '',
    plafondCredit: '',
    devise: 'EUR',
    estSousTraitant: false
  });

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

  // Données de test pour les fournisseurs
  const mockFournisseurs = [
    {
      id: 'fr001',
      codeFournisseur: 'FR001',
      compteComptable: 'F0001',
      raisonSociale: 'BTP Matériaux Plus',
      siret: '12345678901234',
      tvaIntracommunautaire: 'FR12345678901',
      codeApeNaf: '4321A',
      formeJuridique: 'SARL',
      capitalSocial: 500000,
      adresseSiege: '123 Rue des Matériaux, 75001 Paris',
      adresseLivraison: '456 Avenue de la Construction, 75002 Paris',
      statut: 'ACTIF',
      estSousTraitant: false,
      dateEntreeRelation: '2023-01-15',
      plafondCredit: 100000,
      devise: 'EUR',
      contacts: [
        {
          id: 'c1',
          type: 'COMMERCIAL',
          nom: 'Dupont',
          prenom: 'Jean',
          telephone: '01 23 45 67 89',
          email: 'j.dupont@btp-materiaux.fr',
          fonction: 'Directeur Commercial',
          estContactPrincipal: true
        }
      ],
      documents: [
        {
          id: 'd1',
          type: 'KBIS',
          nom: 'Extrait Kbis',
          statut: 'VALIDE',
          dateExpiration: '2025-01-01'
        },
        {
          id: 'd2',
          type: 'URSSAF',
          nom: 'Attestation URSSAF',
          statut: 'A_RENOUVELER',
          dateExpiration: '2024-12-31'
        }
      ],
      scoreQualite: 4.2,
      totalAchats: 45200,
      derniereFacture: '2024-01-15',
      facturesEnCours: 2
    },
    {
      id: 'fr002',
      codeFournisseur: 'FR002',
      compteComptable: 'F0002',
      raisonSociale: 'Sous-traitance Pro',
      siret: '98765432109876',
      tvaIntracommunautaire: 'FR98765432109',
      codeApeNaf: '4321B',
      formeJuridique: 'SAS',
      capitalSocial: 750000,
      adresseSiege: '789 Boulevard du BTP, 75003 Paris',
      adresseLivraison: '789 Boulevard du BTP, 75003 Paris',
      statut: 'ACTIF',
      estSousTraitant: true,
      dateEntreeRelation: '2023-03-20',
      plafondCredit: 150000,
      devise: 'EUR',
      contacts: [
        {
          id: 'c2',
          type: 'TECHNIQUE',
          nom: 'Martin',
          prenom: 'Marie',
          telephone: '01 98 76 54 32',
          email: 'm.martin@sous-traitance-pro.fr',
          fonction: 'Responsable Technique',
          estContactPrincipal: true
        }
      ],
      documents: [
        {
          id: 'd3',
          type: 'KBIS',
          nom: 'Extrait Kbis',
          statut: 'VALIDE',
          dateExpiration: '2025-06-30'
        }
      ],
      scoreQualite: 4.5,
      totalAchats: 32800,
      derniereFacture: '2024-01-10',
      facturesEnCours: 1
    }
  ];

  useEffect(() => {
    // Simuler le chargement des fournisseurs
    setLoading(true);
    setTimeout(() => {
      setFournisseurs(mockFournisseurs);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'confirme': 'bg-green-100 text-green-800',
      'en_livraison': 'bg-blue-100 text-blue-800',
      'validee': 'bg-green-100 text-green-800',
      'payee': 'bg-green-100 text-green-800',
      'partiellement_payee': 'bg-yellow-100 text-yellow-800',
      'acceptee': 'bg-green-100 text-green-800',
      'en_attente': 'bg-gray-100 text-gray-800',
      'brouillon': 'bg-gray-100 text-gray-800',
      'ACTIF': 'bg-green-100 text-green-800',
      'SUSPENDU': 'bg-yellow-100 text-yellow-800',
      'ARCHIVE': 'bg-red-100 text-red-800'
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
      'brouillon': 'Brouillon',
      'ACTIF': 'Actif',
      'SUSPENDU': 'Suspendu',
      'ARCHIVE': 'Archivé'
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

  const getDocumentStatusColor = (statut) => {
    const colors = {
      'VALIDE': 'bg-green-100 text-green-800',
      'A_RENOUVELER': 'bg-yellow-100 text-yellow-800',
      'EXPIRE': 'bg-red-100 text-red-800',
      'EN_COURS': 'bg-blue-100 text-blue-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getDocumentStatusText = (statut) => {
    const texts = {
      'VALIDE': 'Valide',
      'A_RENOUVELER': 'À renouveler',
      'EXPIRE': 'Expiré',
      'EN_COURS': 'En cours'
    };
    return texts[statut] || statut;
  };

  const handleCreateFournisseur = () => {
    // Simuler la création
    const newFournisseur = {
      id: `fr${String(fournisseurs.length + 1).padStart(3, '0')}`,
      codeFournisseur: `FR${String(fournisseurs.length + 1).padStart(3, '0')}`,
      compteComptable: `F${String(fournisseurs.length + 1).padStart(4, '0')}`,
      ...newFournisseur,
      statut: 'ACTIF',
      dateEntreeRelation: new Date().toISOString().split('T')[0],
      contacts: [],
      documents: [],
      scoreQualite: 0,
      totalAchats: 0,
      derniereFacture: null,
      facturesEnCours: 0
    };

    setFournisseurs([...fournisseurs, newFournisseur]);
    setShowCreateModal(false);
    setNewFournisseur({
      raisonSociale: '',
      siret: '',
      tvaIntracommunautaire: '',
      codeApeNaf: '',
      formeJuridique: '',
      capitalSocial: '',
      adresseSiege: '',
      adresseLivraison: '',
      plafondCredit: '',
      devise: 'EUR',
      estSousTraitant: false
    });
  };

  const handleDeleteFournisseur = (id) => {
    setFournisseurs(fournisseurs.filter(f => f.id !== id));
  };

  const filteredFournisseurs = fournisseurs.filter(fournisseur => {
    const matchesSearch = fournisseur.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fournisseur.codeFournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fournisseur.siret?.includes(searchTerm);
    
    const matchesStatus = selectedStatus === 'all' || fournisseur.statut === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

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
          <div className="space-y-6">
            {/* En-tête de la section Fournisseurs */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestion des Fournisseurs</h2>
                <p className="text-gray-600">Gestion complète des fournisseurs et sous-traitants</p>
              </div>
              <div className="flex gap-3">
                <GestalisButton variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exporter
                </GestalisButton>
                <GestalisButton variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Importer
                </GestalisButton>
                <GestalisButton className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4" />
                  Nouveau fournisseur
                </GestalisButton>
              </div>
            </div>

            {/* Filtres et recherche */}
            <GestalisCard>
              <GestalisCardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un fournisseur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="ACTIF">Actif</option>
                    <option value="SUSPENDU">Suspendu</option>
                    <option value="ARCHIVE">Archivé</option>
                  </select>
                  <GestalisButton variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Plus de filtres
                  </GestalisButton>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Liste des fournisseurs */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredFournisseurs.map((fournisseur) => (
                  <GestalisCard key={fournisseur.id} className="hover:shadow-md transition-shadow">
                    <GestalisCardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* En-tête du fournisseur */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-semibold text-gray-900">{fournisseur.raisonSociale}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fournisseur.statut)}`}>
                                {getStatusText(fournisseur.statut)}
                              </span>
                              {fournisseur.estSousTraitant && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Sous-traitant
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Informations principales */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.codeFournisseur}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.compteComptable}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.siret}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.adresseSiege.split(',')[0]}</span>
                            </div>
                          </div>

                          {/* Contacts et documents */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.contacts.length} contact(s)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DocumentIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.documents.length} document(s)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.scoreQualite}/5</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">€{fournisseur.totalAchats.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Alertes documents */}
                          {fournisseur.documents.some(doc => doc.statut === 'A_RENOUVELER' || doc.statut === 'EXPIRE') && (
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm text-yellow-800">
                                {fournisseur.documents.filter(doc => doc.statut === 'A_RENOUVELER' || doc.statut === 'EXPIRE').length} document(s) à renouveler
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <GestalisButton variant="outline" size="sm" onClick={() => setSelectedFournisseur(fournisseur)}>
                            <Eye className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton variant="outline" size="sm" onClick={() => setShowContactModal(true)}>
                            <Users className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton variant="outline" size="sm" onClick={() => setShowDocumentModal(true)}>
                            <DocumentIcon className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton variant="danger" size="sm" onClick={() => handleDeleteFournisseur(fournisseur.id)}>
                            <Trash2 className="h-4 w-4" />
                          </GestalisButton>
                        </div>
                      </div>
                    </GestalisCardContent>
                  </GestalisCard>
                ))}
              </div>
            )}
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

      {/* Modal de création de fournisseur */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau fournisseur</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison sociale *</label>
                <Input
                  value={newFournisseur.raisonSociale}
                  onChange={(e) => setNewFournisseur({...newFournisseur, raisonSociale: e.target.value})}
                  placeholder="Raison sociale"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SIRET</label>
                <Input
                  value={newFournisseur.siret}
                  onChange={(e) => setNewFournisseur({...newFournisseur, siret: e.target.value})}
                  placeholder="12345678901234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TVA intracommunautaire</label>
                <Input
                  value={newFournisseur.tvaIntracommunautaire}
                  onChange={(e) => setNewFournisseur({...newFournisseur, tvaIntracommunautaire: e.target.value})}
                  placeholder="FR12345678901"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code APE/NAF</label>
                <Input
                  value={newFournisseur.codeApeNaf}
                  onChange={(e) => setNewFournisseur({...newFournisseur, codeApeNaf: e.target.value})}
                  placeholder="4321A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forme juridique</label>
                <select
                  value={newFournisseur.formeJuridique}
                  onChange={(e) => setNewFournisseur({...newFournisseur, formeJuridique: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Sélectionner</option>
                  <option value="SARL">SARL</option>
                  <option value="SAS">SAS</option>
                  <option value="SA">SA</option>
                  <option value="EURL">EURL</option>
                  <option value="EI">EI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capital social</label>
                <Input
                  type="number"
                  value={newFournisseur.capitalSocial}
                  onChange={(e) => setNewFournisseur({...newFournisseur, capitalSocial: e.target.value})}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse siège</label>
                <Input
                  value={newFournisseur.adresseSiege}
                  onChange={(e) => setNewFournisseur({...newFournisseur, adresseSiege: e.target.value})}
                  placeholder="123 Rue de la Paix, 75001 Paris"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse livraison</label>
                <Input
                  value={newFournisseur.adresseLivraison}
                  onChange={(e) => setNewFournisseur({...newFournisseur, adresseLivraison: e.target.value})}
                  placeholder="456 Avenue de la Livraison, 75002 Paris"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plafond de crédit</label>
                <Input
                  type="number"
                  value={newFournisseur.plafondCredit}
                  onChange={(e) => setNewFournisseur({...newFournisseur, plafondCredit: e.target.value})}
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                <select
                  value={newFournisseur.devise}
                  onChange={(e) => setNewFournisseur({...newFournisseur, devise: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="estSousTraitant"
                checked={newFournisseur.estSousTraitant}
                onChange={(e) => setNewFournisseur({...newFournisseur, estSousTraitant: e.target.checked})}
                className="rounded border-gray-300"
              />
              <label htmlFor="estSousTraitant" className="text-sm text-gray-700">
                Ce fournisseur est aussi un sous-traitant
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <GestalisButton variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </GestalisButton>
              <GestalisButton onClick={handleCreateFournisseur}>
                Créer le fournisseur
              </GestalisButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion des contacts */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Gestion des contacts</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Fonctionnalité en cours de développement</p>
            <div className="flex justify-end">
              <GestalisButton onClick={() => setShowContactModal(false)}>
                Fermer
              </GestalisButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion des documents */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Gestion des documents</h3>
              <button onClick={() => setShowDocumentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Fonctionnalité en cours de développement</p>
            <div className="flex justify-end">
              <GestalisButton onClick={() => setShowDocumentModal(false)}>
                Fermer
              </GestalisButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achats; 