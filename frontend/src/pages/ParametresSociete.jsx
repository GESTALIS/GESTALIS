import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Upload, 
  Save, 
  Eye, 
  EyeOff,
  Phone,
  Mail,
  Globe,
  FileText,
  Settings,
  User,
  MapPin,
  Euro,
  Clock,
  Languages
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';
import { Input } from '../components/ui/input';
import { api } from '../utils/api';

const ParametresSociete = () => {
  const [societe, setSociete] = useState({
    nom: '',
    raisonSociale: '',
    siret: '',
    tvaIntracommunautaire: '',
    codeApeNaf: '',
    formeJuridique: '',
    capitalSocial: '',
    adresseSiege: '',
    adresseLivraison: '',
    telephone: '',
    email: '',
    siteWeb: '',
    logoUrl: '',
    logoBase64: '',
    rcs: '',
    numeroRcs: '',
    contactPrincipal: '',
    serviceAchats: '',
    serviceComptabilite: '',
    enTeteDefaut: '',
    piedDePage: '',
    conditionsGenerales: '',
    devise: 'EUR',
    langue: 'FR',
    fuseauHoraire: 'Europe/Paris'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchSociete();
  }, []);

  const fetchSociete = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/societe');
      setSociete(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la société:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSociete(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Convertir en base64 pour prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setSociete(prev => ({ ...prev, logoBase64: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Sauvegarder les informations de base
      const response = await api.put(`/api/societe/${societe.id}`, societe);
      
      // Si un logo a été sélectionné, l'uploader
      if (logoFile) {
        await api.post('/api/societe/upload-logo', {
          logoBase64: societe.logoBase64,
          logoUrl: societe.logoUrl
        });
      }
      
      alert('✅ Paramètres de la société sauvegardés avec succès !');
      setLogoFile(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Paramètres de la Société</h1>
              <p className="text-blue-100 text-lg">Configuration de votre entreprise</p>
            </div>
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
                  <Building2 className="h-5 w-5" />
                  Informations générales
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'entreprise *
                    </label>
                    <Input
                      value={societe.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Nom de votre entreprise"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Raison sociale *
                    </label>
                    <Input
                      value={societe.raisonSociale}
                      onChange={(e) => handleInputChange('raisonSociale', e.target.value)}
                      placeholder="Raison sociale"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SIRET
                    </label>
                    <Input
                      value={societe.siret || ''}
                      onChange={(e) => handleInputChange('siret', e.target.value)}
                      placeholder="12345678901234"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TVA Intra
                    </label>
                    <Input
                      value={societe.tvaIntracommunautaire || ''}
                      onChange={(e) => handleInputChange('tvaIntracommunautaire', e.target.value)}
                      placeholder="FR12345678901"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code APE/NAF
                    </label>
                    <Input
                      value={societe.codeApeNaf || ''}
                      onChange={(e) => handleInputChange('codeApeNaf', e.target.value)}
                      placeholder="4391C"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Forme juridique
                    </label>
                    <select
                      value={societe.formeJuridique || ''}
                      onChange={(e) => handleInputChange('formeJuridique', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="SARL">SARL</option>
                      <option value="SAS">SAS</option>
                      <option value="SA">SA</option>
                      <option value="EURL">EURL</option>
                      <option value="EI">EI</option>
                      <option value="EIRL">EIRL</option>
                      <option value="SNC">SNC</option>
                      <option value="SCA">SCA</option>
                      <option value="SCS">SCS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capital social
                    </label>
                    <Input
                      type="number"
                      value={societe.capitalSocial || ''}
                      onChange={(e) => handleInputChange('capitalSocial', e.target.value)}
                      placeholder="100000"
                      className="w-full"
                    />
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Adresses */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresses
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse du siège *
                  </label>
                  <textarea
                    value={societe.adresseSiege}
                    onChange={(e) => handleInputChange('adresseSiege', e.target.value)}
                    placeholder="123 Rue de la Paix&#10;75001 Paris"
                    rows="3"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse de livraison
                  </label>
                  <textarea
                    value={societe.adresseLivraison || ''}
                    onChange={(e) => handleInputChange('adresseLivraison', e.target.value)}
                    placeholder="Adresse de livraison (optionnel)"
                    rows="3"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Contacts */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contacts
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={societe.telephone || ''}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        placeholder="01 23 45 67 89"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        value={societe.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="contact@entreprise.fr"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={societe.siteWeb || ''}
                      onChange={(e) => handleInputChange('siteWeb', e.target.value)}
                      placeholder="https://www.entreprise.fr"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact principal
                    </label>
                    <Input
                      value={societe.contactPrincipal || ''}
                      onChange={(e) => handleInputChange('contactPrincipal', e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service achats
                    </label>
                    <Input
                      value={societe.serviceAchats || ''}
                      onChange={(e) => handleInputChange('serviceAchats', e.target.value)}
                      placeholder="Service Achats"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service comptabilité
                    </label>
                    <Input
                      value={societe.serviceComptabilite || ''}
                      onChange={(e) => handleInputChange('serviceComptabilite', e.target.value)}
                      placeholder="Service Comptabilité"
                      className="w-full"
                    />
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Paramètres système */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres système
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Devise
                    </label>
                    <select
                      value={societe.devise}
                      onChange={(e) => handleInputChange('devise', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF (CHF)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select
                      value={societe.langue}
                      onChange={(e) => handleInputChange('langue', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="FR">Français</option>
                      <option value="EN">English</option>
                      <option value="DE">Deutsch</option>
                      <option value="ES">Español</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      value={societe.fuseauHoraire}
                      onChange={(e) => handleInputChange('fuseauHoraire', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Europe/Berlin">Europe/Berlin</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Logo */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Logo de l'entreprise
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                {/* Prévisualisation du logo */}
                {societe.logoBase64 && (
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img
                        src={societe.logoBase64}
                        alt="Logo de l'entreprise"
                        className="max-w-full h-32 object-contain border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={() => setShowLogo(!showLogo)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                        title={showLogo ? "Masquer le logo" : "Afficher le logo"}
                      >
                        {showLogo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload du logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formats supportés : PNG, JPG, SVG. Taille max : 2MB
                  </p>
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Informations légales */}
            <GestalisCard>
              <GestalisCardHeader>
                <GestalisCardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations légales
                </GestalisCardTitle>
              </GestalisCardHeader>
              <GestalisCardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RCS
                  </label>
                  <Input
                    value={societe.rcs || ''}
                    onChange={(e) => handleInputChange('rcs', e.target.value)}
                    placeholder="Paris"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro RCS
                  </label>
                  <Input
                    value={societe.numeroRcs || ''}
                    onChange={(e) => handleInputChange('numeroRcs', e.target.value)}
                    placeholder="B 123 456 789"
                    className="w-full"
                  />
                </div>
              </GestalisCardContent>
            </GestalisCard>

            {/* Bouton de sauvegarde */}
            <div className="sticky top-6">
              <GestalisButton
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 text-lg"
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
    </div>
  );
};

export default ParametresSociete;
