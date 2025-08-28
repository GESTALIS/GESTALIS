import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { GestalisCard, GestalisCardHeader, GestalisCardTitle, GestalisCardContent } from '@/components/ui/gestalis-card';
import { GestalisButton } from '@/components/ui/gestalis-button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';

function Chantiers() {
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchChantiers();
  }, []);

  const fetchChantiers = async () => {
    try {
      const response = await api.get('/api/chantiers');
      console.log('Réponse API chantiers:', response.data);
      setChantiers(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des chantiers:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (statut) => {
    const colors = {
      'en_preparation': 'bg-yellow-100 text-yellow-800',
      'en_cours': 'bg-blue-100 text-blue-800',
      'suspendu': 'bg-orange-100 text-orange-800',
      'termine': 'bg-green-100 text-green-800',
      'annule': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'en_preparation': 'En préparation',
      'en_cours': 'En cours',
      'suspendu': 'Suspendu',
      'termine': 'Terminé',
      'annule': 'Annulé'
    };
    return labels[statut] || statut;
  };

  const filteredChantiers = chantiers.filter(chantier => {
    const matchesSearch = chantier.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chantier.client?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || chantier.statut === selectedStatus;
    return matchesSearch && matchesStatus;
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
          <h1 className="text-2xl font-bold text-gray-900">Chantiers</h1>
          <p className="text-gray-600">Gérez vos chantiers et projets</p>
        </div>
        <GestalisButton variant="secondary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau chantier
        </GestalisButton>
      </div>

      {/* Filtres */}
      <GestalisCard variant="neutral">
        <GestalisCardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un chantier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_preparation">En préparation</option>
              <option value="en_cours">En cours</option>
              <option value="suspendu">Suspendu</option>
              <option value="termine">Terminé</option>
              <option value="annule">Annulé</option>
            </select>
            <GestalisButton variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Plus de filtres
            </GestalisButton>
          </div>
        </GestalisCardContent>
      </GestalisCard>

      {/* Liste des chantiers */}
      <div className="grid gap-4">
        {filteredChantiers.length === 0 ? (
          <GestalisCard>
            <GestalisCardContent className="p-8 text-center">
              <p className="text-gray-500">Aucun chantier trouvé</p>
            </GestalisCardContent>
          </GestalisCard>
        ) : (
          filteredChantiers.map((chantier) => (
            <GestalisCard key={chantier.id} className="hover:shadow-md transition-shadow">
              <GestalisCardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{chantier.nom}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chantier.statut)}`}>
                        {getStatusLabel(chantier.statut)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{chantier.adresse ? `${chantier.adresse}, ${chantier.code_postal} ${chantier.ville}` : 'Non spécifié'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{chantier.date_debut ? new Date(chantier.date_debut).toLocaleDateString('fr-FR') : 'Non définie'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{chantier.budget_initial ? `${chantier.budget_initial.toLocaleString('fr-FR')} €` : 'Non défini'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{chantier.client?.nom || 'Client non spécifié'}</span>
                      </div>
                    </div>

                    {chantier.description && (
                      <p className="text-gray-600 mt-3 text-sm line-clamp-2">
                        {chantier.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <GestalisButton variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </GestalisButton>
                    <GestalisButton variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </GestalisButton>
                    <GestalisButton variant="danger" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </GestalisButton>
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>
          ))
        )}
      </div>
    </div>
  );
}

export default Chantiers; 