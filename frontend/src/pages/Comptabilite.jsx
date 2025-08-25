import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  FileSpreadsheet,
  Calendar,
  Building2,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Plus,
  Trash2,
  History,
  BarChart3
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import facturesService from '../services/facturesService';
import batchesComptablesService from '../services/batchesComptablesService';
import PreviewEcrituresModal from '../components/comptabilite/PreviewEcrituresModal';
import HistoriqueFactureModal from '../components/comptabilite/HistoriqueFactureModal';
import StatistiquesModal from '../components/comptabilite/StatistiquesModal';

const Comptabilite = () => {
  // États principaux
  const [factures, setFactures] = useState([]);
  const [facturesFiltrees, setFacturesFiltrees] = useState([]);
  const [selectedFactures, setSelectedFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États des filtres
  const [filtres, setFiltres] = useState({
    statutComptable: '',
    typePiece: '',
    periode: 'mois',
    fournisseur: '',
    montantMin: '',
    montantMax: ''
  });
  
  // États des modales
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showHistoriqueModal, setShowHistoriqueModal] = useState(false);
  const [showStatistiquesModal, setShowStatistiquesModal] = useState(false);
  
  // États des données
  const [statistiques, setStatistiques] = useState({});
  const [historiqueBatches, setHistoriqueBatches] = useState([]);
  const [facturePreview, setFacturePreview] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    chargerDonnees();
  }, []);

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    appliquerFiltres();
  }, [filtres, factures]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      
      // Charger les factures
      const facturesData = facturesService.obtenirFactures();
      setFactures(facturesData);
      
      // Charger les statistiques
      const stats = facturesService.obtenirStatistiques();
      setStatistiques(stats);
      
      // Charger l'historique des batches
      const batches = batchesComptablesService.obtenirHistorique();
      setHistoriqueBatches(batches);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour comptabiliser les factures sélectionnées
  const handleComptabiliser = async () => {
    if (selectedFactures.length === 0) {
      alert('Veuillez sélectionner au moins une facture à comptabiliser');
      return;
    }

    try {
      setLoading(true);
      
      // Créer un nouveau batch de comptabilisation
      const batch = {
        id: Date.now().toString(),
        dateCreation: new Date().toISOString(),
        statut: 'EN_COURS',
        factures: selectedFactures,
        utilisateur: 'Utilisateur actuel',
        format: 'CSV'
      };

      // Sauvegarder le batch
      const batchesService = await import('../services/batchesComptablesService');
      await batchesService.default.creerBatch(batch);

      // Marquer les factures comme "En cours"
      const facturesService = await import('../services/facturesService');
      for (const factureId of selectedFactures) {
        await facturesService.default.mettreAJourStatutComptable(
          factureId, 
          'EN_COURS'
        );
      }

      // Ouvrir la modal de prévisualisation
      setSelectedFactures([]);
      setShowPreviewModal(true);
      
      // Recharger les factures
      chargerDonnees();
      
    } catch (error) {
      console.error('Erreur lors de la comptabilisation:', error);
      alert('Erreur lors de la comptabilisation');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour sélectionner une facture
  const handleSelectFacture = (factureId) => {
    setSelectedFactures(prev => {
      if (prev.includes(factureId)) {
        return prev.filter(id => id !== factureId);
      } else {
        return [...prev, factureId];
      }
    });
  };

  // Fonction pour ouvrir la modal de prévisualisation
  const handlePreview = (facture) => {
    setFacturePreview(facture);
    setShowPreviewModal(true);
  };

  // Fonction pour ouvrir la modal d'historique
  const handleHistorique = (facture) => {
    setFacturePreview(facture);
    setShowHistoriqueModal(true);
  };

  // Ouvrir la modal de statistiques
  const handleStatistiques = () => {
    setShowStatistiquesModal(true);
  };

  // Fonction pour sélectionner/désélectionner toutes les factures
  const handleSelectionToutes = (isSelected) => {
    if (isSelected) {
      setSelectedFactures(facturesFiltrees.map(f => f.id));
    } else {
      setSelectedFactures([]);
    }
  };

  // Fonction pour appliquer les filtres
  const appliquerFiltres = () => {
    // Logique de filtrage à implémenter
    console.log('Filtres appliqués:', filtres);
  };

  // Réinitialiser les filtres
  const reinitialiserFiltres = () => {
    setFiltres({
      statutComptable: '',
      typePiece: '',
      periode: 'mois',
      fournisseur: '',
      montantMin: '',
      montantMax: ''
    });
  };

  // Obtenir la couleur du statut comptable
  const getStatutColor = (statut) => {
    switch (statut) {
      case 'NON_COMPTABILISEE': return 'bg-gray-100 text-gray-800';
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPTABILISEE': return 'bg-green-100 text-green-800';
      case 'ERREUR': return 'bg-red-100 text-red-800';
      case 'ANNULEE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir le texte du statut
  const getStatutText = (statut) => {
    switch (statut) {
      case 'NON_COMPTABILISEE': return 'Non comptabilisée';
      case 'EN_COURS': return 'En cours';
      case 'COMPTABILISEE': return 'Comptabilisée';
      case 'ERREUR': return 'Erreur';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
    }
  };

  // Obtenir l'icône du statut
  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'NON_COMPTABILISEE': return <Clock className="h-4 w-4" />;
      case 'EN_COURS': return <AlertCircle className="h-4 w-4" />;
      case 'COMPTABILISEE': return <CheckCircle className="h-4 w-4" />;
      case 'ERREUR': return <X className="h-4 w-4" />;
      case 'ANNULEE': return <Trash2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la comptabilité...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calculator className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Comptabilité</h1>
                <p className="text-blue-100 text-lg">Gestion des écritures comptables et export</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowStatistiquesModal(true)}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistiques
              </Button>
              <Button
                onClick={() => setShowHistoriqueModal(true)}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <History className="h-4 w-4 mr-2" />
                Historique
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GestalisCard>
            <GestalisCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Factures</p>
                  <p className="text-2xl font-bold text-gray-900">{statistiques.total || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          <GestalisCard>
            <GestalisCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Non Comptabilisées</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistiques.parStatut?.NON_COMPTABILISEE || 0}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          <GestalisCard>
            <GestalisCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Comptabilisées</p>
                  <p className="text-2xl font-bold text-green-600">{statistiques.parStatut?.COMPTABILISEE || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          <GestalisCard>
            <GestalisCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Montant Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(statistiques.montantTotal || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FileSpreadsheet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>
        </div>

        {/* Filtres */}
        <GestalisCard className="mb-8">
          <GestalisCardHeader>
            <GestalisCardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres de recherche
            </GestalisCardTitle>
          </GestalisCardHeader>
          <GestalisCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={filtres.statutComptable}
                  onChange={(e) => setFiltres(prev => ({ ...prev, statutComptable: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Tous</option>
                  <option value="NON_COMPTABILISEE">Non comptabilisée</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="COMPTABILISEE">Comptabilisée</option>
                  <option value="ERREUR">Erreur</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filtres.typePiece}
                  onChange={(e) => setFiltres(prev => ({ ...prev, typePiece: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Tous</option>
                  <option value="FACTURE_ACHAT">Facture d'achat</option>
                  <option value="AVOIR_FOURNISSEUR">Avoir fournisseur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                <Input
                  placeholder="Rechercher..."
                  value={filtres.fournisseur}
                  onChange={(e) => setFiltres(prev => ({ ...prev, fournisseur: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                <Input
                  type="date"
                  value={filtres.dateDebut}
                  onChange={(e) => setFiltres(prev => ({ ...prev, dateDebut: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                <Input
                  type="date"
                  value={filtres.dateFin}
                  onChange={(e) => setFiltres(prev => ({ ...prev, dateFin: e.target.value }))}
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => setFiltres({
                    statutComptable: '',
                    typePiece: '',
                    fournisseur: '',
                    dateDebut: '',
                    dateFin: '',
                    montantMin: '',
                    montantMax: ''
                  })}
                  variant="outline"
                  className="w-full"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </GestalisCardContent>
        </GestalisCard>

        {/* Actions en lot */}
        {selectedFactures.length > 0 && (
          <GestalisCard className="mb-6">
            <GestalisCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {selectedFactures.length} facture(s) sélectionnée(s)
                  </span>
                  <Button
                    onClick={() => setSelectedFactures([])}
                    variant="outline"
                    size="sm"
                  >
                    Désélectionner
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      // TODO: Prévisualiser les écritures en lot
                      alert('Prévisualisation en lot à implémenter');
                    }}
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </Button>
                  <Button
                    onClick={() => {
                      // TODO: Comptabiliser en lot
                      alert('Comptabilisation en lot à implémenter');
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Comptabiliser
                  </Button>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>
        )}

        {/* Tableau des factures */}
        <GestalisCard>
          <GestalisCardHeader>
            <div className="flex items-center justify-between">
              <GestalisCardTitle>
                Factures ({facturesFiltrees.length})
              </GestalisCardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => facturesService.exporterCSV(facturesFiltrees)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </GestalisCardHeader>
          <GestalisCardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedFactures.length === facturesFiltrees.length && facturesFiltrees.length > 0}
                        onChange={handleSelectionToutes}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      N° Pièce
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fournisseur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chantier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut Comptable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facturesFiltrees.map((facture) => (
                    <tr key={facture.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFactures.includes(facture.id)}
                          onChange={() => handleSelectFacture(facture.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {facture.numeroPiece}
                        </div>
                        <div className="text-sm text-gray-500">
                          {facture.numeroFacture}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {facture.fournisseur.raisonSociale}
                            </div>
                            <div className="text-sm text-gray-500">
                              {facture.fournisseur.compteFournisseur}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {facture.chantier.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {facture.chantier.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(facture.dateFacture).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {facture.montantTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </div>
                        <div className="text-sm text-gray-500">
                          HT: {facture.montantHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(facture.statutComptable)}`}>
                          {getStatutIcon(facture.statutComptable)}
                          <span className="ml-1">{getStatutText(facture.statutComptable)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handlePreview(facture)}
                            variant="outline"
                            size="sm"
                            disabled={facture.statutComptable === 'COMPTABILISEE'}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleHistorique(facture)}
                            variant="outline"
                            size="sm"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GestalisCardContent>
        </GestalisCard>
      </div>

      {/* Modales */}
      <PreviewEcrituresModal
        facture={facturePreview}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onComptabiliser={handleComptabiliser}
      />

      <HistoriqueFactureModal
        facture={facturePreview}
        isOpen={showHistoriqueModal}
        onClose={() => setShowHistoriqueModal(false)}
      />

      <StatistiquesModal
        isOpen={showStatistiquesModal}
        onClose={() => setShowStatistiquesModal(false)}
      />
    </div>
  );
};

export default Comptabilite;
