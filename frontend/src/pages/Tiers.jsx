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
  Calendar
} from 'lucide-react';

function Tiers() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
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
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => console.log('Bouton test cliqué')}
          >
            Test Simple
          </button>
          <GestalisButton variant="secondary" className="flex items-center gap-2" onClick={handleNewTier}>
            <Plus className="h-4 w-4" />
            Nouveau tiers
          </GestalisButton>
        </div>
      </div>

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
              <option value="CLIENT">Clients</option>
              <option value="FOURNISSEUR">Fournisseurs</option>
              <option value="SOUSTRAITANT">Sous-traitants</option>
              <option value="ORGANISME_SOCIAL">Organismes sociaux</option>
              <option value="ASSURANCE">Assurances</option>
              <option value="BANQUE">Banques</option>
              <option value="ADMINISTRATION">Administrations</option>
            </select>
            <GestalisButton variant="outline" className="flex items-center gap-2" onClick={handleMoreFilters}>
              <Filter className="h-4 w-4" />
              Plus de filtres
            </GestalisButton>
          </div>
        </GestalisCardContent>
      </GestalisCard>

      {/* Liste des tiers */}
      <div className="grid gap-4">
        {filteredTiers.length === 0 ? (
          <GestalisCard>
            <GestalisCardContent className="p-8 text-center">
              <p className="text-gray-500">Aucun tiers trouvé</p>
            </GestalisCardContent>
          </GestalisCard>
        ) : (
          filteredTiers.map((tier) => (
            <GestalisCard key={tier.id} className="hover:shadow-md transition-shadow">
              <GestalisCardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{tier.nom}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tier.type)}`}>
                        {getTypeLabel(tier.type)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{tier.siret || 'SIRET non spécifié'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{tier.telephone || 'Téléphone non spécifié'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{tier.email || 'Email non spécifié'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{tier.adresse ? `${tier.adresse}, ${tier.codePostal} ${tier.ville}` : 'Adresse non spécifiée'}</span>
                      </div>
                    </div>

                    {tier.description && (
                      <p className="text-gray-600 mt-3 text-sm line-clamp-2">
                        {tier.description}
                      </p>
                    )}
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
          ))
        )}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Créer un nouveau tiers</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom * <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTier.nom}
                  onChange={(e) => setNewTier({...newTier, nom: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nom du tiers"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select 
                  value={newTier.type}
                  onChange={(e) => setNewTier({...newTier, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SIRET
                </label>
                <input
                  type="text"
                  value={newTier.siret}
                  onChange={(e) => setNewTier({...newTier, siret: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="12345678901234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={newTier.telephone}
                  onChange={(e) => setNewTier({...newTier, telephone: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="01 23 45 67 89"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newTier.email}
                  onChange={(e) => setNewTier({...newTier, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="contact@exemple.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  value={newTier.codePostal}
                  onChange={(e) => setNewTier({...newTier, codePostal: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="75001"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={newTier.adresse}
                  onChange={(e) => setNewTier({...newTier, adresse: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="123 Rue de la Paix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  value={newTier.ville}
                  onChange={(e) => setNewTier({...newTier, ville: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Paris"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTier.description}
                  onChange={(e) => setNewTier({...newTier, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Description du tiers..."
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTier}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Créer le tiers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tiers;
