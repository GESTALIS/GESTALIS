import React, { useState } from 'react';
import { 
  FileText, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../components/ui/GestalisCard';
import { GestalisButton } from '../../components/ui/gestalis-button';

const DemandesPrix = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Données de test pour les demandes de prix
  const demandesPrix = [
    {
      id: 1,
      numero: 'DP-13428AD5',
      objet: 'Matériaux pour fondation',
      fournisseur: 'BTP Matériaux Plus',
      chantier: 'Rue de la Paix',
      date_demande: '2024-01-15',
      date_reponse: '2024-01-20',
      montant_ht: 15000,
      montant_tva: 3000,
      montant_total: 18000,
      statut: 'acceptee',
      description: 'Béton, ferraillage, coffrage pour fondations'
    },
    {
      id: 2,
      numero: 'DP-4704E395',
      objet: 'Services de terrassement',
      fournisseur: 'Services BTP Express',
      chantier: 'Avenue des Champs',
      date_demande: '2024-01-10',
      date_reponse: null,
      montant_ht: 8000,
      montant_tva: 1600,
      montant_total: 9600,
      statut: 'en_attente',
      description: 'Terrassement et préparation du terrain'
    },
    {
      id: 3,
      numero: 'DP-8F2A1B3C',
      objet: 'Installation électrique',
      fournisseur: 'Sous-traitance Pro',
      chantier: 'Boulevard Central',
      date_demande: '2024-01-08',
      date_reponse: '2024-01-12',
      montant_ht: 25000,
      montant_tva: 5000,
      montant_total: 30000,
      statut: 'refusee',
      description: 'Installation électrique complète'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'recue': 'bg-blue-100 text-blue-800',
      'acceptee': 'bg-green-100 text-green-800',
      'refusee': 'bg-red-100 text-red-800',
      'annulee': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'en_attente': 'En attente',
      'recue': 'Reçue',
      'acceptee': 'Acceptée',
      'refusee': 'Refusée',
      'annulee': 'Annulée'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'en_attente': Clock,
      'recue': FileText,
      'acceptee': CheckCircle,
      'refusee': AlertTriangle,
      'annulee': Trash2
    };
    return icons[status] || Clock;
  };

  const filteredDemandes = demandesPrix.filter(demande => {
    const matchesSearch = demande.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.objet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.fournisseur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || demande.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandes de prix</h1>
          <p className="text-gray-600 mt-2">Gestion des demandes de prix et devis fournisseurs</p>
        </div>
        <div className="flex gap-3">
          <GestalisButton variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </GestalisButton>
          <GestalisButton className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </GestalisButton>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GestalisCard>
          <GestalisCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total demandes</p>
                <p className="text-2xl font-bold text-gray-900">{demandesPrix.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-gestalis-primary bg-opacity-10">
                <FileText className="h-6 w-6 text-gestalis-primary" />
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {demandesPrix.filter(d => d.statut === 'en_attente').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {demandesPrix.filter(d => d.statut === 'acceptee').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
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
                  €{demandesPrix.reduce((sum, d) => sum + d.montant_total, 0).toLocaleString()}
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
                <option value="en_attente">En attente</option>
                <option value="recue">Reçue</option>
                <option value="acceptee">Acceptée</option>
                <option value="refusee">Refusée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
          </div>
        </GestalisCardContent>
      </GestalisCard>

      {/* Liste des demandes de prix */}
      <div className="space-y-4">
        {filteredDemandes.length === 0 ? (
          <GestalisCard>
            <GestalisCardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune demande de prix trouvée</p>
            </GestalisCardContent>
          </GestalisCard>
        ) : (
          filteredDemandes.map((demande) => {
            const StatusIcon = getStatusIcon(demande.statut);
            return (
              <GestalisCard key={demande.id} className="hover:shadow-md transition-shadow">
                <GestalisCardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{demande.numero}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demande.statut)}`}>
                          {getStatusText(demande.statut)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Objet</p>
                          <p className="text-gray-900">{demande.objet}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Fournisseur</p>
                          <p className="text-gray-900">{demande.fournisseur}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Chantier</p>
                          <p className="text-gray-900">{demande.chantier}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Montant total</p>
                          <p className="text-lg font-semibold text-gray-900">€{demande.montant_total.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Demande: {demande.date_demande}</span>
                        </div>
                        {demande.date_reponse && (
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Réponse: {demande.date_reponse}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{demande.chantier}</span>
                        </div>
                      </div>

                      {demande.description && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{demande.description}</p>
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
                        <Send className="h-4 w-4" />
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

export default DemandesPrix; 