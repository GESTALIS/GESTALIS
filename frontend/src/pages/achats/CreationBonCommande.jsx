import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Download,
  Building2,
  User,
  Calendar,
  MapPin,
  Package,
  Search,
  X,
  ArrowLeft
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../components/ui/GestalisCard';
import { GestalisButton } from '../../components/ui/gestalis-button';
import { Input } from '../../components/ui/input';
import { api } from '../../utils/api';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

const CreationBonCommande = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Log de débogage pour vérifier que le composant se charge
  console.log('🚀 Composant CreationBonCommande chargé');
  console.log('👤 Utilisateur connecté:', user);
  
  const [bonCommande, setBonCommande] = useState({
    numeroCommande: '',
    dateCommande: new Date().toISOString().split('T')[0],
    dateLivraisonSouhaitee: '',
    demandeurId: '',
    createurId: user?.id || '',
    fournisseurId: '',
    chantierId: '',
    adresseLivraison: '',
    conditionsLivraison: '',
    conditionsPaiement: '',
    echeancePaiement: '',
    notes: ''
  });

  const [articles, setArticles] = useState([
    {
      id: 1,
      designation: '',
      quantite: '',
      unite: 'U',
      description: '',
      prixUnitaire: ''
    }
  ]);

  const [fournisseurs, setFournisseurs] = useState([]);
  const [chantiers, setChantiers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Recherche fournisseur
  const [searchTermFournisseur, setSearchTermFournisseur] = useState('');
  const [showSearchResultsFournisseur, setShowSearchResultsFournisseur] = useState(false);
  
  // Recherche chantier
  const [searchTermChantier, setSearchTermChantier] = useState('');
  const [showSearchResultsChantier, setShowSearchResultsChantier] = useState(false);
  
  // Recherche demandeur
  const [searchTermDemandeur, setSearchTermDemandeur] = useState('');
  const [showSearchResultsDemandeur, setShowSearchResultsDemandeur] = useState(false);
  
  // Recherche createur
  const [searchTermCreateur, setSearchTermCreateur] = useState('');
  const [showSearchResultsCreateur, setShowSearchResultsCreateur] = useState(false);

  // Modals de création rapide
  const [showCreateFournisseurModal, setShowCreateFournisseurModal] = useState(false);
  const [showCreateChantierModal, setShowCreateChantierModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateArticleModal, setShowCreateArticleModal] = useState(false);

  // États pour les nouveaux éléments
  const [newFournisseur, setNewFournisseur] = useState({
    raisonSociale: '',
    codeFournisseur: '',
    siret: '',
    adresseSiege: ''
  });

  const [newChantier, setNewChantier] = useState({
    nom: '',
    codeChantier: '',
    adresse: '',
    codePostal: '',
    ville: ''
  });

  const [newUser, setNewUser] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: 'UTILISATEUR'
  });

  const [newArticle, setNewArticle] = useState({
    designation: '',
    description: '',
    unite: 'U'
  });

  useEffect(() => {
    fetchData();
  }, []);

  // S'assurer que le numéro de commande est toujours défini
  useEffect(() => {
    if (!bonCommande.numeroCommande) {
      console.log('⚠️ Numéro de commande manquant, définition par défaut...');
      setBonCommande(prev => ({ 
        ...prev, 
        numeroCommande: 'BCPRO97-0001' 
      }));
    }
  }, [bonCommande.numeroCommande]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Chargement des données...');
      
      // Charger les fournisseurs
      const fournisseursResponse = await api.get('/api/fournisseurs');
      setFournisseurs(fournisseursResponse.data);
      console.log('✅ Fournisseurs chargés:', fournisseursResponse.data.length);
      
      // Charger les chantiers
      const chantiersResponse = await api.get('/api/chantiers');
      setChantiers(chantiersResponse.data);
      console.log('✅ Chantiers chargés:', chantiersResponse.data.length);
      
      // Charger les utilisateurs
      const usersResponse = await api.get('/api/users');
      setUsers(usersResponse.data);
      console.log('✅ Utilisateurs chargés:', usersResponse.data.length);
      
      // Générer le numéro de commande
      console.log('🔢 Génération du numéro de commande...');
      const numeroCommande = await generateNumeroCommande();
      console.log('📝 Numéro généré:', numeroCommande);
      
      setBonCommande(prev => ({ 
        ...prev, 
        numeroCommande: numeroCommande || 'BCPRO97-0001' 
      }));
      
      console.log('✅ État final bonCommande:', { ...bonCommande, numeroCommande });
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      // En cas d'erreur, définir un numéro par défaut
      setBonCommande(prev => ({ 
        ...prev, 
        numeroCommande: 'BCPRO97-0001' 
      }));
    } finally {
      setLoading(false);
    }
  };

  const generateNumeroCommande = async () => {
    try {
      console.log('🔍 Génération du numéro de commande...');
      
      // Récupérer le dernier numéro de commande
      const response = await api.get('/api/bons-commande');
      console.log('📡 Réponse API:', response);
      
      const existingCommandes = response.data;
      console.log('📋 Commandes existantes:', existingCommandes);
      
      if (existingCommandes.length === 0) {
        console.log('✅ Première commande, numéro: BCPRO97-0001');
        return 'BCPRO97-0001';
      }
      
      // Trouver le plus grand numéro
      const numbers = existingCommandes
        .map(cmd => cmd.numeroCommande)
        .filter(num => num && num.startsWith('BCPRO97-'))
        .map(num => parseInt(num.split('-')[1]) || 0);
      
      console.log('🔢 Nombres extraits:', numbers);
      
      const nextNumber = Math.max(...numbers) + 1;
      const numeroFinal = `BCPRO97-${String(nextNumber).padStart(4, '0')}`;
      console.log('🎯 Numéro généré:', numeroFinal);
      
      return numeroFinal;
    } catch (error) {
      console.error('❌ Erreur lors de la génération du numéro:', error);
      // En cas d'erreur, retourner un numéro par défaut
      return 'BCPRO97-0001';
    }
  };

  const handleInputChange = (field, value) => {
    setBonCommande(prev => ({ ...prev, [field]: value }));
  };

  const handleArticleChange = (index, field, value) => {
    const newArticles = [...articles];
    newArticles[index] = { ...newArticles[index], [field]: value };
    setArticles(newArticles);
  };

  const addArticle = () => {
    const newArticle = {
      id: Date.now(),
      designation: '',
      quantite: '',
      unite: 'U',
      description: '',
      prixUnitaire: ''
    };
    setArticles([...articles, newArticle]);
  };

  const removeArticle = (index) => {
    if (articles.length > 1) {
      const newArticles = articles.filter((_, i) => i !== index);
      setArticles(newArticles);
    }
  };

  // Recherche intelligente des fournisseurs
  const filteredFournisseurs = fournisseurs.filter(fournisseur => 
    fournisseur.raisonSociale.toLowerCase().includes(searchTermFournisseur.toLowerCase()) ||
    fournisseur.codeFournisseur.toLowerCase().includes(searchTermFournisseur.toLowerCase()) ||
    (fournisseur.siret && fournisseur.siret.includes(searchTermFournisseur))
  );

  const selectFournisseur = (fournisseur) => {
    setBonCommande(prev => ({ ...prev, fournisseurId: fournisseur.id }));
    setSearchTermFournisseur(fournisseur.raisonSociale);
    setShowSearchResultsFournisseur(false);
  };

  // Recherche intelligente des chantiers
  const filteredChantiers = chantiers.filter(chantier => 
    chantier.nom.toLowerCase().includes(searchTermChantier.toLowerCase()) ||
    chantier.codeChantier.toLowerCase().includes(searchTermChantier.toLowerCase()) ||
    (chantier.clientNom && chantier.clientNom.toLowerCase().includes(searchTermChantier.toLowerCase()))
  );

  const selectChantier = (chantier) => {
    setBonCommande(prev => ({ ...prev, chantierId: chantier.id }));
    setSearchTermChantier(`${chantier.codeChantier} - ${chantier.nom}`);
    setShowSearchResultsChantier(false);
  };

  // Recherche intelligente des demandeurs
  const filteredDemandeurs = users.filter(user => 
    user.prenom.toLowerCase().includes(searchTermDemandeur.toLowerCase()) ||
    user.nom.toLowerCase().includes(searchTermDemandeur.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTermDemandeur.toLowerCase())
  );

  const selectDemandeur = (user) => {
    setBonCommande(prev => ({ ...prev, demandeurId: user.id }));
    setSearchTermDemandeur(`${user.prenom} ${user.nom} (${user.role})`);
    setShowSearchResultsDemandeur(false);
  };

  // Recherche intelligente des createurs
  const filteredCreateurs = users.filter(user => 
    user.prenom.toLowerCase().includes(searchTermCreateur.toLowerCase()) ||
    user.nom.toLowerCase().includes(searchTermCreateur.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTermCreateur.toLowerCase())
  );

  const selectCreateur = (user) => {
    setBonCommande(prev => ({ ...prev, createurId: user.id }));
    setSearchTermCreateur(`${user.prenom} ${user.nom} (${user.role})`);
    setShowSearchResultsCreateur(false);
  };

  // 🚀 NOUVELLES FONCTIONS DE GESTION AUTOMATIQUE
  // Fonction pour ouvrir directement dans l'onglet approprié
  const openCreateInTab = (type, searchTerm) => {
    // Stocker le terme de recherche et le type dans localStorage
    localStorage.setItem('createFromSearch', JSON.stringify({
      type: type,
      searchTerm: searchTerm
    }));

    // Rediriger vers la page appropriée
    switch (type) {
      case 'fournisseur':
        window.location.href = '/achats?tab=fournisseurs&create=true';
        break;
      case 'chantier':
        window.location.href = '/chantiers?create=true';
        break;
      case 'user':
        window.location.href = '/admin/users?create=true';
        break;
      case 'article':
        // Pour les articles, on utilise le modal existant mais avec le terme pré-rempli
        setNewArticle(prev => ({ ...prev, designation: searchTerm }));
        setShowCreateArticleModal(true);
        break;
      default:
        break;
    }
  };

  // Fonction pour gérer la recherche et création automatique
  const handleSearchAndCreate = (type, searchTerm, setSearchTerm, setShowResults) => {
    if (searchTerm.trim() === '') return;

    // Filtrer les résultats selon le type
    let filteredResults = [];
    switch (type) {
      case 'fournisseur':
        filteredResults = filteredFournisseurs;
        break;
      case 'chantier':
        filteredResults = filteredChantiers;
        break;
      case 'user':
        filteredResults = type === 'demandeur' ? filteredDemandeurs : filteredCreateurs;
        break;
      case 'article':
        // Pour les articles, on ne fait pas de recherche automatique
        return;
      default:
        break;
    }

    // Si aucun résultat trouvé, ouvrir la page de création
    if (filteredResults.length === 0) {
      openCreatePage(type, searchTerm);
    } else {
      // Afficher les résultats de recherche
      setShowResults(true);
    }
  };

  // Fonction de création rapide pour les articles (avec désignation pré-remplie)
  const handleCreateArticleFromSearch = (designation) => {
    setNewArticle(prev => ({ ...prev, designation: designation }));
    setShowCreateArticleModal(true);
  };

  // Fonctions de création rapide
  const handleCreateFournisseur = async () => {
    try {
      const response = await api.post('/api/fournisseurs', newFournisseur);
      const createdFournisseur = response.data;
      
      // Ajouter à la liste locale
      setFournisseurs(prev => [...prev, createdFournisseur]);
      
      // Sélectionner automatiquement
      selectFournisseur(createdFournisseur);
      
      // Fermer le modal et réinitialiser
      setShowCreateFournisseurModal(false);
      setNewFournisseur({
        raisonSociale: '',
        codeFournisseur: '',
        siret: '',
        adresseSiege: ''
      });
      
      alert('✅ Fournisseur créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création du fournisseur:', error);
      alert('❌ Erreur lors de la création du fournisseur');
    }
  };

  const handleCreateChantier = async () => {
    try {
      const response = await api.post('/api/chantiers', newChantier);
      const createdChantier = response.data;
      
      // Ajouter à la liste locale
      setChantiers(prev => [...prev, createdChantier]);
      
      // Sélectionner automatiquement
      selectChantier(createdChantier);
      
      // Fermer le modal et réinitialiser
      setShowCreateChantierModal(false);
      setNewChantier({
        nom: '',
        codeChantier: '',
        adresse: '',
        codePostal: '',
        ville: ''
      });
      
      alert('✅ Chantier créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création du chantier:', error);
      alert('❌ Erreur lors de la création du chantier');
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await api.post('/api/users', newUser);
      const createdUser = response.data;
      
      // Ajouter à la liste locale
      setUsers(prev => [...prev, createdUser]);
      
      // Fermer le modal et réinitialiser
      setShowCreateUserModal(false);
      setNewUser({
        prenom: '',
        nom: '',
        email: '',
        role: 'UTILISATEUR'
      });
      
      alert('✅ Utilisateur créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      alert('❌ Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleCreateArticle = async () => {
    try {
      // Pour l'instant, on ajoute juste à la liste locale des articles
      // Plus tard, on pourra créer une vraie table d'articles
      const newArticleData = {
        id: Date.now(),
        designation: newArticle.designation,
        description: newArticle.description,
        unite: newArticle.unite
      };
      
      // Ajouter à la liste des articles
      setArticles(prev => [...prev, newArticleData]);
      
      // Fermer le modal et réinitialiser
      setShowCreateArticleModal(false);
      setNewArticle({
        designation: '',
        description: '',
        unite: 'U'
      });
      
      alert('✅ Article ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      alert('❌ Erreur lors de la création de l\'article');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!bonCommande.fournisseurId) {
        alert('Veuillez sélectionner un fournisseur');
        return;
      }
      
      if (!bonCommande.chantierId) {
        alert('Veuillez sélectionner un chantier');
        return;
      }
      
      if (!bonCommande.demandeurId) {
        alert('Veuillez sélectionner un demandeur');
        return;
      }
      
      if (articles.some(article => !article.designation || !article.quantite || !article.description)) {
        alert('Veuillez remplir la désignation, la quantité et la description pour tous les articles');
        return;
      }
      
      // Créer le bon de commande
      const bonCommandeData = {
        ...bonCommande,
        statut: 'DEMANDE', // Statut automatique
        articles: articles.map(article => ({
          designation: article.designation,
          quantite: parseFloat(article.quantite),
          unite: article.unite,
          description: article.description,
          prixUnitaire: article.prixUnitaire ? parseFloat(article.prixUnitaire) : null
        }))
      };
      
      const response = await api.post('/api/bons-commande', bonCommandeData);
      
      alert('✅ Bon de commande créé avec succès !');
      console.log('Bon de commande créé:', response.data);
      
      // Rediriger vers la liste des bons de commande
      window.location.href = '/achats/commandes';
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = () => {
    alert('📧 Fonctionnalité d\'envoi par email à implémenter');
  };

  const handleDownloadPDF = async () => {
    try {
      // Créer le contenu HTML du PDF
      const pdfContent = generatePDFContent();
      
      // Créer un blob et télécharger
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bonCommande.numeroCommande}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('📄 PDF généré et téléchargé !');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('❌ Erreur lors de la génération du PDF');
    }
  };

  const generatePDFContent = () => {
    const fournisseur = fournisseurs.find(f => f.id === bonCommande.fournisseurId);
    const chantier = chantiers.find(c => c.id === bonCommande.chantierId);
    const demandeur = users.find(u => u.id === bonCommande.demandeurId);
    const createur = users.find(u => u.id === bonCommande.createurId);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${bonCommande.numeroCommande}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .company-info { margin-bottom: 30px; }
        .supplier-info { margin-bottom: 30px; }
        .order-details { margin-bottom: 30px; }
        .articles-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .articles-table th, .articles-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .articles-table th { background-color: #f2f2f2; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BON DE COMMANDE</h1>
        <h2>${bonCommande.numeroCommande}</h2>
    </div>
    
    <div class="company-info">
        <h3>Informations de l'entreprise</h3>
        <p><strong>Nom:</strong> GESTALIS ERP</p>
        <p><strong>Date:</strong> ${new Date(bonCommande.dateCommande).toLocaleDateString('fr-FR')}</p>
    </div>
    
    <div class="supplier-info">
        <h3>Fournisseur</h3>
        <p><strong>Raison sociale:</strong> ${fournisseur ? fournisseur.raisonSociale : 'Non spécifié'}</p>
        <p><strong>Code:</strong> ${fournisseur ? fournisseur.codeFournisseur : 'Non spécifié'}</p>
        ${fournisseur?.adresseSiege ? `<p><strong>Adresse:</strong> ${fournisseur.adresseSiege}</p>` : ''}
    </div>
    
    <div class="order-details">
        <h3>Détails de la commande</h3>
        <p><strong>Chantier:</strong> ${chantier ? `${chantier.codeChantier} - ${chantier.nom}` : 'Non spécifié'}</p>
        <p><strong>Demandeur:</strong> ${demandeur ? `${demandeur.prenom} ${demandeur.nom}` : 'Non spécifié'}</p>
        <p><strong>Créateur:</strong> ${createur ? `${createur.prenom} ${createur.nom}` : 'Non spécifié'}</p>
        ${bonCommande.dateLivraisonSouhaitee ? `<p><strong>Date de livraison souhaitée:</strong> ${new Date(bonCommande.dateLivraisonSouhaitee).toLocaleDateString('fr-FR')}</p>` : ''}
    </div>
    
    <h3>Articles commandés</h3>
    <table class="articles-table">
        <thead>
            <tr>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>Unité</th>
                <th>Description</th>
                <th>Prix unitaire</th>
            </tr>
        </thead>
        <tbody>
            ${articles.map(article => `
                <tr>
                    <td>${article.designation}</td>
                    <td>${article.quantite}</td>
                    <td>${article.unite}</td>
                    <td>${article.description}</td>
                    <td>${article.prixUnitaire ? article.prixUnitaire + ' €' : '-'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    ${bonCommande.notes ? `
    <div class="notes">
        <h3>Notes</h3>
        <p>${bonCommande.notes}</p>
    </div>
    ` : ''}
    
    <div class="footer">
        <p>Document généré automatiquement par GESTALIS ERP</p>
        <p>Date de génération: ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}</p>
    </div>
</body>
</html>`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Création d'un Bon de Commande</h1>
                <p className="text-blue-100 text-lg">Nouvelle demande d'articles</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/achats/commandes')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour aux commandes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations générales */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations générales
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de commande
                    </label>
                    <Input
                      value={bonCommande.numeroCommande}
                      onChange={(e) => handleInputChange('numeroCommande', e.target.value)}
                      className="w-full bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de commande
                    </label>
                    <Input
                      type="date"
                      value={bonCommande.dateCommande}
                      onChange={(e) => handleInputChange('dateCommande', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Demandeur *
                     </label>
                     <div className="relative">
                       <div className="relative">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                         <Input
                           value={searchTermDemandeur}
                           onChange={(e) => {
                             setSearchTermDemandeur(e.target.value);
                             if (e.target.value.length > 0) {
                               handleSearchAndCreate('user', e.target.value, setSearchTermDemandeur, setShowSearchResultsDemandeur);
                             } else {
                               setShowSearchResultsDemandeur(false);
                             }
                           }}
                           onKeyPress={(e) => {
                             if (e.key === 'Enter' && searchTermDemandeur.trim()) {
                               handleSearchAndCreate('user', searchTermDemandeur, setSearchTermDemandeur, setShowSearchResultsDemandeur);
                             }
                           }}
                           placeholder="Rechercher un demandeur..."
                           className="w-full pl-10"
                         />
                         {searchTermDemandeur && (
                           <button
                             onClick={() => {
                               setSearchTermDemandeur('');
                               setShowSearchResultsDemandeur(false);
                               setBonCommande(prev => ({ ...prev, demandeurId: '' }));
                             }}
                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                           >
                             <X className="h-4 w-4" />
                           </button>
                         )}
                       </div>
                       
                       {/* Bouton Créer nouveau */}
                       <div className="mt-2">
                         <button
                           onClick={() => openCreateInTab('user', searchTermDemandeur || '')}
                           className="w-full py-2 px-3 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
                         >
                           <Plus className="h-4 w-4" />
                           {searchTermDemandeur ? `Créer "${searchTermDemandeur}"` : 'Créer un nouveau demandeur'}
                         </button>
                       </div>
                       
                       {/* Résultats de recherche */}
                       {showSearchResultsDemandeur && (
                         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                           {filteredDemandeurs.length > 0 ? (
                             filteredDemandeurs.map(user => (
                               <button
                                 key={user.id}
                                 onClick={() => selectDemandeur(user)}
                                 className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                               >
                                 <div className="font-medium">{user.prenom} {user.nom}</div>
                                 <div className="text-sm text-gray-600">{user.role}</div>
                               </button>
                             ))
                           ) : (
                             <div className="px-4 py-2 text-gray-500">
                               Aucun utilisateur trouvé
                               <button
                                 onClick={() => openCreateInTab('user', searchTermDemandeur)}
                                 className="ml-2 text-blue-600 hover:text-blue-800 underline"
                               >
                                 Créer "{searchTermDemandeur}" ?
                               </button>
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                   </div>
                                     <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Créateur *
                     </label>
                     <div className="relative">
                       <div className="relative">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                         <Input
                           value={searchTermCreateur}
                           onChange={(e) => {
                             setSearchTermCreateur(e.target.value);
                             if (e.target.value.length > 0) {
                               handleSearchAndCreate('user', e.target.value, setSearchTermCreateur, setShowSearchResultsCreateur);
                             } else {
                               setShowSearchResultsCreateur(false);
                             }
                           }}
                           onKeyPress={(e) => {
                             if (e.key === 'Enter' && searchTermCreateur.trim()) {
                               handleSearchAndCreate('user', searchTermCreateur, setSearchTermCreateur, setShowSearchResultsCreateur);
                             }
                           }}
                           placeholder="Rechercher un créateur..."
                           className="w-full pl-10"
                         />
                         {searchTermCreateur && (
                           <button
                             onClick={() => {
                               setSearchTermCreateur('');
                               setShowSearchResultsCreateur(false);
                               setBonCommande(prev => ({ ...prev, createurId: '' }));
                             }}
                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                           >
                             <X className="h-4 w-4" />
                           </button>
                         )}
                       </div>
                       
                       {/* Bouton Créer nouveau */}
                       <div className="mt-2">
                         <button
                           onClick={() => openCreateInTab('user', searchTermCreateur || '')}
                           className="w-full py-2 px-3 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
                         >
                           <Plus className="h-4 w-4" />
                           {searchTermCreateur ? `Créer "${searchTermCreateur}"` : 'Créer un nouveau créateur'}
                         </button>
                       </div>
                       
                       {/* Résultats de recherche */}
                       {showSearchResultsCreateur && (
                         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                           {filteredCreateurs.length > 0 ? (
                             filteredCreateurs.map(user => (
                               <button
                                 key={user.id}
                                 onClick={() => selectCreateur(user)}
                                 className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                               >
                                 <div className="font-medium">{user.prenom} {user.nom}</div>
                                 <div className="text-sm text-gray-600">{user.role}</div>
                               </button>
                             ))
                           ) : (
                             <div className="px-4 py-2 text-gray-500">
                               Aucun utilisateur trouvé
                               <button
                                 onClick={() => openCreateInTab('user', searchTermCreateur)}
                                 className="ml-2 text-blue-600 hover:text-blue-800 underline"
                               >
                                 Créer "{searchTermCreateur}" ?
                               </button>
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de livraison souhaitée
                    </label>
                    <Input
                      type="date"
                      value={bonCommande.dateLivraisonSouhaitee}
                      onChange={(e) => handleInputChange('dateLivraisonSouhaitee', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Fournisseur *
                     </label>
                     <div className="relative">
                       <div className="relative">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                         <Input
                           value={searchTermFournisseur}
                           onChange={(e) => {
                             setSearchTermFournisseur(e.target.value);
                             if (e.target.value.length > 0) {
                               handleSearchAndCreate('fournisseur', e.target.value, setSearchTermFournisseur, setShowSearchResultsFournisseur);
                             } else {
                               setShowSearchResultsFournisseur(false);
                             }
                           }}
                           onKeyPress={(e) => {
                             if (e.key === 'Enter' && searchTermFournisseur.trim()) {
                               handleSearchAndCreate('fournisseur', searchTermFournisseur, setSearchTermFournisseur, setShowSearchResultsFournisseur);
                             }
                           }}
                           placeholder="Rechercher un fournisseur..."
                           className="w-full pl-10"
                         />
                         {searchTermFournisseur && (
                           <button
                             onClick={() => {
                               setSearchTermFournisseur('');
                               setShowSearchResultsFournisseur(false);
                               setBonCommande(prev => ({ ...prev, fournisseurId: '' }));
                             }}
                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                           >
                             <X className="h-4 w-4" />
                           </button>
                         )}
                       </div>
                       
                       {/* Bouton Créer nouveau */}
                       <div className="mt-2">
                         <button
                           onClick={() => openCreateInTab('fournisseur', searchTermFournisseur || '')}
                           className="w-full py-3 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
                         >
                           <Plus className="h-4 w-4" />
                           {searchTermFournisseur ? `Créer "${searchTermFournisseur}"` : 'Créer un nouveau fournisseur'}
                         </button>
                       </div>
                       
                       {/* Résultats de recherche */}
                       {showSearchResultsFournisseur && (
                         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                           {filteredFournisseurs.length > 0 ? (
                             filteredFournisseurs.map(fournisseur => (
                               <button
                                 key={fournisseur.id}
                                 onClick={() => selectFournisseur(fournisseur)}
                                 className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                               >
                                 <div className="font-medium">{fournisseur.raisonSociale}</div>
                                 <div className="text-sm text-gray-600">
                                   {fournisseur.codeFournisseur} - {fournisseur.siret}
                                 </div>
                               </button>
                             ))
                           ) : (
                             <div className="px-4 py-2 text-gray-500">
                               Aucun fournisseur trouvé
                               <button
                                 onClick={() => openCreateInTab('fournisseur', searchTermFournisseur)}
                                 className="ml-2 text-blue-600 hover:text-blue-800 underline"
                               >
                                 Créer "{searchTermFournisseur}" ?
                               </button>
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                   </div>
                                     <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Chantier *
                     </label>
                     <div className="relative">
                       <div className="relative">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                         <Input
                           value={searchTermChantier}
                           onChange={(e) => {
                             setSearchTermChantier(e.target.value);
                             if (e.target.value.length > 0) {
                               handleSearchAndCreate('chantier', e.target.value, setSearchTermChantier, setShowSearchResultsChantier);
                             } else {
                               setShowSearchResultsChantier(false);
                             }
                           }}
                           onKeyPress={(e) => {
                             if (e.key === 'Enter' && searchTermChantier.trim()) {
                               handleSearchAndCreate('chantier', searchTermChantier, setSearchTermChantier, setShowSearchResultsChantier);
                             }
                           }}
                           placeholder="Rechercher un chantier..."
                           className="w-full pl-10"
                         />
                         {searchTermChantier && (
                           <button
                             onClick={() => {
                               setSearchTermChantier('');
                               setShowSearchResultsChantier(false);
                               setBonCommande(prev => ({ ...prev, chantierId: '' }));
                             }}
                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                           >
                             <X className="h-4 w-4" />
                           </button>
                         )}
                       </div>
                       
                       {/* Bouton Créer nouveau */}
                       <div className="mt-2">
                         <button
                           onClick={() => openCreateInTab('chantier', searchTermChantier || '')}
                           className="w-full py-3 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
                         >
                           <Plus className="h-4 w-4" />
                           {searchTermChantier ? `Créer "${searchTermChantier}"` : 'Créer un nouveau chantier'}
                         </button>
                       </div>
                       
                       {/* Résultats de recherche */}
                       {showSearchResultsChantier && (
                         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                           {filteredChantiers.length > 0 ? (
                             filteredChantiers.map(chantier => (
                               <button
                                 key={chantier.id}
                                 onClick={() => selectChantier(chantier)}
                                 className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                               >
                                 <div className="font-medium">{chantier.codeChantier} - {chantier.nom}</div>
                                 <div className="text-sm text-gray-600">
                                   {chantier.clientNom ? `Client: ${chantier.clientNom}` : chantier.adresse}
                                 </div>
                               </button>
                             ))
                           ) : (
                             <div className="px-4 py-2 text-gray-500">
                               Aucun chantier trouvé
                               <button
                                 onClick={() => openCreateInTab('chantier', searchTermChantier)}
                                 className="ml-2 text-blue-600 hover:text-blue-800 underline"
                               >
                                 Créer "{searchTermChantier}" ?
                               </button>
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                   </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Articles */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Articles demandés
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                {articles.map((article, index) => (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Article {index + 1}</h4>
                      {articles.length > 1 && (
                        <button
                          onClick={() => removeArticle(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Supprimer l'article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Désignation *
                         </label>
                         <div className="relative">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                           <Input
                             value={article.designation}
                             onChange={(e) => handleArticleChange(index, 'designation', e.target.value)}
                             placeholder="Rechercher ou saisir une désignation..."
                             className="w-full pl-10"
                           />
                         </div>
                         
                         {/* Bouton Créer nouveau article */}
                         <div className="mt-2">
                           <button
                             onClick={() => handleCreateArticleFromSearch(article.designation)}
                             className="w-full py-2 px-3 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
                           >
                             <Plus className="h-4 w-4" />
                             {article.designation ? `Créer "${article.designation}"` : 'Créer un nouvel article'}
                           </button>
                         </div>
                       </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantité *
                        </label>
                        <Input
                          type="number"
                          value={article.quantite}
                          onChange={(e) => handleArticleChange(index, 'quantite', e.target.value)}
                          placeholder="1"
                          min="0"
                          step="0.001"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unité
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={article.unite}
                            onChange={(e) => handleArticleChange(index, 'unite', e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="U">Unité (U)</option>
                            <option value="M">Mètre (M)</option>
                            <option value="M2">Mètre carré (M²)</option>
                            <option value="M3">Mètre cube (M³)</option>
                            <option value="KG">Kilogramme (KG)</option>
                            <option value="L">Litre (L)</option>
                            <option value="PAQ">Paquet</option>
                            <option value="LOT">Lot</option>
                          </select>
                          <Input
                            value={article.unite === 'U' || article.unite === 'M' || article.unite === 'M2' || article.unite === 'M3' || article.unite === 'KG' || article.unite === 'L' || article.unite === 'PAQ' || article.unite === 'LOT' ? '' : article.unite}
                            onChange={(e) => handleArticleChange(index, 'unite', e.target.value)}
                            placeholder="Autre unité"
                            className="flex-1"
                            onFocus={() => {
                              if (['U', 'M', 'M2', 'M3', 'KG', 'L', 'PAQ', 'LOT'].includes(article.unite)) {
                                handleArticleChange(index, 'unite', '');
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prix unitaire (optionnel)
                        </label>
                        <Input
                          type="number"
                          value={article.prixUnitaire}
                          onChange={(e) => handleArticleChange(index, 'prixUnitaire', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={article.description}
                        onChange={(e) => handleArticleChange(index, 'description', e.target.value)}
                        placeholder="Description détaillée de l'article"
                        rows="3"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addArticle}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Ajouter un article
                </button>
              </GestalisCardContent>
            </GestalisCard>

            {/* Notes */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes et informations complémentaires
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent>
                <textarea
                  value={bonCommande.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Notes, conditions spéciales, informations importantes..."
                  rows="4"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </GestalisCardContent>
            </GestalisCard>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Actions */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Actions
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-3">
                <GestalisButton
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </GestalisButton>

                <button 
                  onClick={handleSendEmail}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Envoyer par email
                </button>

                <button 
                  onClick={handleDownloadPDF}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Télécharger PDF
                </button>
              </GestalisCardContent>
            </GestalisCard>

            {/* Informations fournisseur */}
            {bonCommande.fournisseurId && (
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informations fournisseur
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  {(() => {
                    const fournisseur = fournisseurs.find(f => f.id === bonCommande.fournisseurId);
                    if (!fournisseur) return null;
                    
                    return (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Raison sociale</p>
                          <p className="text-sm text-gray-900">{fournisseur.raisonSociale}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Code</p>
                          <p className="text-sm text-gray-900">{fournisseur.codeFournisseur}</p>
                        </div>
                        {fournisseur.adresseSiege && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Adresse</p>
                            <p className="text-sm text-gray-900">{fournisseur.adresseSiege}</p>
                          </div>
                        )}
                        {fournisseur.telephone && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Téléphone</p>
                            <p className="text-sm text-gray-900">{fournisseur.telephone}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </GestalisCardContent>
              </GestalisCard>
            )}

            {/* Informations chantier */}
            {bonCommande.chantierId && (
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Informations chantier
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  {(() => {
                    const chantier = chantiers.find(c => c.id === bonCommande.chantierId);
                    if (!chantier) return null;
                    
                    return (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Nom</p>
                          <p className="text-sm text-gray-900">{chantier.nom}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Code</p>
                          <p className="text-sm text-gray-900">{chantier.codeChantier}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Adresse</p>
                          <p className="text-sm text-gray-900">{chantier.adresse}</p>
                          <p className="text-sm text-gray-900">{chantier.codePostal} {chantier.ville}</p>
                        </div>
                        {chantier.clientNom && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Client</p>
                            <p className="text-sm text-gray-900">{chantier.clientNom}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </GestalisCardContent>
              </GestalisCard>
            )}
                     </div>
         </div>
       </div>

       {/* Modals de création rapide */}
       
       {/* Modal Créer Fournisseur */}
       {showCreateFournisseurModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-semibold">Nouveau Fournisseur</h3>
               <button onClick={() => setShowCreateFournisseurModal(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="h-6 w-6" />
               </button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Raison sociale *</label>
                 <Input
                   value={newFournisseur.raisonSociale}
                   onChange={(e) => setNewFournisseur(prev => ({ ...prev, raisonSociale: e.target.value }))}
                   placeholder="Nom de l'entreprise"
                   className="w-full"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Code fournisseur *</label>
                 <Input
                   value={newFournisseur.codeFournisseur}
                   onChange={(e) => setNewFournisseur(prev => ({ ...prev, codeFournisseur: e.target.value }))}
                   placeholder="Code unique"
                   className="w-full"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">SIRET</label>
                 <Input
                   value={newFournisseur.siret}
                   onChange={(e) => setNewFournisseur(prev => ({ ...prev, siret: e.target.value }))}
                   placeholder="Numéro SIRET"
                   className="w-full"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                 <Input
                   value={newFournisseur.adresseSiege}
                   onChange={(e) => setNewFournisseur(prev => ({ ...prev, adresseSiege: e.target.value }))}
                   placeholder="Adresse du siège"
                   className="w-full"
                 />
               </div>
             </div>
             
             <div className="flex justify-end gap-3 mt-6">
               <button
                 onClick={() => setShowCreateFournisseurModal(false)}
                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
               >
                 Annuler
               </button>
               <button
                 onClick={handleCreateFournisseur}
                 disabled={!newFournisseur.raisonSociale || !newFournisseur.codeFournisseur}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
               >
                 Créer
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Modal Créer Chantier */}
       {showCreateChantierModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-semibold">Nouveau Chantier</h3>
               <button onClick={() => setShowCreateChantierModal(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="h-6 w-6" />
               </button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                 <Input
                   value={newChantier.nom}
                   onChange={(e) => setNewChantier(prev => ({ ...prev, nom: e.target.value }))}
                   placeholder="Nom du chantier"
                   className="w-full"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Code chantier *</label>
                 <Input
                   value={newChantier.codeChantier}
                   onChange={(e) => setNewChantier(prev => ({ ...prev, codeChantier: e.target.value }))}
                   placeholder="Code unique"
                   className="w-full"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                 <Input
                   value={newChantier.adresse}
                   onChange={(e) => setNewChantier(prev => ({ ...prev, adresse: e.target.value }))}
                   placeholder="Adresse du chantier"
                   className="w-full"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                   <Input
                     value={newChantier.codePostal}
                     onChange={(e) => setNewChantier(prev => ({ ...prev, codePostal: e.target.value }))}
                     placeholder="Code postal"
                     className="w-full"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                   <Input
                     value={newChantier.ville}
                     onChange={(e) => setNewChantier(prev => ({ ...prev, ville: e.target.value }))}
                     placeholder="Ville"
                     className="w-full"
                   />
                 </div>
               </div>
             </div>
             
             <div className="flex justify-end gap-3 mt-6">
               <button
                 onClick={() => setShowCreateChantierModal(false)}
                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
               >
                 Annuler
               </button>
               <button
                 onClick={handleCreateChantier}
                 disabled={!newChantier.nom || !newChantier.codeChantier}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
               >
                 Créer
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Modal Créer Utilisateur */}
       {showCreateUserModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-semibold">Nouvel Utilisateur</h3>
               <button onClick={() => setShowCreateUserModal(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="h-6 w-6" />
               </button>
             </div>
             
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                   <Input
                     value={newUser.prenom}
                     onChange={(e) => setNewUser(prev => ({ ...prev, prenom: e.target.value }))}
                     placeholder="Prénom"
                     className="w-full"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                   <Input
                     value={newUser.nom}
                     onChange={(e) => setNewUser(prev => ({ ...prev, nom: e.target.value }))}
                     placeholder="Nom"
                     className="w-full"
                   />
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                 <Input
                   type="email"
                   value={newUser.email}
                   onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                   placeholder="email@exemple.com"
                   className="w-full"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                 <select
                   value={newUser.role}
                   onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                 >
                   <option value="UTILISATEUR">Utilisateur</option>
                   <option value="ADMIN">Administrateur</option>
                   <option value="COMPTABLE">Comptable</option>
                 </select>
               </div>
             </div>
             
             <div className="flex justify-end gap-3 mt-6">
               <button
                 onClick={() => setShowCreateUserModal(false)}
                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
               >
                 Annuler
               </button>
               <button
                 onClick={handleCreateUser}
                 disabled={!newUser.prenom || !newUser.nom || !newUser.email}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
               >
                 Créer
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Modal Créer Article */}
       {showCreateArticleModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-semibold">Nouvel Article</h3>
               <button onClick={() => setShowCreateArticleModal(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="h-6 w-6" />
               </button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Désignation *</label>
                 <Input
                   value={newArticle.designation}
                   onChange={(e) => setNewArticle(prev => ({ ...prev, designation: e.target.value }))}
                   placeholder="Nom de l'article"
                   className="w-full"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                 <textarea
                   value={newArticle.description}
                   onChange={(e) => setNewArticle(prev => ({ ...prev, description: e.target.value }))}
                   placeholder="Description détaillée"
                   rows="3"
                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Unité</label>
                 <select
                   value={newArticle.unite}
                   onChange={(e) => setNewArticle(prev => ({ ...prev, unite: e.target.value }))}
                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                 >
                   <option value="U">Unité (U)</option>
                   <option value="M">Mètre (M)</option>
                   <option value="M2">Mètre carré (M²)</option>
                   <option value="M3">Mètre cube (M³)</option>
                   <option value="KG">Kilogramme (KG)</option>
                   <option value="L">Litre (L)</option>
                   <option value="PAQ">Paquet</option>
                   <option value="LOT">Lot</option>
                 </select>
               </div>
             </div>
             
             <div className="flex justify-end gap-3 mt-6">
               <button
                 onClick={() => setShowCreateArticleModal(false)}
                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
               >
                 Annuler
               </button>
               <button
                 onClick={handleCreateArticle}
                 disabled={!newArticle.designation || !newArticle.description}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
               >
                 Créer
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default CreationBonCommande;
