import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, MapPin, Calendar, DollarSign, Building2, Download, Upload, FileText, AlertCircle, Users, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../components/ui/GestalisCard';
import { GestalisButton } from '../../components/ui/gestalis-button';
import { Input } from '../../components/ui/input';

const Chantiers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedChantiers, setSelectedChantiers] = useState([]);
  const [chantiers, setChantiers] = useState([]); // Liste vide au départ
  const [loading, setLoading] = useState(false);

  // États pour la gestion des chantiers
  const [filteredChantiers, setFilteredChantiers] = useState([]);
  const [showDeleteBulkModal, setShowDeleteBulkModal] = useState(false);

  // Charger les chantiers depuis localStorage au montage
  useEffect(() => {
    const chantiersLocal = localStorage.getItem('gestalis-chantiers');
    if (chantiersLocal) {
      try {
        const chantiersParsed = JSON.parse(chantiersLocal);
        setChantiers(chantiersParsed);
        setFilteredChantiers(chantiersParsed);
        console.log('✅ Chantiers chargés depuis localStorage:', chantiersParsed);
      } catch (error) {
        console.error('Erreur lors du parsing localStorage:', error);
        localStorage.removeItem('gestalis-chantiers');
      }
    }
  }, []);

  // Filtrage des chantiers
  useEffect(() => {
    const filtered = chantiers.filter(chantier => {
      const matchesSearch = chantier.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chantier.codeChantier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chantier.clientNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chantier.ville?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || chantier.statut === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredChantiers(filtered);
  }, [chantiers, searchTerm, selectedStatus]);

  const handleNouveauChantier = () => {
    console.log('🚀 Navigation vers création chantier...');
    try {
      navigate('/achats/chantiers/nouveau');
    } catch (error) {
      console.error('❌ Erreur de navigation:', error);
      window.location.href = '/achats/chantiers/nouveau';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_COURS': return 'bg-blue-100 text-blue-800';
      case 'TERMINE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDU': return 'bg-red-100 text-red-800';
      case 'PLANIFIE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'EN_ATTENTE': return 'En attente';
      case 'SUSPENDU': return 'Suspendu';
      case 'PLANIFIE': return 'Planifié';
      default: return 'Inconnu';
    }
  };

  const handleSelectChantier = (id) => {
    setSelectedChantiers(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllChantiers = () => {
    if (selectedChantiers.length === filteredChantiers.length) {
      setSelectedChantiers([]);
    } else {
      setSelectedChantiers(filteredChantiers.map(c => c.id));
    }
  };

  const handleDeleteBulkChantiers = () => {
    if (selectedChantiers.length === 0) {
      alert('Aucun chantier sélectionné');
      return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedChantiers.length} chantier(s) ?`)) {
      setChantiers(prev => prev.filter(c => !selectedChantiers.includes(c.id)));
      setSelectedChantiers([]);
      alert(`${selectedChantiers.length} chantier(s) supprimé(s) avec succès !`);
    }
  };

  const handleExportChantiers = () => {
    if (selectedChantiers.length === 0) {
      alert('Veuillez sélectionner au moins un chantier à exporter');
      return;
    }
    alert(`Export de ${selectedChantiers.length} chantier(s) en cours...`);
  };

  const handleImportChantiers = () => {
    alert('Fonctionnalité d\'import en cours de développement');
  };

  const handleViewChantier = (chantier) => {
    console.log('Voir chantier:', chantier);
    // TODO: Implémenter la vue détaillée
    alert(`Vue détaillée du chantier: ${chantier.nom}`);
  };

  const handleEditChantier = (chantier) => {
    console.log('Modifier chantier:', chantier);
    // TODO: Implémenter l'édition
    alert(`Édition du chantier: ${chantier.nom}`);
  };

  const handleDeleteChantier = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chantier ?')) {
      try {
        setLoading(true);
        
        // Supprimer du localStorage
        const chantiersUpdated = chantiers.filter(c => c.id !== id);
        setChantiers(chantiersUpdated);
        localStorage.setItem('gestalis-chantiers', JSON.stringify(chantiersUpdated));
        
        alert('✅ Chantier supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('❌ Erreur lors de la suppression');
      } finally {
        setLoading(false);
      }
    }
  };

  // Données de test pour démarrer
  useEffect(() => {
    if (chantiers.length === 0) {
      const chantiersTest = [
        {
          id: 1,
          nom: 'Résidence Les Jardins',
          codeChantier: 'CH-2024-001',
          adresse: '123 Rue de la Paix',
          codePostal: '75001',
          ville: 'Paris',
          clientNom: 'Promoteur ABC',
          dateDebut: '2024-01-15',
          dateFin: '2024-12-31',
          montant: 2500000,
          devise: 'EUR',
          statut: 'EN_COURS',
          description: 'Construction d\'une résidence de 50 logements'
        },
        {
          id: 2,
          nom: 'Centre Commercial Central',
          codeChantier: 'CH-2024-002',
          adresse: '456 Avenue des Champs',
          codePostal: '69000',
          ville: 'Lyon',
          clientNom: 'Groupe Commercial XYZ',
          dateDebut: '2024-03-01',
          dateFin: '2025-06-30',
          montant: 5000000,
          devise: 'EUR',
          statut: 'PLANIFIE',
          description: 'Rénovation et extension du centre commercial'
        },
        {
          id: 3,
          nom: 'Immeuble de Bureaux',
          codeChantier: 'CH-2024-003',
          adresse: '789 Boulevard Maritime',
          codePostal: '13000',
          ville: 'Marseille',
          clientNom: 'Société Immobilière DEF',
          dateDebut: '2023-09-01',
          dateFin: '2024-08-31',
          montant: 1800000,
          devise: 'EUR',
          statut: 'TERMINE',
          description: 'Construction d\'un immeuble de bureaux de 3000m²'
        }
      ];
      
      setChantiers(chantiersTest);
      setFilteredChantiers(chantiersTest);
      localStorage.setItem('gestalis-chantiers', JSON.stringify(chantiersTest));
      console.log('📊 Chantiers de test chargés:', chantiersTest);
    }
  }, [chantiers.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Contenu principal */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Barre de recherche et filtres - Même style que Fournisseurs */}
          <GestalisCard className="bg-white border-0 shadow-sm">
            <GestalisCardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un chantier..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="TERMINE">Terminé</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="SUSPENDU">Suspendu</option>
                    <option value="PLANIFIE">Planifié</option>
                  </select>
                  
                  <GestalisButton 
                    variant="outline" 
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Plus de filtres
                  </GestalisButton>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* En-tête avec statistiques et bouton d'ajout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{chantiers.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">En cours</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {chantiers.filter(c => c.statut === 'EN_COURS').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Terminés</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {chantiers.filter(c => c.statut === 'TERMINE').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Montant total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(chantiers.reduce((sum, c) => sum + (c.montant || 0), 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton d'ajout */}
            <GestalisButton 
              onClick={handleNouveauChantier}
              className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nouveau Chantier
            </GestalisButton>
          </div>

          {/* Actions en lot */}
          {selectedChantiers.length > 0 && (
            <GestalisCard className="bg-blue-50 border-blue-200">
              <GestalisCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      {selectedChantiers.length} chantier(s) sélectionné(s)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <GestalisButton
                      onClick={handleExportChantiers}
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </GestalisButton>
                    <GestalisButton
                      onClick={handleDeleteBulkChantiers}
                      variant="danger"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </GestalisButton>
                  </div>
                </div>
              </GestalisCardContent>
            </GestalisCard>
          )}

          {/* Liste des chantiers */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredChantiers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun chantier trouvé</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Aucun chantier ne correspond à vos critères de recherche'
                  : 'Commencez par ajouter votre premier chantier'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && (
                <GestalisButton 
                  onClick={handleNouveauChantier}
                  className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un chantier
                </GestalisButton>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredChantiers.map((chantier) => (
                <GestalisCard key={chantier.id} className="hover:shadow-md transition-all duration-300 border-0 bg-white">
                  <GestalisCardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">{chantier.nom}</h3>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(chantier.statut)}`}>
                              {getStatusText(chantier.statut)}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {chantier.codeChantier}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{chantier.clientNom}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{chantier.ville}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {chantier.dateDebut ? new Date(chantier.dateDebut).toLocaleDateString('fr-FR') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {chantier.montant ? new Intl.NumberFormat('fr-FR', { 
                                style: 'currency', 
                                currency: chantier.devise,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              }).format(chantier.montant) : 'N/A'}
                            </span>
                          </div>
                        </div>
                        
                        {chantier.description && (
                          <p className="text-sm text-gray-600 mt-4">{chantier.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <input
                          type="checkbox"
                          checked={selectedChantiers.includes(chantier.id)}
                          onChange={() => handleSelectChantier(chantier.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
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
              ))}
            </div>
          )}

          {/* Boutons d'action - Même style que Fournisseurs */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button 
                onClick={handleImportChantiers}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importer
              </button>
            </div>
            
            <button 
              onClick={handleNouveauChantier}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Nouveau Chantier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chantiers;
