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
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Users,
  Building,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

function GestionCommerciale() {
  const [prospects, setProspects] = useState([]);
  const [opportunites, setOpportunites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchCommercialData();
  }, []);

  const fetchCommercialData = async () => {
    try {
      // TODO: Remplacer par les vraies APIs
      // const responseProspects = await api.get('/api/prospects');
      // const responseOpportunites = await api.get('/api/opportunites');
      
      // Données de démonstration
      const mockProspects = [
        {
          id: 'prospect-1',
          nom: 'Entreprise Innovation',
          secteur: 'Technologie',
          potentiel: 'ÉLEVE',
          contact: 'Jean Dupont',
          telephone: '01 23 45 67 89',
          email: 'contact@innovation.com',
          status: 'EN_COURT',
          valeur: 50000,
          derniereAction: '2024-01-15'
        },
        {
          id: 'prospect-2',
          nom: 'Société Construction',
          secteur: 'BTP',
          potentiel: 'MOYEN',
          contact: 'Marie Martin',
          telephone: '01 98 76 54 32',
          email: 'm.martin@construction.fr',
          status: 'QUALIFIE',
          valeur: 25000,
          derniereAction: '2024-01-10'
        }
      ];

      const mockOpportunites = [
        {
          id: 'opp-1',
          nom: 'Projet Digital Transformation',
          prospect: 'Entreprise Innovation',
          montant: 50000,
          probabilite: 80,
          status: 'NEGOCIATION',
          dateCreation: '2024-01-15',
          echeance: '2024-03-15'
        },
        {
          id: 'opp-2',
          nom: 'Rénovation Bureaux',
          prospect: 'Société Construction',
          montant: 25000,
          probabilite: 60,
          status: 'PROPOSITION',
          dateCreation: '2024-01-10',
          echeance: '2024-02-10'
        }
      ];

      setProspects(mockProspects);
      setOpportunites(mockOpportunites);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données commerciales:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'EN_COURT': 'bg-blue-100 text-blue-800',
      'QUALIFIE': 'bg-green-100 text-green-800',
      'PROPOSITION': 'bg-yellow-100 text-yellow-800',
      'NEGOCIATION': 'bg-orange-100 text-orange-800',
      'GAGNE': 'bg-green-100 text-green-800',
      'PERDU': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'EN_COURT': 'En cours',
      'QUALIFIE': 'Qualifié',
      'PROPOSITION': 'Proposition',
      'NEGOCIATION': 'Négociation',
      'GAGNE': 'Gagné',
      'PERDU': 'Perdu'
    };
    return labels[status] || status;
  };

  const getPotentielColor = (potentiel) => {
    const colors = {
      'ÉLEVE': 'bg-green-100 text-green-800',
      'MOYEN': 'bg-yellow-100 text-yellow-800',
      'FAIBLE': 'bg-red-100 text-red-800'
    };
    return colors[potentiel] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion Commerciale</h1>
          <p className="text-gray-600">Analyse commerciale, marges et suivi des performances</p>
        </div>
        <div className="flex gap-2">
          <GestalisButton variant="secondary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau prospect
          </GestalisButton>
          <GestalisButton variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle opportunité
          </GestalisButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(75000)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prospects actifs</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opportunités</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </GestalisCardContent>
        </GestalisCard>

        <GestalisCard>
          <GestalisCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                <p className="text-2xl font-bold text-gray-900">18%</p>
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
                placeholder="Rechercher un prospect ou opportunité..."
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
              <option value="EN_COURT">En cours</option>
              <option value="QUALIFIE">Qualifié</option>
              <option value="PROPOSITION">Proposition</option>
              <option value="NEGOCIATION">Négociation</option>
              <option value="GAGNE">Gagné</option>
              <option value="PERDU">Perdu</option>
            </select>
            <GestalisButton variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Plus de filtres
            </GestalisButton>
          </div>
        </GestalisCardContent>
      </GestalisCard>

      {/* Prospects */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Prospects</h2>
        <div className="grid gap-4">
          {prospects.map((prospect) => (
            <GestalisCard key={prospect.id} className="hover:shadow-md transition-shadow">
              <GestalisCardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{prospect.nom}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                        {getStatusLabel(prospect.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPotentielColor(prospect.potentiel)}`}>
                        {prospect.potentiel}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{prospect.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{prospect.secteur}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(prospect.valeur)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Dernière action : {new Date(prospect.derniereAction).toLocaleDateString('fr-FR')}</span>
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

      {/* Opportunités */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Opportunités</h2>
        <div className="grid gap-4">
          {opportunites.map((opportunite) => (
            <GestalisCard key={opportunite.id} className="hover:shadow-md transition-shadow">
              <GestalisCardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{opportunite.nom}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunite.status)}`}>
                        {getStatusLabel(opportunite.status)}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {opportunite.probabilite}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{opportunite.prospect}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(opportunite.montant)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Créée le {new Date(opportunite.dateCreation).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>Échéance : {new Date(opportunite.echeance).toLocaleDateString('fr-FR')}</span>
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

export default GestionCommerciale;
