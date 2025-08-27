import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Building2, 
  ClipboardList, 
  FileText, 
  Receipt, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Shield,
  MapPin,
  CreditCard,
  Clock,
  Calculator,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { GestalisCard, GestalisCardContent } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';
import { Input } from '../components/ui/input';

// Composant banner pour Sous-traitants
const SousTraitantsBanner = ({ description, children }) => {
  const sousTraitantsStyle = {
    borderRadius: '16px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #1B275A, #06B6D4)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div className="module-banner sous-traitants-banner" style={sousTraitantsStyle}>
      <div className="module-icon" style={{ fontSize: '1.8rem' }}>🏗️</div>
      <div>
        <div className="module-title" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Module Sous-traitants</div>
        {description && (
          <div className="module-description" style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '4px' }}>{description}</div>
        )}
      </div>
      {children && (
        <div className="ml-auto">
          {children}
        </div>
      )}
    </div>
  );
};

const SousTraitants = () => {
  // États pour la gestion des onglets
  const [activeTab, setActiveTab] = useState('overview');
  
  // États pour la gestion des sous-traitants
  const [sousTraitants, setSousTraitants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // États pour les modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  
  // États pour la création de sous-traitant
  const [activeCreateTab, setActiveCreateTab] = useState('coordonnees');
  const [newSousTraitant, setNewSousTraitant] = useState({
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
    estSousTraitant: true,
    pasDeTvaGuyane: true,
    compteComptable: '',
    qualification: '',
    domaineActivite: '',
    assuranceRC: '',
    assuranceDecennale: '',
    urssaf: '',
    kbis: '',
    rib: ''
  });
  
  // États pour les contacts
  const [contacts, setContacts] = useState([]);
  
  // États pour les comptes comptables
  const [planComptable, setPlanComptable] = useState([
    { numeroCompte: 'F0001', intitule: 'Fournisseur - Sous-traitant', typeCompte: 'SOUS_TRAITANT' },
    { numeroCompte: 'F0002', intitule: 'Fournisseur - Matériaux', typeCompte: 'FOURNISSEUR' },
    { numeroCompte: 'F0003', intitule: 'Fournisseur - Services', typeCompte: 'FOURNISSEUR' }
  ]);
  const [filteredPlanComptable, setFilteredPlanComptable] = useState([]);
  const [searchCompteTerm, setSearchCompteTerm] = useState('');
  const [showCompteResults, setShowCompteResults] = useState(false);
  const [showCreateCompteModal, setShowCreateCompteModal] = useState(false);
  const [newCompte, setNewCompte] = useState({ numeroCompte: '', intitule: '', typeCompte: 'SOUS_TRAITANT' });
  
  // États pour les conditions de paiement
  const [showCreateConditionModal, setShowCreateConditionModal] = useState(false);
  const [newConditionPaiement, setNewConditionPaiement] = useState({ libelle: '', type: 'NET', delai: '', escompte: '', description: '' });
  const [conditionsPaiement, setConditionsPaiement] = useState([
    { id: 'COMPTANT', libelle: 'COMPTANT - 0 jour', type: 'COMPTANT', delai: 0, escompte: 0, description: 'Paiement immédiat' },
    { id: 'NET30', libelle: 'NET 30 - 30 Jours', type: 'NET', delai: 30, escompte: 0, description: '30 jours après facture' },
    { id: 'NET45', libelle: 'NET 45 - 45 Jours', type: 'NET', delai: 45, escompte: 0, description: '45 jours après facture' }
  ]);
  
  // États pour les échéances
  const [showCreateEcheanceModal, setShowCreateEcheanceModal] = useState(false);
  const [newEcheance, setNewEcheance] = useState({ libelle: '', delai: '', description: '' });
  const [echeances, setEcheances] = useState([
    { id: 'COMPTANT', libelle: 'COMPTANT - 0 jour', delai: 0, description: 'Paiement immédiat' },
    { id: '30J', libelle: '30J - 30 Jours date de facture', delai: 30, description: '30 jours après facture' },
    { id: '45J', libelle: '45J - 45 Jours date de facture', delai: 45, description: '45 jours après facture' },
    { id: '60J', libelle: '60J - 60 Jours date de facture', delai: 60, description: '60 jours après facture' }
  ]);

  // États pour la sélection multiple
  const [selectedSousTraitants, setSelectedSousTraitants] = useState([]);
  const [showDeleteBulkModal, setShowDeleteBulkModal] = useState(false);

  // Code sous-traitant suivant
  const [nextSousTraitantCode, setNextSousTraitantCode] = useState('STPRO97-0001');

  // Données de test pour les statistiques
  const stats = [
    {
      title: 'Sous-traitants actifs',
      value: '12',
      change: '+2',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      color: 'text-green-600',
      icon: Users
    },
    {
      title: 'Contrats en cours',
      value: '8',
      change: '+1',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      color: 'text-blue-600',
      icon: FileText
    },
    {
      title: 'Situations mensuelles',
      value: '24',
      change: '+3',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      color: 'text-orange-600',
      icon: Receipt
    },
    {
      title: 'Score moyen conformité',
      value: '87%',
      change: '+5%',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      color: 'text-green-600',
      icon: CheckCircle
    }
  ];

  // Activités récentes
  const recentActivities = [
    {
      description: 'Nouveau contrat signé avec BTP Construction',
      time: 'Il y a 2 heures',
      icon: FileText
    },
    {
      description: 'Situation mensuelle validée pour ST Pro Services',
      time: 'Il y a 4 heures',
      icon: Receipt
    },
    {
      description: 'Document DC4 expiré pour ST Martinique',
      time: 'Il y a 1 jour',
      icon: AlertTriangle
    },
    {
      description: 'Nouveau sous-traitant qualifié : ST Guyane',
      time: 'Il y a 2 jours',
      icon: Users
    }
  ];

  // Initialisation
  useEffect(() => {
    // Charger les données des sous-traitants
    loadSousTraitants();
    
    // Initialiser le plan comptable filtré
    setFilteredPlanComptable(planComptable);
    
    // Gérer les paramètres d'URL pour les onglets
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'sous-traitants', 'contrats', 'situations', 'demandes-prix', 'analytics'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const loadSousTraitants = async () => {
    setLoading(true);
    try {
      // Simulation de chargement - à remplacer par l'API réelle
      const mockSousTraitants = [
        {
          id: 1,
          codeSousTraitant: 'STPRO97-0001',
          raisonSociale: 'BTP Construction',
          siret: '12345678901234',
          qualification: 'Gros œuvre',
          domaineActivite: 'Construction',
          statut: 'ACTIF',
          assuranceRC: '2025-12-31',
          assuranceDecennale: '2025-12-31',
          urssaf: '2025-12-31',
          kbis: '2025-12-31',
          rib: 'FR76 1234 5678 9012 3456 7890 123',
          compteComptable: 'F0001',
          adresseSiege: '123 Rue de la Construction, 97300 Cayenne'
        },
        {
          id: 2,
          codeSousTraitant: 'STPRO97-0002',
          raisonSociale: 'ST Pro Services',
          siret: '23456789012345',
          qualification: 'Second œuvre',
          domaineActivite: 'Rénovation',
          statut: 'ACTIF',
          assuranceRC: '2025-11-30',
          assuranceDecennale: '2025-11-30',
          urssaf: '2025-11-30',
          kbis: '2025-11-30',
          rib: 'FR76 2345 6789 0123 4567 8901 234',
          compteComptable: 'F0001',
          adresseSiege: '456 Avenue des Services, 97300 Cayenne'
        }
      ];
      
      setSousTraitants(mockSousTraitants);
    } catch (error) {
      console.error('Erreur lors du chargement des sous-traitants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSousTraitant = async () => {
    // Validation des champs obligatoires
    if (!newSousTraitant.raisonSociale || !newSousTraitant.siret) {
      alert('Veuillez remplir au minimum la raison sociale et le SIRET');
      return;
    }

    try {
      setLoading(true);
      
      // Créer le nouveau sous-traitant
      const nouveauSousTraitant = {
        id: Date.now(),
        codeSousTraitant: nextSousTraitantCode,
        ...newSousTraitant,
        statut: 'ACTIF'
      };
      
      // Mettre à jour la liste locale
      setSousTraitants(prev => [...prev, nouveauSousTraitant]);
      
      // Générer le prochain code sous-traitant
      const currentNumber = parseInt(nextSousTraitantCode.split('-')[1]);
      const nextNumber = currentNumber + 1;
      setNextSousTraitantCode(`STPRO97-${String(nextNumber).padStart(4, '0')}`);
      
      // Réinitialiser le formulaire
      setNewSousTraitant({
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
        estSousTraitant: true,
        pasDeTvaGuyane: true,
        compteComptable: '',
        qualification: '',
        domaineActivite: '',
        assuranceRC: '',
        assuranceDecennale: '',
        urssaf: '',
        kbis: '',
        rib: ''
      });
      setContacts([]);
      setActiveCreateTab('coordonnees');
      
      // Fermer le modal et réinitialiser
      setShowCreateModal(false);
      
      // S'assurer qu'on est dans l'onglet Sous-traitants
      setActiveTab('sous-traitants');
      
      // Notification de succès
      alert(`✅ Sous-traitant ${nouveauSousTraitant.raisonSociale} créé avec succès !\nCode: ${nouveauSousTraitant.codeSousTraitant}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du sous-traitant');
    } finally {
      setLoading(false);
    }
  };

  const addContact = () => {
    const newContact = {
      id: Date.now(),
      nom: '',
      fonction: '',
      telephone: '',
      portable: '',
      email: ''
    };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (id, field, value) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const removeContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleDeleteSousTraitant = async (id) => {
    try {
      // Mettre à jour la liste locale
      setSousTraitants(prev => prev.filter(st => st.id !== id));
      alert('Sous-traitant supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du sous-traitant');
    }
  };

  const handleViewSousTraitant = (sousTraitant) => {
    alert(`Visualisation de ${sousTraitant.raisonSociale}\nCode: ${sousTraitant.codeSousTraitant}\nSIRET: ${sousTraitant.siret}`);
  };

  const handleEditSousTraitant = (sousTraitant) => {
    alert(`Modification de ${sousTraitant.raisonSociale}\nFonctionnalité en cours de développement`);
  };

  const handleSelectSousTraitant = (id) => {
    setSelectedSousTraitants(prev => 
      prev.includes(id) 
        ? prev.filter(stId => stId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllSousTraitants = () => {
    if (selectedSousTraitants.length === sousTraitants.length) {
      setSelectedSousTraitants([]);
    } else {
      setSelectedSousTraitants(sousTraitants.map(st => st.id));
    }
  };

  const handleDeleteBulkSousTraitants = () => {
    if (selectedSousTraitants.length === 0) {
      alert('Aucun sous-traitant sélectionné');
      return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedSousTraitants.length} sous-traitant(s) ?`)) {
      setSousTraitants(prev => prev.filter(st => !selectedSousTraitants.includes(st.id)));
      setSelectedSousTraitants([]);
      setShowDeleteBulkModal(false);
      alert(`${selectedSousTraitants.length} sous-traitant(s) supprimé(s) avec succès !`);
    }
  };

  const handleCreateCompte = () => {
    const newCompteData = {
      numeroCompte: newCompte.numeroCompte,
      intitule: newCompte.intitule,
      typeCompte: newCompte.typeCompte
    };
    setPlanComptable([...planComptable, newCompteData]);
    setFilteredPlanComptable([...filteredPlanComptable, newCompteData]);
    setShowCreateCompteModal(false);
    setNewCompte({ numeroCompte: '', intitule: '', typeCompte: 'SOUS_TRAITANT' });
    
    // Mettre à jour le champ de recherche avec le nouveau compte
    setSearchCompteTerm(`${newCompteData.numeroCompte} - ${newCompteData.intitule}`);
    setNewSousTraitant({...newSousTraitant, compteComptable: newCompteData.numeroCompte});
    
    // Notification de succès
    alert(`✅ Compte comptable créé avec succès !\nNuméro: ${newCompteData.numeroCompte}\nIntitulé: ${newCompteData.intitule}`);
  };

  const handleCreateConditionPaiement = () => {
    const newCondition = {
      id: `cond${String(conditionsPaiement.length + 1).padStart(3, '0')}`,
      libelle: newConditionPaiement.libelle,
      type: newConditionPaiement.type,
      delai: newConditionPaiement.delai,
      escompte: newConditionPaiement.escompte,
      description: newConditionPaiement.description
    };
    setConditionsPaiement([...conditionsPaiement, newCondition]);
    setShowCreateConditionModal(false);
    setNewConditionPaiement({ libelle: '', type: 'NET', delai: '', escompte: '', description: '' });
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'ACTIF': return 'bg-green-100 text-green-800';
      case 'SUSPENDU': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'ACTIF': return 'Actif';
      case 'SUSPENDU': return 'Suspendu';
      case 'ARCHIVE': return 'Archivé';
      default: return 'Inconnu';
    }
  };

  const handleCreateEcheance = () => {
    if (!newEcheance.libelle || !newEcheance.delai) {
      alert('Veuillez remplir le libellé et le délai');
      return;
    }
    
    const newEcheanceData = {
      id: `CUSTOM_${Date.now()}`,
      libelle: newEcheance.libelle,
      delai: parseInt(newEcheance.delai),
      description: newEcheance.description || ''
    };
    
    setEcheances([...echeances, newEcheanceData]);
    setShowCreateEcheanceModal(false);
    setNewEcheance({ libelle: '', delai: '', description: '' });
    
    // Notification de succès
    alert(`✅ Échéance créée avec succès !\nLibellé: ${newEcheanceData.libelle}\nDélai: ${newEcheanceData.delai} jours`);
  };

  // Filtrer les sous-traitants
  const filteredSousTraitants = sousTraitants.filter(sousTraitant => {
    const matchesSearch = sousTraitant.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sousTraitant.codeSousTraitant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sousTraitant.siret.includes(searchTerm);
    
    const matchesStatus = selectedStatus === 'all' || sousTraitant.statut === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* SousTraitantsBanner STICKY - reste fixé en haut */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <SousTraitantsBanner />
          </div>
        </div>
      </div>

      {/* Navigation par onglets STICKY - reste sous le banner */}
      <div className="sticky top-[120px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 pb-4">
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <nav className="flex space-x-1 bg-[#1B275A] p-1 rounded-2xl shadow-sm border border-gray-200">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Target },
              { id: 'sous-traitants', label: 'Sous-traitants', icon: Building2 },
              { id: 'contrats', label: 'Contrats', icon: FileText },
              { id: 'situations', label: 'Situations', icon: Receipt },
              { id: 'demandes-prix', label: 'Demandes de prix', icon: ClipboardList },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-teal-600 text-white shadow-lg'
                    : 'text-white hover:text-blue-100 hover:bg-white/20'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal avec padding-top pour compenser les éléments sticky */}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-4">
        {/* Statistiques - UNIQUEMENT dans Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className={`${stat.bgColor} ${stat.color} p-1 rounded-2xl transition-all duration-300 group-hover:shadow-lg`}>
                  <div className="bg-white rounded-xl p-6 h-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm font-medium ${stat.textColor}`}>
                          {stat.change} ce mois
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl text-white`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contenu principal selon l'onglet actif */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Section Sous-traitants */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Sous-traitants récents</h2>
                <button
                  onClick={() => setActiveTab('sous-traitants')}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                >
                  Voir tous
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : sousTraitants.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun sous-traitant</h3>
                  <p className="text-gray-500 mb-4">Commencez par ajouter votre premier sous-traitant</p>
                  <button 
                    onClick={() => window.location.href = '/achats?tab=fournisseurs&create=true'}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    <Users className="h-5 w-5" />
                    Nouveau fournisseur
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-600">Sous-traitants créés</h4>
                    <span className="text-sm text-gray-500">Total: {sousTraitants.length}</span>
                  </div>
                  <div className="grid gap-3">
                    {sousTraitants.slice(0, 3).map((sousTraitant) => (
                      <div key={sousTraitant.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{sousTraitant.raisonSociale}</h4>
                          <p className="text-sm text-gray-500">{sousTraitant.codeSousTraitant} • {sousTraitant.qualification}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sousTraitant.statut)}`}>
                          {getStatusText(sousTraitant.statut)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {sousTraitants.length > 3 && (
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setActiveTab('sous-traitants')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Voir tous les {sousTraitants.length} sous-traitants →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section Activités récentes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Activités récentes</h2>
              
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune activité récente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'demandes-prix' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Demandes de prix</h3>
            <p className="text-gray-500">Fonctionnalité à coder beaucoup plus tard</p>
          </div>
        )}

        {activeTab === 'contrats' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Gestion des contrats</h3>
            <p className="text-gray-500">Fonctionnalité en cours de développement</p>
          </div>
        )}

        {activeTab === 'situations' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Situations mensuelles</h3>
            <p className="text-gray-500">Fonctionnalité en cours de développement</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Module Analytics</h3>
            <p className="text-gray-500">Fonctionnalité en cours de développement</p>
          </div>
        )}

        {activeTab === 'sous-traitants' && (
          <div className="space-y-6">
            {/* Barre de recherche et filtres */}
            <GestalisCard className="bg-white border-0 shadow-sm">
              <GestalisCardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher un sous-traitant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="ACTIF">Actif</option>
                      <option value="SUSPENDU">Suspendu</option>
                      <option value="ARCHIVE">Archivé</option>
                    </select>
                    
                    <GestalisButton 
                      variant="outline" 
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Plus de filtres
                    </GestalisButton>
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Bouton Nouveau Fournisseur - Même style que Dashboard */}
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => window.location.href = '/achats?tab=fournisseurs&create=true'}
                className="flex items-center gap-2 px-6 py-3 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Users className="h-5 w-5" />
                Nouveau fournisseur
              </button>
            </div>

            {/* Liste des sous-traitants */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : sousTraitants.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun sous-traitant trouvé</h3>
                <p className="text-gray-500 mb-6">Commencez par ajouter votre premier sous-traitant</p>
                <button 
                  onClick={() => window.location.href = '/achats?tab=fournisseurs&create=true'}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <Users className="h-5 w-5" />
                  Nouveau fournisseur
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredSousTraitants.map((sousTraitant) => (
                  <GestalisCard key={sousTraitant.id} className="hover:shadow-md transition-all duration-300 border-0 bg-white">
                    <GestalisCardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{sousTraitant.raisonSociale}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sousTraitant.statut)}`}>
                              {getStatusText(sousTraitant.statut)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{sousTraitant.codeSousTraitant}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{sousTraitant.siret}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{sousTraitant.adresseSiege?.split(',')[0] || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{sousTraitant.compteComptable || 'N/A'}</span>
                            </div>
                          </div>
                          
                          {/* Informations spécifiques sous-traitant */}
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700">Qualification:</span>
                              <span className="text-sm text-gray-600">{sousTraitant.qualification || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700">Domaine:</span>
                              <span className="text-sm text-gray-600">{sousTraitant.domaineActivite || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700">Assurance RC:</span>
                              <span className="text-sm text-gray-600">{sousTraitant.assuranceRC || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <GestalisButton 
                            variant="outline" 
                            size="sm" 
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            title="Visualiser"
                            onClick={() => handleViewSousTraitant(sousTraitant)}
                          >
                            <Eye className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton 
                            variant="outline" 
                            size="sm"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            title="Modifier"
                            onClick={() => handleEditSousTraitant(sousTraitant)}
                          >
                            <Edit className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton 
                            variant="danger" 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            title="Supprimer"
                            onClick={() => handleDeleteSousTraitant(sousTraitant.id)}
                          >
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
      </div>
    </div>
  );
};

export default SousTraitants;