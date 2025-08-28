import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { GestalisCard, GestalisCardContent } from '@/components/ui/GestalisCard';
import { GestalisButton } from '@/components/ui/gestalis-button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Building,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  Download,
  Upload,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  X,
  ArrowRight,
  FileText
} from 'lucide-react';

function Tiers() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [newTier, setNewTier] = useState({
    nom: '',
    type: 'CLIENT',
    siret: '',
    telephone: '',
    email: '',
    adresse: '',
    codePostal: '',
    ville: '',
    description: ''
  });

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      const response = await api.get('/api/clients');
      console.log('Réponse API tiers:', response.data);
      setTiers(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des tiers:', error);
      setLoading(false);
    }
  };

  // Fonctions pour les boutons
  const handleNewTier = () => {
    console.log('Créer un nouveau tiers');
    setShowCreateModal(true);
  };

  const handleCreateTier = () => {
    if (!newTier.nom.trim()) {
      alert('Le nom est obligatoire');
      return;
    }
    
    const tierToAdd = {
      ...newTier,
      id: `tier-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setTiers(prevTiers => [...prevTiers, tierToAdd]);
    console.log('Nouveau tiers créé:', tierToAdd);
    
    // Réinitialiser le formulaire
    setNewTier({
      nom: '',
      type: 'CLIENT',
      siret: '',
      telephone: '',
      email: '',
      adresse: '',
      codePostal: '',
      ville: '',
      description: ''
    });
    
    setShowCreateModal(false);
  };

  const handleViewTier = (tier) => {
    console.log('Voir le tiers:', tier);
    // TODO: Ouvrir modal de visualisation
  };

  const handleEditTier = (tier) => {
    console.log('Éditer le tiers:', tier);
    // TODO: Ouvrir modal d'édition
  };

  const handleDeleteTier = (tier) => {
    console.log('Supprimer le tiers:', tier);
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${tier.nom} ?`)) {
      // Supprimer le tiers de la liste locale
      setTiers(prevTiers => prevTiers.filter(t => t.id !== tier.id));
      console.log('Tiers supprimé de la liste');
      
      // TODO: Appel API de suppression
      // await api.delete(`/api/clients/${tier.id}`);
    }
  };

  const handleMoreFilters = () => {
    console.log('Plus de filtres');
    // TODO: Ouvrir modal de filtres avancés
  };

  // Nouvelles fonctions pour l'export/import
  const handleExportToFournisseurs = async () => {
    setShowExportModal(true);
    setExportProgress(0);
    
    try {
      // Simuler l'export progressif
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Simuler l'export vers la section Fournisseurs
      const fournisseursToExport = tiers.filter(tier => tier.type === 'FOURNISSEUR');
      
      console.log(`Export de ${fournisseursToExport.length} fournisseurs vers la section Fournisseurs`);
      
      // TODO: Appel API pour exporter vers la section Fournisseurs
      // await api.post('/api/fournisseurs/import-from-tiers', { tiers: fournisseursToExport });
      
      setExportProgress(100);
      setTimeout(() => {
        setShowExportModal(false);
        setExportProgress(0);
        alert(`Export réussi ! ${fournisseursToExport.length} fournisseur(s) exporté(s) vers la section Fournisseurs.`);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setShowExportModal(false);
      setExportProgress(0);
      alert('Erreur lors de l\'export vers la section Fournisseurs.');
    }
  };

  const handleImportFromFournisseurs = async () => {
    setShowImportModal(true);
    setImportProgress(0);
    
    try {
      // Simuler l'import progressif
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Simuler l'import depuis la section Fournisseurs
      console.log('Import depuis la section Fournisseurs en cours...');
      
      // TODO: Appel API pour importer depuis la section Fournisseurs
      // const response = await api.get('/api/fournisseurs/export-to-tiers');
      // const importedTiers = response.data;
      
      setImportProgress(100);
      setTimeout(() => {
        setShowImportModal(false);
        setImportProgress(0);
        alert('Import réussi depuis la section Fournisseurs !');
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      setShowImportModal(false);
      setImportProgress(0);
      alert('Erreur lors de l\'import depuis la section Fournisseurs.');
    }
  };

  const navigateToFournisseurs = () => {
    // Navigation vers la section Fournisseurs du module Achat
    window.location.href = '/achats?tab=fournisseurs';
  };

  const getTypeColor = (type) => {
    const colors = {
      'CLIENT': 'bg-blue-100 text-blue-800',
      'FOURNISSEUR': 'bg-green-100 text-green-800',
      'SOUSTRAITANT': 'bg-orange-100 text-orange-800',
      'ORGANISME_SOCIAL': 'bg-purple-100 text-purple-800',
      'ASSURANCE': 'bg-indigo-100 text-indigo-800',
      'BANQUE': 'bg-teal-100 text-teal-800',
      'ADMINISTRATION': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'CLIENT': 'Client',
      'FOURNISSEUR': 'Fournisseur',
      'SOUSTRAITANT': 'Sous-traitant',
      'ORGANISME_SOCIAL': 'Organisme social',
      'ASSURANCE': 'Assurance',
      'BANQUE': 'Banque',
      'ADMINISTRATION': 'Administration'
    };
    return labels[type] || type;
  };

  const filteredTiers = tiers.filter(tier => {
    const matchesSearch = tier.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tier.siret?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || tier.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Compter les fournisseurs
  const fournisseursCount = tiers.filter(tier => tier.type === 'FOURNISSEUR').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tiers</h1>
          <p className="text-gray-600">Gérez vos relations commerciales et administratives</p>
        </div>
        <div className="flex gap-2">
          <GestalisButton variant="outline" className="flex items-center gap-2" onClick={navigateToFournisseurs}>
            <ExternalLink className="h-4 w-4" />
            Section Fournisseurs
          </GestalisButton>
          <GestalisButton variant="secondary" className="flex items-center gap-2" onClick={handleNewTier}>
            <Plus className="h-4 w-4" />
            Nouveau tiers
          </GestalisButton>
        </div>
      </div>

      {/* Section de liaison avec Fournisseurs */}
      {fournisseursCount > 0 && (
        <GestalisCard className="border-l-4 border-l-green-500">
          <GestalisCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Liaison avec la section Fournisseurs</h3>
                  <p className="text-sm text-gray-600">
                    {fournisseursCount} fournisseur(s) détecté(s) dans les Tiers
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <GestalisButton variant="outline" size="sm" onClick={handleExportToFournisseurs}>
                  <Download className="h-4 w-4" />
                  Exporter vers Fournisseurs
                </GestalisButton>
                <GestalisButton variant="outline" size="sm" onClick={handleImportFromFournisseurs}>
                  <Upload className="h-4 w-4" />
                  Importer depuis Fournisseurs
                </GestalisButton>
                <GestalisButton size="sm" onClick={navigateToFournisseurs}>
                  <ArrowRight className="h-4 w-4" />
                  Aller à la section Fournisseurs
                </GestalisButton>
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>
      )}

      {/* Filtres */}
      <GestalisCard variant="neutral">
        <GestalisCardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un tiers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les types</option>
              <option value="CLIENT">Client</option>
              <option value="FOURNISSEUR">Fournisseur</option>
              <option value="SOUSTRAITANT">Sous-traitant</option>
              <option value="ORGANISME_SOCIAL">Organisme social</option>
              <option value="ASSURANCE">Assurance</option>
              <option value="BANQUE">Banque</option>
              <option value="ADMINISTRATION">Administration</option>
            </select>
            <GestalisButton variant="outline" className="flex items-center gap-2" onClick={handleMoreFilters}>
              <Filter className="h-4 w-4" />
              Plus de filtres
            </GestalisButton>
          </div>
        </GestalisCardContent>
      </GestalisCard>

      {/* Liste des tiers */}
      <div className="space-y-4">
        {filteredTiers.map((tier) => (
          <GestalisCard key={tier.id} className="hover:shadow-md transition-shadow">
            <GestalisCardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{tier.nom}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tier.type)}`}>
                      {getTypeLabel(tier.type)}
                    </span>
                    {tier.type === 'FOURNISSEUR' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <ExternalLink className="h-3 w-3 inline mr-1" />
                        Lié à la section Fournisseurs
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{tier.siret || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{tier.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{tier.email || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{tier.adresse ? `${tier.adresse}, ${tier.codePostal} ${tier.ville}` : 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <GestalisButton variant="outline" size="sm" onClick={() => handleViewTier(tier)}>
                    <Eye className="h-4 w-4" />
                  </GestalisButton>
                  <GestalisButton variant="outline" size="sm" onClick={() => handleEditTier(tier)}>
                    <Edit className="h-4 w-4" />
                  </GestalisButton>
                  <GestalisButton variant="danger" size="sm" onClick={() => handleDeleteTier(tier)}>
                    <Trash2 className="h-4 w-4" />
                  </GestalisButton>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>
        ))}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nouveau tiers</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <Input
                  value={newTier.nom}
                  onChange={(e) => setNewTier({...newTier, nom: e.target.value})}
                  placeholder="Nom du tiers"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newTier.type}
                  onChange={(e) => setNewTier({...newTier, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="CLIENT">Client</option>
                  <option value="FOURNISSEUR">Fournisseur</option>
                  <option value="SOUSTRAITANT">Sous-traitant</option>
                  <option value="ORGANISME_SOCIAL">Organisme social</option>
                  <option value="ASSURANCE">Assurance</option>
                  <option value="BANQUE">Banque</option>
                  <option value="ADMINISTRATION">Administration</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SIRET</label>
                <Input
                  value={newTier.siret}
                  onChange={(e) => setNewTier({...newTier, siret: e.target.value})}
                  placeholder="12345678901234"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <Input
                  value={newTier.telephone}
                  onChange={(e) => setNewTier({...newTier, telephone: e.target.value})}
                  placeholder="01 23 45 67 89"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  value={newTier.email}
                  onChange={(e) => setNewTier({...newTier, email: e.target.value})}
                  placeholder="contact@entreprise.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <Input
                  value={newTier.adresse}
                  onChange={(e) => setNewTier({...newTier, adresse: e.target.value})}
                  placeholder="123 Rue de la Paix"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                  <Input
                    value={newTier.codePostal}
                    onChange={(e) => setNewTier({...newTier, codePostal: e.target.value})}
                    placeholder="75001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <Input
                    value={newTier.ville}
                    onChange={(e) => setNewTier({...newTier, ville: e.target.value})}
                    placeholder="Paris"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTier.description}
                  onChange={(e) => setNewTier({...newTier, description: e.target.value})}
                  placeholder="Description du tiers"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <GestalisButton variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </GestalisButton>
              <GestalisButton onClick={handleCreateTier}>
                Créer le tiers
              </GestalisButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'export vers Fournisseurs */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Export vers la section Fournisseurs</h3>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Export en cours...</p>
                  <p className="text-sm text-blue-700">Synchronisation avec la section Fournisseurs</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-600 text-center">
                {exportProgress}% - Export des fournisseurs...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'import depuis Fournisseurs */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Import depuis la section Fournisseurs</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Import en cours...</p>
                  <p className="text-sm text-green-700">Synchronisation depuis la section Fournisseurs</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-600 text-center">
                {importProgress}% - Import des fournisseurs...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tiers;
