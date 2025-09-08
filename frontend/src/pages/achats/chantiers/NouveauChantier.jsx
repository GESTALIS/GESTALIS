import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText,
  Upload,
  Plus,
  Trash2
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '@/components/ui/gestalis-card';
import { GestalisButton } from '@/components/ui/gestalis-button';
import { Input } from '@/components/ui/input';

const NouveauChantier = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chantier, setChantier] = useState({
    nom: '',
    code: '',
    numeroExterne: '',
    description: '',
    type: 'Construction',
    clientNom: '',
    adresse: '',
    ville: '',
    codePostal: '',
    dateDebut: '',
    dateFin: '',
    dureeEstimee: '',
    statut: 'en_preparation',
    montant: '',
    devise: 'EUR',
    acompte: '',
    chefChantier: '',
    equipe: '',
    sousTraitants: [],
    documents: []
  });

  // Générer automatiquement le code chantier
  useEffect(() => {
    const generateCode = () => {
      const now = new Date();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear().toString().slice(-2);
      const existingChantiers = JSON.parse(localStorage.getItem('gestalis-chantiers') || '[]');
      const count = existingChantiers.length + 1;
      return `CH${month}${year}-${count.toString().padStart(4, '0')}`;
    };
    
    if (!chantier.code) {
      setChantier(prev => ({ ...prev, code: generateCode() }));
    }
  }, [chantier.code]);

  // Détecter le retour depuis SmartPicker
  useEffect(() => {
    const smartpickerContext = sessionStorage.getItem('smartpicker_return_context');
    if (smartpickerContext) {
      try {
        const { returnTo, returnField, draftId, searchTerm } = JSON.parse(smartpickerContext);
        console.log('🔄 Retour depuis SmartPicker détecté:', { returnTo, returnField, draftId, searchTerm });
        if (returnTo && returnTo.includes('creation-bon-commande') && searchTerm) {
          // Pré-remplir le nom du chantier avec le terme de recherche
          setChantier(prev => ({ ...prev, nom: searchTerm }));
          console.log('🚀 Chantier pré-rempli depuis SmartPicker:', searchTerm);
        }
      } catch (error) {
        console.error('Erreur lors du parsing du contexte SmartPicker:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setChantier(prev => ({ ...prev, [field]: value }));
  };

  const handleSousTraitantAdd = () => {
    const nouveauSousTraitant = prompt('Nom du sous-traitant :');
    if (nouveauSousTraitant) {
      setChantier(prev => ({
        ...prev,
        sousTraitants: [...prev.sousTraitants, nouveauSousTraitant]
      }));
    }
  };

  const handleSousTraitantRemove = (index) => {
    setChantier(prev => ({
      ...prev,
      sousTraitants: prev.sousTraitants.filter((_, i) => i !== index)
    }));
  };

  const handleDocumentAdd = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.png';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setChantier(prev => ({
          ...prev,
          documents: [...prev.documents, { nom: file.name, fichier: file }]
        }));
      }
    };
    input.click();
  };

  const handleDocumentRemove = (index) => {
    setChantier(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation basique
      if (!chantier.nom || !chantier.clientNom || !chantier.ville) {
        alert('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        return;
      }

      // Récupérer les chantiers existants
      const existingChantiers = JSON.parse(localStorage.getItem('gestalis-chantiers') || '[]');
      
      // Créer le nouveau chantier
      const nouveauChantier = {
        ...chantier,
        id: Date.now(), // ID unique simple
        montant: parseFloat(chantier.montant) || 0,
        acompte: parseFloat(chantier.acompte) || 0,
        equipe: parseInt(chantier.equipe) || 0,
        dateCreation: new Date().toISOString()
      };

      // Ajouter à la liste
      const updatedChantiers = [...existingChantiers, nouveauChantier];
      localStorage.setItem('gestalis-chantiers', JSON.stringify(updatedChantiers));

      // Vérifier si on doit retourner au Bon de Commande (nouveau système SmartPicker)
      const smartpickerContext = sessionStorage.getItem('smartpicker_return_context');
      console.log('🔍 Contexte SmartPicker trouvé:', smartpickerContext);
      if (smartpickerContext) {
        try {
          const { returnTo, returnField, draftId } = JSON.parse(smartpickerContext);
          console.log('🔍 Contexte parsé:', { returnTo, returnField, draftId });
          if (returnTo && (returnTo.includes('creation-bon-commande') || returnTo.includes('nouvelle-facture'))) {
            console.log('🚀 Retour vers le formulaire depuis SmartPicker:', returnTo);
            const chantierFormate = {
              id: nouveauChantier.id,
              label: `${nouveauChantier.code} — ${nouveauChantier.nom}`,
              data: nouveauChantier
            };
            console.log('💾 Chantier formaté pour retour:', chantierFormate);
            localStorage.setItem('selectedChantier', JSON.stringify(chantierFormate));
            sessionStorage.removeItem('smartpicker_return_context'); // Clean up here
            
            const destination = returnTo.includes('creation-bon-commande') ? 'Bon de Commande' : 'Facture';
            alert(`✅ Chantier créé avec succès !\n\nNom: ${nouveauChantier.nom}\nCode: ${nouveauChantier.code}\nClient: ${nouveauChantier.clientNom}\nType: ${nouveauChantier.type}\n\nVous allez être redirigé vers le ${destination}.`);
            console.log('🔄 Navigation vers:', returnTo);
            window.location.href = returnTo;
            return;
          } else {
            console.log('❌ Pas de retour vers formulaire - returnTo:', returnTo);
          }
        } catch (error) {
          console.error('Erreur lors du parsing du contexte SmartPicker:', error);
        }
      } else {
        console.log('❌ Aucun contexte SmartPicker trouvé');
      }

      // Redirection vers la liste des chantiers
      navigate('/chantiers');
    } catch (error) {
      console.error('Erreur lors de la création du chantier:', error);
      alert('Erreur lors de la création du chantier');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/chantiers');
  };

  const typesChantier = [
    'Construction',
    'Rénovation',
    'Maintenance',
    'Réhabilitation',
    'Extension',
    'Démolition',
    'Terrassement',
    'VRD',
    'Électricité',
    'Plomberie',
    'Chauffage',
    'Climatisation',
    'Autre'
  ];

  const statuts = [
    { value: 'en_preparation', label: 'En préparation' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'suspendu', label: 'Suspendu' },
    { value: 'termine', label: 'Terminé' },
    { value: 'annule', label: 'Annulé' }
  ];

  const devises = ['EUR', 'USD', 'GBP', 'CHF'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouveau Chantier</h1>
              <p className="text-gray-600">Créez un nouveau chantier avec toutes les informations nécessaires</p>
            </div>
            <div className="flex gap-3">
              <GestalisButton 
                variant="outline" 
                onClick={handleCancel}
                className="border-gray-300"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </GestalisButton>
              <GestalisButton 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Création...' : 'Créer le chantier'}
              </GestalisButton>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Informations de base
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du chantier *
                  </label>
                  <Input
                    type="text"
                    value={chantier.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Ex: Rénovation Immeuble Centre-Ville"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code chantier automatique *
                  </label>
                  <Input
                    type="text"
                    value={chantier.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="Code unique du chantier"
                    required
                    className="w-full bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro chantier externe
                  </label>
                  <Input
                    type="text"
                    value={chantier.numeroExterne}
                    onChange={(e) => handleInputChange('numeroExterne', e.target.value)}
                    placeholder="Numéro externe (optionnel)"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de chantier
                  </label>
                  <select
                    value={chantier.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {typesChantier.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={chantier.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description détaillée du chantier..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={chantier.statut}
                  onChange={(e) => handleInputChange('statut', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {statuts.map(statut => (
                    <option key={statut.value} value={statut.value}>{statut.label}</option>
                  ))}
                </select>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Client et Localisation */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Client et Localisation
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du client *
                </label>
                <Input
                  type="text"
                  value={chantier.clientNom}
                  onChange={(e) => handleInputChange('clientNom', e.target.value)}
                  placeholder="Nom de l'entreprise ou du client"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète
                </label>
                <Input
                  type="text"
                  value={chantier.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Numéro et nom de rue"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <Input
                    type="text"
                    value={chantier.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    placeholder="Ville"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <Input
                    type="text"
                    value={chantier.codePostal}
                    onChange={(e) => handleInputChange('codePostal', e.target.value)}
                    placeholder="Code postal"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Planning et Durée */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Planning et Durée
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début prévue
                  </label>
                  <Input
                    type="date"
                    value={chantier.dateDebut}
                    onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin prévue
                  </label>
                  <Input
                    type="date"
                    value={chantier.dateFin}
                    onChange={(e) => handleInputChange('dateFin', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée estimée
                  </label>
                  <Input
                    type="text"
                    value={chantier.dureeEstimee}
                    onChange={(e) => handleInputChange('dureeEstimee', e.target.value)}
                    placeholder="Ex: 6 mois"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Informations financières */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Informations financières
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant HT
                  </label>
                  <Input
                    type="number"
                    value={chantier.montant}
                    onChange={(e) => handleInputChange('montant', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Devise
                  </label>
                  <select
                    value={chantier.devise}
                    onChange={(e) => handleInputChange('devise', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {devises.map(devise => (
                      <option key={devise} value={devise}>{devise}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acompte reçu
                  </label>
                  <Input
                    type="number"
                    value={chantier.acompte}
                    onChange={(e) => handleInputChange('acompte', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Équipe et Ressources */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Équipe et Ressources
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chef de chantier
                  </label>
                  <Input
                    type="text"
                    value={chantier.chefChantier}
                    onChange={(e) => handleInputChange('chefChantier', e.target.value)}
                    placeholder="Nom du chef de chantier"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille de l'équipe
                  </label>
                  <Input
                    type="number"
                    value={chantier.equipe}
                    onChange={(e) => handleInputChange('equipe', e.target.value)}
                    placeholder="Nombre de personnes"
                    min="0"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sous-traitants impliqués
                </label>
                <div className="space-y-2">
                  {chantier.sousTraitants.map((st, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={st}
                        onChange={(e) => {
                          const newSousTraitants = [...chantier.sousTraitants];
                          newSousTraitants[index] = e.target.value;
                          setChantier(prev => ({ ...prev, sousTraitants: newSousTraitants }));
                        }}
                        placeholder="Nom du sous-traitant"
                        className="flex-1"
                      />
                      <GestalisButton
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleSousTraitantRemove(index)}
                        className="px-2 py-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </GestalisButton>
                    </div>
                  ))}
                  <GestalisButton
                    type="button"
                    variant="outline"
                    onClick={handleSousTraitantAdd}
                    className="border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un sous-traitant
                  </GestalisButton>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Documents */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Documents
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="space-y-2">
                {chantier.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="flex-1 text-sm text-gray-700">{doc.nom}</span>
                    <GestalisButton
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDocumentRemove(index)}
                      className="px-2 py-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </GestalisButton>
                  </div>
                ))}
                <GestalisButton
                  type="button"
                  variant="outline"
                  onClick={handleDocumentAdd}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter un document
                </GestalisButton>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <GestalisButton 
              type="button"
              variant="outline" 
              onClick={handleCancel}
              className="border-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </GestalisButton>
            <GestalisButton 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Création...' : 'Créer le chantier'}
            </GestalisButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NouveauChantier;
