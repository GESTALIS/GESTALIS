import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  X, 
  TrendingUp, 
  Calendar,
  Download,
  FileSpreadsheet,
  Calculator,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../ui/GestalisCard';
import { Button } from '../ui/button';
import facturesService from '../../services/facturesService';
import batchesComptablesService from '../../services/batchesComptablesService';

const StatistiquesModal = ({ isOpen, onClose }) => {
  const [statistiques, setStatistiques] = useState({});
  const [statistiquesBatches, setStatistiquesBatches] = useState({});
  const [periode, setPeriode] = useState('mois');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      chargerStatistiques();
    }
  }, [isOpen, periode]);

  const chargerStatistiques = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques des factures
      const statsFactures = facturesService.obtenirStatistiques();
      setStatistiques(statsFactures);
      
      // Charger les statistiques des batches
      const statsBatches = batchesComptablesService.obtenirStatistiques();
      setStatistiquesBatches(statsBatches);
      
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const exporterStatistiques = () => {
    const data = {
      factures: statistiques,
      batches: statistiquesBatches,
      periode: periode,
      dateExport: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `statistiques_comptabilite_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-bold">Statistiques détaillées</h3>
                <p className="text-blue-100 text-sm">Vue d'ensemble de la comptabilité</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={exporterStatistiques}
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sélecteur de période */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Période:</span>
                <select
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="mois">Ce mois</option>
                  <option value="trimestre">Ce trimestre</option>
                  <option value="annee">Cette année</option>
                </select>
              </div>

              {/* Statistiques des factures */}
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Statistiques des factures
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{statistiques.total || 0}</div>
                      <div className="text-sm text-gray-600">Total factures</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">{statistiques.parStatut?.NON_COMPTABILISEE || 0}</div>
                      <div className="text-sm text-gray-600">Non comptabilisées</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{statistiques.parStatut?.COMPTABILISEE || 0}</div>
                      <div className="text-sm text-gray-600">Comptabilisées</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {(statistiques.montantTotal || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </div>
                      <div className="text-sm text-gray-600">Montant total</div>
                    </div>
                  </div>

                  {/* Répartition par type */}
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Répartition par type</h4>
                    <div className="space-y-3">
                      {statistiques.parType && Object.entries(statistiques.parType).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {type === 'FACTURE_ACHAT' ? 'Factures d\'achat' : 'Avoirs fournisseur'}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(count / statistiques.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GestalisCardContent>
              </GestalisCard>

              {/* Statistiques des batches */}
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Statistiques des exports comptables
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">{statistiquesBatches.total || 0}</div>
                      <div className="text-sm text-gray-600">Total batches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{statistiquesBatches.parStatut?.COMPLETE || 0}</div>
                      <div className="text-sm text-gray-600">Exports réussis</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{statistiquesBatches.parStatut?.ERREUR || 0}</div>
                      <div className="text-sm text-gray-600">Exports en erreur</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{statistiquesBatches.totalFactures || 0}</div>
                      <div className="text-sm text-gray-600">Factures exportées</div>
                    </div>
                  </div>

                  {/* Répartition par format */}
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Répartition par format d'export</h4>
                    <div className="space-y-3">
                      {statistiquesBatches.parFormat && Object.entries(statistiquesBatches.parFormat).map(([format, count]) => (
                        <div key={format} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {format === 'CSV' ? 'Fichiers CSV' : 'Fichiers Excel'}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(count / statistiquesBatches.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GestalisCardContent>
              </GestalisCard>

              {/* Actions */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Button onClick={onClose} variant="outline">
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatistiquesModal;
