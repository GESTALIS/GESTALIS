import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Truck,
  Building2,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../components/ui/GestalisCard';
import { GestalisButton } from '../../components/ui/gestalis-button';

const Commandes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Données de test pour les commandes
  const commandes = [
    {
      id: 1,
      numero: 'BC-040ABD43',
      objet: 'Commande matériaux fondation',
      fournisseur: 'BTP Matériaux Plus',
      chantier: 'Rue de la Paix',
      date_commande: '2024-01-15',
      date_livraison_souhaitee: '2024-01-22',
      date_livraison_reelle: '2024-01-20',
      montant_ht: 15000,
      montant_tva: 3000,
      montant_total: 18000,
      statut: 'confirme',
      conditions_paiement: '30 jours',
      delai_livraison: '1 semaine',
      description: 'Commande de matériaux pour les fondations du chantier'
    },
    {
      id: 2,
      numero: 'BC-7F8E9D2A',
      objet: 'Sous-traitance électricité',
      fournisseur: 'Sous-traitance Pro',
      chantier: 'Boulevard Central',
      date_commande: '2024-01-10',
      date_livraison_souhaitee: '2024-01-24',
      date_livraison_reelle: null,
      montant_ht: 25000,
      montant_tva: 5000,
      montant_total: 30000,
      statut: 'en_livraison',
      conditions_paiement: '45 jours',
      delai_livraison: '2 semaines',
      description: 'Installation électrique complète'
    },
    {
      id: 3,
      numero: 'BC-1A2B3C4D',
      objet: 'Services de terrassement',
      fournisseur: 'Services BTP Express',
      chantier: 'Avenue des Champs',
      date_commande: '2024-01-08',
      date_livraison_souhaitee: '2024-01-15',
      date_livraison_reelle: '2024-01-18',
      montant_ht: 8000,
      montant_tva: 1600,
      montant_total: 9600,
      statut: 'livree',
      conditions_paiement: '30 jours',
      delai_livraison: '1 semaine',
      description: 'Terrassement et préparation du terrain'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'brouillon': 'bg-gray-100 text-gray-800',
      'confirme': 'bg-blue-100 text-blue-800',
      'en_livraison': 'bg-yellow-100 text-yellow-800',
      'livree': 'bg-green-100 text-green-800',
      'annulee': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'brouillon': 'Brouillon',
      'confirme': 'Confirmé',
      'en_livraison': 'En livraison',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'brouillon': Clock,
      'confirme': CheckCircle,
      'en_livraison': Truck,
      'livree': Package,
      'annulee': AlertTriangle
    };
    return icons[status] || Clock;
  };

  const filteredCommandes = commandes.filter(commande => {
    const matchesSearch = commande.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commande.objet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commande.fournisseur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commande.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bons de commande</h1>
          <p className="text-gray-600 mt-2">Gestion des commandes fournisseurs</p>
        </div>
        <div className="flex gap-3">
          <GestalisButton variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </GestalisButton>
          <GestalisButton className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle commande
          </GestalisButton>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GestalisCard>
          <GestalisCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total commandes</p>
                <p className="text-2xl font-bold text-gray-900">{commandes.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-gestalis-accent bg-opacity-10">
                <ShoppingCart className="h-6 w-6 text-gestalis-accent" />
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En livraison</p>
                <p className="text-2xl font-bold text-gray-900">
                  {commandes.filter(c => c.statut === 'en_livraison').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Livrées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {commandes.filter(c => c.statut === 'livree').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Montant total</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{commandes.reduce((sum, c) => sum + c.montant_total, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gestalis-secondary bg-opacity-10">
                <DollarSign className="h-6 w-6 text-gestalis-secondary" />
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>
      </div>

      {/* Filtres et recherche */}
      <GestalisCard>
        <GestalisCardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, objet, fournisseur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gestalis-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gestalis-primary focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="brouillon">Brouillon</option>
                <option value="confirme">Confirmé</option>
                <option value="en_livraison">En livraison</option>
                <option value="livree">Livrée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
          </div>
        </GestalisCardContent>
      </GestalisCard>

      {/* Liste des commandes */}
      <div className="space-y-4">
        {filteredCommandes.length === 0 ? (
          <GestalisCard>
            <GestalisCardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande trouvée</p>
            </GestalisCardContent>
          </GestalisCard>
        ) : (
          filteredCommandes.map((commande) => {
            const StatusIcon = getStatusIcon(commande.statut);
            return (
              <GestalisCard key={commande.id} className="hover:shadow-md transition-shadow">
                <GestalisCardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{commande.numero}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(commande.statut)}`}>
                          {getStatusText(commande.statut)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Objet</p>
                          <p className="text-gray-900">{commande.objet}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Fournisseur</p>
                          <p className="text-gray-900">{commande.fournisseur}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Chantier</p>
                          <p className="text-gray-900">{commande.chantier}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Montant total</p>
                          <p className="text-lg font-semibold text-gray-900">€{commande.montant_total.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Commande: {commande.date_commande}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Livraison: {commande.date_livraison_souhaitee}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{commande.chantier}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-gray-600">Conditions de paiement: <span className="font-medium">{commande.conditions_paiement}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-600">Délai de livraison: <span className="font-medium">{commande.delai_livraison}</span></p>
                        </div>
                      </div>

                      {commande.description && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{commande.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <GestalisButton variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </GestalisButton>
                      <GestalisButton variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </GestalisButton>
                      <GestalisButton variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </GestalisButton>
                      <GestalisButton variant="danger" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </GestalisButton>
                    </div>
                  </div>
                </GestalisCardContent>
              </GestalisCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Commandes; 