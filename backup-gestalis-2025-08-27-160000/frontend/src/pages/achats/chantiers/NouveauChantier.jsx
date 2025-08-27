import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Save, 
  ArrowLeft,
  X
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../../components/ui/GestalisCard';
import { GestalisButton } from '../../../components/ui/gestalis-button';
import { Input } from '../../../components/ui/input';
import { api } from '../../../utils/api';

const NouveauChantier = () => {
  const [chantier, setChantier] = useState({
    nom: '',
    codeChantier: '',
    adresse: '',
    codePostal: '',
    ville: '',
    pays: 'France',
    clientNom: '',
    clientContact: '',
    clientTelephone: '',
    clientEmail: '',
    dateDebut: '',
    dateFin: '',
    montant: '',
    devise: 'EUR',
    statut: 'EN_COURS',
    description: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Récupérer le terme de recherche depuis localStorage
    const createFromSearch = localStorage.getItem('createFromSearch');
    if (createFromSearch) {
      try {
        const { type, searchTerm } = JSON.parse(createFromSearch);
        if (type === 'chantier' && searchTerm) {
          setChantier(prev => ({ ...prev, nom: searchTerm }));
          // Nettoyer le localStorage
          localStorage.removeItem('createFromSearch');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du terme de recherche:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setChantier(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!chantier.nom || !chantier.codeChantier) {
        alert('Veuillez remplir le nom et le code du chantier');
        return;
      }
      
      const response = await api.post('/api/chantiers', chantier);
      
      alert('✅ Chantier créé avec succès !');
      console.log('Chantier créé:', response.data);
      
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
            <MapPin className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Nouveau Chantier</h1>
              <p className="text-blue-100 text-lg">Créer un nouveau chantier</p>
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
                <MapPin className="h-5 w-5" />
                Informations générales
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du chantier *
                  </label>
                  <Input
                    value={chantier.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Nom du chantier"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code chantier *
                  </label>
                  <Input
                    value={chantier.codeChantier}
                    onChange={(e) => handleInputChange('codeChantier', e.target.value)}
                    placeholder="Code unique"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
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
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={chantier.dateFin}
                    onChange={(e) => handleInputChange('dateFin', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant
                  </label>
                  <Input
                    type="number"
                    value={chantier.montant}
                    onChange={(e) => handleInputChange('montant', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CHF">CHF (CHF)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={chantier.statut}
                  onChange={(e) => handleInputChange('statut', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="EN_COURS">En cours</option>
                  <option value="PLANIFIE">Planifié</option>
                  <option value="TERMINE">Terminé</option>
                  <option value="EN_PAUSE">En pause</option>
                  <option value="ANNULE">Annulé</option>
                </select>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Adresse */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adresse du chantier
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète
                </label>
                <Input
                  value={chantier.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Adresse complète du chantier"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <Input
                    value={chantier.codePostal}
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
                    value={chantier.ville}
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
                    value={chantier.pays}
                    onChange={(e) => handleInputChange('pays', e.target.value)}
                    placeholder="Pays"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Client */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Informations client
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du client
                  </label>
                  <Input
                    value={chantier.clientNom}
                    onChange={(e) => handleInputChange('clientNom', e.target.value)}
                    placeholder="Nom du client"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact client
                  </label>
                  <Input
                    value={chantier.clientContact}
                    onChange={(e) => handleInputChange('clientContact', e.target.value)}
                    placeholder="Nom du contact principal"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone client
                  </label>
                  <Input
                    value={chantier.clientTelephone}
                    onChange={(e) => handleInputChange('clientTelephone', e.target.value)}
                    placeholder="Numéro de téléphone"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email client
                  </label>
                  <Input
                    type="email"
                    value={chantier.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="email@exemple.com"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Description */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Description et notes
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du chantier
                </label>
                <textarea
                  value={chantier.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description détaillée du chantier..."
                  rows="3"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes et informations complémentaires
                </label>
                <textarea
                  value={chantier.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Notes, conditions spéciales, informations importantes..."
                  rows="4"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
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

export default NouveauChantier;
