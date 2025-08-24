import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Receipt, Calendar, DollarSign, Building2, Download, Upload, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Factures = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFactures, setSelectedFactures] = useState([]);
  const [factures, setFactures] = useState([]); // Liste vide au départ

  const handleNouvelleFacture = () => {
    console.log('🚀 Navigation vers création facture...');
    try {
      navigate('/achats/nouvelle-facture');
    } catch (error) {
      console.error('❌ Erreur de navigation:', error);
      window.location.href = '/achats/nouvelle-facture';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Validée': return 'bg-blue-100 text-blue-800';
      case 'Payée': return 'bg-green-100 text-green-800';
      case 'En retard': return 'bg-red-100 text-red-800';
      case 'Partiellement payée': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'En attente': return 'En attente';
      case 'Validée': return 'Validée';
      case 'Payée': return 'Payée';
      case 'En retard': return 'En retard';
      case 'Partiellement payée': return 'Partiellement payée';
      default: return 'Inconnu';
    }
  };

  const handleSelectFacture = (id) => {
    setSelectedFactures(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllFactures = () => {
    if (selectedFactures.length === factures.length) {
      setSelectedFactures([]);
    } else {
      setSelectedFactures(factures.map(f => f.id));
    }
  };

  const handleDeleteBulkFactures = () => {
    if (selectedFactures.length === 0) {
      alert('Aucune facture sélectionnée');
      return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFactures.length} facture(s) ?`)) {
      setFactures(prev => prev.filter(f => !selectedFactures.includes(f.id)));
      setSelectedFactures([]);
      alert(`${selectedFactures.length} facture(s) supprimée(s) avec succès !`);
    }
  };

  const handleExportFactures = () => {
    if (selectedFactures.length === 0) {
      alert('Veuillez sélectionner au moins une facture à exporter');
      return;
    }
    alert(`Export de ${selectedFactures.length} facture(s) en cours...`);
  };

  const handleImportFactures = () => {
    alert('Fonctionnalité d\'import en cours de développement');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Contenu principal */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Barre de recherche et filtres - Même style que Fournisseurs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une facture..."
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
                  <option value="En attente">En attente</option>
                  <option value="Validée">Validée</option>
                  <option value="Payée">Payée</option>
                  <option value="En retard">En retard</option>
                  <option value="Partiellement payée">Partiellement payée</option>
                </select>
                
                <button className="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 rounded-xl transition-colors flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Plus de filtres
                </button>
              </div>
            </div>
          </div>

          {/* Barre de sélection multiple - Même style que Fournisseurs */}
          {factures.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFactures.length === factures.length && factures.length > 0}
                      onChange={handleSelectAllFactures}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedFactures.length === 0 
                        ? 'Sélectionner tout' 
                        : `${selectedFactures.length} sur ${factures.length} sélectionnée(s)`
                      }
                    </span>
                  </label>
                </div>
                
                {selectedFactures.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {selectedFactures.length} facture(s) sélectionnée(s)
                    </span>
                    <button 
                      onClick={handleExportFactures}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Exporter
                    </button>
                    <button 
                      onClick={handleDeleteBulkFactures}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer la sélection
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Boutons d'action - Même style que Fournisseurs */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button 
                onClick={handleImportFactures}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importer
              </button>
            </div>
            
            <button 
              onClick={handleNouvelleFacture}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Nouvelle Facture
            </button>
          </div>

          {/* Contenu principal - Affichage conditionnel comme Fournisseurs */}
          {factures.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune facture</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par créer votre première facture fournisseur'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && (
                <button 
                  onClick={handleNouvelleFacture}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Créer une facture
                </button>
              )}
            </div>
          ) : (
            /* Table des factures - Même style que Fournisseurs */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Factures fournisseurs</h2>
                <p className="text-sm text-gray-600 mt-1">Liste des factures et suivi des paiements</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Référence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fournisseur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date facture
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant HT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Échéance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {factures.map((facture) => (
                      <tr key={facture.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedFactures.includes(facture.id)}
                              onChange={() => handleSelectFacture(facture.id)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-900">{facture.numero}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{facture.fournisseur}</div>
                              <div className="text-sm text-gray-500">{facture.codeFournisseur} • {facture.siret}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{facture.dateFacture}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(facture.montantHT)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(facture.statut)}`}>
                            {getStatusText(facture.statut)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{facture.echeance}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Factures;

