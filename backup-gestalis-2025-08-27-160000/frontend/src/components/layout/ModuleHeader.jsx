import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AchatsBanner } from '../../components/layout/ModuleBanner';

const Commandes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleNouveauBonCommande = () => {
    console.log('🚀 Navigation vers création bon de commande...');
    try {
      navigate('/achats/creation-bon-commande');
    } catch (error) {
      console.error('❌ Erreur de navigation:', error);
      window.location.href = '/achats/creation-bon-commande';
    }
  };

  // Données d'exemple pour les bons de commande
  const commandes = [
    {
      id: 'BC-2024-001',
      fournisseur: 'Béton Express',
      date: '15/01/2024',
      montant: 2500.00,
      status: 'En attente',
      echeance: '30/01/2024'
    },
    {
      id: 'BC-2024-002',
      fournisseur: 'Acier Pro',
      date: '12/01/2024',
      montant: 1800.00,
      status: 'Validé',
      echeance: '25/01/2024'
    },
    {
      id: 'BC-2024-003',
      fournisseur: 'Matériaux Plus',
      date: '10/01/2024',
      montant: 3200.00,
      status: 'Livré',
      echeance: '20/01/2024'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Validé': return 'bg-blue-100 text-blue-800';
      case 'Livré': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Bannière Achats avec dégradé bleu */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <AchatsBanner description="Gestion des bons de commande et suivi des achats">
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </button>
            </div>
          </AchatsBanner>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Barre d'outils */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Recherche et filtres */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un bon de commande..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="En attente">En attente</option>
                  <option value="Validé">Validé</option>
                  <option value="Livré">Livré</option>
                </select>
              </div>
              
              {/* Bouton nouveau */}
              <button 
                onClick={handleNouveauBonCommande}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="h-5 w-5" />
                Nouveau Bon de Commande
              </button>
            </div>
          </div>

          {/* Table des bons de commande */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Bons de commande</h2>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commandes.map((commande) => (
                    <tr key={commande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {commande.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {commande.fournisseur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {commande.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(commande.montant)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commande.status)}`}>
                          {commande.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {commande.echeance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
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
        </div>
      </div>
    </div>
  );
};

export default Commandes;
