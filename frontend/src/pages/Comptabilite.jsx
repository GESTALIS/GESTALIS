import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Building2, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Users,
  CreditCard,
  Clock,
  X,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  Database,
  Shield,
  Target,
  Settings,
  Info,
  ExternalLink,
  History
} from 'lucide-react';
import { GestalisCard, GestalisCardContent } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';
import { Input } from '../components/ui/input';
import { useComptesStore } from '../stores/useComptesStore';
import { useReturnNav } from '../hooks/useReturnNav';

// Composant banner pour Comptabilité (dégradé orange)
const ComptabiliteBanner = ({ description, children }) => {
  const comptabiliteStyle = {
    borderRadius: '16px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
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
    <div className="module-banner comptabilite-banner" style={comptabiliteStyle}>
      <div className="module-icon" style={{ fontSize: '1.8rem' }}>📊</div>
      <div>
        <div className="module-title" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Module Comptabilité</div>
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

const Comptabilite = () => {
  // Hook pour la navigation de retour (mode picker)
  const { isPicker, returnTo, returnField, draftId, goBackWith, cancelAndReturn } = useReturnNav();
  
  // États pour la gestion des onglets
  const [activeTab, setActiveTab] = useState('overview');
  
  // États pour la gestion des données
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Store des comptes
  const { comptes, addCompte, updateCompte, deleteCompte, setComptes, loadFromSupabase: loadComptesFromSupabase } = useComptesStore();
  
  // États pour les modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showControlModal, setShowControlModal] = useState(false);
  const [showCompteModal, setShowCompteModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  
  // États pour la création
  const [activeCreateTab, setActiveCreateTab] = useState('plan-comptable');
  
  // États pour la création de compte
  const [newCompte, setNewCompte] = useState({
    numero: '',
    classe: '',
    nom: '',
    type: 'charge',
    description: '',
    journalCentralisation: '',
    saisieAutorisee: true,
    actif: true
  });
  const [compteErrors, setCompteErrors] = useState({});
  
  // États pour la création de journal
  const [newJournal, setNewJournal] = useState({
    code: '',
    nom: '',
    type: 'mixte',
    description: '',
    actif: true
  });
  const [journalErrors, setJournalErrors] = useState({});
  
  // Données des journaux existants
  const [journaux, setJournaux] = useState([
    { id: 1, code: 'ACH', nom: 'Achats', type: 'debit', description: 'Journal des achats et fournisseurs', actif: true, dateCreation: '2025-01-01' },
    { id: 2, code: 'VEN', nom: 'Ventes', type: 'credit', description: 'Journal des ventes et clients', actif: true, dateCreation: '2025-01-01' },
    { id: 3, code: 'BAN', nom: 'Banque', type: 'mixte', description: 'Journal des opérations bancaires', actif: true, dateCreation: '2025-01-01' },
    { id: 4, code: 'OD', nom: 'Opérations Diverses', type: 'mixte', description: 'Journal des opérations diverses', actif: true, dateCreation: '2025-01-01' },
    { id: 5, code: 'CAI', nom: 'Caisse', type: 'mixte', description: 'Journal des opérations de caisse', actif: true, dateCreation: '2025-01-01' },
    { id: 6, code: 'PAY', nom: 'Paiements', type: 'credit', description: 'Journal des opérations diverses', actif: true, dateCreation: '2025-01-01' }
  ]);

  
  // Fonctions intelligentes pour la détection des comptes
  const detectCompteClasse = (numero) => {
    if (!numero) return '';
    
    // Détection intelligente pour F et C
    if (numero.startsWith('F')) return '4 - Tiers (Fournisseurs)';
    if (numero.startsWith('C')) return '4 - Tiers (Clients)';
    
    const premierChiffre = numero.charAt(0);
    switch (premierChiffre) {
      case '1': return '1 - Capitaux';
      case '2': return '2 - Immobilisations';
      case '3': return '3 - Stocks';
      case '4': return '4 - Tiers';
      case '5': return '5 - Financiers';
      case '6': return '6 - Charges';
      case '7': return '7 - Produits';
      default: return '';
    }
  };

  const detectCompteType = (numero) => {
    if (!numero) return 'charge';
    
    // Détection intelligente pour F et C
    if (numero.startsWith('F')) return 'passif';
    if (numero.startsWith('C')) return 'actif';
    
    const premierChiffre = numero.charAt(0);
    switch (premierChiffre) {
      case '1': return 'passif';
      case '2': return 'actif';
      case '3': return 'actif';
      case '4': return 'mixte';
      case '5': return 'actif';
      case '6': return 'charge';
      case '7': return 'produit';
      default: return 'charge';
    }
  };

  const handleCreateCompte = () => {
    console.log('🚀 Tentative de création du compte...', newCompte);
    
    // Validation
    const errors = {};
    if (!newCompte.numero) errors.numero = 'Le numéro de compte est obligatoire';
    if (!newCompte.nom) errors.nom = 'Le nom du compte est obligatoire';
    if (!newCompte.journalCentralisation) errors.journalCentralisation = 'Le journal de centralisation est obligatoire';
    
    // Vérification des doublons (insensible à la casse)
    const numeroExists = comptes.some(compte => 
      compte.numero.toLowerCase() === newCompte.numero.toLowerCase()
    );
    if (numeroExists) {
      errors.numero = 'Ce numéro de compte existe déjà';
    }
    
    if (Object.keys(errors).length > 0) {
      console.log('❌ Erreurs de validation:', errors);
      setCompteErrors(errors);
      
      // Message d'erreur pour l'utilisateur
      alert(`❌ Erreur de validation :\n${Object.values(errors).join('\n')}`);
      return;
    }

    // Détection automatique de la classe et du type
    const classeAuto = detectCompteClasse(newCompte.numero);
    const typeAuto = detectCompteType(newCompte.numero);
    
    // Numéro de compte final (utiliser le numéro saisi par l'utilisateur)
    const compte = {
      ...newCompte,
      numero: newCompte.numero, // Utiliser le numéro saisi
      classe: classeAuto,
      type: typeAuto,
      id: Date.now(),
      dateCreation: new Date().toISOString()
    };
    
    console.log('✅ Compte créé avec succès:', compte);
    
    // Utiliser Zustand pour ajouter le compte
    addCompte(compte);
    
    // Si on est en mode picker, retourner au formulaire d'origine
    if (isPicker && returnTo) {
      console.log('🚀 Navigation de retour vers:', returnTo);
      goBackWith({
        id: compte.id,
        numero: compte.numero,
        intitule: compte.nom
      });
      return;
    }
    
    // Message de succès pour l'utilisateur
    alert(`✅ Compte créé avec succès !\n\nNuméro: ${compte.numero}\nNom: ${compte.nom}\nClasse: ${compte.classe}\nType: ${compte.type}`);
    
    // Réinitialiser le formulaire
    resetCompteForm();
  };

  const resetCompteForm = () => {
    setNewCompte({
      numero: '',
      classe: '',
      nom: '',
      type: 'charge',
      description: '',
      journalCentralisation: '',
      saisieAutorisee: true,
      actif: true
    });
    setCompteErrors({});
    setShowCompteModal(false);
  };

  const handleCreateJournal = () => {
    console.log('🚀 Tentative de création du journal...', newJournal);
    
    // Validation
    const errors = {};
    if (!newJournal.code) errors.code = 'Le code du journal est obligatoire';
    if (!newJournal.nom) errors.nom = 'Le nom du journal est obligatoire';
    
    // Vérification des doublons (insensible à la casse)
    const codeExists = journaux.some(journal => 
      journal.code.toLowerCase() === newJournal.code.toLowerCase()
    );
    if (codeExists) {
      errors.code = 'Ce code de journal existe déjà';
    }
    
    if (Object.keys(errors).length > 0) {
      console.log('❌ Erreurs de validation:', errors);
      setJournalErrors(errors);
      
      // Message d'erreur pour l'utilisateur
      alert(`❌ Erreur de validation :\n${Object.values(errors).join('\n')}`);
      return;
    }

    const journal = {
      ...newJournal,
      id: Date.now(),
      dateCreation: new Date().toISOString()
    };
    
    console.log('✅ Journal créé avec succès:', journal);
    
    // Ajouter le journal à la liste IMMÉDIATEMENT
    setJournaux(prev => [journal, ...prev]);
    
    // Message de succès pour l'utilisateur
    alert(`✅ Journal créé avec succès !\n\nCode: ${journal.code}\nNom: ${journal.nom}\nType: ${journal.type}`);
    
    // Réinitialiser le formulaire
    resetJournalForm();
  };

  const resetJournalForm = () => {
    setNewJournal({
      code: '',
      nom: '',
      type: 'mixte',
      description: '',
      actif: true
    });
    setJournalErrors({});
    setShowJournalModal(false);
  };

  // Fonctions d'action pour les comptes
  const handleViewCompte = (compte) => {
    alert(`📊 Détails du compte :\n\nNuméro: ${compte.numero}\nNom: ${compte.nom}\nClasse: ${compte.classe}\nType: ${compte.type}\nJournal: ${compte.journalCentralisation}\nStatut: ${compte.actif ? 'Actif' : 'Inactif'}\nDate création: ${new Date(compte.dateCreation).toLocaleDateString('fr-FR')}`);
  };

  const handleEditCompte = (compte) => {
    // Pré-remplir le formulaire avec les données du compte
    setNewCompte({
      numero: compte.numero,
      classe: compte.classe,
      nom: compte.nom,
      type: compte.type,
      description: compte.description || '',
      journalCentralisation: compte.journalCentralisation,
      saisieAutorisee: compte.saisieAutorisee || true,
      actif: compte.actif
    });
    
    // Ouvrir le modal en mode édition
    setShowCompteModal(true);
    setActiveCreateTab('identite');
    
    // Supprimer le compte de la liste (il sera recréé)
    setComptes(prev => prev.filter(c => c.id !== compte.id));
  };

  const handleDeleteCompte = (compte) => {
    if (confirm(`🗑️ Êtes-vous sûr de vouloir supprimer le compte "${compte.nom}" (${compte.numero}) ?`)) {
      // Utiliser Zustand pour supprimer
      deleteCompte(compte.id);
      alert(`✅ Compte "${compte.nom}" supprimé avec succès !`);
    }
  };

  // Fonctions d'action pour les journaux
  const handleViewJournal = (journal) => {
    alert(`📝 Détails du journal :\n\nCode: ${journal.code}\nNom: ${journal.nom}\nType: ${journal.type}\nDescription: ${journal.description || 'Aucune description'}\nStatut: ${journal.actif ? 'Actif' : 'Inactif'}\nDate création: ${new Date(journal.dateCreation).toLocaleDateString('fr-FR')}`);
  };

  const handleEditJournal = (journal) => {
    // Pré-remplir le formulaire avec les données du journal
    setNewJournal({
      code: journal.code,
      nom: journal.nom,
      type: journal.type,
      description: journal.description || '',
      actif: journal.actif
    });
    
    // Ouvrir le modal en mode édition
    setShowJournalModal(true);
    
    // Supprimer le journal de la liste (il sera recréé)
    setJournaux(prev => prev.filter(j => j.id !== journal.id));
  };

  const handleDeleteJournal = (journal) => {
    if (confirm(`🗑️ Êtes-vous sûr de vouloir supprimer le journal "${journal.nom}" (${journal.code}) ?`)) {
      setJournaux(prev => prev.filter(j => j.id !== journal.id));
      alert(`✅ Journal "${journal.nom}" supprimé avec succès !`);
    }
  };

  // Données de test pour les statistiques
  const stats = [
    {
      title: 'Total Factures',
      value: '156',
      change: '+12',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      color: 'text-blue-600',
      icon: FileText
    },
    {
      title: 'Non Comptabilisées',
      value: '23',
      change: '-5',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      color: 'text-yellow-600',
      icon: Clock
    },
    {
      title: 'Comptabilisées',
      value: '133',
      change: '+17',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      color: 'text-green-600',
      icon: CheckCircle
    },
    {
      title: 'Montant Total',
      value: '€89.450',
      change: '+€12.300',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      color: 'text-purple-600',
      icon: TrendingUp
    }
  ];

  // Activités récentes
  const recentActivities = [
    {
      description: 'Export comptable FEC créé - Lot 2025-08-27',
      time: 'Il y a 2 heures',
      icon: Download
    },
    {
      description: 'Facture BCPRO97-0001 comptabilisée',
      time: 'Il y a 4 heures',
      icon: CheckCircle
    },
    {
      description: 'Erreur détectée sur compte 401 inexistant',
      time: 'Il y a 1 jour',
      icon: AlertTriangle
    },
    {
      description: 'Nouveau journal OD créé',
      time: 'Il y a 2 jours',
      icon: Plus
    }
  ];

  // Initialisation
  useEffect(() => {
    // Gérer les paramètres d'URL pour les onglets
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'plan-comptable', 'journaux', 'factures', 'export', 'controles', 'rapports'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    // Pas de comptes par défaut - l'utilisateur crée ses propres comptes
    // avec ses propres numéros
  }, []);

  // Vérifier s'il faut ouvrir automatiquement le modal de création de compte (mode picker)
  useEffect(() => {
    if (isPicker) {
      // Ouvrir le modal de création de compte en mode picker
      setShowCompteModal(true);
      console.log('🚀 Modal de création de compte ouvert en mode picker depuis Fournisseur');
    }
  }, [isPicker]);

  // Charger les comptes depuis Supabase au démarrage
  useEffect(() => {
    const loadComptes = async () => {
      try {
        console.log('🔄 Chargement des comptes depuis Supabase...');
        await loadComptesFromSupabase();
        console.log('✅ Comptes chargés depuis Supabase');
      } catch (error) {
        console.error('❌ Erreur chargement comptes:', error);
        // En cas d'erreur, ajouter quelques comptes de test
        console.log('🔄 Ajout de comptes de test...');
        setComptes([
          { id: 1, numero: 'F4010005', nom: 'RESO', type: 'passif', classe: '4 - Tiers' },
          { id: 2, numero: 'FEXE', nom: 'EXEMPLE', type: 'passif', classe: '4 - Tiers' },
          { id: 3, numero: 'FTESTDPL', nom: 'TESTDPL', type: 'passif', classe: '4 - Tiers' },
          { id: 4, numero: 'FFDXSQ', nom: 'FDS', type: 'passif', classe: '4 - Tiers' },
          { id: 5, numero: 'FTETETE', nom: 'TETETE', type: 'passif', classe: '4 - Tiers' }
        ]);
      }
    };
    
    loadComptes();
  }, [loadComptesFromSupabase, setComptes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* ComptabiliteBanner STICKY - reste fixé en haut */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <ComptabiliteBanner>
              {isPicker && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                    <ArrowLeft className="h-4 w-4" />
                    Sélection pour Fournisseur en cours
                  </div>
                </div>
              )}
            </ComptabiliteBanner>
          </div>
        </div>
      </div>

      {/* Navigation par onglets STICKY - reste sous le banner */}
      <div className="sticky top-[120px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 pb-4">
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <nav className="flex space-x-1 bg-[#FF6B35] p-1 rounded-2xl shadow-sm border border-gray-200">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Target },
              { id: 'plan-comptable', label: 'Plan comptable', icon: Database },
              { id: 'journaux', label: 'Journaux', icon: FileText },
              { id: 'factures', label: 'Factures à intégrer', icon: Building2 },
              { id: 'export', label: 'Export comptable', icon: Download },
              { id: 'controles', label: 'Contrôles', icon: Shield },
              { id: 'rapports', label: 'Rapports', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'text-white hover:text-orange-100 hover:bg-white/20'
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
            {/* Section Plan comptable */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Plan comptable PCG</h2>
                <button
                  onClick={() => setActiveTab('plan-comptable')}
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2 transition-colors"
                >
                  Gérer
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                   <h4 className="font-medium text-orange-900">Classe 4 - Tiers</h4>
                   <p className="text-sm text-orange-700">401, 411, 421, 43x</p>
                 </div>
                                 <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                   <h4 className="font-medium text-orange-900">Classe 5 - Trésorerie</h4>
                   <p className="text-sm text-orange-700">512, 53</p>
                 </div>
                                 <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                   <h4 className="font-medium text-orange-900">Classe 6 - Charges</h4>
                   <p className="text-sm text-orange-700">606, 615, 628</p>
                 </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Classe 7 - Produits</h4>
                  <p className="text-sm text-orange-600">701, 706, 708</p>
                </div>
              </div>
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
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-orange-600" />
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

        {activeTab === 'plan-comptable' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Plan comptable PCG</h3>
                <p className="text-gray-500">Gestion des comptes selon le Plan Comptable Général français</p>
              </div>
              
              {/* Bouton Nouveau Compte */}
              <div className="text-center ml-8">
                <button
                  onClick={() => setShowCompteModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Database className="h-5 w-5" />
                  Nouveau Compte
                </button>
                <p className="text-sm text-gray-500 mt-3">Créer un nouveau compte</p>
              </div>
            </div>
            
            {/* Tableau des comptes existants */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Comptes existants ({comptes.length})</h4>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un compte..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Numéro</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Nom</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Journal</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comptes.map((compte) => (
                      <tr key={compte.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {compte.numero}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{compte.nom}</td>
                                                 <td className="py-3 px-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                             compte.type === 'actif' ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200' :
                             compte.type === 'passif' ? 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border border-red-200' :
                             compte.type === 'charge' ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200' :
                             compte.type === 'produit' ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border border-orange-200' :
                             'bg-gradient-to-r from-gray-100 to-orange-50 text-gray-800 border border-gray-200'
                           }`}>
                             {compte.type}
                           </span>
                         </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            {compte.journalCentralisation}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            compte.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {compte.actif ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewCompte(compte)}
                              className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditCompte(compte)}
                              className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                              title="Modifier le compte"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCompte(compte)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Supprimer le compte"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {comptes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Database className="h-8 w-8 mx-auto mb-2" />
                  <p>Aucun compte créé pour le moment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'journaux' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Gestion des journaux</h3>
                <p className="text-gray-500">ACH, VEN, BAN, OD, CAI, PAY</p>
              </div>
              
              {/* Bouton Nouveau Journal */}
              <div className="text-center ml-8">
                <button
                  onClick={() => setShowJournalModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FileText className="h-5 w-5" />
                  Nouveau Journal
                </button>
                <p className="text-sm text-gray-500 mt-3">Créer un nouveau journal</p>
              </div>
            </div>
            
            {/* Tableau des journaux existants */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Journaux existants ({journaux.length})</h4>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un journal..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Code</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Nom</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {journaux.map((journal) => (
                      <tr key={journal.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            {journal.code}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{journal.nom}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            journal.type === 'debit' ? 'bg-red-100 text-red-800' :
                            journal.type === 'credit' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {journal.type === 'debit' ? 'Débit' : 
                             journal.type === 'credit' ? 'Crédit' : 'Mixte'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                          {journal.description || 'Aucune description'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            journal.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {journal.actif ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewJournal(journal)}
                              className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditJournal(journal)}
                              className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                              title="Modifier le journal"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteJournal(journal)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Supprimer le journal"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {journaux.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>Aucun journal créé pour le moment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'factures' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Factures à intégrer</h3>
            <p className="text-gray-500">Import des factures validées et avoirs</p>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Download className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Export comptable</h3>
            <p className="text-gray-500">Format FEC et contrôle d'équilibre</p>
          </div>
        )}

        {activeTab === 'controles' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Contrôles et validation</h3>
            <p className="text-gray-500">Vérification des comptes et équilibre</p>
          </div>
        )}

        {activeTab === 'rapports' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Rapports et traçabilité</h3>
            <p className="text-gray-500">Suivi des exports et historique</p>
          </div>
        )}
      </div>

      {/* Modal Nouveau Compte - Style moderne avec couleurs comptabilité */}
      {showCompteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex">
            {/* Sidebar colorée avec navigation - Couleurs comptabilité */}
            <div className="w-80 bg-gradient-to-b from-orange-500 to-red-600 p-6 text-white">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Nouveau Compte</h3>
                <p className="text-orange-100">Remplissez les informations du compte comptable</p>
              </div>
              
              <nav className="space-y-2">
                {[
                  { id: 'identite', label: 'Identité du compte', icon: Database },
                  { id: 'journal', label: 'Journal de centralisation', icon: FileText },
                  { id: 'options', label: 'Options et contrôles', icon: Settings },
                  { id: 'description', label: 'Description', icon: Info }
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
                  {activeCreateTab === 'identite' && 'Identité du compte comptable'}
                  {activeCreateTab === 'journal' && 'Journal de centralisation'}
                  {activeCreateTab === 'options' && 'Options et contrôles'}
                  {activeCreateTab === 'description' && 'Description du compte'}
                </h3>
                <button
                  onClick={() => setShowCompteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Onglet Identité */}
              {activeCreateTab === 'identite' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de compte <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="ex: F (Fournisseur), C (Client), 401, 411, 604..."
                        value={newCompte.numero}
                        onChange={(e) => {
                          const numero = e.target.value;
                          setNewCompte({...newCompte, numero});
                          
                          // Détection automatique de la classe et du type
                          if (numero) {
                            const classeAuto = detectCompteClasse(numero);
                            const typeAuto = detectCompteType(numero);
                            setNewCompte(prev => ({
                              ...prev,
                              numero,
                              classe: classeAuto,
                              type: typeAuto
                            }));
                          }
                        }}
                        className={`w-full ${compteErrors.numero ? 'border-red-500' : ''}`}
                      />
                      {compteErrors.numero && (
                        <p className="text-red-500 text-sm mt-1">{compteErrors.numero}</p>
                      )}
                      {newCompte.numero && newCompte.classe && (
                        <div className="mt-2 space-y-1">
                          <p className="text-green-600 text-sm">
                            ✅ Classe détectée automatiquement : {newCompte.classe}
                          </p>
                          {newCompte.numero.startsWith('F') && (
                            <p className="text-blue-600 text-sm">
                              💡 Suggestion : Utilisez le compte 401 (Fournisseurs)
                            </p>
                          )}
                          {newCompte.numero.startsWith('C') && (
                            <p className="text-blue-600 text-sm">
                              💡 Suggestion : Utilisez le compte 411 (Clients)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du compte <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="ex: Fournisseurs, Clients, Achats..."
                        value={newCompte.nom}
                        onChange={(e) => setNewCompte({...newCompte, nom: e.target.value})}
                        className={`w-full ${compteErrors.nom ? 'border-red-500' : ''}`}
                      />
                      {compteErrors.nom && (
                        <p className="text-red-500 text-sm mt-1">{compteErrors.nom}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Classe détectée</label>
                      <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                        {newCompte.classe || 'Saisissez un numéro de compte'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type détecté</label>
                      <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                        {newCompte.type || 'Saisissez un numéro de compte'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Journal */}
              {activeCreateTab === 'journal' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Journal de centralisation <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newCompte.journalCentralisation}
                      onChange={(e) => setNewCompte({...newCompte, journalCentralisation: e.target.value})}
                      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none ${compteErrors.journalCentralisation ? 'border-red-500' : ''}`}
                    >
                      <option value="">Sélectionnez un journal</option>
                      {journaux.map((journal) => (
                        <option key={journal.code} value={journal.code}>
                          {journal.code} - {journal.nom}
                        </option>
                      ))}
                    </select>
                    {compteErrors.journalCentralisation && (
                      <p className="text-red-500 text-sm mt-1">{compteErrors.journalCentralisation}</p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Aide à la sélection</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>ACH</strong> : Pour les comptes fournisseurs (401, 606, 615...)</p>
                      <p><strong>VEN</strong> : Pour les comptes clients (411, 701, 706...)</p>
                      <p><strong>BAN</strong> : Pour les comptes bancaires (512, 53...)</p>
                      <p><strong>OD</strong> : Pour les opérations diverses</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Options */}
              {activeCreateTab === 'options' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newCompte.saisieAutorisee}
                          onChange={(e) => setNewCompte({...newCompte, saisieAutorisee: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Saisie autorisée</span>
                      </label>
                      <p className="text-sm text-gray-500 mt-1">Permet la saisie d'écritures sur ce compte</p>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newCompte.actif}
                          onChange={(e) => setNewCompte({...newCompte, actif: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Compte actif</span>
                      </label>
                      <p className="text-sm text-gray-500 mt-1">Le compte peut recevoir des écritures</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Description */}
              {activeCreateTab === 'description' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description du compte</label>
                    <textarea
                      placeholder="Description détaillée du compte comptable..."
                      value={newCompte.description}
                      onChange={(e) => setNewCompte({...newCompte, description: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                {isPicker ? (
                  <button
                    onClick={cancelAndReturn}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler et revenir
                  </button>
                ) : (
                <button
                  onClick={() => setShowCompteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                )}
                <button
                  onClick={handleCreateCompte}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  <Database className="h-4 w-4 inline mr-2" />
                  Créer le compte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouveau Journal */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Nouveau Journal</h3>
                <button
                  onClick={() => setShowJournalModal(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code du journal <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="ex: ACH, VEN, BAN, OD..."
                    value={newJournal.code}
                    onChange={(e) => setNewJournal({...newJournal, code: e.target.value.toUpperCase()})}
                    className={`w-full ${journalErrors.code ? 'border-red-500' : ''}`}
                  />
                  {journalErrors.code && (
                    <p className="text-red-500 text-sm mt-1">{journalErrors.code}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du journal <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="ex: Achats, Ventes, Banque..."
                    value={newJournal.nom}
                    onChange={(e) => setNewJournal({...newJournal, nom: e.target.value})}
                    className={`w-full ${journalErrors.nom ? 'border-red-500' : ''}`}
                  />
                  {journalErrors.nom && (
                    <p className="text-red-500 text-sm mt-1">{journalErrors.nom}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de journal</label>
                  <select
                    value={newJournal.type}
                    onChange={(e) => setNewJournal({...newJournal, type: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="mixte">Mixte (Débit et Crédit)</option>
                    <option value="debit">Débit uniquement</option>
                    <option value="credit">Crédit uniquement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Description du journal..."
                    value={newJournal.description}
                    onChange={(e) => setNewJournal({...newJournal, description: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newJournal.actif}
                      onChange={(e) => setNewJournal({...newJournal, actif: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Journal actif</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowJournalModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateJournal}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  Créer le journal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comptabilite;
