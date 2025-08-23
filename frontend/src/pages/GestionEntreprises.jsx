import React, { useState, useEffect } from 'react';
import { Plus, Settings, Palette, FileText, Building2, Users, Globe } from 'lucide-react';
import { GestalisCard, GestalisCardHeader, GestalisCardTitle, GestalisCardContent } from '@/components/ui/gestalis-card';
import { GestalisButton } from '@/components/ui/gestalis-button';

const GestionEntreprises = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBrandingModal, setShowBrandingModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/companies');
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (companyData) => {
    try {
      const response = await fetch('http://localhost:3001/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      if (response.ok) {
        const newCompany = await response.json();
        setCompanies(prev => [...prev, newCompany]);
        setShowCreateModal(false);
        alert('Entreprise créée avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de l\'entreprise');
    }
  };

  const handleBrandingUpdate = async (brandingData) => {
    if (!selectedCompany) return;

    try {
      const response = await fetch(`http://localhost:3001/api/companies/${selectedCompany.id}/branding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandingData),
      });

      if (response.ok) {
        const updatedBranding = await response.json();
        setCompanies(prev => prev.map(company => 
          company.id === selectedCompany.id 
            ? { ...company, branding: updatedBranding }
            : company
        ));
        setShowBrandingModal(false);
        setSelectedCompany(null);
        alert('Branding mis à jour avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du branding:', error);
      alert('Erreur lors de la mise à jour du branding');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des entreprises...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Entreprises</h1>
          <p className="text-gray-600 mt-2">Configuration multi-entreprises pour GESTALIS</p>
        </div>
        <GestalisButton
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvelle Entreprise
        </GestalisButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Entreprises</p>
                <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center gap-3">
              <Palette className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Brandings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {companies.filter(c => c.branding).length}
                </p>
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {companies.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>
      </div>

      {/* Liste des entreprises */}
      <GestalisCard>
        <GestalisCardHeader>
          <GestalisCardTitle>Entreprises configurées</GestalisCardTitle>
        </GestalisCardHeader>
        <GestalisCardContent>
          {companies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucune entreprise configurée</p>
              <GestalisButton onClick={() => setShowCreateModal(true)}>
                Créer la première entreprise
              </GestalisButton>
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <div key={company.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-600">Code: {company.code}</p>
                        {company.legalName && (
                          <p className="text-sm text-gray-500">{company.legalName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <GestalisButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowBrandingModal(true);
                        }}
                      >
                        <Palette className="h-4 w-4 mr-2" />
                        Branding
                      </GestalisButton>
                      
                      <GestalisButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Ouvrir la gestion des templates
                          alert('Gestion des templates à implémenter');
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Templates
                      </GestalisButton>
                      
                      <GestalisButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Ouvrir la configuration
                          alert('Configuration à implémenter');
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Config
                      </GestalisButton>
                    </div>
                  </div>
                  
                  {/* Aperçu du branding */}
                  {company.branding && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-2">Couleurs du branding :</p>
                      <div className="flex gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: company.branding.primaryColor }}
                          title="Couleur principale"
                        />
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: company.branding.secondaryColor }}
                          title="Couleur secondaire"
                        />
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: company.branding.accentColor }}
                          title="Couleur d'accent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </GestalisCardContent>
      </GestalisCard>

      {/* Modal de création d'entreprise */}
      {showCreateModal && (
        <CreateCompanyModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCompany}
        />
      )}

      {/* Modal de branding */}
      {showBrandingModal && selectedCompany && (
        <BrandingModal
          company={selectedCompany}
          onClose={() => {
            setShowBrandingModal(false);
            setSelectedCompany(null);
          }}
          onSubmit={handleBrandingUpdate}
        />
      )}
    </div>
  );
};

// Composant modal de création d'entreprise
const CreateCompanyModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    legalName: '',
    siret: '',
    tvaNumber: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'FR',
    phone: '',
    email: '',
    website: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Nouvelle Entreprise</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code * (ex: PRO97)
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PRO97"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom * 
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de l'entreprise"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raison sociale
            </label>
            <input
              type="text"
              value={formData.legalName}
              onChange={(e) => setFormData(prev => ({ ...prev, legalName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Raison sociale légale"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SIRET
              </label>
              <input
                type="text"
                value={formData.siret}
                onChange={(e) => setFormData(prev => ({ ...prev, siret: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12345678901234"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° TVA
              </label>
              <input
                type="text"
                value={formData.tvaNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, tvaNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="FR12345678901"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Rue de la Paix"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="75001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paris"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contact@entreprise.com"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <GestalisButton
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </GestalisButton>
            <GestalisButton type="submit">
              Créer l'entreprise
            </GestalisButton>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant modal de branding
const BrandingModal = ({ company, onClose, onSubmit }) => {
  const [brandingData, setBrandingData] = useState({
    primaryColor: company.branding?.primaryColor || '#1E40AF',
    secondaryColor: company.branding?.secondaryColor || '#059669',
    accentColor: company.branding?.accentColor || '#DC2626',
    textColor: company.branding?.textColor || '#1F2937',
    backgroundColor: company.branding?.backgroundColor || '#F9FAFB',
    primaryFont: company.branding?.primaryFont || 'Inter',
    secondaryFont: company.branding?.secondaryFont || 'Georgia'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(brandingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Branding - {company.name}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Couleurs */}
          <div>
            <h3 className="text-lg font-medium mb-3">Couleurs principales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur principale
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#1E40AF"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur secondaire
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#059669"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur d'accent
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandingData.accentColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandingData.accentColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#DC2626"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur de fond
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandingData.backgroundColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandingData.backgroundColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#F9FAFB"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typographie */}
          <div>
            <h3 className="text-lg font-medium mb-3">Typographie</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Police principale
                </label>
                <select
                  value={brandingData.primaryFont}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, primaryFont: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Police secondaire
                </label>
                <select
                  value={brandingData.secondaryFont}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryFont: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
              </div>
            </div>
          </div>

          {/* Aperçu */}
          <div>
            <h3 className="text-lg font-medium mb-3">Aperçu du branding</h3>
            <div 
              className="p-6 rounded-lg border"
              style={{ backgroundColor: brandingData.backgroundColor }}
            >
              <div className="space-y-4">
                <h4 
                  className="text-2xl font-bold"
                  style={{ 
                    color: brandingData.primaryColor,
                    fontFamily: brandingData.primaryFont
                  }}
                >
                  Titre principal
                </h4>
                <p 
                  className="text-lg"
                  style={{ 
                    color: brandingData.textColor,
                    fontFamily: brandingData.primaryFont
                  }}
                >
                  Texte principal avec la police et couleur sélectionnées
                </p>
                <div className="flex gap-2">
                  <span 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: brandingData.secondaryColor }}
                  >
                    Bouton secondaire
                  </span>
                  <span 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: brandingData.accentColor }}
                  >
                    Bouton accent
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <GestalisButton
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </GestalisButton>
            <GestalisButton type="submit">
              Sauvegarder le branding
            </GestalisButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GestionEntreprises;
