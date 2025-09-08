import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Download,
  Building2,
  ArrowLeft,
  Package,
  Info
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../components/ui/GestalisCard';
import { GestalisButton } from '../../components/ui/gestalis-button';
import { Input } from '../../components/ui/input';
import SmartPicker from '../../components/SmartPicker';
import BonCommandePDF from '../../components/pdf/BonCommandePDF';
import { useAuthStore } from '../../stores/authStore';
import { useFournisseursStore } from '../../stores/useFournisseursStore';
import { useNavigate } from 'react-router-dom';
import { 
  searchFournisseurs, 
  searchChantiers, 
  searchEmployes, 
  searchProduits 
} from '../../services/searchService';

const CreationBonCommande = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Utiliser le store des fournisseurs
  const { fournisseurs = [], loadFromSupabase } = useFournisseursStore();
  
  // États du formulaire
  const [bonCommande, setBonCommande] = useState({
    numeroCommande: `BC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Date.now()).slice(-4)}`,
    dateCommande: new Date().toISOString().split('T')[0],
    dateLivraisonSouhaitee: '',
    demandeur: null,
    createur: null,
    fournisseur: null,
    chantier: null,
    observations: '',
    statut: 'BROUILLON'
  });

  // États pour les articles
  const [articles, setArticles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Charger les fournisseurs au montage
  useEffect(() => {
    if (fournisseurs.length === 0) {
      loadFromSupabase();
    }
  }, [fournisseurs.length, loadFromSupabase]);

  // Initialiser le créateur avec l'utilisateur connecté
  useEffect(() => {
    if (user && !bonCommande.createur) {
      setBonCommande(prev => ({ 
        ...prev, 
        createur: {
          id: user.id,
          label: `${user.prenom || ''} ${user.nom || ''} (${user.email || ''})`,
          data: user
        }
      }));
    }
  }, [user, bonCommande.createur]);

  // Gérer le retour depuis la création de fournisseur
  useEffect(() => {
    const selectedFournisseur = localStorage.getItem('selectedFournisseur');
    if (selectedFournisseur) {
      try {
        const fournisseur = JSON.parse(selectedFournisseur);
      setBonCommande(prev => ({ 
        ...prev, 
          fournisseur: fournisseur
      }));
      
        // Nettoyer le localStorage
        localStorage.removeItem('selectedFournisseur');
      
        console.log('✅ Fournisseur sélectionné automatiquement:', fournisseur);
    } catch (error) {
        console.error('Erreur lors du parsing du fournisseur sélectionné:', error);
      }
    }
  }, []);

  // Gérer le retour depuis la création d'employé
  useEffect(() => {
    const selectedEmploye = localStorage.getItem('selectedEmploye');
    if (selectedEmploye) {
      try {
        const employe = JSON.parse(selectedEmploye);
        
        // Vérifier si c'est pour le demandeur ou le créateur
        const smartpickerContext = sessionStorage.getItem('smartpicker_return_context');
        let targetField = 'demandeur'; // Par défaut
        
        if (smartpickerContext) {
          try {
            const { returnField } = JSON.parse(smartpickerContext);
            if (returnField === 'createur') {
              targetField = 'createur';
            }
    } catch (error) {
            console.error('Erreur lors du parsing du contexte pour déterminer le champ cible:', error);
          }
        }
        
        setBonCommande(prev => ({
          ...prev,
          [targetField]: employe
        }));
        
        // Nettoyer le localStorage
        localStorage.removeItem('selectedEmploye');
        
        console.log(`✅ Employé sélectionné automatiquement pour ${targetField}:`, employe);
      } catch (error) {
        console.error('Erreur lors du parsing de l\'employé sélectionné:', error);
      }
    }
  }, []);


  // Gérer le retour depuis la création de chantier
  useEffect(() => {
    const selectedChantier = localStorage.getItem('selectedChantier');
    if (selectedChantier) {
      try {
        const chantier = JSON.parse(selectedChantier);
        setBonCommande(prev => ({
          ...prev,
          chantier: chantier
        }));
        
        // Nettoyer le localStorage
        localStorage.removeItem('selectedChantier');
        
        console.log('✅ Chantier sélectionné automatiquement:', chantier);
    } catch (error) {
        console.error('Erreur lors du parsing du chantier sélectionné:', error);
      }
    }
  }, []);

  // Gérer le retour depuis la création de produit
  useEffect(() => {
    const selectedProduit = localStorage.getItem('selectedProduit');
    if (selectedProduit) {
      try {
        const produit = JSON.parse(selectedProduit);
        
        // Ajouter automatiquement un nouvel article avec le produit sélectionné
        const nouvelArticle = {
        id: Date.now(),
          produit: produit,
          quantite: '1',
          prixUnitaire: '',
          unite: produit.data?.unite || 'U',
          description: produit.data?.description || '',
          montantTotal: 0
        };
        
        setArticles(prev => [...prev, nouvelArticle]);
        
        // Nettoyer le localStorage
        localStorage.removeItem('selectedProduit');
        
        console.log('✅ Produit ajouté automatiquement comme article:', produit);
    } catch (error) {
        console.error('Erreur lors du parsing du produit sélectionné:', error);
      }
    }
  }, []);

  // Gestion des changements de valeurs
  const handleFieldChange = (field, value) => {
    setBonCommande(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestion des articles
  const addArticle = () => {
    setArticles(prev => [...prev, {
        id: Date.now(),
      produit: null,
      quantite: '',
      prixUnitaire: '',
      unite: '',
      description: '',
      montantTotal: 0
    }]);
  };

  const removeArticle = (index) => {
    setArticles(prev => prev.filter((_, i) => i !== index));
  };

  const updateArticle = (index, field, value) => {
    setArticles(prev => prev.map((article, i) => {
      if (i === index) {
        const updated = { ...article, [field]: value };
        
        // Recalculer le montant total si quantité ou prix change
        if (field === 'quantite' || field === 'prixUnitaire') {
          const quantite = parseFloat(field === 'quantite' ? value : updated.quantite) || 0;
          const prix = parseFloat(field === 'prixUnitaire' ? value : updated.prixUnitaire) || 0;
          updated.montantTotal = quantite * prix;
        }
        
        return updated;
      }
      return article;
    }));
  };

  // Calculer le total général
  const totalGeneral = articles.reduce((sum, article) => sum + article.montantTotal, 0);

  // Sauvegarde du bon de commande
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!bonCommande.fournisseur) {
        alert('Veuillez sélectionner un fournisseur');
        return;
      }
      
      if (!bonCommande.chantier) {
        alert('Veuillez sélectionner un chantier');
        return;
      }
      
      if (articles.length === 0) {
        alert('Veuillez ajouter au moins un article');
        return;
      }
      
      // Préparer les données pour l'API
      const payload = {
        numeroCommande: bonCommande.numeroCommande,
        dateCommande: bonCommande.dateCommande,
        dateLivraisonSouhaitee: bonCommande.dateLivraisonSouhaitee,
        fournisseurId: bonCommande.fournisseur.id,
        chantierId: bonCommande.chantier.id,
        demandeurId: bonCommande.demandeur?.id,
        createurId: bonCommande.createur?.id,
        observations: bonCommande.observations,
        statut: bonCommande.statut,
        totalGeneral: totalGeneral,
        articles: articles.map(article => ({
          produitId: article.produit?.id,
          quantite: parseFloat(article.quantite) || 0,
          prixUnitaire: parseFloat(article.prixUnitaire) || 0,
          unite: article.unite,
          description: article.description,
          montantTotal: article.montantTotal
        }))
      };
      
      console.log('Payload à envoyer:', payload);
      
      // TODO: Appel API réel
      // const response = await api.post('/api/bons-commande', payload);
      
      alert('✅ Bon de commande sauvegardé avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/achats/commandes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-8 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Retour"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Création d'un Bon de Commande</h1>
                <p className="text-blue-100">Nouveau bon de commande</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GestalisButton
                variant="outline"
                onClick={() => setShowPDFModal(true)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Aperçu PDF
              </GestalisButton>
              <GestalisButton
                variant="outline"
                  onClick={handleSave}
                  disabled={saving}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </GestalisButton>
              <GestalisButton
                onClick={handleSave}
                disabled={saving}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Send className="h-4 w-4 mr-2" />
                {saving ? 'Envoi...' : 'Envoyer'}
              </GestalisButton>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Informations générales */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations générales
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de commande
                    </label>
                    <Input
                      value={bonCommande.numeroCommande}
                      readOnly
                  className="w-full bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de commande
                    </label>
                    <Input
                      type="date"
                      value={bonCommande.dateCommande}
                  onChange={(e) => handleFieldChange('dateCommande', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de livraison souhaitée
                    </label>
                    <Input
                      type="date"
                      value={bonCommande.dateLivraisonSouhaitee}
                  onChange={(e) => handleFieldChange('dateLivraisonSouhaitee', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
          </GestalisCardContent>
        </GestalisCard>

        {/* Sélection des entités */}
        <GestalisCard>
          <GestalisCardHeader>
            <GestalisCardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Sélection des entités
            </GestalisCardTitle>
          </GestalisCardHeader>
          <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SmartPicker
                label="Fournisseur"
                required
                value={bonCommande.fournisseur}
                onChange={(value) => handleFieldChange('fournisseur', value)}
                fetcher={searchFournisseurs}
                           placeholder="Rechercher un fournisseur..."
                createUrl="/achats?tab=fournisseurs&create=true"
                createLabel="Créer un fournisseur"
              />
              
              <SmartPicker
                label="Chantier"
                required
                value={bonCommande.chantier}
                onChange={(value) => handleFieldChange('chantier', value)}
                fetcher={searchChantiers}
                           placeholder="Rechercher un chantier..."
                createUrl="/achats/chantiers/nouveau"
                createLabel="Créer un chantier"
              />
              
              <SmartPicker
                label="Demandeur"
                value={bonCommande.demandeur}
                onChange={(value) => handleFieldChange('demandeur', value)}
                fetcher={searchEmployes}
                placeholder="Rechercher un employé..."
                createUrl="/rh?tab=employes&create=true"
                createLabel="Créer un employé"
              />
              
              <SmartPicker
                label="Créateur"
                value={bonCommande.createur}
                onChange={(value) => handleFieldChange('createur', value)}
                fetcher={searchEmployes}
                placeholder="Rechercher un employé..."
                createUrl="/rh?tab=employes&create=true"
                createLabel="Créer un employé"
              />
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Articles */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
              Articles
                </GestalisCardTitle>
              </GestalisCardHeader>
          <GestalisCardContent>
            <div className="space-y-4">
                {articles.map((article, index) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Article {index + 1}</h4>
                        <button
                      type="button"
                          onClick={() => removeArticle(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <SmartPicker
                        label="Produit"
                        required
                        value={article.produit}
                        onChange={(value) => updateArticle(index, 'produit', value)}
                        fetcher={searchProduits}
                        placeholder="Rechercher un produit..."
                        createUrl="/achats?tab=produits&create=true"
                        createLabel="Créer un produit"
                      />
                    </div>
                    
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantité
                         </label>
                           <Input
                        type="number"
                        value={article.quantite}
                        onChange={(e) => updateArticle(index, 'quantite', e.target.value)}
                        placeholder="0"
                        className="w-full"
                           />
                         </div>
                         
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix unitaire
                        </label>
                        <Input
                          type="number"
                        step="0.01"
                        value={article.prixUnitaire}
                        onChange={(e) => updateArticle(index, 'prixUnitaire', e.target.value)}
                        placeholder="0.00"
                          className="w-full"
                        />
                    </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unité
                        </label>
                          <Input
                        value={article.unite}
                        onChange={(e) => updateArticle(index, 'unite', e.target.value)}
                        placeholder="PIECE"
                        className="w-full"
                          />
                        </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                        </label>
                        <Input
                        value={article.description}
                        onChange={(e) => updateArticle(index, 'description', e.target.value)}
                        placeholder="Description de l'article"
                          className="w-full"
                        />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Montant total
                      </label>
                      <Input
                        value={article.montantTotal.toFixed(2)}
                        readOnly
                        className="w-full bg-gray-50"
                      />
                    </div>
                    </div>
                  </div>
                ))}

                <button
                type="button"
                  onClick={addArticle}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Ajouter un article
                </button>
            </div>
              </GestalisCardContent>
            </GestalisCard>

        {/* Total général */}
        {articles.length > 0 && (
            <GestalisCard>
              <GestalisCardContent>
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total général</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalGeneral.toFixed(2)} €
          </div>
                        </div>
                        </div>
                </GestalisCardContent>
              </GestalisCard>
            )}

        {/* Observations */}
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Observations
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
            <textarea
              value={bonCommande.observations}
              onChange={(e) => handleFieldChange('observations', e.target.value)}
              placeholder="Observations, notes spéciales..."
              className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
                </GestalisCardContent>
              </GestalisCard>
       </div>

      {/* Modal PDF */}
       {showPDFModal && (
         <BonCommandePDF
           bonCommande={{
            ...bonCommande,
            totalGeneral: totalGeneral,
             articles: articles.map(article => ({
              ...article,
              quantite: parseFloat(article.quantite) || 0,
               prixUnitaire: parseFloat(article.prixUnitaire) || 0,
               montantTotal: (parseFloat(article.quantite) || 0) * (parseFloat(article.prixUnitaire) || 0)
             }))
           }}
           onClose={() => setShowPDFModal(false)}
         />
       )}
     </div>
   );
 };

export default CreationBonCommande;
