import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, FileText, Download, Upload, AlertCircle, CheckCircle, Clock, XCircle, DollarSign, Building2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../../components/ui/GestalisCard';
import { GestalisButton } from '../../../components/ui/gestalis-button';
import { Input } from '../../../components/ui/input';

const Cessions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCessions, setSelectedCessions] = useState([]);
  const [cessions, setCessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredCessions, setFilteredCessions] = useState([]);

  // Charger les cessions depuis localStorage au montage
  useEffect(() => {
    const cessionsLocal = localStorage.getItem('gestalis-cessions');
    if (cessionsLocal) {
      try {
        const cessionsParsed = JSON.parse(cessionsLocal);
        setCessions(cessionsParsed);
        setFilteredCessions(cessionsParsed);
        console.log('✅ Cessions chargées depuis localStorage:', cessionsParsed);
      } catch (error) {
        console.error('Erreur lors du parsing localStorage:', error);
        localStorage.removeItem('gestalis-cessions');
      }
    }
  }, []);

  // Filtrage des cessions
  useEffect(() => {
    const filtered = cessions.filter(cession => {
      const matchesSearch = cession.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cession.clientNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cession.chantierNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cession.fournisseurNom?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || cession.statut === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredCessions(filtered);
  }, [cessions, searchTerm, selectedStatus]);

  const handleNouvelleCession = () => {
    console.log('🚀 Navigation vers création cession...');
    try {
      navigate('/achats/cession-creance/nouvelle');
    } catch (error) {
      console.error('❌ Erreur de navigation:', error);
      window.location.href = '/achats/cession-creance/nouvelle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_COURS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TERMINEE': return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ANNULEE': return 'bg-red-100 text-red-800 border-red-200';
      case 'SUSPENDUE': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINEE': return 'Terminée';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULEE': return 'Annulée';
      case 'SUSPENDUE': return 'Suspendue';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'EN_COURS': return Clock;
      case 'TERMINEE': return CheckCircle;
      case 'EN_ATTENTE': return AlertCircle;
      case 'ANNULEE': return XCircle;
      case 'SUSPENDUE': return Clock;
      default: return AlertCircle;
    }
  };

  const handleSelectCession = (id) => {
    setSelectedCessions(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllCessions = () => {
    if (selectedCessions.length === filteredCessions.length) {
      setSelectedCessions([]);
    } else {
      setSelectedCessions(filteredCessions.map(c => c.id));
    }
  };

  const handleDeleteBulkCessions = () => {
    if (selectedCessions.length === 0) {
      alert('Aucune cession sélectionnée');
      return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCessions.length} cession(s) ?`)) {
      setCessions(prev => prev.filter(c => !selectedCessions.includes(c.id)));
      setSelectedCessions([]);
      alert(`${selectedCessions.length} cession(s) supprimée(s) avec succès !`);
    }
  };

  const handleExportCessions = () => {
    if (selectedCessions.length === 0) {
      alert('Veuillez sélectionner au moins une cession à exporter');
      return;
    }
    alert(`Export de ${selectedCessions.length} cession(s) en cours...`);
  };

  const handleImportCessions = () => {
    alert('Fonctionnalité d\'import en cours de développement');
  };

  const handleViewCession = (cession) => {
    console.log('Voir cession:', cession);
    navigate(`/achats/cession-creance/${cession.id}`);
  };

  const handleEditCession = (cession) => {
    console.log('Modifier cession:', cession);
    navigate(`/achats/cession-creance/${cession.id}/modifier`);
  };

  const handleDeleteCession = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette cession ?')) {
      try {
        setLoading(true);
        
        // Supprimer du localStorage
        const cessionsUpdated = cessions.filter(c => c.id !== id);
        setCessions(cessionsUpdated);
        localStorage.setItem('gestalis-cessions', JSON.stringify(cessionsUpdated));
        
        alert('✅ Cession supprimée avec succès !');
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
    if (cessions.length === 0) {
      const cessionsTest = [
        {
          id: 1,
          reference: 'CC-2024-001',
          dateCreation: '2024-01-15',
          clientNom: 'Promoteur ABC',
          chantierNom: 'Résidence Les Jardins',
          fournisseurNom: 'Entreprise Construction XYZ',
          montant: 150000,
          devise: 'EUR',
          statut: 'EN_COURS',
          dateEcheance: '2024-06-30',
          description: 'Cession de créance pour travaux de maçonnerie'
        },
        {
          id: 2,
          reference: 'CC-2024-002',
          dateCreation: '2024-02-01',
          clientNom: 'Groupe Commercial DEF',
          chantierNom: 'Centre Commercial Central',
          fournisseurNom: 'Société Électricité GHI',
          montant: 75000,
          devise: 'EUR',
          statut: 'TERMINEE',
          dateEcheance: '2024-05-15',
          description: 'Cession de créance pour installation électrique'
        },
        {
          id: 3,
          reference: 'CC-2024-003',
          dateCreation: '2024-03-10',
          clientNom: 'Société Immobilière JKL',
          chantierNom: 'Immeuble de Bureaux',
          fournisseurNom: 'Entreprise Plomberie MNO',
          montant: 45000,
          devise: 'EUR',
          statut: 'EN_ATTENTE',
          dateEcheance: '2024-07-31',
          description: 'Cession de créance pour travaux de plomberie'
        }
      ];
      
      setCessions(cessionsTest);
      setFilteredCessions(cessionsTest);
      localStorage.setItem('gestalis-cessions', JSON.stringify(cessionsTest));
      console.log('📊 Cessions de test chargées:', cessionsTest);
    }
  }, [cessions.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Contenu principal */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Barre de recherche et filtres */}
          <GestalisCard className="bg-white border-0 shadow-sm">
            <GestalisCardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une cession..."
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
                    <option value="TERMINEE">Terminée</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="SUSPENDUE">Suspendue</option>
                    <option value="ANNULEE">Annulée</option>
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
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{cessions.length}</p>
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
                      {cessions.filter(c => c.statut === 'EN_COURS').length}
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
                    <p className="text-sm font-medium text-gray-600">Terminées</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {cessions.filter(c => c.statut === 'TERMINEE').length}
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
                      }).format(cessions.reduce((sum, c) => sum + (c.montant || 0), 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton d'ajout */}
            <GestalisButton 
              onClick={handleNouvelleCession}
              className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nouvelle Cession
            </GestalisButton>
          </div>

          {/* Actions en lot */}
          {selectedCessions.length > 0 && (
            <GestalisCard className="bg-blue-50 border-blue-200">
              <GestalisCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      {selectedCessions.length} cession(s) sélectionnée(s)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <GestalisButton
                      onClick={handleExportCessions}
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </GestalisButton>
                    <GestalisButton
                      onClick={handleDeleteBulkCessions}
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

          {/* Liste des cessions */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredCessions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune cession trouvée</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Aucune cession ne correspond à vos critères de recherche'
                  : 'Commencez par ajouter votre première cession'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && (
                <GestalisButton 
                  onClick={handleNouvelleCession}
                  className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une cession
                </GestalisButton>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCessions.map((cession) => {
                const StatusIcon = getStatusIcon(cession.statut);
                return (
                  <GestalisCard key={cession.id} className="hover:shadow-md transition-all duration-300 border-0 bg-white">
                    <GestalisCardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{cession.reference}</h3>
                            <div className="flex gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(cession.statut)}`}>
                                <StatusIcon className="h-3 w-3 inline mr-1" />
                                {getStatusText(cession.statut)}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {cession.montant ? new Intl.NumberFormat('fr-FR', { 
                                  style: 'currency', 
                                  currency: cession.devise,
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                }).format(cession.montant) : 'N/A'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{cession.clientNom}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{cession.chantierNom}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{cession.fournisseurNom}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {cession.dateEcheance ? new Date(cession.dateEcheance).toLocaleDateString('fr-FR') : 'N/A'}
                              </span>
                            </div>
                          </div>
                          
                          {cession.description && (
                            <p className="text-sm text-gray-600 mt-4">{cession.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <input
                            type="checkbox"
                            checked={selectedCessions.includes(cession.id)}
                            onChange={() => handleSelectCession(cession.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <GestalisButton 
                            onClick={() => handleViewCession(cession)}
                            variant="outline" 
                            size="sm" 
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            title="Visualiser"
                          >
                            <Eye className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton 
                            onClick={() => handleEditCession(cession)}
                            variant="outline" 
                            size="sm"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </GestalisButton>
                          <GestalisButton 
                            onClick={() => handleDeleteCession(cession.id)}
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

          {/* Boutons d'action */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button 
                onClick={handleImportCessions}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importer
              </button>
            </div>
            
            <button 
              onClick={handleNouvelleCession}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Nouvelle Cession
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cessions;
