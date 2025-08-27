import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  AlertCircle,
  User,
  Calculator,
  Info,
  Package,
  Truck,
  ClipboardList
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';
import { Input } from '../components/ui/input';
import Commandes from './achats/Commandes';
import Factures from './achats/Factures';
import { AchatsBanner } from '../components/layout/ModuleBanner';

const Achats = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Gérer les paramètres d'URL pour l'onglet et la création
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    const createParam = searchParams.get('create');
    
    if (tabParam) {
      setActiveTab(tabParam);
      
      // Si on doit créer quelque chose, ouvrir le modal approprié
      if (createParam === 'true') {
        // Si on est dans l'onglet fournisseurs, ouvrir directement le modal
        if (tabParam === 'fournisseurs') {
          console.log('🚀 Ouverture automatique du modal de création de fournisseur');
          setShowCreateModal(true);
          
          // Pré-remplir avec les données du localStorage si disponibles
          const createData = localStorage.getItem('createFromSearch');
          if (createData) {
            try {
              const { type, searchTerm } = JSON.parse(createData);
              if (type === 'fournisseur' && searchTerm) {
                setNewFournisseur(prev => ({ ...prev, raisonSociale: searchTerm }));
              }
              // Nettoyer le localStorage
              localStorage.removeItem('createFromSearch');
            } catch (error) {
              console.error('Erreur lors du parsing des données de création:', error);
            }
          }
        }
      }
    }
  }, [location.search]);

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
    estSousTraitant: false,
    // Conditions de règlement
    modeReglement: 'VIR',
    echeanceType: '30J',
    respectEcheance: true,
    joursDecalage: 30,
    finDeMois: false,
    jourPaiement: 0
  });

  // Charger les fournisseurs depuis Supabase
  useEffect(() => {
    fetchFournisseurs();
    fetchPlanComptable();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      setLoading(true);
      // Utiliser le service local au lieu de l'API
      const fournisseursService = await import('../services/fournisseursService');
      const data = fournisseursService.default.obtenirFournisseurs();
      setFournisseurs(data);
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error);
      // Utiliser des données par défaut en cas d'erreur
      setFournisseurs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanComptable = async () => {
    try {
      // Utiliser les données par défaut du plan comptable
      const planComptableDefault = [
        { numeroCompte: 'F0001', intitule: 'Fournisseurs' },
        { numeroCompte: 'F0002', intitule: 'Fournisseurs - Sous-traitants' },
        { numeroCompte: 'F0003', intitule: 'Fournisseurs - Frais de transport' },
        { numeroCompte: 'F0004', intitule: 'Fournisseurs - Frais de dépôt' },
        { numeroCompte: 'F0005', intitule: 'Fournisseurs - Frais de douane' },
      ];
      setPlanComptable(planComptableDefault);
      setFilteredPlanComptable(planComptableDefault);
    } catch (error) {
      console.error('Erreur lors du chargement du plan comptable:', error);
    }
  };

  // États pour la création de fournisseur moderne
  const [activeCreateTab, setActiveCreateTab] = useState('coordonnees');
  const [showCreateCompteModal, setShowCreateCompteModal] = useState(false);
  const [showCreateConditionModal, setShowCreateConditionModal] = useState(false);
  const [planComptable, setPlanComptable] = useState([
    { numeroCompte: 'F0001', intitule: 'Fournisseurs' },
    { numeroCompte: 'F0002', intitule: 'Fournisseurs - Sous-traitants' },
    { numeroCompte: 'F0003', intitule: 'Fournisseurs - Frais de transport' },
    { numeroCompte: 'F0004', intitule: 'Fournisseurs - Frais de dépôt' },
    { numeroCompte: 'F0005', intitule: 'Fournisseurs - Frais de douane' },
  ]);
  const [filteredPlanComptable, setFilteredPlanComptable] = useState([
    { numeroCompte: 'F0001', intitule: 'Fournisseurs' },
    { numeroCompte: 'F0002', intitule: 'Fournisseurs - Sous-traitants' },
    { numeroCompte: 'F0003', intitule: 'Fournisseurs - Frais de transport' },
    { numeroCompte: 'F0004', intitule: 'Fournisseurs - Frais de dépôt' },
    { numeroCompte: 'F0005', intitule: 'Fournisseurs - Frais de douane' },
  ]);
  const [searchCompteTerm, setSearchCompteTerm] = useState('');
  const [showCompteResults, setShowCompteResults] = useState(false);
  const [conditionsPaiement, setConditionsPaiement] = useState([
    { id: 'NET_30', libelle: 'Net 30 jours' },
    { id: 'NET_60', libelle: 'Net 60 jours' },
    { id: 'NET_90', libelle: 'Net 90 jours' },
    { id: 'ESCOMPTE_10_NET_30', libelle: 'Escompte 10% Net 30 jours' },
    { id: 'ESCOMPTE_5_NET_10', libelle: 'Escompte 5% Net 10 jours' },
  ]);

  // États pour la création de compte comptable
  const [newCompte, setNewCompte] = useState({
    numeroCompte: '',
    intitule: '',
    typeCompte: 'FOURNISSEUR'
  });

  // États pour la création de condition de paiement
  const [newConditionPaiement, setNewConditionPaiement] = useState({
    libelle: '',
    type: 'COMPTANT',
    delai: '',
    escompte: '',
    description: ''
  });

  // État pour le code fournisseur automatique
  const [nextFournisseurCode, setNextFournisseurCode] = useState('FPRO97-0001');

  // État pour la case TVA Guyane
  const [pasDeTvaGuyane, setPasDeTvaGuyane] = useState(false);

  // État pour les contacts multiples
  const [contacts, setContacts] = useState([]);

  // Données réelles (vides au démarrage)
  const [stats, setStats] = useState([
    {
      title: 'Fournisseurs',
      value: '0',
      change: '0',
      icon: Building2,
      color: 'bg-gradient-to-br from-blue-500 to-teal-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Commandes en cours',
      value: '0',
      change: '0',
      icon: ShoppingCart,
      color: 'bg-gradient-to-br from-blue-500 to-teal-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Factures à payer',
      value: '0',
      change: '0',
      icon: Receipt,
      color: 'bg-gradient-to-br from-blue-500 to-teal-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Montant total',
      value: '€0',
      change: '0',
      icon: DollarSign,
      color: 'bg-gradient-to-br from-blue-500 to-teal-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    }
  ]);

  // Données réelles (vides au démarrage)
  const [recentActivities, setRecentActivities] = useState([]);

  // États pour les fournisseurs
  const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
  const [selectedFournisseurs, setSelectedFournisseurs] = useState([]);
  const [showDeleteBulkModal, setShowDeleteBulkModal] = useState(false);

  useEffect(() => {
    // Simulation de chargement des données réelles
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Ici on chargerait les vraies données depuis l'API
      setFournisseurs([]);
      setFilteredFournisseurs([]);
    }, 1000);
  }, []);

  // Mise à jour des statistiques quand les fournisseurs changent
  useEffect(() => {
    setStats(prev => prev.map(stat => {
      if (stat.title === 'Fournisseurs') {
        return { ...stat, value: fournisseurs.length.toString() };
      }
      return stat;
    }));
  }, [fournisseurs]);

  useEffect(() => {
    // Filtrage des fournisseurs
    const filtered = fournisseurs.filter(fournisseur => {
      const matchesSearch = fournisseur.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fournisseur.codeFournisseur?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || fournisseur.statut === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredFournisseurs(filtered);
  }, [fournisseurs, searchTerm, selectedStatus]);

  // Fermer les résultats de recherche des comptes quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.compte-search-container')) {
        setShowCompteResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateFournisseur = async () => {
    console.log('🚀 Tentative de création du fournisseur...', newFournisseur);
    
    // Validation des champs obligatoires
    if (!newFournisseur.raisonSociale || !newFournisseur.siret) {
      alert('❌ Erreur de validation :\n- La raison sociale est obligatoire\n- Le SIRET est obligatoire');
      return;
    }

    try {
      setLoading(true);
      
      // Créer le fournisseur localement (sans service externe)
      const nouveauFournisseur = {
        id: Date.now(), // ID unique temporaire
        codeFournisseur: nextFournisseurCode,
        raisonSociale: newFournisseur.raisonSociale,
        siret: newFournisseur.siret,
        tvaIntracommunautaire: newFournisseur.tvaIntracommunautaire || null,
        codeApeNaf: newFournisseur.codeApeNaf || null,
        formeJuridique: newFournisseur.formeJuridique || null,
        capitalSocial: newFournisseur.capitalSocial || null,
        adresseSiege: newFournisseur.adresseSiege || null,
        adresseLivraison: newFournisseur.adresseLivraison || null,
        plafondCredit: newFournisseur.plafondCredit || null,
        devise: newFournisseur.devise,
        estSousTraitant: newFournisseur.estSousTraitant,
        pasDeTvaGuyane: pasDeTvaGuyane,
        compteComptable: newFournisseur.compteComptable || null,
        dateCreation: new Date().toISOString(),
        statut: 'ACTIF'
      };

      console.log('✅ Fournisseur créé avec succès:', nouveauFournisseur);
      
      // Mettre à jour la liste locale IMMÉDIATEMENT
      setFournisseurs(prev => [nouveauFournisseur, ...prev]);
      
      // Générer le prochain code fournisseur
      const currentNumber = parseInt(nextFournisseurCode.split('-')[1]);
      const nextNumber = currentNumber + 1;
      setNextFournisseurCode(`FPRO97-${String(nextNumber).padStart(4, '0')}`);
      
      // Réinitialiser le formulaire
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
        estSousTraitant: false,
        // Conditions de règlement
        modeReglement: 'VIR',
        echeanceType: '30J',
        respectEcheance: true,
        joursDecalage: 30,
        finDeMois: false,
        jourPaiement: 0
      });
      setContacts([]);
      setPasDeTvaGuyane(false);
      setActiveCreateTab('coordonnees');
      
      // Fermer le modal et réinitialiser
      setShowCreateModal(false);
      
      // S'assurer qu'on est dans l'onglet Fournisseurs
      setActiveTab('fournisseurs');
      
      // Notification de succès
      alert(`✅ Fournisseur créé avec succès !\n\nRaison sociale: ${nouveauFournisseur.raisonSociale}\nCode: ${nouveauFournisseur.codeFournisseur}\nSIRET: ${nouveauFournisseur.siret}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      alert('❌ Erreur lors de la création du fournisseur');
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

    const handleDeleteFournisseur = async (id) => {
    try {
      // Utiliser le service local au lieu de l'API
      const fournisseursService = await import('../services/fournisseursService');
      fournisseursService.default.supprimerFournisseur(id);
      
      // Mettre à jour la liste locale
      setFournisseurs(prev => prev.filter(f => f.id !== id));
      alert('Fournisseur supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du fournisseur');
    }
  };

  const handleViewFournisseur = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    // Ici on pourrait ouvrir un modal de visualisation
    alert(`Visualisation de ${fournisseur.raisonSociale}\nCode: ${fournisseur.codeFournisseur}\nSIRET: ${fournisseur.siret}`);
  };

  const handleEditFournisseur = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    // Ici on pourrait ouvrir un modal d'édition
    alert(`Modification de ${fournisseur.raisonSociale}\nFonctionnalité en cours de développement`);
  };

  const handleSelectFournisseur = (id) => {
    setSelectedFournisseurs(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllFournisseurs = () => {
    if (selectedFournisseurs.length === filteredFournisseurs.length) {
      setSelectedFournisseurs([]);
    } else {
      setSelectedFournisseurs(filteredFournisseurs.map(f => f.id));
    }
  };

  const handleDeleteBulkFournisseurs = () => {
    if (selectedFournisseurs.length === 0) {
      alert('Aucun fournisseur sélectionné');
      return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFournisseurs.length} fournisseur(s) ?`)) {
      setFournisseurs(prev => prev.filter(f => !selectedFournisseurs.includes(f.id)));
      setSelectedFournisseurs([]);
      setShowDeleteBulkModal(false);
      alert(`${selectedFournisseurs.length} fournisseur(s) supprimé(s) avec succès !`);
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
    setNewCompte({ numeroCompte: '', intitule: '', typeCompte: 'FOURNISSEUR' });
    
    // Mettre à jour le champ de recherche avec le nouveau compte
    setSearchCompteTerm(`${newCompteData.numeroCompte} - ${newCompteData.intitule}`);
    setNewFournisseur({...newFournisseur, compteComptable: newCompteData.numeroCompte});
    
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
    setNewConditionPaiement({ libelle: '', type: 'COMPTANT', delai: '', escompte: '', description: '' });
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

  const [showCreateEcheanceModal, setShowCreateEcheanceModal] = useState(false);
  const [newEcheance, setNewEcheance] = useState({ libelle: '', delai: '', description: '' });
  const [echeances, setEcheances] = useState([
    { id: 'COMPTANT', libelle: 'COMPTANT - 0 jour', delai: 0, description: 'Paiement immédiat' },
    { id: '30J', libelle: '30J - 30 Jours date de facture', delai: 30, description: '30 jours après facture' },
    { id: '45J', libelle: '45J - 45 Jours date de facture', delai: 45, description: '45 jours après facture' },
    { id: '60J', libelle: '60J - 60 Jours date de facture', delai: 60, description: '60 jours après facture' },
    { id: 'FINMOIS30J', libelle: 'Fin de mois + 30J', delai: 30, description: 'Fin de mois + 30 jours' }
  ]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* AchatsBanner STICKY - reste fixé en haut */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <AchatsBanner />
          </div>
        </div>
      </div>

      {/* Navigation par onglets STICKY - reste sous le banner */}
      <div className="sticky top-[120px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 pb-4">
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <nav className="flex space-x-1 bg-[#1B275A] p-1 rounded-2xl shadow-sm border border-gray-200">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Target },
              { id: 'fournisseurs', label: 'Fournisseurs', icon: Building2 },
              { id: 'demandes-prix', label: 'Demandes de prix', icon: ClipboardList },
              { id: 'commandes', label: 'Bons de commande', icon: ShoppingCart },
              { id: 'factures', label: 'Factures', icon: Receipt },
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
            {/* Section Fournisseurs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Fournisseurs récents</h2>
        <button
                  onClick={() => setActiveTab('fournisseurs')}
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
                             ) : fournisseurs.length === 0 ? (
                 <div className="text-center py-12">
                   <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fournisseur</h3>
                   <p className="text-gray-500 mb-4">Commencez par ajouter votre premier fournisseur</p>
                   <GestalisButton 
                     onClick={() => setShowCreateModal(true)}
                     className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white"
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Ajouter un fournisseur
                   </GestalisButton>
                 </div>
               ) : (
                 <div className="space-y-4">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="text-sm font-medium text-gray-600">Fournisseurs créés</h4>
                     <span className="text-sm text-gray-500">Total: {fournisseurs.length}</span>
                   </div>
                   <div className="grid gap-3">
                     {fournisseurs.slice(0, 3).map((fournisseur) => (
                       <div key={fournisseur.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                           <Building2 className="h-4 w-4 text-blue-600" />
                         </div>
                         <div className="flex-1">
                           <h4 className="font-medium text-gray-900">{fournisseur.raisonSociale}</h4>
                           <p className="text-sm text-gray-500">{fournisseur.codeFournisseur} • {fournisseur.siret}</p>
                         </div>
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fournisseur.statut)}`}>
                           {getStatusText(fournisseur.statut)}
                         </span>
                       </div>
                     ))}
                   </div>
                   {fournisseurs.length > 3 && (
                     <div className="text-center pt-2">
        <button
          onClick={() => setActiveTab('fournisseurs')}
                         className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                       >
                         Voir tous les {fournisseurs.length} fournisseurs →
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

        {activeTab === 'commandes' && (
          <Commandes />
        )}

        {activeTab === 'factures' && (
          <Factures />
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Module Analytics</h3>
            <p className="text-gray-500">Fonctionnalité en cours de développement</p>
          </div>
        )}

        {activeTab === 'fournisseurs' && (
          <div className="space-y-6">
            {/* Barre de recherche et filtres */}
            <GestalisCard className="bg-white border-0 shadow-sm">
              <GestalisCardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher un fournisseur..."
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

            {/* Liste des fournisseurs */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : fournisseurs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun fournisseur trouvé</h3>
                <p className="text-gray-500 mb-6">Commencez par ajouter votre premier fournisseur</p>
                <GestalisButton 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un fournisseur
                </GestalisButton>
              </div>
            ) : (
              <div className="grid gap-4">
                {fournisseurs.map((fournisseur) => (
                  <GestalisCard key={fournisseur.id} className="hover:shadow-md transition-all duration-300 border-0 bg-white">
                    <GestalisCardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{fournisseur.raisonSociale}</h3>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Actif
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.codeFournisseur}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.siret}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.adresseSiege?.split(',')[0] || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{fournisseur.compteComptable || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <GestalisButton 
                            variant="outline" 
                            size="sm" 
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            title="Visualiser"
                          >
                            <Eye className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton 
                            variant="outline" 
                            size="sm"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton 
                            variant="danger" 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            title="Supprimer"
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

      {/* Modals de base */}
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

      {/* Modal de création de fournisseur moderne */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex">
            {/* Sidebar colorée avec navigation */}
            <div className="w-80 bg-gradient-to-b from-blue-500 to-teal-600 p-6 text-white">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Nouveau Fournisseur</h3>
                <p className="text-blue-100">Remplissez les informations du fournisseur</p>
              </div>
              
              <nav className="space-y-2">
                {[
                  { id: 'coordonnees', label: 'Coordonnées', icon: Building2 },
                  { id: 'infosJuridiques', label: 'Infos juridiques', icon: Shield },
                  { id: 'contacts', label: 'Contacts', icon: Users },
                  { id: 'conditionsCommerciales', label: 'Informations bancaires', icon: CreditCard },
                  { id: 'compta', label: 'Compta', icon: Calculator }
                ].map((tab) => (
        <button
                    key={tab.id}
                    onClick={() => setActiveCreateTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeCreateTab === tab.id
                        ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
        </button>
                ))}
              </nav>
            </div>

            {/* Contenu principal du modal */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {activeCreateTab === 'coordonnees' && 'Coordonnées du fournisseur'}
                  {activeCreateTab === 'infosJuridiques' && 'Informations juridiques'}
                  {activeCreateTab === 'contacts' && 'Contacts du fournisseur'}
                  {activeCreateTab === 'conditionsCommerciales' && 'Informations bancaires'}
                  {activeCreateTab === 'compta' && 'Informations comptables'}
                </h3>
        <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
        </button>
      </div>

              {/* Onglet Coordonnées */}
              {activeCreateTab === 'coordonnees' && (
      <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code fournisseur</label>
                      <Input
                        value={nextFournisseurCode}
                        disabled
                        className="w-full bg-gray-100"
                      />
                      <p className="text-sm text-gray-500 mt-1">Code généré automatiquement</p>
                          </div>
                          <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Raison sociale *</label>
                      <Input
                        value={newFournisseur.raisonSociale}
                        onChange={(e) => setNewFournisseur({...newFournisseur, raisonSociale: e.target.value})}
                        placeholder="Nom de l'entreprise"
                        className="w-full"
                      />
                          </div>
                        </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SIRET *</label>
                      <Input
                        value={newFournisseur.siret}
                        onChange={(e) => setNewFournisseur({...newFournisseur, siret: e.target.value})}
                        placeholder="12345678901234"
                        className="w-full"
                      />
                          </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code APE/NAF</label>
                      <Input
                        value={newFournisseur.codeApeNaf}
                        onChange={(e) => setNewFournisseur({...newFournisseur, codeApeNaf: e.target.value})}
                        placeholder="4321A"
                        className="w-full"
                      />
                        </div>
                      </div>

                  <div className="grid grid-cols-2 gap-6">
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
                        <option value="AUTRE">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse du siège</label>
                      <Input
                        value={newFournisseur.adresseSiege}
                        onChange={(e) => setNewFournisseur({...newFournisseur, adresseSiege: e.target.value})}
                        placeholder="123 Rue de la Paix, 75001 Paris"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="estSousTraitant"
                      checked={newFournisseur.estSousTraitant}
                      onChange={(e) => setNewFournisseur({...newFournisseur, estSousTraitant: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="estSousTraitant" className="text-sm font-medium text-gray-700">
                      Ce fournisseur est un sous-traitant
                    </label>
                  </div>
                  
                  {newFournisseur.estSousTraitant && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Information :</strong> En cochant cette case, le fournisseur sera automatiquement 
                        classé comme sous-traitant dans la comptabilité et des règles spécifiques s'appliqueront 
                        (ex: TVA différente, documents obligatoires, etc.).
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Onglet Infos juridiques */}
              {activeCreateTab === 'infosJuridiques' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="pasDeTvaGuyane"
                      checked={pasDeTvaGuyane}
                      onChange={(e) => setPasDeTvaGuyane(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="pasDeTvaGuyane" className="text-sm font-medium text-gray-700">
                      ✅ Pas de TVA – Guyane (CGI art. 294, 1°)
                    </label>
                  </div>
                  
                  {!pasDeTvaGuyane && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">TVA intracommunautaire</label>
                      <Input
                        value={newFournisseur.tvaIntracommunautaire}
                        onChange={(e) => setNewFournisseur({...newFournisseur, tvaIntracommunautaire: e.target.value})}
                        placeholder="FR12345678901"
                        className="w-full"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capital social</label>
                    <Input
                      value={newFournisseur.capitalSocial}
                      onChange={(e) => setNewFournisseur({...newFournisseur, capitalSocial: e.target.value})}
                      placeholder="100000"
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Onglet Contacts */}
              {activeCreateTab === 'contacts' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom du contact principal</label>
                      <Input
                        value={newFournisseur.contactPrincipal?.nom || ''}
                        onChange={(e) => setNewFournisseur({
                          ...newFournisseur, 
                          contactPrincipal: {...newFournisseur.contactPrincipal, nom: e.target.value}
                        })}
                        placeholder="Jean Dupont"
                        className="w-full"
                      />
                </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                      <Input
                        value={newFournisseur.contactPrincipal?.fonction || ''}
                        onChange={(e) => setNewFournisseur({
                          ...newFournisseur, 
                          contactPrincipal: {...newFournisseur.contactPrincipal, fonction: e.target.value}
                        })}
                        placeholder="Directeur commercial"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone fixe</label>
                      <Input
                        value={newFournisseur.contactPrincipal?.telephone || ''}
                        onChange={(e) => setNewFournisseur({
                          ...newFournisseur, 
                          contactPrincipal: {...newFournisseur.contactPrincipal, telephone: e.target.value}
                        })}
                        placeholder="01 23 45 67 89"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone portable</label>
                      <Input
                        value={newFournisseur.contactPrincipal?.portable || ''}
                        onChange={(e) => setNewFournisseur({
                          ...newFournisseur, 
                          contactPrincipal: {...newFournisseur.contactPrincipal, portable: e.target.value}
                        })}
                        placeholder="06 12 34 56 78"
                        className="w-full"
                      />
                  </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={newFournisseur.contactPrincipal?.email || ''}
                      onChange={(e) => setNewFournisseur({
                        ...newFournisseur, 
                        contactPrincipal: {...newFournisseur.contactPrincipal, email: e.target.value}
                      })}
                      placeholder="contact@entreprise.com"
                      className="w-full"
                    />
                        </div>

                  {/* Contacts supplémentaires */}
                  {contacts.map((contact, index) => (
                    <div key={contact.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">Contact {index + 2}</h4>
                        <button
                          onClick={() => removeContact(contact.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Nom"
                          value={contact.nom}
                          onChange={(e) => updateContact(contact.id, 'nom', e.target.value)}
                        />
                        <Input
                          placeholder="Fonction"
                          value={contact.fonction}
                          onChange={(e) => updateContact(contact.id, 'fonction', e.target.value)}
                        />
                        <Input
                          placeholder="Téléphone"
                          value={contact.telephone}
                          onChange={(e) => updateContact(contact.id, 'telephone', e.target.value)}
                        />
                        <Input
                          placeholder="Email"
                          value={contact.email}
                          onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addContact}
                    className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un contact
                  </button>
                </div>
              )}

              {/* Onglet Informations bancaires */}
              {activeCreateTab === 'conditionsCommerciales' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RIB/IBAN</label>
                      <Input
                        value={newFournisseur.ribIban || ''}
                        onChange={(e) => setNewFournisseur({...newFournisseur, ribIban: e.target.value})}
                        placeholder="FR76 1234 5678 9012 3456 7890 123"
                        className="w-full"
                      />
                        </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">BIC/SWIFT</label>
                      <Input
                        value={newFournisseur.bicSwift || ''}
                        onChange={(e) => setNewFournisseur({...newFournisseur, bicSwift: e.target.value})}
                        placeholder="BNPAFRPP123"
                        className="w-full"
                      />
                      </div>
                    </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la banque</label>
                      <Input
                        value={newFournisseur.nomBanque || ''}
                        onChange={(e) => setNewFournisseur({...newFournisseur, nomBanque: e.target.value})}
                        placeholder="Banque Populaire"
                        className="w-full"
                      />
                        </div>
                        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code banque</label>
                      <Input
                        value={newFournisseur.codeBanque || ''}
                        onChange={(e) => setNewFournisseur({...newFournisseur, codeBanque: e.target.value})}
                        placeholder="12345"
                        className="w-full"
                      />
                        </div>
                      </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code guichet</label>
                      <Input
                        value={newFournisseur.codeGuichet || ''}
                        onChange={(e) => setNewFournisseur({...newFournisseur, codeGuichet: e.target.value})}
                        placeholder="67890"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de compte</label>
                      <Input
                        value={newFournisseur.numeroCompte || ''}
                        onChange={(e) => setNewFournisseur({...newFournisseur, numeroCompte: e.target.value})}
                        placeholder="12345678901"
                        className="w-full"
                      />
                        </div>
                  </div>

                        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clé RIB</label>
                    <Input
                      value={newFournisseur.cleRib || ''}
                      onChange={(e) => setNewFournisseur({...newFournisseur, cleRib: e.target.value})}
                      placeholder="12"
                      className="w-full"
                    />
                        </div>
                      </div>
              )}

                             {/* Onglet Compta */}
               {activeCreateTab === 'compta' && (
                 <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Compte fournisseur</label>
                       
                       {/* Combobox : Recherche + Sélection en un seul endroit */}
                       <div className="relative mb-2 compte-search-container">
                         <div className="flex gap-2">
                           <div className="flex-1 relative">
                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                             <Input
                               placeholder="Tapez pour rechercher (ex: 'bt', 'construction')..."
                               value={searchCompteTerm}
                                                                onChange={(e) => {
                                   const value = e.target.value;
                                   setSearchCompteTerm(value);
                                   
                                   if (value.length > 0) {
                                     // Filtrer les comptes en temps réel
                                     const filtered = planComptable.filter(compte => 
                                       compte.numeroCompte.toLowerCase().includes(value.toLowerCase()) ||
                                       compte.intitule.toLowerCase().includes(value.toLowerCase())
                                     );
                                     setFilteredPlanComptable(filtered);
                                     setShowCompteResults(true);
                                   } else {
                                     setFilteredPlanComptable(planComptable);
                                     setShowCompteResults(false);
                                   }
                                 }}
                               onFocus={() => {
                                 if (searchCompteTerm.length > 0) {
                                   setShowCompteResults(true);
                                 }
                               }}
                               className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                             />
                             
                             {/* Résultats de recherche en dropdown */}
                             {showCompteResults && searchCompteTerm.length > 0 && (
                               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                 {filteredPlanComptable.length > 0 ? (
                                   filteredPlanComptable.map((compte) => (
                                     <div
                                       key={compte.numeroCompte}
                                       onClick={() => {
                                         setNewFournisseur({...newFournisseur, compteComptable: compte.numeroCompte});
                                         setSearchCompteTerm(`${compte.numeroCompte} - ${compte.intitule}`);
                                         setShowCompteResults(false);
                                       }}
                                       className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                     >
                                       <div className="font-medium text-gray-900">{compte.numeroCompte}</div>
                                       <div className="text-sm text-gray-600">{compte.intitule}</div>
                    </div>
                                   ))
                                 ) : (
                                   <div className="px-4 py-3 text-gray-500 text-center">
                                     Aucun compte trouvé
                  </div>
                                 )}
            </div>
                             )}
                           </div>
                           
                           <button
                             onClick={() => setShowCreateCompteModal(true)}
                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                             title="Créer un nouveau compte"
                           >
                             <Plus className="h-4 w-4" />
                             <span className="text-sm font-medium">Nouveau</span>
                           </button>
                         </div>
                         
                         <p className="text-sm text-gray-500 mt-1">
                           {searchCompteTerm.length > 0 ? `${filteredPlanComptable.length} compte(s) trouvé(s)` : 'Tapez pour rechercher un compte existant ou créez-en un nouveau'}
                         </p>
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                       <select
                         value={newFournisseur.devise}
                         onChange={(e) => setNewFournisseur({...newFournisseur, devise: e.target.value})}
                         className="w-full border border-gray-300 rounded-md px-3 py-2"
                       >
                         <option value="EUR">EUR (€)</option>
                         <option value="USD">USD ($)</option>
                         <option value="GBP">GBP (£)</option>
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Plafond de crédit</label>
                     <Input
                       type="number"
                       value={newFournisseur.plafondCredit}
                       onChange={(e) => setNewFournisseur({...newFournisseur, plafondCredit: e.target.value})}
                       placeholder="50000"
                       className="w-full"
                     />
                   </div>

                   {/* Conditions de Règlement */}
                   <div className="border-t pt-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4">Conditions de Règlement</h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* Mode de Règlement */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Mode de Règlement
                         </label>
                         <select
                           value={newFournisseur.modeReglement || 'VIR'}
                           onChange={(e) => {
                             const mode = e.target.value;
                             setNewFournisseur({
                               ...newFournisseur, 
                               modeReglement: mode,
                               // Logique métier : si COMPTANT, jours de décalage = 0
                               joursDecalage: mode === 'COMPTANT' ? 0 : (newFournisseur.joursDecalage || 30)
                             });
                           }}
                           className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                         >
                           <option value="COMPTANT">COMPTANT - Paiement immédiat</option>
                           <option value="VIR">VIR - Virement</option>
                           <option value="CHQ">CHQ - Chèque</option>
                           <option value="ESP">ESP - Espèces</option>
                           <option value="CARTE">CARTE - Carte bancaire</option>
                         </select>
                       </div>

                       {/* Échéance type */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Échéance type
                         </label>
                         <div className="flex gap-2">
                           <select
                             value={newFournisseur.echeanceType || '30J'}
                             onChange={(e) => {
                               const echeance = e.target.value;
                               const selectedEcheance = echeances.find(e => e.id === echeance);
                               setNewFournisseur({
                                 ...newFournisseur, 
                                 echeanceType: echeance,
                                 // Logique métier : si COMPTANT, jours de décalage = 0
                                 joursDecalage: echeance === 'COMPTANT' ? 0 : (selectedEcheance?.delai || 30)
                               });
                             }}
                             className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                           >
                             {echeances.map((echeance) => (
                               <option key={echeance.id} value={echeance.id}>
                                 {echeance.libelle}
                               </option>
                             ))}
                           </select>
                           
                           <button
                             type="button"
                             onClick={() => setShowCreateEcheanceModal(true)}
                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                             title="Créer une nouvelle échéance"
                           >
                             <Plus className="h-4 w-4" />
                             <span className="text-sm font-medium">Nouvelle</span>
                           </button>
                         </div>
                       </div>

                       {/* Respect Échéance */}
                       <div className="flex items-center">
                         <input
                           type="checkbox"
                           id="respectEcheance"
                           checked={newFournisseur.respectEcheance !== undefined ? newFournisseur.respectEcheance : true}
                           onChange={(e) => setNewFournisseur({...newFournisseur, respectEcheance: e.target.checked})}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         />
                         <label htmlFor="respectEcheance" className="ml-2 block text-sm text-gray-900">
                           Respect Échéance type
                         </label>
                       </div>

                       {/* Jours de décalage */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Jours de décalage
                         </label>
                         <input
                           type="number"
                           value={newFournisseur.joursDecalage !== undefined ? newFournisseur.joursDecalage : 30}
                           onChange={(e) => setNewFournisseur({...newFournisseur, joursDecalage: parseInt(e.target.value) || 0})}
                           className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                           min="0"
                         />
                       </div>

                       {/* Fin de mois */}
                       <div className="flex items-center">
                         <input
                           type="checkbox"
                           id="finDeMois"
                           checked={newFournisseur.finDeMois !== undefined ? newFournisseur.finDeMois : false}
                           onChange={(e) => setNewFournisseur({...newFournisseur, finDeMois: e.target.checked})}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         />
                         <label htmlFor="finDeMois" className="ml-2 block text-sm text-gray-900">
                           Fin de mois
                         </label>
                       </div>

                       {/* Jour de paiement */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Jour de paiement
                         </label>
                         <input
                           type="number"
                           value={newFournisseur.jourPaiement !== undefined ? newFournisseur.jourPaiement : 0}
                           onChange={(e) => setNewFournisseur({...newFournisseur, jourPaiement: parseInt(e.target.value) || 0})}
                           className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                           min="0"
                           max="31"
                         />
                       </div>
                     </div>
                   </div>
          </div>
        )}

              {/* Navigation et actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
                <div className="flex gap-3">
                  {/* Bouton Annuler - NOUVEAU */}
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </button>

                  {activeCreateTab !== 'coordonnees' && (
                    <button
                      onClick={() => {
                        const tabs = ['coordonnees', 'infosJuridiques', 'contacts', 'conditionsCommerciales', 'compta'];
                        const currentIndex = tabs.indexOf(activeCreateTab);
                        if (currentIndex > 0) {
                          setActiveCreateTab(tabs[currentIndex - 1]);
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Précédent
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  {activeCreateTab !== 'compta' && (
                    <button
                      onClick={() => {
                        const tabs = ['coordonnees', 'infosJuridiques', 'contacts', 'conditionsCommerciales', 'compta'];
                        const currentIndex = tabs.indexOf(activeCreateTab);
                        if (currentIndex < tabs.length - 1) {
                          setActiveCreateTab(tabs[currentIndex + 1]);
                        }
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-md hover:from-blue-600 hover:to-teal-700 transition-all duration-200"
                    >
                      Suivant
                    </button>
                  )}
                  
                  {/* Bouton Créer visible partout */}
                  <button
                    onClick={handleCreateFournisseur}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium"
                  >
                    Créer le fournisseur
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

             {/* Modal de création de compte comptable */}
       {showCreateCompteModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-600 rounded-full flex items-center justify-center">
                     <Calculator className="h-5 w-5 text-white" />
                   </div>
                   <div>
                     <h3 className="text-xl font-semibold text-gray-900">Créer un nouveau compte fournisseur</h3>
                     <p className="text-sm text-gray-600">Ajoutez un compte au plan comptable</p>
                   </div>
                 </div>
                 <button
                   onClick={() => setShowCreateCompteModal(false)}
                   className="text-gray-400 hover:text-gray-600"
                 >
                   <X className="h-6 w-6" />
                 </button>
               </div>
             </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de compte (F...)</label>
                <Input
                  value={newCompte.numeroCompte}
                  onChange={(e) => setNewCompte({...newCompte, numeroCompte: e.target.value})}
                  placeholder="F0001"
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">Format obligatoire : F suivi de chiffres (ex: F0001)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Intitulé du compte</label>
                <Input
                  value={newCompte.intitule}
                  onChange={(e) => setNewCompte({...newCompte, intitule: e.target.value})}
                  placeholder="Fournisseur - [Nom de l'entreprise]"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de compte</label>
                <select
                  value={newCompte.typeCompte}
                  onChange={(e) => setNewCompte({...newCompte, typeCompte: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="FOURNISSEUR">Fournisseur</option>
                  <option value="SOUS_TRAITANT">Sous-traitant</option>
                  <option value="TRANSPORT">Transport</option>
                  <option value="DEPOT">Dépôt</option>
                  <option value="DOUANE">Douane</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateCompteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateCompte}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Créer le compte
              </button>
            </div>
          </div>
          </div>
        )}

      {/* Modal de création de condition de paiement */}
      {showCreateConditionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Créer une nouvelle condition de paiement</h3>
                <button
                  onClick={() => setShowCreateConditionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
      </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Libellé</label>
                <Input
                  value={newConditionPaiement.libelle}
                  onChange={(e) => setNewConditionPaiement({...newConditionPaiement, libelle: e.target.value})}
                  placeholder="Comptant, 30 jours, 45 jours FM..."
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de condition</label>
                <select
                  value={newConditionPaiement.type}
                  onChange={(e) => setNewConditionPaiement({...newConditionPaiement, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="COMPTANT">Comptant</option>
                  <option value="NET">Net</option>
                  <option value="ESCOMPTE">Escompte</option>
                  <option value="FIN_DE_MOIS">Fin de mois</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Délai (en jours)</label>
                  <Input
                    type="number"
                    value={newConditionPaiement.delai}
                    onChange={(e) => setNewConditionPaiement({...newConditionPaiement, delai: e.target.value})}
                    placeholder="0, 30, 45..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Escompte (%)</label>
                  <Input
                    type="number"
                    value={newConditionPaiement.escompte}
                    onChange={(e) => setNewConditionPaiement({...newConditionPaiement, escompte: e.target.value})}
                    placeholder="5, 10..."
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newConditionPaiement.description}
                  onChange={(e) => setNewConditionPaiement({...newConditionPaiement, description: e.target.value})}
                  placeholder="Description détaillée de la condition..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateConditionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateConditionPaiement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Créer la condition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'échéance */}
      {showCreateEcheanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Créer une nouvelle échéance</h3>
              <button
                onClick={() => setShowCreateEcheanceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Libellé de l'échéance
                </label>
                <input
                  type="text"
                  value={newEcheance.libelle}
                  onChange={(e) => setNewEcheance({...newEcheance, libelle: e.target.value})}
                  placeholder="ex: 15J - 15 Jours"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Délai en jours
                </label>
                <input
                  type="number"
                  value={newEcheance.delai}
                  onChange={(e) => setNewEcheance({...newEcheance, delai: e.target.value})}
                  placeholder="15"
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={newEcheance.description}
                  onChange={(e) => setNewEcheance({...newEcheance, description: e.target.value})}
                  placeholder="ex: 15 jours après la date de facture"
                  rows="2"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateEcheanceModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateEcheance}
                disabled={!newEcheance.libelle || !newEcheance.delai}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Créer l'échéance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achats; 
