import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, ShoppingCart, Calendar, DollarSign, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Commandes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCommandes, setSelectedCommandes] = useState([]);
  const [commandes, setCommandes] = useState([]); // Liste vide au départ

  const handleNouveauBonCommande = () => {
    console.log('🚀 Navigation vers création bon de commande...');
    try {
      navigate('/achats/creation-bon-commande');
    } catch (error) {
      console.error('❌ Erreur de navigation:', error);
      window.location.href = '/achats/creation-bon-commande';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Validé': return 'bg-blue-100 text-blue-800';
      case 'Livré': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'En attente': return 'En attente';
      case 'Validé': return 'Validé';
      case 'Livré': return 'Livré';
      default: return 'Inconnu';
    }
  };

  const handleSelectCommande = (id) => {
    setSelectedCommandes(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllCommandes = () => {
    if (selectedCommandes.length === commandes.length) {
      setSelectedCommandes([]);
    } else {
      setSelectedCommandes(commandes.map(c => c.id));
    }
  };

  const handleDeleteBulkCommandes = () => {
    if (selectedCommandes.length === 0) {
      alert('Aucun bon de commande sélectionné');
      return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCommandes.length} bon(s) de commande ?`)) {
      setCommandes(prev => prev.filter(c => !selectedCommandes.includes(c.id)));
      setSelectedCommandes([]);
      alert(`${selectedCommandes.length} bon(s) de commande supprimé(s) avec succès !`);
    }
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
                    placeholder="Rechercher un bon de commande..."
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
                  <option value="Validé">Validé</option>
                  <option value="Livré">Livré</option>
                </select>
                
                <button className="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 rounded-xl transition-colors flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Plus de filtres
                </button>
              </div>
            </div>
          </div>

          {/* Barre de sélection multiple - Même style que Fournisseurs */}
          {commandes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCommandes.length === commandes.length && commandes.length > 0}
                      onChange={handleSelectAllCommandes}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedCommandes.length === 0 
                        ? 'Sélectionner tout' 
                        : `${selectedCommandes.length} sur ${commandes.length} sélectionné(s)`
                      }
                    </span>
                  </label>
        </div>
                
                {selectedCommandes.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {selectedCommandes.length} bon(s) de commande sélectionné(s)
                    </span>
                    <button 
                      onClick={handleDeleteBulkCommandes}
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

          {/* Bouton nouveau - Même style que Fournisseurs */}
          <div className="flex justify-end">
          <button 
              onClick={handleNouveauBonCommande}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
              <Plus className="h-5 w-5" />
            Nouveau Bon de Commande
          </button>
        </div>

          {/* Contenu principal - Affichage conditionnel comme Fournisseurs */}
          {commandes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun bon de commande</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par créer votre premier bon de commande'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && (
                <button 
                  onClick={handleNouveauBonCommande}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Créer un bon de commande
                </button>
              )}
            </div>
          ) : (
            /* Table des bons de commande - Même style que Fournisseurs */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Bons de commande</h2>
                <p className="text-sm text-gray-600 mt-1">Liste des commandes fournisseurs</p>
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
                        Date
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {commandes.map((commande) => (
                      <tr key={commande.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedCommandes.includes(commande.id)}
                              onChange={() => handleSelectCommande(commande.id)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-900">{commande.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{commande.fournisseur}</div>
                              <div className="text-sm text-gray-500">{commande.codeFournisseur} • {commande.siret}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{commande.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(commande.montant)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(commande.status)}`}>
                            {getStatusText(commande.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{commande.echeance}</span>
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

export default Commandes; 