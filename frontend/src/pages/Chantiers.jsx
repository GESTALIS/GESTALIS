import React, { useState, useEffect } from 'react';
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
  Clock,
  Building2,
  FileText,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '@/components/ui/gestalis-card';
import { GestalisButton } from '@/components/ui/gestalis-button';
import { Input } from '@/components/ui/input';

const Chantiers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedChantiers, setSelectedChantiers] = useState([]);
  const [chantiers, setChantiers] = useState([]);
  const [filteredChantiers, setFilteredChantiers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les chantiers depuis localStorage ou créer des données de test
  useEffect(() => {
    const savedChantiers = localStorage.getItem('gestalis-chantiers');
    if (savedChantiers) {
      const parsedChantiers = JSON.parse(savedChantiers);
      setChantiers(parsedChantiers);
      setFilteredChantiers(parsedChantiers);
    } else {
              // Données de test si aucun chantier n'existe
        const chantiersTest = [
          {
            id: 1,
            code: 'CH012024-0001',
            numeroExterne: 'REF-2024-001',
            nom: 'Rénovation Immeuble Centre-Ville',
            description: 'Rénovation complète d\'un immeuble de 5 étages dans le centre-ville',
            type: 'Rénovation',
            clientNom: 'Immobilier Centre-Ville SARL',
            adresse: '15 Rue de la République',
            ville: 'Lyon',
            codePostal: '69001',
            dateDebut: '2024-01-15',
            dateFin: '2024-08-30',
            dureeEstimee: '7 mois',
            statut: 'en_cours',
            montant: 850000,
            devise: 'EUR',
            acompte: 170000,
            chefChantier: 'Jean Dupont',
            equipe: 12
          },
          {
            id: 2,
            code: 'CH012024-0002',
            numeroExterne: 'PROJ-2024-002',
            nom: 'Construction Maison Individuelle',
            description: 'Construction d\'une maison moderne de 150m² avec jardin',
            type: 'Construction',
            clientNom: 'Famille Martin',
            adresse: '45 Chemin des Oliviers',
            ville: 'Aix-en-Provence',
            codePostal: '13100',
            dateDebut: '2024-03-01',
            dateFin: '2024-10-15',
            dureeEstimee: '7.5 mois',
            statut: 'en_preparation',
            montant: 320000,
            devise: 'EUR',
            acompte: 64000,
            chefChantier: 'Marie Laurent',
            equipe: 8
          },
          {
            id: 3,
            code: 'CH012024-0003',
            nom: 'Maintenance Centre Commercial',
            description: 'Travaux de maintenance et rénovation partielle du centre commercial',
            type: 'Maintenance',
            clientNom: 'Centre Commercial Grand Sud',
            adresse: '123 Avenue du Commerce',
            ville: 'Marseille',
            codePostal: '13008',
            dateDebut: '2024-02-10',
            dateFin: '2024-04-30',
            dureeEstimee: '2.5 mois',
            statut: 'termine',
            montant: 180000,
            devise: 'EUR',
            acompte: 36000,
            chefChantier: 'Pierre Moreau',
            equipe: 6
          }
        ];
      setChantiers(chantiersTest);
      setFilteredChantiers(chantiersTest);
      localStorage.setItem('gestalis-chantiers', JSON.stringify(chantiersTest));
    }
  }, []);

  // Filtrer les chantiers
  useEffect(() => {
    let filtered = chantiers;
    
    if (searchTerm) {
      filtered = filtered.filter(chantier => 
        chantier.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chantier.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chantier.clientNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chantier.ville?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(chantier => chantier.statut === selectedStatus);
    }
    
    setFilteredChantiers(filtered);
  }, [searchTerm, selectedStatus, chantiers]);

  // Gestion de la sélection
  const handleSelectChantier = (chantierId) => {
    setSelectedChantiers(prev => 
      prev.includes(chantierId) 
        ? prev.filter(id => id !== chantierId)
        : [...prev, chantierId]
    );
  };

  const handleSelectAll = () => {
    if (selectedChantiers.length === filteredChantiers.length) {
      setSelectedChantiers([]);
    } else {
      setSelectedChantiers(filteredChantiers.map(c => c.id));
    }
  };

  // Actions sur les chantiers
  const handleViewChantier = (chantier) => {
    // Navigation vers la page de détail du chantier
    navigate(`/chantiers/${chantier.id}`);
  };

  const handleEditChantier = (chantier) => {
    navigate(`/chantiers/${chantier.id}/modifier`);
  };

  const handleDeleteChantier = (chantierId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chantier ?')) {
      const updatedChantiers = chantiers.filter(c => c.id !== chantierId);
      setChantiers(updatedChantiers);
      localStorage.setItem('gestalis-chantiers', JSON.stringify(updatedChantiers));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedChantiers.length === 0) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedChantiers.length} chantier(s) ?`)) {
      const updatedChantiers = chantiers.filter(c => !selectedChantiers.includes(c.id));
      setChantiers(updatedChantiers);
      setSelectedChantiers([]);
      localStorage.setItem('gestalis-chantiers', JSON.stringify(updatedChantiers));
    }
  };

  const handleNouveauChantier = () => {
    navigate('/chantiers/nouveau');
  };

  const handleImportChantiers = () => {
    // Logique d'import
    alert('Fonctionnalité d\'import à implémenter');
  };

  const handleExportChantiers = () => {
    // Logique d'export
    alert('Fonctionnalité d\'export à implémenter');
  };

  // Couleurs et labels des statuts
  const getStatusColor = (statut) => {
    const colors = {
      'en_preparation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'en_cours': 'bg-blue-100 text-blue-800 border-blue-200',
      'suspendu': 'bg-orange-100 text-orange-800 border-orange-200',
      'termine': 'bg-green-100 text-green-800 border-green-200',
      'annule': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getStatusIcon = (statut) => {
    const icons = {
      'en_preparation': Clock,
      'en_cours': Play,
      'suspendu': Pause,
      'termine': CheckCircle,
      'annule': XCircle
    };
    return icons[statut] || AlertCircle;
  };

  // Calcul des statistiques
  const totalChantiers = chantiers.length;
  const chantiersEnCours = chantiers.filter(c => c.statut === 'en_cours').length;
  const chantiersTermines = chantiers.filter(c => c.statut === 'termine').length;
  const montantTotal = chantiers.reduce((sum, c) => sum + (c.montant || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec titre et bouton */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Chantiers</h1>
              <p className="text-gray-600">Gérez vos chantiers et projets de construction</p>
            </div>
            <GestalisButton 
              onClick={handleNouveauChantier}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau Chantier
            </GestalisButton>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GestalisCard className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <GestalisCardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Total Chantiers</p>
                  <p className="text-2xl font-bold text-green-900">{totalChantiers}</p>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          <GestalisCard className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
            <GestalisCardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">En Cours</p>
                  <p className="text-2xl font-bold text-blue-900">{chantiersEnCours}</p>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          <GestalisCard className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200">
            <GestalisCardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-emerald-600">Terminés</p>
                  <p className="text-2xl font-bold text-emerald-900">{chantiersTermines}</p>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          <GestalisCard className="bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200">
            <GestalisCardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-teal-600">Montant Total</p>
                  <p className="text-2xl font-bold text-teal-900">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(montantTotal)}
                  </p>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>
        </div>

        {/* Barre de recherche et filtres */}
        <GestalisCard className="mb-6">
          <GestalisCardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un chantier, code, client, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="en_preparation">En préparation</option>
                  <option value="en_cours">En cours</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="termine">Terminé</option>
                  <option value="annule">Annulé</option>
                </select>
                
                <GestalisButton variant="outline" className="border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </GestalisButton>
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        {/* Actions en lot */}
        {selectedChantiers.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedChantiers.length} chantier(s) sélectionné(s)
              </span>
              <div className="flex gap-2">
                <GestalisButton 
                  variant="danger" 
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer la sélection
                </GestalisButton>
              </div>
            </div>
          </div>
        )}

        {/* Liste des chantiers */}
        {filteredChantiers.length === 0 ? (
          <GestalisCard>
            <GestalisCardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun chantier trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Aucun chantier ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre premier chantier.'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && (
                <GestalisButton 
                  onClick={handleNouveauChantier}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un chantier
                </GestalisButton>
              )}
            </GestalisCardContent>
          </GestalisCard>
        ) : (
          <div className="space-y-4">
            {filteredChantiers.map((chantier) => {
              const StatusIcon = getStatusIcon(chantier.statut);
              return (
                <GestalisCard key={chantier.id} className="hover:shadow-lg transition-shadow duration-200">
                  <GestalisCardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={selectedChantiers.includes(chantier.id)}
                            onChange={() => handleSelectChantier(chantier.id)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{chantier.nom}</h3>
                              <span className="px-2 py-1 text-xs font-medium rounded-full border">
                                {chantier.code}
                              </span>
                              {chantier.numeroExterne && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-800">
                                  {chantier.numeroExterne}
                                </span>
                              )}
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(chantier.statut)}`}>
                                <StatusIcon className="h-3 w-3 inline mr-1" />
                                {getStatusLabel(chantier.statut)}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{chantier.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">{chantier.clientNom}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">{chantier.ville}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {chantier.dateDebut ? new Date(chantier.dateDebut).toLocaleDateString('fr-FR') : 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {chantier.montant ? new Intl.NumberFormat('fr-FR', { 
                                    style: 'currency', 
                                    currency: chantier.devise,
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                  }).format(chantier.montant) : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <GestalisButton 
                          onClick={() => handleViewChantier(chantier)}
                          variant="outline" 
                          size="sm" 
                          className="border-blue-500 text-blue-600 hover:bg-blue-50"
                          title="Visualiser"
                        >
                          <Eye className="h-4 w-4" />
                        </GestalisButton>
                        <GestalisButton 
                          onClick={() => handleEditChantier(chantier)}
                          variant="outline" 
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </GestalisButton>
                        <GestalisButton 
                          onClick={() => handleDeleteChantier(chantier.id)}
                          variant="danger" 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700 text-white"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </GestalisButton>
                      </div>
                    </div>
                  </GestalisCardContent>
                </GestalisCard>
              );
            })}
          </div>
        )}

        {/* Boutons d'action en bas */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-3">
            <button 
              onClick={handleImportChantiers}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importer
            </button>
            <button 
              onClick={handleExportChantiers}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredChantiers.length} chantier(s) affiché(s) sur {chantiers.length} total
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chantiers; 