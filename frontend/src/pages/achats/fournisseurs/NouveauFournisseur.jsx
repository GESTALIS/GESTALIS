import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Save, 
  ArrowLeft,
  X
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../../components/ui/GestalisCard';
import { GestalisButton } from '../../../components/ui/gestalis-button';
import { Input } from '../../../components/ui/input';
import { api } from '../../../utils/api';
import { useFournisseursStore } from '../../../stores/useFournisseursStore';
import { useComptesStore } from '../../../stores/useComptesStore';

const NouveauFournisseur = () => {
  const [fournisseur, setFournisseur] = useState({
    raisonSociale: '',
    codeFournisseur: '',
    siret: '',
    adresseSiege: '',
    codePostal: '',
    ville: '',
    pays: 'France',
    telephone: '',
    email: '',
    siteWeb: '',
    activite: '',
    regimeFiscal: 'NORMAL',
    tvaIntracommunautaire: '',
    contactPrincipal: '',
    notes: '',
    compteFournisseur: '', // Compte fournisseur au format "F..." (ex: FTOTAL, F00045)
    compteComptable: '' // Compte comptable réel (ex: 401, 401001)
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // États pour la recherche de comptes comptables
  const [searchCompteTerm, setSearchCompteTerm] = useState('');
  const [showCompteResults, setShowCompteResults] = useState(false);
  
  // Store des comptes comptables
  const { comptes } = useComptesStore();
  
  // Filtrer les fournisseurs existants pour la recherche de codes fournisseurs
  const { fournisseurs } = useFournisseursStore();
  const filteredFournisseurs = fournisseurs.filter(fournisseur => 
    fournisseur.codeFournisseur?.toLowerCase().includes(searchCompteTerm.toLowerCase()) ||
    fournisseur.raisonSociale?.toLowerCase().includes(searchCompteTerm.toLowerCase())
  );

  useEffect(() => {
    // Récupérer le terme de recherche depuis localStorage
    const createFromSearch = localStorage.getItem('createFromSearch');
    if (createFromSearch) {
      try {
        const { type, searchTerm } = JSON.parse(createFromSearch);
        if (type === 'fournisseur' && searchTerm) {
          setFournisseur(prev => ({ ...prev, raisonSociale: searchTerm }));
          // Nettoyer le localStorage
          localStorage.removeItem('createFromSearch');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du terme de recherche:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFournisseur(prev => ({ ...prev, [field]: value }));
  };
  
  // Gérer la sélection d'un code fournisseur existant
  const handleCompteSelect = (fournisseur) => {
    setFournisseur(prev => ({ 
      ...prev, 
      compteFournisseur: fournisseur.codeFournisseur
    }));
    setSearchCompteTerm(fournisseur.codeFournisseur);
    setShowCompteResults(false);
  };
  
  // Gérer la recherche de comptes
  const handleCompteSearch = (value) => {
    setSearchCompteTerm(value);
    setShowCompteResults(value.length > 0);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!fournisseur.raisonSociale || !fournisseur.codeFournisseur) {
        alert('Veuillez remplir la raison sociale et le code fournisseur');
        return;
      }
      
      // Validation du compte fournisseur (format "F...")
      if (!fournisseur.compteFournisseur) {
        alert('Le compte fournisseur est obligatoire pour la comptabilisation');
        return;
      }
      
      if (!fournisseur.compteFournisseur.startsWith('F')) {
        alert('Le compte fournisseur doit commencer par "F" (ex: FTOTAL, F00045)');
        return;
      }
      
      const response = await api.post('/api/fournisseurs', fournisseur);
      
      alert('✅ Fournisseur créé avec succès !');
      console.log('Fournisseur créé:', response.data);
      
      // Retourner à la page précédente
      window.history.back();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <Building2 className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Nouveau Fournisseur</h1>
              <p className="text-blue-100 text-lg">Créer un nouveau fournisseur</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Informations générales */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations générales
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raison sociale *
                  </label>
                  <Input
                    value={fournisseur.raisonSociale}
                    onChange={(e) => handleInputChange('raisonSociale', e.target.value)}
                    placeholder="Nom de l'entreprise"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code fournisseur *
                  </label>
                  <Input
                    value={fournisseur.codeFournisseur}
                    onChange={(e) => handleInputChange('codeFournisseur', e.target.value)}
                    placeholder="Code unique"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compte fournisseur *
                  </label>
                  <div className="relative">
                    <Input
                      value={searchCompteTerm}
                      onChange={(e) => handleCompteSearch(e.target.value)}
                      placeholder="Rechercher un code fournisseur (ex: FTESTDPL, FFDXSQ)"
                      className="w-full pr-10"
                      onFocus={() => setShowCompteResults(searchCompteTerm.length > 0)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    {/* Résultats de recherche */}
                    {showCompteResults && filteredFournisseurs.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredFournisseurs.slice(0, 10).map((fournisseur) => (
                          <div
                            key={fournisseur.id}
                            onClick={() => handleCompteSelect(fournisseur)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {fournisseur.codeFournisseur}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {fournisseur.raisonSociale}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                {fournisseur.statut}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Sélectionnez un code fournisseur existant
                    </p>
                    <button
                      type="button"
                      onClick={goCreateCompte}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Créer
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SIRET
                  </label>
                  <Input
                    value={fournisseur.siret}
                    onChange={(e) => handleInputChange('siret', e.target.value)}
                    placeholder="Numéro SIRET"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activité
                  </label>
                  <Input
                    value={fournisseur.activite}
                    onChange={(e) => handleInputChange('activite', e.target.value)}
                    placeholder="Secteur d'activité"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Adresse */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Adresse
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse du siège
                </label>
                <Input
                  value={fournisseur.adresseSiege}
                  onChange={(e) => handleInputChange('adresseSiege', e.target.value)}
                  placeholder="Adresse complète"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <Input
                    value={fournisseur.codePostal}
                    onChange={(e) => handleInputChange('codePostal', e.target.value)}
                    placeholder="Code postal"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <Input
                    value={fournisseur.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    placeholder="Ville"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <Input
                    value={fournisseur.pays}
                    onChange={(e) => handleInputChange('pays', e.target.value)}
                    placeholder="Pays"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Contact */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Contact
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <Input
                    value={fournisseur.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="Numéro de téléphone"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={fournisseur.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemple.com"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <Input
                    value={fournisseur.siteWeb}
                    onChange={(e) => handleInputChange('siteWeb', e.target.value)}
                    placeholder="https://www.exemple.com"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact principal
                  </label>
                  <Input
                    value={fournisseur.contactPrincipal}
                    onChange={(e) => handleInputChange('contactPrincipal', e.target.value)}
                    placeholder="Nom du contact principal"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Informations fiscales */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations fiscales
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Régime fiscal
                  </label>
                  <select
                    value={fournisseur.regimeFiscal}
                    onChange={(e) => handleInputChange('regimeFiscal', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="SIMPLIFIE">Simplifié</option>
                    <option value="REEL">Réel</option>
                    <option value="EXONERE">Exonéré</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TVA intracommunautaire
                  </label>
                  <Input
                    value={fournisseur.tvaIntracommunautaire}
                    onChange={(e) => handleInputChange('tvaIntracommunautaire', e.target.value)}
                    placeholder="FR12345678901"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Notes */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Notes et informations complémentaires
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <textarea
                value={fournisseur.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notes, conditions spéciales, informations importantes..."
                rows="4"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </GestalisCardContent>
          </GestalisCard>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              Annuler
            </button>
            <GestalisButton
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default NouveauFournisseur;
