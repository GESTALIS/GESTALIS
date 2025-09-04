import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Save, 
  X,
  Edit
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../../components/ui/GestalisCard';
import { GestalisButton } from '../../../components/ui/gestalis-button';
import { Input } from '../../../components/ui/input';
import { useComptesStore } from '../../../stores/useComptesStore';


const ModifierFournisseur = ({ fournisseur, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
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
    compteFournisseur: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (fournisseur) {
      setFormData({
        raisonSociale: fournisseur.raisonSociale || '',
        codeFournisseur: fournisseur.codeFournisseur || '',
        siret: fournisseur.siret || '',
        adresseSiege: fournisseur.adresseSiege || '',
        codePostal: fournisseur.codePostal || '',
        ville: fournisseur.ville || '',
        pays: fournisseur.pays || 'France',
        telephone: fournisseur.telephone || '',
        email: fournisseur.email || '',
        siteWeb: fournisseur.siteWeb || '',
        activite: fournisseur.activite || '',
        regimeFiscal: fournisseur.regimeFiscal || 'NORMAL',
        tvaIntracommunautaire: fournisseur.tvaIntracommunautaire || '',
        contactPrincipal: fournisseur.contactPrincipal || '',
        notes: fournisseur.notes || '',
        compteFournisseur: fournisseur.compteComptable || fournisseur.codeFournisseur || ''
      });
    }
  }, [fournisseur]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!formData.raisonSociale || !formData.codeFournisseur) {
        alert('Veuillez remplir la raison sociale et le code fournisseur');
        return;
      }
      
      // Validation du compte fournisseur (format "F...")
      if (!formData.compteFournisseur) {
        alert('Le compte fournisseur est obligatoire pour la comptabilisation');
        return;
      }
      
      if (!formData.compteFournisseur.startsWith('F')) {
        alert('Le compte fournisseur doit commencer par "F" (ex: FTOTAL, F00045)');
        return;
      }
      
      // Créer l'objet fournisseur mis à jour
      const updatedFournisseur = {
        ...fournisseur,
        raisonSociale: formData.raisonSociale,
        codeFournisseur: formData.codeFournisseur,
        siret: formData.siret,
        tvaIntracommunautaire: formData.tvaIntracommunautaire,
        codeApeNaf: formData.activite,
        formeJuridique: formData.regimeFiscal,
        adresseSiege: formData.adresseSiege,
        adresseLivraison: formData.adresseSiege,
        devise: 'EUR',
        estSousTraitant: false,
        compteComptable: formData.compteFournisseur,
        // Ajouter les nouveaux champs
        codePostal: formData.codePostal,
        ville: formData.ville,
        pays: formData.pays,
        telephone: formData.telephone,
        email: formData.email,
        siteWeb: formData.siteWeb,
        activite: formData.activite,
        regimeFiscal: formData.regimeFiscal,
        contactPrincipal: formData.contactPrincipal,
        notes: formData.notes,
        updatedAt: new Date().toISOString()
      };
      
      // Mettre à jour dans localStorage
      const fournisseurs = JSON.parse(localStorage.getItem('gestalis-fournisseurs') || '[]');
      const updatedFournisseurs = fournisseurs.map(f => 
        f.id === fournisseur.id ? updatedFournisseur : f
      );
      localStorage.setItem('gestalis-fournisseurs', JSON.stringify(updatedFournisseurs));
      
      alert('✅ Fournisseur modifié avec succès !');
      console.log('Fournisseur modifié:', updatedFournisseur);
      
      // Appeler la fonction de callback pour mettre à jour la liste
      if (onUpdate) {
        onUpdate(updatedFournisseur);
      }
      
      // Fermer le modal
      onClose();
      
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('❌ Erreur lors de la modification');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!fournisseur) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Edit className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Modifier le Fournisseur</h1>
                <p className="text-green-100 text-lg">{fournisseur.raisonSociale}</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-white hover:text-green-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
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
                      value={formData.raisonSociale}
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
                      value={formData.codeFournisseur}
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
                    <Input
                      value={formData.compteFournisseur}
                      onChange={(e) => handleInputChange('compteFournisseur', e.target.value)}
                      placeholder="FTOTAL, F00045, F-BETONEXP"
                      className="w-full"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Format "F..." obligatoire pour la comptabilisation
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SIRET
                    </label>
                    <Input
                      value={formData.siret}
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
                      value={formData.activite}
                      onChange={(e) => handleInputChange('activite', e.target.value)}
                      placeholder="Secteur d'activité"
                      className="w-full"
                    />
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Adresse et contact */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Adresse et contact
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse du siège
                    </label>
                    <Input
                      value={formData.adresseSiege}
                      onChange={(e) => handleInputChange('adresseSiege', e.target.value)}
                      placeholder="Adresse complète"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal
                    </label>
                    <Input
                      value={formData.codePostal}
                      onChange={(e) => handleInputChange('codePostal', e.target.value)}
                      placeholder="Code postal"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <Input
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      placeholder="Ville"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <select
                      value={formData.pays}
                      onChange={(e) => handleInputChange('pays', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Allemagne">Allemagne</option>
                      <option value="Espagne">Espagne</option>
                      <option value="Italie">Italie</option>
                      <option value="Pays-Bas">Pays-Bas</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <Input
                      value={formData.telephone}
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
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Adresse email"
                      type="email"
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
                      value={formData.siteWeb}
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
                      value={formData.contactPrincipal}
                      onChange={(e) => handleInputChange('contactPrincipal', e.target.value)}
                      placeholder="Nom du contact principal"
                      className="w-full"
                    />
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Informations juridiques et fiscales */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informations juridiques et fiscales
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Régime fiscal
                    </label>
                    <select
                      value={formData.regimeFiscal}
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
                      value={formData.tvaIntracommunautaire}
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
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Notes, conditions spéciales, informations importantes..."
                  rows="4"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </GestalisCardContent>
            </GestalisCard>
          </div>
        </div>

        {/* Actions en bas */}
        <div className="bg-gray-50 p-6 rounded-b-2xl border-t">
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
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </GestalisButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierFournisseur;
