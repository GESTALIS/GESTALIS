import React, { useState, useEffect } from 'react';
import { 
  User, 
  Plus, 
  Save, 
  ArrowLeft,
  X
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../../components/ui/GestalisCard';
import { GestalisButton } from '../../../components/ui/gestalis-button';
import { Input } from '../../../components/ui/input';
import { api } from '../../../utils/api';

const NouvelUtilisateur = () => {
  const [user, setUser] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    role: 'UTILISATEUR',
    departement: '',
    poste: '',
    dateEmbauche: '',
    statut: 'ACTIF',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Détecter le retour depuis SmartPicker
    const smartpickerContext = sessionStorage.getItem('smartpicker_return_context');
    if (smartpickerContext) {
      try {
        const { returnTo, returnField, draftId, searchTerm } = JSON.parse(smartpickerContext);
        console.log('🔄 Retour depuis SmartPicker détecté:', { returnTo, returnField, draftId, searchTerm });
        if (returnTo && returnTo.includes('creation-bon-commande') && searchTerm) {
          // Essayer de deviner si c'est un prénom ou un nom
          const words = searchTerm.trim().split(' ');
          if (words.length >= 2) {
            setUser(prev => ({ 
              ...prev, 
              prenom: words[0],
              nom: words.slice(1).join(' ')
            }));
          } else {
            setUser(prev => ({ ...prev, prenom: searchTerm }));
          }
          console.log('🚀 Utilisateur pré-rempli depuis SmartPicker:', searchTerm);
        }
      } catch (error) {
        console.error('Erreur lors du parsing du contexte SmartPicker:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!user.prenom || !user.nom || !user.email) {
        alert('Veuillez remplir le prénom, le nom et l\'email');
        return;
      }
      
      const response = await api.post('/api/users', user);
      const nouvelUtilisateur = response.data;
      
      // Vérifier si on doit retourner au Bon de Commande (nouveau système SmartPicker)
      const smartpickerContext = sessionStorage.getItem('smartpicker_return_context');
      console.log('🔍 Contexte SmartPicker trouvé:', smartpickerContext);
      if (smartpickerContext) {
        try {
          const { returnTo, returnField, draftId } = JSON.parse(smartpickerContext);
          console.log('🔍 Contexte parsé:', { returnTo, returnField, draftId });
          if (returnTo && returnTo.includes('creation-bon-commande')) {
            console.log('🚀 Retour vers le Bon de Commande depuis SmartPicker');
            const utilisateurFormate = {
              id: nouvelUtilisateur.id,
              label: `${nouvelUtilisateur.prenom} ${nouvelUtilisateur.nom}${nouvelUtilisateur.poste ? ` (${nouvelUtilisateur.poste})` : ''}`,
              data: nouvelUtilisateur
            };
            console.log('💾 Utilisateur formaté pour retour:', utilisateurFormate);
            localStorage.setItem('selectedUser', JSON.stringify(utilisateurFormate));
            sessionStorage.removeItem('smartpicker_return_context'); // Clean up here
            alert(`✅ Utilisateur créé avec succès !\n\nNom: ${nouvelUtilisateur.prenom} ${nouvelUtilisateur.nom}\nEmail: ${nouvelUtilisateur.email}\nRôle: ${nouvelUtilisateur.role}\n\nVous allez être redirigé vers le Bon de Commande.`);
            console.log('🔄 Navigation vers:', returnTo);
            window.location.href = returnTo;
            return;
          } else {
            console.log('❌ Pas de retour vers Bon de Commande - returnTo:', returnTo);
          }
        } catch (error) {
          console.error('Erreur lors du parsing du contexte SmartPicker:', error);
        }
      } else {
        console.log('❌ Aucun contexte SmartPicker trouvé');
      }
      
      alert('✅ Utilisateur créé avec succès !');
      console.log('Utilisateur créé:', response.data);
      
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
            <User className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Nouvel Utilisateur</h1>
              <p className="text-blue-100 text-lg">Créer un nouvel utilisateur</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Informations personnelles */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <Input
                    value={user.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Prénom"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <Input
                    value={user.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Nom"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemple.com"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <Input
                    value={user.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="Numéro de téléphone"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Informations professionnelles */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations professionnelles
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    value={user.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="UTILISATEUR">Utilisateur</option>
                    <option value="ADMIN">Administrateur</option>
                    <option value="COMPTABLE">Comptable</option>
                    <option value="MANAGER">Manager</option>
                    <option value="DIRIGEANT">Dirigeant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département
                  </label>
                  <Input
                    value={user.departement}
                    onChange={(e) => handleInputChange('departement', e.target.value)}
                    placeholder="Département"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste
                  </label>
                  <Input
                    value={user.poste}
                    onChange={(e) => handleInputChange('poste', e.target.value)}
                    placeholder="Intitulé du poste"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'embauche
                  </label>
                  <Input
                    type="date"
                    value={user.dateEmbauche}
                    onChange={(e) => handleInputChange('dateEmbauche', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={user.statut}
                  onChange={(e) => handleInputChange('statut', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="ACTIF">Actif</option>
                  <option value="INACTIF">Inactif</option>
                  <option value="CONGE">En congé</option>
                  <option value="DEMISSION">Démission</option>
                </select>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Notes */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Notes et informations complémentaires
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <textarea
                value={user.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notes, informations importantes, commentaires..."
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

export default NouvelUtilisateur;
