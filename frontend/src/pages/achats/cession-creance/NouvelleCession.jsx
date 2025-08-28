import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  FileText, 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  MapPin,
  Plus,
  Trash2
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../../components/ui/GestalisCard';
import { GestalisButton } from '../../../components/ui/gestalis-button';
import { Input } from '../../../components/ui/input';

const NouvelleCession = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cession, setCession] = useState({
    reference: '',
    dateCreation: new Date().toISOString().split('T')[0],
    clientNom: '',
    chantierNom: '',
    fournisseurNom: '',
    montant: '',
    devise: 'EUR',
    statut: 'EN_ATTENTE',
    dateEcheance: '',
    description: '',
    conditions: '',
    documents: [],
    notes: ''
  });

  // Générer automatiquement la référence
  useEffect(() => {
    const generateReference = () => {
      const now = new Date();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear().toString().slice(-2);
      const existingCessions = JSON.parse(localStorage.getItem('gestalis-cessions') || '[]');
      const count = existingCessions.length + 1;
      return `CC${month}${year}-${count.toString().padStart(3, '0')}`;
    };
    
    if (!cession.reference) {
      setCession(prev => ({ ...prev, reference: generateReference() }));
    }
  }, [cession.reference]);

  // États pour les suggestions (à ajouter après la déclaration de cession)
  const [chantierSuggestions, setChantierSuggestions] = useState([]);
  const [fournisseurSuggestions, setFournisseurSuggestions] = useState([]);
  const [showChantierSuggestions, setShowChantierSuggestions] = useState(false);
  const [showFournisseurSuggestions, setShowFournisseurSuggestions] = useState(false);

  // Fonctions pour récupérer les suggestions (à ajouter après handleInputChange)
  const getChantierSuggestions = (searchTerm) => {
    if (!searchTerm) return [];
    
    const chantiers = JSON.parse(localStorage.getItem('gestalis-chantiers') || '[]');
    return chantiers
      .filter(chantier => 
        chantier.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chantier.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chantier.clientNom?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
  };

  const getFournisseurSuggestions = (searchTerm) => {
    if (!searchTerm) return [];
    
    const fournisseurs = JSON.parse(localStorage.getItem('gestalis-fournisseurs') || '[]');
    return fournisseurs
      .filter(fournisseur => 
        fournisseur.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fournisseur.codeFournisseur?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
  };

  const handleChantierInputChange = (value) => {
    setCession(prev => ({ ...prev, chantierNom: value }));
    
    if (value.length > 2) {
      const suggestions = getChantierSuggestions(value);
      setChantierSuggestions(suggestions);
      setShowChantierSuggestions(true);
    } else {
      setShowChantierSuggestions(false);
    }
  };

  const handleFournisseurInputChange = (value) => {
    setCession(prev => ({ ...prev, fournisseurNom: value }));
    
    if (value.length > 2) {
      const suggestions = getFournisseurSuggestions(value);
      setFournisseurSuggestions(suggestions);
      setShowFournisseurSuggestions(true);
    } else {
      setShowFournisseurSuggestions(false);
    }
  };

  const selectChantier = (chantier) => {
    setCession(prev => ({ ...prev, chantierNom: chantier.code }));
    setShowChantierSuggestions(false);
  };

  const selectFournisseur = (fournisseur) => {
    setCession(prev => ({ ...prev, fournisseurNom: fournisseur.raisonSociale }));
    setShowFournisseurSuggestions(false);
  };

  const handleInputChange = (field, value) => {
    setCession(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentAdd = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.png';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setCession(prev => ({
          ...prev,
          documents: [...prev.documents, { nom: file.name, fichier: file }]
        }));
      }
    };
    input.click();
  };

  const handleDocumentRemove = (index) => {
    setCession(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation basique
      if (!cession.clientNom || !cession.chantierNom || !cession.fournisseurNom || !cession.montant) {
        alert('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        return;
      }

      // Récupérer les cessions existantes
      const existingCessions = JSON.parse(localStorage.getItem('gestalis-cessions') || '[]');
      
      // Créer la nouvelle cession
      const nouvelleCession = {
        ...cession,
        id: Date.now(), // ID unique simple
        montant: parseFloat(cession.montant) || 0,
        dateCreation: new Date().toISOString()
      };

      // Ajouter à la liste
      const updatedCessions = [...existingCessions, nouvelleCession];
      localStorage.setItem('gestalis-cessions', JSON.stringify(updatedCessions));

      // Redirection vers la liste des cessions
      navigate('/achats/cession-creance');
    } catch (error) {
      console.error('Erreur lors de la création de la cession:', error);
      alert('Erreur lors de la création de la cession');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/achats/cession-creance');
  };

  const statuts = [
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'TERMINEE', label: 'Terminée' },
    { value: 'SUSPENDUE', label: 'Suspendue' },
    { value: 'ANNULEE', label: 'Annulée' }
  ];

  const devises = ['EUR', 'USD', 'GBP', 'CHF'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouvelle Cession de Créance</h1>
              <p className="text-gray-600">Créez une nouvelle cession de créance avec toutes les informations nécessaires</p>
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
                className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Création...' : 'Créer la cession'}
              </GestalisButton>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Informations de base
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence *
                  </label>
                  <Input
                    type="text"
                    value={cession.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                    placeholder="Référence automatique"
                    required
                    className="w-full bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de création
                  </label>
                  <Input
                    type="date"
                    value={cession.dateCreation}
                    onChange={(e) => handleInputChange('dateCreation', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={cession.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description de la cession de créance..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={cession.statut}
                  onChange={(e) => handleInputChange('statut', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statuts.map(statut => (
                    <option key={statut.value} value={statut.value}>{statut.label}</option>
                  ))}
                </select>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Parties impliquées */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Parties impliquées
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client *
                  </label>
                  <Input
                    type="text"
                    value={cession.clientNom}
                    onChange={(e) => handleInputChange('clientNom', e.target.value)}
                    placeholder="Nom du client"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chantier *
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={cession.chantierNom}
                      onChange={(e) => handleChantierInputChange(e.target.value)}
                      placeholder="Code ou nom du chantier"
                      required
                      className="w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => navigate('/achats/chantiers/nouveau')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      <Plus className="h-3 w-3 inline mr-1" />
                      Nouveau
                    </button>
                    {/* Suggestions chantier */}
                    {showChantierSuggestions && chantierSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {chantierSuggestions.map((chantier) => (
                          <div
                            key={chantier.id}
                            onClick={() => selectChantier(chantier)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{chantier.code}</div>
                            <div className="text-sm text-gray-600">{chantier.description}</div>
                            {chantier.clientNom && (
                              <div className="text-xs text-gray-500">Client: {chantier.clientNom}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fournisseur *
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={cession.fournisseurNom}
                      onChange={(e) => handleFournisseurInputChange(e.target.value)}
                      placeholder="Nom ou code du fournisseur"
                      required
                      className="w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => navigate('/achats/fournisseurs/nouveau')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      <Plus className="h-3 w-3 inline mr-1" />
                      Nouveau
                    </button>
                    {/* Suggestions fournisseur */}
                    {showFournisseurSuggestions && fournisseurSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {fournisseurSuggestions.map((fournisseur) => (
                          <div
                            key={fournisseur.id}
                            onClick={() => selectFournisseur(fournisseur)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{fournisseur.raisonSociale}</div>
                            {fournisseur.codeFournisseur && (
                              <div className="text-sm text-gray-600">Code: {fournisseur.codeFournisseur}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                    Montant *
                  </label>
                  <Input
                    type="number"
                    value={cession.montant}
                    onChange={(e) => handleInputChange('montant', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Devise
                  </label>
                  <select
                    value={cession.devise}
                    onChange={(e) => handleInputChange('devise', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {devises.map(devise => (
                      <option key={devise} value={devise}>{devise}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance
                  </label>
                  <Input
                    type="date"
                    value={cession.dateEcheance}
                    onChange={(e) => handleInputChange('dateEcheance', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions spéciales
                </label>
                <textarea
                  value={cession.conditions}
                  onChange={(e) => handleInputChange('conditions', e.target.value)}
                  placeholder="Conditions particulières de la cession..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                {cession.documents.map((doc, index) => (
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
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un document
                </GestalisButton>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Notes */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Notes et informations complémentaires
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={cession.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Notes, commentaires, informations importantes..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
              className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-8 py-3"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Création...' : 'Créer la cession'}
            </GestalisButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NouvelleCession;
