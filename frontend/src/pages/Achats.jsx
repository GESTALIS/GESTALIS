import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { fournisseursService } from '../services/supabase';
import { useFournisseursStore } from '../stores/useFournisseursStore';
import { useComptesStore } from '../stores/useComptesStore';
import { useProduitsStore } from '../stores/useProduitsStore';


const Achats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // GÃ©rer les paramÃ¨tres d'URL pour l'onglet et la crÃ©ation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    const createParam = searchParams.get('create');
    
    if (tabParam) {
      setActiveTab(tabParam);
      
      // Si on doit crÃ©er quelque chose, ouvrir le modal appropriÃ©
      if (createParam === 'true') {
        // Si on est dans l'onglet fournisseurs, ouvrir directement le modal
        if (tabParam === 'fournisseurs') {
          console.log('ðŸš€ Ouverture automatique du modal de crÃ©ation de fournisseur');
          setShowCreateModal(true);
          
          // PrÃ©-remplir avec les donnÃ©es du localStorage si disponibles
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
              console.error('Erreur lors du parsing des donnÃ©es de crÃ©ation:', error);
            }
          }
        }
        
        // Si on est dans l'onglet produits, ouvrir directement le modal
        if (tabParam === 'produits') {
          console.log('ðŸš€ Ouverture automatique du modal de crÃ©ation de produit');
          setShowCreateProduitModal(true);
        }
      }
    }
  }, [location.search]);

  // GÃ©rer le retour depuis la comptabilitÃ© (mode picker)
  useEffect(() => {
    if (location.state?.type === "PICKED_COMPTE" && location.state?.value) {
      console.log('ðŸ”„ Retour depuis la comptabilitÃ© avec compte sÃ©lectionnÃ©:', location.state.value);
      
      // Ouvrir automatiquement le modal de crÃ©ation de fournisseur
      setShowCreateModal(true);
      
      // Aller directement Ã  l'onglet compta
      setActiveCreateTab('compta');
      
      // Injecter le compte sÃ©lectionnÃ© dans le formulaire fournisseur
      setNewFournisseur(prev => ({
        ...prev,
        compteComptable: location.state.value.numero
      }));
      
      // Mettre Ã  jour le champ de recherche
      setSearchCompteTerm(`${location.state.value.numero} â€” ${location.state.value.intitule}`);
      
      // Restaurer le brouillon si disponible
      if (location.state.draftId) {
        const saved = localStorage.getItem(`draft_fournisseur_${location.state.draftId}`);
        if (saved) {
          const draftData = JSON.parse(saved);
          setNewFournisseur(prev => ({ ...prev, ...draftData }));
        }
        // Nettoyer le brouillon
        localStorage.removeItem(`draft_fournisseur_${location.state.draftId}`);
      }
      
      // Nettoyer le state de navigation
      window.history.replaceState({}, document.title, location.pathname + location.search);
    }
  }, [location.state]);

  // GÃ©rer le retour depuis le SmartPicker
  useEffect(() => {
    const smartpickerContext = sessionStorage.getItem('smartpicker_return_context');
    if (smartpickerContext) {
      try {
        const { returnTo, returnField, draftId, searchTerm } = JSON.parse(smartpickerContext);
        console.log('ðŸ”„ Retour depuis SmartPicker dÃ©tectÃ©:', { returnTo, returnField, draftId, searchTerm });
        
        // Si on vient d'un formulaire (Bon de Commande ou Facture), ouvrir le modal de crÃ©ation appropriÃ©
        if (returnTo && (returnTo.includes('creation-bon-commande') || returnTo.includes('nouvelle-facture'))) {
          console.log('ðŸš€ Ouverture du modal de crÃ©ation depuis SmartPicker');
          
          // DÃ©terminer quel modal ouvrir selon le champ
          if (returnField === 'fournisseur') {
            setShowCreateModal(true);
            if (searchTerm) {
              setNewFournisseur(prev => ({ ...prev, raisonSociale: searchTerm }));
            }
          } else if (returnField === 'produit') {
            setShowCreateProduitModal(true);
            if (searchTerm) {
              setNewProduit(prev => ({ ...prev, nom: searchTerm }));
            }
          }
          
          // NE PAS nettoyer le contexte ici - on en a besoin pour le retour aprÃ¨s crÃ©ation
        }
      } catch (error) {
        console.error('Erreur lors du parsing du contexte SmartPicker:', error);
      }
    }
  }, []);

  // Ã‰tats pour la gestion des fournisseurs
  const { 
    fournisseurs, 
    loading: fournisseursLoading,
    addFournisseur, 
    updateFournisseur, 
    deleteFournisseur,
    setFournisseurs,
    nextFournisseurCode,
    loadFromSupabase: loadFournisseursFromSupabase
  } = useFournisseursStore();
  
  const { comptes, loadFromSupabase: loadComptesFromSupabase } = useComptesStore();

  // Charger les donnÃ©es depuis Supabase au dÃ©marrage
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('ðŸ”„ Chargement des donnÃ©es depuis Supabase...');
        await Promise.all([
          loadFournisseursFromSupabase(),
          loadComptesFromSupabase()
        ]);
        console.log('âœ… DonnÃ©es chargÃ©es depuis Supabase');
      } catch (error) {
        console.error('âŒ Erreur chargement donnÃ©es:', error);
      }
    };
    
    loadData();
  }, [loadFournisseursFromSupabase, loadComptesFromSupabase]);
  const { produits, addProduit, setProduits } = useProduitsStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);

  // Ã‰tats pour la gestion des produits

  const [showCreateProduitModal, setShowCreateProduitModal] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
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
    // Conditions de rÃ¨glement
    modeReglement: 'VIR',
    echeanceType: '30J',
    respectEcheance: true,
    joursDecalage: 30,
    finDeMois: false,
    jourPaiement: 0
  });

  const [newProduit, setNewProduit] = useState({
    code: '',
    nom: '',
    description: '',
    categorie: '',
    unite: 'U',
    commentaires: ''
  });

  // Ã‰tat pour indiquer si le code a Ã©tÃ© gÃ©nÃ©rÃ© automatiquement
  const [codeAutoGenere, setCodeAutoGenere] = useState(false);

  const [produitFournisseurs, setProduitFournisseurs] = useState([
    {
      fournisseurId: '',
      codeFournisseur: '',
      prixUnitaire: '',
      devise: 'EUR',
      datePrix: new Date().toISOString().split('T')[0]
    }
  ]);

  // Ã‰tats pour la sidebar de crÃ©ation de compte comptable
  const [showCompteSelectionModal, setShowCompteSelectionModal] = useState(false);
  const [newCompteComptable, setNewCompteComptable] = useState({
    numero: '',
    nom: '',
    type: 'charge',
    classe: '',
    description: '',
    journalCentralisation: '',
    saisieAutorisee: true,
    actif: true
  });
  const [compteErrors, setCompteErrors] = useState({});

  // CatÃ©gories de produits TP (Travaux Publics)
  const categoriesProduits = [
    'MatÃ©riaux TP',
    'Ã‰quipements TP',
    'Outillage TP',
    'Hydraulique',
    'Signalisation',
    'SÃ©curitÃ© chantier',
    'Services TP',
    'Divers TP'
  ];



  const unitesMesure = [
    { value: 'U', label: 'UnitÃ© (U)' },
    { value: 'M', label: 'MÃ¨tre linÃ©aire (M)' },
    { value: 'M2', label: 'MÃ¨tre carrÃ© (MÂ²)' },
    { value: 'M3', label: 'MÃ¨tre cube (MÂ³)' },
    { value: 'KG', label: 'Kilogramme (KG)' },
    { value: 'T', label: 'Tonne (T)' },
    { value: 'L', label: 'Litre (L)' },
    { value: 'PAQ', label: 'Paquet' },
    { value: 'LOT', label: 'Lot' },
    { value: 'M2/J', label: 'MÂ² par jour' },
    { value: 'M3/J', label: 'MÂ³ par jour' },
    { value: 'H', label: 'Heure (H)' },
    { value: 'J', label: 'Jour (J)' }
  ];

  // PrÃ©fixes de codes par catÃ©gorie TP
  const prefixesCodes = {
    'MatÃ©riaux TP': 'MAT',
    'Ã‰quipements TP': 'EQU',
    'Outillage TP': 'OUT',
    'Hydraulique': 'HYD',
    'Signalisation': 'SIG',
    'SÃ©curitÃ© chantier': 'SEC',
    'Services TP': 'SER',
    'Divers TP': 'DIV'
  };

  // Charger les fournisseurs depuis Supabase ET localStorage au montage
  useEffect(() => {
    const chargerFournisseurs = async () => {
      try {
        // 1. Charger depuis Supabase
        const fournisseursSupabase = await fournisseursService.recupererTous();
        console.log('âœ… Fournisseurs chargÃ©s depuis Supabase:', fournisseursSupabase);
        
        // 2. Charger depuis localStorage
        const fournisseursLocal = localStorage.getItem('gestalis-fournisseurs');
        let fournisseursLocalStorage = [];
        
        if (fournisseursLocal) {
          try {
            fournisseursLocalStorage = JSON.parse(fournisseursLocal);
            console.log('ðŸ’¾ Fournisseurs chargÃ©s depuis localStorage:', fournisseursLocalStorage);
          } catch (error) {
            console.error('âŒ Erreur parsing localStorage fournisseurs:', error);
          }
        }
        
        // 3. PRIORITÃ‰ AUX DONNÃ‰ES LOCALES (utilisateur a effacÃ© les donnÃ©es de test)
        // Si localStorage contient des donnÃ©es, utiliser SEULEMENT localStorage
        // Sinon, utiliser Supabase (premiÃ¨re fois)
        let fournisseursFinaux = [];
        
        if (fournisseursLocalStorage.length > 0) {
          // L'utilisateur a des donnÃ©es locales (a effacÃ© les donnÃ©es de test)
          console.log('ðŸŽ¯ Utilisation des donnÃ©es locales uniquement (donnÃ©es de test effacÃ©es)');
          fournisseursFinaux = fournisseursLocalStorage;
        } else {
          // PremiÃ¨re fois ou localStorage vide, utiliser Supabase
          console.log('ðŸŽ¯ PremiÃ¨re utilisation, chargement depuis Supabase');
          fournisseursFinaux = fournisseursSupabase;
        }
        
        console.log('ðŸ”„ Fournisseurs finaux chargÃ©s:', fournisseursFinaux);
        
        setFournisseurs(fournisseursFinaux);
        setFilteredFournisseurs(fournisseursFinaux);
        
      } catch (error) {
        console.error('âŒ Erreur chargement fournisseurs:', error);
        
        // En cas d'erreur Supabase, utiliser uniquement localStorage
        const fournisseursLocal = localStorage.getItem('gestalis-fournisseurs');
        if (fournisseursLocal) {
          try {
            const fournisseursLocalStorage = JSON.parse(fournisseursLocal);
            console.log('ðŸ”„ Utilisation des fournisseurs du localStorage en fallback:', fournisseursLocalStorage);
            setFournisseurs(fournisseursLocalStorage);
            setFilteredFournisseurs(fournisseursLocalStorage);
          } catch (parseError) {
            console.error('âŒ Erreur parsing localStorage en fallback:', parseError);
            setFournisseurs([]);
            setFilteredFournisseurs([]);
          }
        } else {
          setFournisseurs([]);
          setFilteredFournisseurs([]);
        }
      }
    };

    chargerFournisseurs();
    fetchPlanComptable();
    
    // Charger les produits depuis localStorage
    const produitsLocal = localStorage.getItem('gestalis-produits');
    if (produitsLocal) {
      try {
        const produitsParsed = JSON.parse(produitsLocal);
        setProduits(produitsParsed);
        console.log('ðŸ“¦ Produits chargÃ©s au montage du composant:', produitsParsed);
      } catch (error) {
        console.error('âŒ Erreur lors du parsing des produits:', error);
      }
    }
  }, []); // Se dÃ©clenche une seule fois au montage



  const fetchPlanComptable = async () => {
    try {
      // Essayer de rÃ©cupÃ©rer les comptes depuis le localStorage du module ComptabilitÃ©
      const comptesComptabilite = localStorage.getItem('gestalis-comptes');
      let comptesDisponibles = [];
      
      if (comptesComptabilite) {
        try {
          const comptesParsed = JSON.parse(comptesComptabilite);
          // Filtrer les comptes de type fournisseur ou crÃ©er des comptes adaptÃ©s
          comptesDisponibles = comptesParsed
            .filter(compte => compte.type === 'charge' || compte.type === 'passif' || compte.classe?.includes('Tiers'))
            .map(compte => ({
              numeroCompte: compte.numero,
              intitule: compte.nom,
              type: compte.type,
              classe: compte.classe
            }));
          console.log('âœ… Comptes comptables rÃ©cupÃ©rÃ©s depuis ComptabilitÃ©:', comptesDisponibles);
        } catch (parseError) {
          console.error('Erreur lors du parsing des comptes comptables:', parseError);
        }
      }
      
      // Si aucun compte trouvÃ©, utiliser les donnÃ©es par dÃ©faut
      if (comptesDisponibles.length === 0) {
        console.log('ðŸ“Š Utilisation des comptes par dÃ©faut');
        comptesDisponibles = [
          { numeroCompte: '401', intitule: 'Fournisseurs - GÃ©nÃ©ral', type: 'passif', classe: '4 - Tiers' },
          { numeroCompte: '401001', intitule: 'Fournisseurs - MatÃ©riaux', type: 'passif', classe: '4 - Tiers' },
          { numeroCompte: '401002', intitule: 'Fournisseurs - Sous-traitance', type: 'passif', classe: '4 - Tiers' },
          { numeroCompte: '401003', intitule: 'Fournisseurs - Services', type: 'passif', classe: '4 - Tiers' },
          { numeroCompte: '606', intitule: 'Achats - MatÃ©riaux', type: 'charge', classe: '6 - Charges' },
          { numeroCompte: '607', intitule: 'Achats - Services', type: 'charge', classe: '6 - Charges' },
        ];
      }
      
      setPlanComptable(comptesDisponibles);
      setFilteredPlanComptable(comptesDisponibles);
      console.log('ðŸ’¾ Plan comptable mis Ã  jour:', comptesDisponibles);
      
    } catch (error) {
      console.error('Erreur lors du chargement du plan comptable:', error);
      // En cas d'erreur, utiliser les donnÃ©es par dÃ©faut
      const planComptableDefault = [
        { numeroCompte: '401', intitule: 'Fournisseurs - GÃ©nÃ©ral', type: 'passif', classe: '4 - Tiers' },
        { numeroCompte: '401001', intitule: 'Fournisseurs - MatÃ©riaux', type: 'passif', classe: '4 - Tiers' },
        { numeroCompte: '401002', intitule: 'Fournisseurs - Sous-traitance', type: 'passif', classe: '4 - Tiers' },
      ];
      setPlanComptable(planComptableDefault);
      setFilteredPlanComptable(planComptableDefault);
    }
  };

  // Ã‰tats pour la crÃ©ation de fournisseur moderne
  const [activeCreateTab, setActiveCreateTab] = useState('coordonnees');
  const [showCreateCompteModal, setShowCreateCompteModal] = useState(false);
  const [showCreateConditionModal, setShowCreateConditionModal] = useState(false);
  const [planComptable, setPlanComptable] = useState([
    { numeroCompte: 'F0001', intitule: 'Fournisseurs' },
    { numeroCompte: 'F0002', intitule: 'Fournisseurs - Sous-traitants' },
    { numeroCompte: 'F0003', intitule: 'Fournisseurs - Frais de transport' },
    { numeroCompte: 'F0004', intitule: 'Fournisseurs - Frais de dÃ©pÃ´t' },
    { numeroCompte: 'F0005', intitule: 'Fournisseurs - Frais de douane' },
  ]);
  const [filteredPlanComptable, setFilteredPlanComptable] = useState([
    { numeroCompte: 'F0001', intitule: 'Fournisseurs' },
    { numeroCompte: 'F0002', intitule: 'Fournisseurs - Sous-traitants' },
    { numeroCompte: 'F0003', intitule: 'Fournisseurs - Frais de transport' },
    { numeroCompte: 'F0004', intitule: 'Fournisseurs - Frais de dÃ©pÃ´t' },
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

  // Ã‰tats pour la crÃ©ation de compte comptable
  const [newCompte, setNewCompte] = useState({
    numeroCompte: '',
    intitule: '',
    typeCompte: 'FOURNISSEUR'
  });

  // Ã‰tats pour la crÃ©ation de condition de paiement
  const [newConditionPaiement, setNewConditionPaiement] = useState({
    libelle: '',
    type: 'COMPTANT',
    delai: '',
    escompte: '',
    description: ''
  });

  // Ã‰tat pour le code fournisseur automatique


  // Ã‰tat pour la case TVA Guyane
  const [pasDeTvaGuyane, setPasDeTvaGuyane] = useState(false);

  // Ã‰tat pour les contacts multiples
  const [contacts, setContacts] = useState([]);

  // DonnÃ©es rÃ©elles (vides au dÃ©marrage)
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
      title: 'Factures Ã  payer',
      value: '0',
      change: '0',
      icon: Receipt,
      color: 'bg-gradient-to-br from-blue-500 to-teal-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Montant total',
      value: 'â‚¬0',
      change: '0',
      icon: DollarSign,
      color: 'bg-gradient-to-br from-blue-500 to-teal-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    }
  ]);

  // DonnÃ©es rÃ©elles (vides au dÃ©marrage)
  const [recentActivities, setRecentActivities] = useState([]);

  // Ã‰tats pour les fournisseurs
  const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
  const [selectedFournisseurs, setSelectedFournisseurs] = useState([]);
  const [showDeleteBulkModal, setShowDeleteBulkModal] = useState(false);

  useEffect(() => {
    // Simulation de chargement des donnÃ©es rÃ©elles
          // Loading gÃ©rÃ© par Zustand
    // Loading gÃ©rÃ© par Zustand
    // Ici on chargerait les vraies donnÃ©es depuis l'API
    setFournisseurs([]);
    setFilteredFournisseurs([]);
  }, []);

  // Mise Ã  jour des statistiques quand les fournisseurs changent
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

  // Fermer les rÃ©sultats de recherche des comptes quand on clique ailleurs
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
    // VÃ©rifier si nous sommes en mode Ã©dition ou crÃ©ation
    const isEditing = selectedFournisseur !== null;
    
    if (isEditing) {
      console.log('ðŸ”„ Tentative de modification du fournisseur...', newFournisseur);
    } else {
      console.log('ðŸš€ Tentative de crÃ©ation du fournisseur...', newFournisseur);
    }
    
    // Validation des champs obligatoires
    if (!newFournisseur.raisonSociale || !newFournisseur.siret) {
      alert('âŒ Erreur de validation :\n- La raison sociale est obligatoire\n- Le SIRET est obligatoire');
      return;
    }

    try {
      if (isEditing) {
        // MODE Ã‰DITION : Mettre Ã  jour le fournisseur existant
        const fournisseurModifie = {
          ...selectedFournisseur,
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
          updatedAt: new Date().toISOString()
        };

        console.log('âœ… Fournisseur modifiÃ© avec succÃ¨s:', fournisseurModifie);
        
        // Utiliser Zustand pour mettre Ã  jour
        updateFournisseur(selectedFournisseur.id, fournisseurModifie);
        
        // DÉSACTIVÉ : Plus de sauvegarde localStorage - Supabase est la source de vérité
        console.log('🎯 Fournisseur modifié - Supabase est la source de vérité');
        
        // Fermer le modal et rÃ©initialiser
        setShowCreateModal(false);
        setSelectedFournisseur(null);
        
        // Notification de succÃ¨s
        alert(`âœ… Fournisseur modifiÃ© avec succÃ¨s !\n\nRaison sociale: ${fournisseurModifie.raisonSociale}\nCode: ${fournisseurModifie.codeFournisseur}\nSIRET: ${fournisseurModifie.siret}`);
        
      } else {
        // MODE CRÃ‰ATION : CrÃ©er un nouveau fournisseur
        const nouveauFournisseur = {
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
          compteComptable: newFournisseur.compteComptable || null
        };

        console.log('âœ… Fournisseur crÃ©Ã© avec succÃ¨s:', nouveauFournisseur);
        
        // Utiliser Zustand pour ajouter
        addFournisseur(nouveauFournisseur);
        
        // DÉSACTIVÉ : Plus de sauvegarde localStorage - Supabase est la source de vérité
        console.log('🎯 Fournisseur créé - Supabase est la source de vérité');
        
        // VÃ©rifier si on doit retourner au Bon de Commande (SmartPicker)
        const smartpickerContext = sessionStorage.getItem('smartpicker_return_context');
        console.log('ðŸ” Contexte SmartPicker trouvÃ©:', smartpickerContext);
        
        if (smartpickerContext) {
          try {
            const { returnTo, returnField, draftId } = JSON.parse(smartpickerContext);
            console.log('ðŸ” Contexte parsÃ©:', { returnTo, returnField, draftId });
            
            if (returnTo && (returnTo.includes('creation-bon-commande') || returnTo.includes('nouvelle-facture'))) {
              console.log('ðŸš€ Retour vers le formulaire depuis SmartPicker:', returnTo);
              
              // Retourner au Bon de Commande avec le nouveau fournisseur sÃ©lectionnÃ©
              const fournisseurFormate = {
                id: nouveauFournisseur.id,
                label: `${nouveauFournisseur.codeFournisseur} â€” ${nouveauFournisseur.raisonSociale}`,
                data: nouveauFournisseur
              };
              
              console.log('ðŸ’¾ Fournisseur formatÃ© pour retour:', fournisseurFormate);
              
              // Sauvegarder le fournisseur sÃ©lectionnÃ© pour le retour
              localStorage.setItem('selectedFournisseur', JSON.stringify(fournisseurFormate));
              
              // Nettoyer le contexte
              sessionStorage.removeItem('smartpicker_return_context');
              
              // Fermer le modal
              setShowCreateModal(false);
              
              // Notification de succÃ¨s
              const destination = returnTo.includes('creation-bon-commande') ? 'Bon de Commande' : 'Facture';
              alert(`âœ… Fournisseur crÃ©Ã© avec succÃ¨s !\n\nRaison sociale: ${nouveauFournisseur.raisonSociale}\nCode: ${nouveauFournisseur.codeFournisseur}\nSIRET: ${nouveauFournisseur.siret}\n\nVous allez Ãªtre redirigÃ© vers le ${destination}.`);
              
              // Retourner au formulaire d'origine
              console.log('ðŸ”„ Navigation vers:', returnTo);
              window.location.href = returnTo;
              
              return; // Sortir de la fonction pour Ã©viter la rÃ©initialisation
            } else {
              console.log('âŒ Pas de retour vers formulaire - returnTo:', returnTo);
            }
          } catch (error) {
            console.error('Erreur lors du parsing du contexte SmartPicker:', error);
          }
        } else {
          console.log('âŒ Aucun contexte SmartPicker trouvÃ©');
        }
        
        // RÃ©initialiser le formulaire
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
          // Conditions de rÃ¨glement
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
        
        // Fermer le modal et rÃ©initialiser
        setShowCreateModal(false);
      
        // S'assurer qu'on est dans l'onglet Fournisseurs
        setActiveTab('fournisseurs');
          
        // Notification de succÃ¨s
        alert(`âœ… Fournisseur crÃ©Ã© avec succÃ¨s !\n\nRaison sociale: ${nouveauFournisseur.raisonSociale}\nCode: ${nouveauFournisseur.codeFournisseur}\nSIRET: ${nouveauFournisseur.siret}`);
      }
      
    } catch (error) {
      console.error('âŒ Erreur lors de la crÃ©ation/modification:', error);
      if (isEditing) {
        alert('âŒ Erreur lors de la modification du fournisseur');
      } else {
        alert('âŒ Erreur lors de la crÃ©ation du fournisseur');
      }
    } finally {
      // setLoading(false); // CommentÃ© car setLoading n'est pas dÃ©fini dans cette fonction
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

  const handleCreateProduit = () => {
    console.log('ðŸš€ Tentative de crÃ©ation du produit...', newProduit);
    
    // Validation des champs obligatoires
    if (!newProduit.code || !newProduit.nom || !newProduit.categorie) {
      alert('âŒ Erreur de validation :\n- Le code produit est obligatoire\n- Le nom est obligatoire\n- La catÃ©gorie est obligatoire');
      return;
    }

    try {
      // CrÃ©er le produit localement
      const nouveauProduit = {
        id: Date.now(),
        code: newProduit.code,
        nom: newProduit.nom,
        description: newProduit.description,
        categorie: newProduit.categorie,
        unite: newProduit.unite,
        commentaires: newProduit.commentaires,
        fournisseurs: produitFournisseurs.filter(f => f.fournisseurId),
        dateCreation: new Date().toISOString(),
        statut: 'ACTIF'
      };

      console.log('âœ… Produit crÃ©Ã© avec succÃ¨s:', nouveauProduit);
      
      // Utiliser Zustand pour ajouter
      addProduit(nouveauProduit);
        
      // DÉSACTIVÉ : Plus de sauvegarde localStorage - Supabase est la source de vérité
      console.log('🎯 Produit créé - Supabase est la source de vérité');

      // VÃ©rifier si on doit retourner au Bon de Commande (nouveau systÃ¨me SmartPicker)
      const smartpickerContext = sessionStorage.getItem('smartpicker_return_context');
      console.log('ðŸ” Contexte SmartPicker trouvÃ©:', smartpickerContext);
      if (smartpickerContext) {
        try {
          const { returnTo, returnField, draftId } = JSON.parse(smartpickerContext);
          console.log('ðŸ” Contexte parsÃ©:', { returnTo, returnField, draftId });
          if (returnTo && (returnTo.includes('creation-bon-commande') || returnTo.includes('nouvelle-facture'))) {
            console.log('ðŸš€ Retour vers le formulaire depuis SmartPicker:', returnTo);
            const produitFormate = {
              id: nouveauProduit.id,
              label: `${nouveauProduit.code} â€” ${nouveauProduit.nom}`,
              data: nouveauProduit
            };
            console.log('ðŸ’¾ Produit formatÃ© pour retour:', produitFormate);
            localStorage.setItem('selectedProduit', JSON.stringify(produitFormate));
            sessionStorage.removeItem('smartpicker_return_context'); // Clean up here
            setShowCreateProduitModal(false);
            const destination = returnTo.includes('creation-bon-commande') ? 'Bon de Commande' : 'Facture';
            alert(`âœ… Produit crÃ©Ã© avec succÃ¨s !\n\nCode: ${nouveauProduit.code}\nNom: ${nouveauProduit.nom}\nCatÃ©gorie: ${nouveauProduit.categorie}\n\nVous allez Ãªtre redirigÃ© vers le ${destination}.`);
            console.log('ðŸ”„ Navigation vers:', returnTo);
            window.location.href = returnTo;
            return;
          } else {
            console.log('âŒ Pas de retour vers formulaire - returnTo:', returnTo);
          }
        } catch (error) {
          console.error('Erreur lors du parsing du contexte SmartPicker:', error);
        }
      } else {
        console.log('âŒ Aucun contexte SmartPicker trouvÃ©');
      }
        
      // RÃ©initialiser le formulaire
      setNewProduit({
        code: '',
        nom: '',
        description: '',
        categorie: '',
        unite: 'U',
        commentaires: ''
      });
      setProduitFournisseurs([{
        fournisseurId: '',
        codeFournisseur: '',
        prixUnitaire: '',
        devise: 'EUR',
        datePrix: new Date().toISOString().split('T')[0]
      }]);
        
      // Fermer le modal
      setShowCreateProduitModal(false);
      
      // RÃ©initialiser l'Ã©tat du code auto-gÃ©nÃ©rÃ©
      setCodeAutoGenere(false);
      
      // S'assurer qu'on est dans l'onglet Produits
      setActiveTab('produits');
        
      // Notification de succÃ¨s
      alert(`âœ… Produit crÃ©Ã© avec succÃ¨s !\n\nCode: ${nouveauProduit.code}\nNom: ${nouveauProduit.nom}\nCatÃ©gorie: ${nouveauProduit.categorie}`);
      
    } catch (error) {
      console.error('âŒ Erreur lors de la crÃ©ation du produit:', error);
      alert('âŒ Erreur lors de la crÃ©ation du produit');
    }
  };

  const addProduitFournisseur = () => {
    const newFournisseur = {
      fournisseurId: '',
      codeFournisseur: '',
      prixUnitaire: '',
      devise: 'EUR',
      datePrix: new Date().toISOString().split('T')[0]
    };
    setProduitFournisseurs([...produitFournisseurs, newFournisseur]);
  };

  const updateProduitFournisseur = (index, field, value) => {
    setProduitFournisseurs(produitFournisseurs.map((fournisseur, i) => 
      i === index ? { ...fournisseur, [field]: value } : fournisseur
    ));
  };

  const removeProduitFournisseur = (index) => {
    setProduitFournisseurs(produitFournisseurs.filter((_, i) => i !== index));
  };

  // GÃ©nÃ©rer automatiquement le code produit basÃ© sur la catÃ©gorie
  const generateProduitCode = (categorie) => {
    if (!categorie) return '';
    
    const prefix = prefixesCodes[categorie] || 'PROD';
    const produitsCategorie = produits.filter(p => p.categorie === categorie);
    const nextNumber = produitsCategorie.length + 1;
    
    return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
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
    if (confirm('ÃŠtes-vous sÃ»r de vouloir supprimer ce fournisseur ?')) {
      try {
        // Supprimer du store Zustand
        deleteFournisseur(id);
        
        // DÉSACTIVÉ : Plus de sauvegarde localStorage - Supabase est la source de vérité
        console.log('🎯 Fournisseur supprimé - Supabase est la source de vérité');
        
        // Notification de succÃ¨s
        alert('âœ… Fournisseur supprimÃ© avec succÃ¨s !');
      } catch (error) {
        console.error('âŒ Erreur lors de la suppression:', error);
        alert('âŒ Erreur lors de la suppression du fournisseur');
      }
    }
  };

  const handleViewFournisseur = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    // Ici on pourrait ouvrir un modal de visualisation
    alert(`Visualisation de ${fournisseur.raisonSociale}\nCode: ${fournisseur.codeFournisseur}\nSIRET: ${fournisseur.siret}`);
  };

  const handleEditFournisseur = (fournisseur) => {
    // PrÃ©-remplir le formulaire avec les donnÃ©es du fournisseur
    setNewFournisseur({
      raisonSociale: fournisseur.raisonSociale || '',
      siret: fournisseur.siret || '',
      tvaIntracommunautaire: fournisseur.tvaIntracommunautaire || '',
      codeApeNaf: fournisseur.codeApeNaf || '',
      formeJuridique: fournisseur.formeJuridique || '',
      capitalSocial: fournisseur.capitalSocial || '',
      adresseSiege: fournisseur.adresseSiege || '',
      adresseLivraison: fournisseur.adresseLivraison || '',
      plafondCredit: fournisseur.plafondCredit || '',
      devise: fournisseur.devise || 'EUR',
      estSousTraitant: fournisseur.estSousTraitant || false,
      modeReglement: fournisseur.modeReglement || 'VIR',
      echeanceType: fournisseur.echeanceType || '30J',
      respectEcheance: fournisseur.respectEcheance !== undefined ? fournisseur.respectEcheance : true,
      joursDecalage: fournisseur.joursDecalage || 30,
      finDeMois: fournisseur.finDeMois || false,
      jourPaiement: fournisseur.jourPaiement || 0,
      compteComptable: fournisseur.compteComptable || ''
    });
    
    // Marquer que nous sommes en mode Ã©dition
    setSelectedFournisseur(fournisseur);
    
    // Ouvrir le modal de crÃ©ation (qui servira aussi pour la modification)
    setShowCreateModal(true);
    
    // Aller directement Ã  l'onglet coordonnÃ©es
    setActiveCreateTab('coordonnees');
  };

  const handleUpdateFournisseur = (updatedFournisseur) => {
    setFournisseurs(prev => prev.map(f => 
      f.id === updatedFournisseur.id ? updatedFournisseur : f
    ));
    setShowEditModal(false);
    setSelectedFournisseur(null);
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
      alert('Aucun fournisseur sÃ©lectionnÃ©');
      return;
    }
    
    if (confirm(`ÃŠtes-vous sÃ»r de vouloir supprimer ${selectedFournisseurs.length} fournisseur(s) ?`)) {
      // Supprimer chaque fournisseur via Zustand
      selectedFournisseurs.forEach(id => deleteFournisseur(id));
      
      // DÉSACTIVÉ : Plus de sauvegarde localStorage - Supabase est la source de vérité
      console.log('🎯 Fournisseurs supprimés en masse - Supabase est la source de vérité');
      
      // RÃ©initialiser la sÃ©lection
      setSelectedFournisseurs([]);
      setShowDeleteBulkModal(false);
      alert(`âœ… ${selectedFournisseurs.length} fournisseur(s) supprimÃ©(s) avec succÃ¨s !`);
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
    
    // Mettre Ã  jour le champ de recherche avec le nouveau compte
    setSearchCompteTerm(`${newCompteData.numeroCompte} - ${newCompteData.intitule}`);
    setNewFournisseur({...newFournisseur, compteComptable: newCompteData.numeroCompte});
    
    // Notification de succÃ¨s
    alert(`âœ… Compte comptable crÃ©Ã© avec succÃ¨s !\nNumÃ©ro: ${newCompteData.numeroCompte}\nIntitulÃ©: ${newCompteData.intitule}`);
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
      case 'ARCHIVE': return 'ArchivÃ©';
      default: return 'Inconnu';
    }
  };

  const [showCreateEcheanceModal, setShowCreateEcheanceModal] = useState(false);
  const [newEcheance, setNewEcheance] = useState({ libelle: '', delai: '', description: '' });
  const [echeances, setEcheances] = useState([
    { id: 'COMPTANT', libelle: 'COMPTANT - 0 jour', delai: 0, description: 'Paiement immÃ©diat' },
    { id: '30J', libelle: '30J - 30 Jours date de facture', delai: 30, description: '30 jours aprÃ¨s facture' },
    { id: '45J', libelle: '45J - 45 Jours date de facture', delai: 45, description: '45 jours aprÃ¨s facture' },
    { id: '60J', libelle: '60J - 60 Jours date de facture', delai: 60, description: '60 jours aprÃ¨s facture' },
    { id: 'FINMOIS30J', libelle: 'Fin de mois + 30J', delai: 30, description: 'Fin de mois + 30 jours' }
  ]);

  const handleCreateEcheance = () => {
    if (!newEcheance.libelle || !newEcheance.delai) {
      alert('Veuillez remplir le libellÃ© et le dÃ©lai');
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
    
    // Notification de succÃ¨s
    alert(`âœ… Ã‰chÃ©ance crÃ©Ã©e avec succÃ¨s !\nLibellÃ©: ${newEcheanceData.libelle}\nDÃ©lai: ${newEcheanceData.delai} jours`);
  };

  // Fonction pour crÃ©er un compte comptable depuis la sidebar
  const handleCreateCompteComptable = () => {
    console.log('ðŸš€ Tentative de crÃ©ation du compte...', newCompteComptable);
    const errors = {};
    
    // Validation des champs obligatoires
    if (!newCompteComptable.numero) {
      errors.numero = 'Le numÃ©ro de compte est obligatoire';
    }
    if (!newCompteComptable.nom) {
      errors.nom = 'Le nom du compte est obligatoire';
    }
    if (!newCompteComptable.journalCentralisation) {
      errors.journalCentralisation = 'Le journal de centralisation est obligatoire';
    }

    if (Object.keys(errors).length > 0) {
      console.log('âŒ Erreurs de validation:', errors);
      setCompteErrors(errors);
      alert(`âŒ Erreur de validation :\n${Object.values(errors).join('\n')}`);
      return;
    }

    // DÃ©tection automatique de la classe et du type
    const detectCompteClasse = (numero) => {
      const num = parseInt(numero);
      if (num >= 1 && num <= 5) return 'Actifs';
      if (num >= 6 && num <= 7) return 'Passifs';
      if (num >= 6 && num <= 7) return 'Tiers';
      if (num >= 1 && num <= 5) return 'Charges';
      if (num >= 7 && num <= 7) return 'Produits';
      return 'Tiers';
    };

    const detectCompteType = (numero) => {
      const num = parseInt(numero);
      if (num >= 1 && num <= 5) return 'actif';
      if (num >= 6 && num <= 7) return 'passif';
      if (num >= 6 && num <= 7) return 'charge';
      if (num >= 1 && num <= 5) return 'produit';
      return 'charge';
    };

    const classeAuto = detectCompteClasse(newCompteComptable.numero);
    const typeAuto = detectCompteType(newCompteComptable.numero);

    const compte = {
      ...newCompteComptable,
      numero: newCompteComptable.numero,
      classe: classeAuto,
      type: typeAuto,
      id: Date.now(),
      dateCreation: new Date().toISOString()
    };

    console.log('âœ… Compte crÃ©Ã© avec succÃ¨s:', compte);

    // Utiliser Zustand pour ajouter le compte
    const { addCompte } = useComptesStore.getState();
    addCompte(compte);

    // SÃ©lectionner automatiquement le nouveau compte
    setNewFournisseur({...newFournisseur, compteComptable: compte.numero});
    
    // Fermer la sidebar et rÃ©initialiser
    setShowCompteSelectionModal(false);
    setNewCompteComptable({
      numero: '', nom: '', type: 'charge', classe: '', description: '',
      journalCentralisation: '', saisieAutorisee: true, actif: true
    });
    setCompteErrors({});

    alert(`âœ… Compte crÃ©Ã© et sÃ©lectionnÃ© avec succÃ¨s !\n\nNumÃ©ro: ${compte.numero}\nNom: ${compte.nom}\nClasse: ${compte.classe}\nType: ${compte.type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* AchatsBanner STICKY - reste fixÃ© en haut */}
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
              { id: 'produits', label: 'Produits', icon: Package },
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

      {/* Contenu principal avec padding-top pour compenser les Ã©lÃ©ments sticky */}
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
                <h2 className="text-xl font-semibold text-gray-900">Fournisseurs rÃ©cents</h2>
        <button
                  onClick={() => setActiveTab('fournisseurs')}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                >
                  Voir tous
                  <TrendingUp className="h-4 w-4" />
        </button>
              </div>
              
              {fournisseursLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                             ) : fournisseurs.length === 0 ? (
                 <div className="text-center py-12">
                   <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fournisseur</h3>
                   <p className="text-gray-500 mb-4">Commencez par ajouter votre premier fournisseur</p>
                   <div className="flex gap-3">
                     <GestalisButton 
                       onClick={() => setShowCreateModal(true)}
                       className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white"
                     >
                       <Plus className="h-4 w-4 mr-2" />
                       Ajouter un fournisseur
                     </GestalisButton>
                     
                     {/* Bouton de test temporaire */}
                     <button
                       onClick={() => {
                         const testFournisseur = {
                           id: 'test-123',
                           raisonSociale: 'Fournisseur Test',
                           codeFournisseur: 'FTEST-001',
                           siret: '12345678901234'
                         };
                         setSelectedFournisseur(testFournisseur);
                         setShowEditModal(true);
                       }}
                       className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200"
                     >
                       ðŸ§ª Test Modal Modifier
                     </button>
                   </div>
                 </div>
               ) : (
                 <div className="space-y-4">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="text-sm font-medium text-gray-600">Fournisseurs crÃ©Ã©s</h4>
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
                           <p className="text-sm text-gray-500">{fournisseur.codeFournisseur} â€¢ {fournisseur.siret}</p>
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
                         Voir tous les {fournisseurs.length} fournisseurs â†’
        </button>
                     </div>
                   )}
                 </div>
               )}
            </div>

            {/* Section Produits */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Produits rÃ©cents</h2>
                <button
                  onClick={() => setActiveTab('produits')}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                >
                  Voir tous
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
              
              {produits.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit</h3>
                  <p className="text-gray-500 mb-4">Commencez par ajouter votre premier produit</p>
                  <GestalisButton 
                    onClick={() => setShowCreateProduitModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un produit
                  </GestalisButton>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-600">Produits crÃ©Ã©s</h4>
                    <span className="text-sm text-gray-500">Total: {produits.length}</span>
                  </div>
                  <div className="grid gap-3">
                    {produits.slice(0, 3).map((produit) => (
                      <div key={produit.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{produit.nom}</h4>
                          <p className="text-sm text-gray-500">{produit.code} â€¢ {produit.categorie}</p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {produit.statut}
                        </span>
                      </div>
                    ))}
                  </div>
                  {produits.length > 3 && (
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setActiveTab('produits')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Voir tous les {produits.length} produits â†’
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section ActivitÃ©s rÃ©centes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">ActivitÃ©s rÃ©centes</h2>
              
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune activitÃ© rÃ©cente</p>
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
            <p className="text-gray-500">FonctionnalitÃ© Ã  coder beaucoup plus tard</p>
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
            <p className="text-gray-500">FonctionnalitÃ© en cours de dÃ©veloppement</p>
          </div>
        )}

        {activeTab === 'produits' && (
          <div className="space-y-6">
            {/* Barre de recherche et filtres */}
            <GestalisCard className="bg-white border-0 shadow-sm">
              <GestalisCardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher un produit..."
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
                      <option value="all">Toutes les catÃ©gories</option>
                      {categoriesProduits.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
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

            {/* En-tÃªte avec bouton d'ajout */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Produits ({produits.length})
              </h3>
              <GestalisButton 
                onClick={() => setShowCreateProduitModal(true)}
                className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </GestalisButton>
            </div>

            {/* Liste des produits */}
            {produits.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun produit trouvÃ©</h3>
                <p className="text-gray-500 mb-6">Commencez par ajouter votre premier produit</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {produits.map((produit) => (
                  <GestalisCard key={produit.id} className="hover:shadow-md transition-all duration-300 border-0 bg-white">
                    <GestalisCardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{produit.nom}</h3>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {produit.statut}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {produit.categorie}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Code</p>
                              <p className="text-sm text-gray-900 font-mono">{produit.code}</p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-500">UnitÃ©</p>
                              <p className="text-sm text-gray-900">{produit.unite}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Fournisseurs</p>
                              <p className="text-sm text-gray-900">{produit.fournisseurs?.length || 0}</p>
                            </div>
                          </div>
                          
                          {produit.description && (
                            <p className="text-sm text-gray-600 mt-4">{produit.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => setSelectedProduit(produit)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Voir les dÃ©tails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduit(produit);
                              setNewProduit(produit);
                              setShowCreateProduitModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`ÃŠtes-vous sÃ»r de vouloir supprimer le produit "${produit.nom}" ?`)) {
                                setProduits(prev => prev.filter(p => p.id !== produit.id));
                                // DÉSACTIVÉ : Plus de localStorage - Supabase est la source de vérité
                                deleteProduit(produit.id);
                                console.log('🎯 Produit supprimé - Supabase est la source de vérité');
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </GestalisCardContent>
                  </GestalisCard>
                ))}
              </div>
            )}
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
                      <option value="ARCHIVE">ArchivÃ©</option>
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

            {/* En-tÃªte avec bouton d'ajout */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Fournisseurs ({fournisseurs.length})
              </h3>
              <GestalisButton 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un fournisseur
              </GestalisButton>
            </div>

            {/* Liste des fournisseurs */}
            {fournisseursLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : fournisseurs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun fournisseur trouvÃ©</h3>
                <p className="text-gray-500 mb-6">Commencez par ajouter votre premier fournisseur</p>
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
                            <div className="flex gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Actif
                              </span>
                              {fournisseur.estSousTraitant && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center gap-1">
                                  ðŸ—ï¸ Sous-traitant
                                </span>
                              )}
                            </div>
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
                            onClick={() => handleViewFournisseur(fournisseur)}
                            variant="outline" 
                            size="sm" 
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            title="Visualiser"
                          >
                            <Eye className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton 
                            onClick={() => handleEditFournisseur(fournisseur)}
                            variant="outline" 
                            size="sm"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton 
                            onClick={() => handleDeleteFournisseur(fournisseur.id)}
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
            <p className="text-gray-600 mb-4">FonctionnalitÃ© en cours de dÃ©veloppement</p>
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
            <p className="text-gray-600 mb-4">FonctionnalitÃ© en cours de dÃ©veloppement</p>
            <div className="flex justify-end">
              <GestalisButton onClick={() => setShowDocumentModal(false)}>
                Fermer
              </GestalisButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crÃ©ation de fournisseur moderne */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex">
            {/* Sidebar colorÃ©e avec navigation */}
            <div className="w-80 bg-gradient-to-b from-blue-500 to-teal-600 p-6 text-white">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">
                  {selectedFournisseur ? 'Modifier le Fournisseur' : 'Nouveau Fournisseur'}
                </h3>
                <p className="text-blue-100">Remplissez les informations du fournisseur</p>
              </div>
              
              <nav className="space-y-2">
                {[
                  { id: 'coordonnees', label: 'CoordonnÃ©es', icon: Building2 },
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
                  {activeCreateTab === 'coordonnees' && 'CoordonnÃ©es du fournisseur'}
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

              {/* Onglet CoordonnÃ©es */}
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
                      <p className="text-sm text-gray-500 mt-1">Code gÃ©nÃ©rÃ© automatiquement</p>
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
                        <option value="">SÃ©lectionner</option>
                        <option value="SARL">SARL</option>
                        <option value="SAS">SAS</option>
                        <option value="SA">SA</option>
                        <option value="EURL">EURL</option>
                        <option value="EI">EI</option>
                        <option value="AUTRE">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse du siÃ¨ge</label>
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
                        classÃ© comme sous-traitant dans la comptabilitÃ© et des rÃ¨gles spÃ©cifiques s'appliqueront 
                        (ex: TVA diffÃ©rente, documents obligatoires, etc.).
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
                      âœ… Pas de TVA â€“ Guyane (CGI art. 294, 1Â°)
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">TÃ©lÃ©phone fixe</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">TÃ©lÃ©phone portable</label>
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

                  {/* Contacts supplÃ©mentaires */}
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
                          placeholder="TÃ©lÃ©phone"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">NumÃ©ro de compte</label>
                      <Input
                        value={newFournisseur.numeroCompte || ''}
                        onChange={(e) => setNewFournisseur({...newFournisseur, numeroCompte: e.target.value})}
                        placeholder="12345678901"
                        className="w-full"
                      />
                        </div>
                  </div>

                        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ClÃ© RIB</label>
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
                       <label className="block text-sm font-medium text-gray-700 mb-2">NumÃ©ro de compte</label>
                       
                       {/* Combobox : Recherche + SÃ©lection en un seul endroit */}
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
                                     // Filtrer les comptes en temps rÃ©el
                                     const filtered = comptes.filter(compte => 
                                       (compte.numero && compte.numero.toString().toLowerCase().includes(value.toLowerCase())) ||
                                       (compte.nom && compte.nom.toLowerCase().includes(value.toLowerCase())) ||
                                       (compte.intitule && compte.intitule.toLowerCase().includes(value.toLowerCase()))
                                     );
                                     setFilteredPlanComptable(filtered);
                                     setShowCompteResults(true);
                                   } else {
                                     setFilteredPlanComptable(comptes);
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
                             
                             {/* RÃ©sultats de recherche en dropdown */}
                             {showCompteResults && searchCompteTerm.length > 0 && (
                               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                 {filteredPlanComptable.length > 0 ? (
                                   filteredPlanComptable.map((compte) => (
                                     <div
                                       key={compte.numero || compte.id}
                                       onClick={() => {
                                         setNewFournisseur({...newFournisseur, compteComptable: compte.numero});
                                         setSearchCompteTerm(`${compte.numero} - ${compte.nom || compte.intitule}`);
                                         setShowCompteResults(false);
                                       }}
                                       className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                     >
                                       <div className="flex items-center justify-between">
                                         <div className="flex-1">
                                           <div className="font-medium text-gray-900">{compte.numero}</div>
                                           <div className="text-sm text-gray-600">{compte.nom || compte.intitule}</div>
                                         </div>
                                         <div className="flex flex-col items-end text-xs">
                                           <span className={`px-2 py-1 rounded-full ${
                                             compte.type === 'passif' ? 'bg-blue-100 text-blue-800' :
                                             compte.type === 'charge' ? 'bg-red-100 text-red-800' :
                                             'bg-gray-100 text-gray-800'
                                           }`}>
                                             {compte.type}
                                           </span>
                                           {compte.classe && (
                                             <span className="text-gray-500 mt-1">{compte.classe}</span>
                                           )}
                                         </div>
                                       </div>
                                     </div>
                                   ))
                                 ) : (
                                   <div className="px-4 py-3 text-gray-500 text-center">
                                     Aucun compte trouvÃ©
                  </div>
                                 )}
            </div>
                             )}
                           </div>
                           
                           <button
                             onClick={() => {
                               // Sauvegarde immÃ©diate du brouillon du fournisseur
                               const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                               localStorage.setItem(`draft_fournisseur_${draftId}`, JSON.stringify(newFournisseur));
                               
                               // Marquer qu'on attend une sÃ©lection
                               sessionStorage.setItem('awaiting_pick', `1|${Date.now()}|${draftId}`);
                               
                               // Naviguer vers le plan comptable en mode picker
                               navigate("/comptabilite?tab=plan-comptable&context=picker", {
                                 state: {
                                   returnTo: "/achats?tab=fournisseurs",
                                   returnField: "compteComptable",
                                   draftId,
                                 },
                               });
                             }}
                             className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                             title="CrÃ©er un nouveau compte comptable"
                           >
                             <Plus className="h-3 w-3" />
                             <span className="text-xs font-medium">Nouveau</span>
                           </button>
                         </div>
                         
                         <p className="text-sm text-gray-500 mt-1">
                           {searchCompteTerm.length > 0 ? `${filteredPlanComptable.length} compte(s) trouvÃ©(s)` : 'Tapez pour rechercher un compte existant ou crÃ©ez-en un nouveau'}
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
                         <option value="EUR">EUR (â‚¬)</option>
                         <option value="USD">USD ($)</option>
                         <option value="GBP">GBP (Â£)</option>
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Plafond de crÃ©dit</label>
                     <Input
                       type="number"
                       value={newFournisseur.plafondCredit}
                       onChange={(e) => setNewFournisseur({...newFournisseur, plafondCredit: e.target.value})}
                       placeholder="50000"
                       className="w-full"
                     />
                   </div>

                   {/* Conditions de RÃ¨glement */}
                   <div className="border-t pt-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4">Conditions de RÃ¨glement</h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* Mode de RÃ¨glement */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Mode de RÃ¨glement
                         </label>
                         <select
                           value={newFournisseur.modeReglement || 'VIR'}
                           onChange={(e) => {
                             const mode = e.target.value;
                             setNewFournisseur({
                               ...newFournisseur, 
                               modeReglement: mode,
                               // Logique mÃ©tier : si COMPTANT, jours de dÃ©calage = 0
                               joursDecalage: mode === 'COMPTANT' ? 0 : (newFournisseur.joursDecalage || 30)
                             });
                           }}
                           className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                         >
                           <option value="COMPTANT">COMPTANT - Paiement immÃ©diat</option>
                           <option value="VIR">VIR - Virement</option>
                           <option value="CHQ">CHQ - ChÃ¨que</option>
                           <option value="ESP">ESP - EspÃ¨ces</option>
                           <option value="CARTE">CARTE - Carte bancaire</option>
                         </select>
                       </div>

                       {/* Ã‰chÃ©ance type */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Ã‰chÃ©ance type
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
                                 // Logique mÃ©tier : si COMPTANT, jours de dÃ©calage = 0
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
                             title="CrÃ©er une nouvelle Ã©chÃ©ance"
                           >
                             <Plus className="h-4 w-4" />
                             <span className="text-sm font-medium">Nouvelle</span>
                           </button>
                         </div>
                       </div>

                       {/* Respect Ã‰chÃ©ance */}
                       <div className="flex items-center">
                         <input
                           type="checkbox"
                           id="respectEcheance"
                           checked={newFournisseur.respectEcheance !== undefined ? newFournisseur.respectEcheance : true}
                           onChange={(e) => setNewFournisseur({...newFournisseur, respectEcheance: e.target.checked})}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         />
                         <label htmlFor="respectEcheance" className="ml-2 block text-sm text-gray-900">
                           Respect Ã‰chÃ©ance type
                         </label>
                       </div>

                       {/* Jours de dÃ©calage */}
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Jours de dÃ©calage
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
                      PrÃ©cÃ©dent
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
                  
                  {/* Bouton CrÃ©er visible partout */}
                  <button
                    onClick={handleCreateFournisseur}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium"
                  >
                    {selectedFournisseur ? 'Modifier le fournisseur' : 'CrÃ©er le fournisseur'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

             {/* Modal de crÃ©ation de compte comptable */}
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
                     <h3 className="text-xl font-semibold text-gray-900">CrÃ©er un nouveau compte fournisseur</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">NumÃ©ro de compte (F...)</label>
                <Input
                  value={newCompte.numeroCompte}
                  onChange={(e) => setNewCompte({...newCompte, numeroCompte: e.target.value})}
                  placeholder="F0001"
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">Format obligatoire : F suivi de chiffres (ex: F0001)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IntitulÃ© du compte</label>
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
                  <option value="DEPOT">DÃ©pÃ´t</option>
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
                CrÃ©er le compte
              </button>
            </div>
          </div>
          </div>
        )}

      {/* Modal de crÃ©ation de condition de paiement */}
      {showCreateConditionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">CrÃ©er une nouvelle condition de paiement</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">LibellÃ©</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">DÃ©lai (en jours)</label>
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
                  placeholder="Description dÃ©taillÃ©e de la condition..."
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
                CrÃ©er la condition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crÃ©ation d'Ã©chÃ©ance */}
      {showCreateEcheanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">CrÃ©er une nouvelle Ã©chÃ©ance</h3>
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
                  LibellÃ© de l'Ã©chÃ©ance
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
                  DÃ©lai en jours
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
                  placeholder="ex: 15 jours aprÃ¨s la date de facture"
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
                CrÃ©er l'Ã©chÃ©ance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crÃ©ation de produit */}
      {showCreateProduitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-blue-500 to-teal-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {selectedProduit ? 'Modifier le produit' : 'Nouveau Produit'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateProduitModal(false);
                    setSelectedProduit(null);
                    setCodeAutoGenere(false);
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Contenu du modal */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Informations de base
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code produit <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ex: MAT-001 (MatÃ©riaux TP)"
                        value={newProduit.code}
                        onChange={(e) => {
                          if (!codeAutoGenere) {
                            setNewProduit({...newProduit, code: e.target.value.toUpperCase()});
                          }
                        }}
                        className={`flex-1 rounded-lg border px-3 py-2 focus:outline-none ${
                          codeAutoGenere 
                            ? 'border-green-300 bg-green-50 text-green-800 cursor-not-allowed' 
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                        readOnly={codeAutoGenere}
                        title={codeAutoGenere ? "Code gÃ©nÃ©rÃ© automatiquement - non modifiable" : ""}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const codeGenere = generateProduitCode(newProduit.categorie);
                          setNewProduit({...newProduit, code: codeGenere});
                          setCodeAutoGenere(true);
                        }}
                        className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm whitespace-nowrap"
                        disabled={!newProduit.categorie || codeAutoGenere}
                        title={codeAutoGenere ? "Code dÃ©jÃ  gÃ©nÃ©rÃ© automatiquement" : "GÃ©nÃ©rer automatiquement le code"}
                      >
                        <Package className="h-4 w-4 inline mr-1" />
                        Auto
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Code gÃ©nÃ©rÃ© automatiquement selon la catÃ©gorie sÃ©lectionnÃ©e
                    </p>
                  </div>
                  

                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du produit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ex: CÃ¢ble Ã©lectrique 2.5mmÂ²"
                      value={newProduit.nom}
                      onChange={(e) => setNewProduit({...newProduit, nom: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Description dÃ©taillÃ©e du produit..."
                      value={newProduit.description}
                      onChange={(e) => setNewProduit({...newProduit, description: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* CatÃ©gorisation */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    CatÃ©gorisation
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CatÃ©gorie <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newProduit.categorie}
                      onChange={(e) => {
                        const newCategorie = e.target.value;
                        setNewProduit({
                          ...newProduit, 
                          categorie: newCategorie, 
                          code: generateProduitCode(newCategorie)
                        });
                        setCodeAutoGenere(true); // Marquer comme auto-gÃ©nÃ©rÃ©
                      }}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">SÃ©lectionner une catÃ©gorie</option>
                      {categoriesProduits.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  

                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UnitÃ© de mesure</label>
                    <select
                      value={newProduit.unite}
                      onChange={(e) => setNewProduit({...newProduit, unite: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      {unitesMesure.map(unite => (
                        <option key={unite.value} value={unite.value}>{unite.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>



              {/* Fournisseurs et prix */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Fournisseurs et prix
                  </h4>
                  <button
                    onClick={addProduitFournisseur}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Ajouter un fournisseur
                  </button>
                </div>
                
                <div className="space-y-4">
                  {produitFournisseurs.map((fournisseur, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-700">Fournisseur {index + 1}</h5>
                        {produitFournisseurs.length > 1 && (
                          <button
                            onClick={() => removeProduitFournisseur(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                          <select
                            value={fournisseur.fournisseurId}
                            onChange={(e) => updateProduitFournisseur(index, 'fournisseurId', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">SÃ©lectionner un fournisseur</option>
                            {fournisseurs.map(f => (
                              <option key={f.id} value={f.id}>{f.raisonSociale}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Code produit fournisseur</label>
                          <input
                            type="text"
                            placeholder="Code du produit chez le fournisseur"
                            value={fournisseur.codeFournisseur}
                            onChange={(e) => updateProduitFournisseur(index, 'codeFournisseur', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={fournisseur.prixUnitaire}
                            onChange={(e) => updateProduitFournisseur(index, 'prixUnitaire', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date du prix</label>
                          <input
                            type="date"
                            value={fournisseur.datePrix}
                            onChange={(e) => updateProduitFournisseur(index, 'datePrix', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                          <select
                            value={fournisseur.devise}
                            onChange={(e) => updateProduitFournisseur(index, 'devise', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="EUR">EUR (â‚¬)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (Â£)</option>
                          </select>
                        </div>
                        

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commentaires */}
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Commentaires
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires additionnels</label>
                  <textarea
                    placeholder="Informations supplÃ©mentaires, notes internes..."
                    value={newProduit.commentaires}
                    onChange={(e) => setNewProduit({...newProduit, commentaires: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateProduitModal(false);
                    setSelectedProduit(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateProduit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  {selectedProduit ? 'Modifier le produit' : 'CrÃ©er le produit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar ComptabilitÃ© - CrÃ©ation de compte */}
      {showCompteSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex">
            {/* Contenu principal - Formulaire fournisseur */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">CrÃ©ation de fournisseur</h3>
                <button
                  onClick={() => setShowCompteSelectionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Formulaire fournisseur existant */}
              <div className="space-y-6">
                <p className="text-gray-600">Continuez Ã  remplir le formulaire fournisseur pendant que vous crÃ©ez le compte comptable Ã  droite.</p>
                {/* Ici on pourrait afficher un rÃ©sumÃ© du formulaire fournisseur */}
              </div>
            </div>

            {/* Sidebar droite - Formulaire comptabilitÃ© */}
            <div className="w-96 bg-gradient-to-b from-orange-500 to-red-600 p-6 text-white">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Nouveau Compte</h3>
                <p className="text-orange-100">CrÃ©ez le compte comptable pour votre fournisseur</p>
              </div>
              
              {/* Formulaire de crÃ©ation de compte */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    NumÃ©ro de compte <span className="text-red-200">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 401, 411, 604..."
                    value={newCompteComptable.numero}
                    onChange={(e) => {
                      const numero = e.target.value;
                      setNewCompteComptable({...newCompteComptable, numero});
                    }}
                    className={`w-full px-3 py-2 rounded-lg border-2 ${
                      compteErrors.numero ? 'border-red-300 bg-red-50' : 'border-white/30 bg-white/10'
                    } text-white placeholder-white/60 focus:outline-none focus:border-white`}
                  />
                  {compteErrors.numero && (
                    <p className="text-red-200 text-sm mt-1">{compteErrors.numero}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nom du compte <span className="text-red-200">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Fournisseurs, Clients..."
                    value={newCompteComptable.nom}
                    onChange={(e) => setNewCompteComptable({...newCompteComptable, nom: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border-2 ${
                      compteErrors.nom ? 'border-red-300 bg-red-50' : 'border-white/30 bg-white/10'
                    } text-white placeholder-white/60 focus:outline-none focus:border-white`}
                  />
                  {compteErrors.nom && (
                    <p className="text-red-200 text-sm mt-1">{compteErrors.nom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Type de compte</label>
                  <select
                    value={newCompteComptable.type}
                    onChange={(e) => setNewCompteComptable({...newCompteComptable, type: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-white/30 bg-white/10 text-white focus:outline-none focus:border-white"
                  >
                    <option value="actif" className="bg-gray-800">Actif</option>
                    <option value="passif" className="bg-gray-800">Passif</option>
                    <option value="charge" className="bg-gray-800">Charge</option>
                    <option value="produit" className="bg-gray-800">Produit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Journal de centralisation <span className="text-red-200">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: VT, AC, BQ..."
                    value={newCompteComptable.journalCentralisation}
                    onChange={(e) => setNewCompteComptable({...newCompteComptable, journalCentralisation: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border-2 ${
                      compteErrors.journalCentralisation ? 'border-red-300 bg-red-50' : 'border-white/30 bg-white/10'
                    } text-white placeholder-white/60 focus:outline-none focus:border-white`}
                  />
                  {compteErrors.journalCentralisation && (
                    <p className="text-red-200 text-sm mt-1">{compteErrors.journalCentralisation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <textarea
                    placeholder="Description du compte..."
                    value={newCompteComptable.description}
                    onChange={(e) => setNewCompteComptable({...newCompteComptable, description: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white"
                    rows={3}
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCompteSelectionModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-white/30 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateCompteComptable}
                    className="flex-1 px-4 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
                    CrÃ©er et sÃ©lectionner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achats; 



