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
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

function Vente() {
  const [devis, setDevis] = useState([]);
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchVenteData();
  }, []);

  const fetchVenteData = async () => {
    try {
      // TODO: Remplacer par les vraies APIs
      // const responseDevis = await api.get('/api/devis');
      // const responseFactures = await api.get('/api/factures');
      
      // Données de démonstration
      const mockDevis = [
        {
          id: 'devis-1',
          numero: 'DEV-001',
          client: 'Entreprise ABC',
          montant: 15000,
          status: 'EN_COURS',
          dateCreation: '2024-01-15',
          validite: '2024-02-15'
        },
        {
          id: 'devis-2',
          numero: 'DEV-002',
          client: 'Société XYZ',
          montant: 8500,
          status: 'ACCEPTE',
          dateCreation: '2024-01-10',
          validite: '2024-02-10'
        }
      ];

      const mockFactures = [
        {
          id: 'facture-1',
          numero: 'FA-001',
          client: 'Entreprise ABC',
          montant: 15000,
          status: 'EMISE',
          dateEmission: '2024-01-15',
          echeance: '2024-02-15'
        },
        {
          id: 'facture-2',
          numero: 'FA-002',
          client: 'Société XYZ',
          montant: 8500,
          status: 'PAYEE',
          dateEmission: '2024-01-10',
          echeance: '2024-01-10'
        }
      ];

      setDevis(mockDevis);
      setFactures(mockFactures);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données de vente:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'EN_COURS': 'bg-yellow-100 text-yellow-800',
      'ACCEPTE': 'bg-green-100 text-green-800',
      'REFUSE': 'bg-red-100 text-red-800',
      'EMISE': 'bg-blue-100 text-blue-800',
      'PAYEE': 'bg-green-100 text-green-800',
      'EN_RETARD': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'EN_COURS': 'En cours',
      'ACCEPTE': 'Accepté',
      'REFUSE': 'Refusé',
      'EMISE': 'Émise',
      'PAYEE': 'Payée',
      'EN_RETARD': 'En retard'
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Vente</h1>
          <p className="text-gray-600">Gérez vos devis, factures et suivi commercial</p>
        </div>
        <div className="flex gap-2">
          <GestalisButton variant="secondary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau devis
          </GestalisButton>
          <GestalisButton variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle facture
          </GestalisButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CA Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(23500)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Devis en cours</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Factures émises</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                <p className="text-2xl font-bold text-gray-900">100%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </GestalisCardContent>
        </GestalisCard>
      </div>

      {/* Filtres */}
      <GestalisCard variant="neutral">
        <GestalisCardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un devis ou facture..."
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
              <option value="EN_COURS">En cours</option>
              <option value="ACCEPTE">Accepté</option>
              <option value="REFUSE">Refusé</option>
              <option value="EMISE">Émise</option>
              <option value="PAYEE">Payée</option>
            </select>
            <GestalisButton variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Plus de filtres
            </GestalisButton>
          </div>
        </GestalisCardContent>
      </GestalisCard>

      {/* Devis */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Devis</h2>
        <div className="grid gap-4">
          {devis.map((devis) => (
            <GestalisCard key={devis.id} className="hover:shadow-md transition-shadow">
              <GestalisCardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{devis.numero}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(devis.status)}`}>
                        {getStatusLabel(devis.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{devis.client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(devis.montant)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Créé le {new Date(devis.dateCreation).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Valide jusqu'au {new Date(devis.validite).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
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
          ))}
        </div>
      </div>

      {/* Factures */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Factures</h2>
        <div className="grid gap-4">
          {factures.map((facture) => (
            <GestalisCard key={facture.id} className="hover:shadow-md transition-shadow">
              <GestalisCardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{facture.numero}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(facture.status)}`}>
                        {getStatusLabel(facture.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{facture.client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(facture.montant)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Émise le {new Date(facture.dateEmission).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Échéance {new Date(facture.echeance).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default Vente;
