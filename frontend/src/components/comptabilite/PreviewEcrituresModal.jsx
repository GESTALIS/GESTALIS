import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Download, 
  FileSpreadsheet,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Info
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../ui/GestalisCard';
import { Button } from '../ui/button';
import comptabiliteService from '../../services/comptabiliteService';

const PreviewEcrituresModal = ({ isOpen, onClose, facture, batch }) => {
  const [ecritures, setEcritures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formatExport, setFormatExport] = useState('CSV');
  const [colonnesVisibles, setColonnesVisibles] = useState({
    date: true,
    numeroPiece: true,
    numeroCompte: true,
    libelle: true,
    debit: true,
    credit: true
  });

  useEffect(() => {
    if (isOpen && facture) {
      genererEcritures();
    }
  }, [isOpen, facture]);

  const genererEcritures = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ecrituresGenerees = await comptabiliteService.genererEcrituresComptables(facture);
      setEcritures(ecrituresGenerees);
      
    } catch (error) {
      console.error('Erreur lors de la génération des écritures:', error);
      setError('Erreur lors de la génération des écritures comptables');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setLoading(true);
      
      if (format === 'CSV') {
        await comptabiliteService.exporterCSV(ecritures, batch);
      } else {
        await comptabiliteService.exporterExcel(ecritures, batch);
      }
      
      // Marquer le batch comme complet
      if (batch) {
        const batchesService = await import('../../services/batchesComptablesService');
        await batchesService.default.mettreAJourStatut(batch.id, 'COMPLETE');
      }
      
      onClose();
      
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setError('Erreur lors de l\'export des écritures');
    } finally {
      setLoading(false);
    }
  };

  const calculerTotalDebit = () => {
    return ecritures.reduce((total, ecriture) => total + (ecriture.debit || 0), 0);
  };

  const calculerTotalCredit = () => {
    return ecritures.reduce((total, ecriture) => total + (ecriture.credit || 0), 0);
  };

  const equilibreValide = () => {
    const debit = calculerTotalDebit();
    const credit = calculerTotalCredit();
    return Math.abs(debit - credit) < 0.01;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-bold">Prévisualisation des écritures comptables</h3>
                <p className="text-blue-100 text-sm">
                  Facture {facture?.numeroPiece} - {facture?.fournisseur?.raisonSociale}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Génération des écritures comptables...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <Button onClick={genererEcritures} className="mt-4">
                Réessayer
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Informations du batch */}
              {batch && (
                <GestalisCard>
                  <GestalisCardHeader>
                    <GestalisCardTitle>Informations du batch</GestalisCardTitle>
                  </GestalisCardHeader>
                  <GestalisCardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">ID Batch</span>
                        <p className="text-sm text-gray-900">{batch.id}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Date création</span>
                        <p className="text-sm text-gray-900">
                          {new Date(batch.dateCreation).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Factures</span>
                        <p className="text-sm text-gray-900">{batch.factures.length}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Utilisateur</span>
                        <p className="text-sm text-gray-900">{batch.utilisateur}</p>
                      </div>
                    </div>
                  </GestalisCardContent>
                </GestalisCard>
              )}

              {/* Contrôle d'équilibre */}
              <div className={`p-4 rounded-lg border ${
                equilibreValide() 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {equilibreValide() ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    equilibreValide() ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {equilibreValide() ? 'Équilibre comptable validé' : 'Équilibre comptable non respecté'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Total Débit: {calculerTotalDebit().toFixed(2)}€ | 
                  Total Crédit: {calculerTotalCredit().toFixed(2)}€ | 
                  Différence: {(calculerTotalDebit() - calculerTotalCredit()).toFixed(2)}€
                </div>
              </div>

              {/* Configuration de l'export */}
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle>Configuration de l'export</GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  <div className="flex items-center gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format d'export
                      </label>
                      <select
                        value={formatExport}
                        onChange={(e) => setFormatExport(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="CSV">CSV</option>
                        <option value="EXCEL">Excel</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colonnes visibles
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(colonnesVisibles).map(([colonne, visible]) => (
                          <label key={colonne} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={visible}
                              onChange={(e) => setColonnesVisibles(prev => ({
                                ...prev,
                                [colonne]: e.target.checked
                              }))}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                              {colonne === 'date' ? 'Date' :
                               colonne === 'numeroPiece' ? 'N° Pièce' :
                               colonne === 'numeroCompte' ? 'N° Compte' :
                               colonne === 'libelle' ? 'Libellé' :
                               colonne === 'debit' ? 'Débit' :
                               colonne === 'credit' ? 'Crédit' : colonne}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </GestalisCardContent>
              </GestalisCard>

              {/* Tableau des écritures */}
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle>
                    Écritures comptables ({ecritures.length} lignes)
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {colonnesVisibles.date && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          )}
                          {colonnesVisibles.numeroPiece && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              N° Pièce
                            </th>
                          )}
                          {colonnesVisibles.numeroCompte && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              N° Compte
                            </th>
                          )}
                          {colonnesVisibles.libelle && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Libellé
                            </th>
                          )}
                          {colonnesVisibles.debit && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Débit
                            </th>
                          )}
                          {colonnesVisibles.credit && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Crédit
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ecritures.map((ecriture, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {colonnesVisibles.date && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(ecriture.date).toLocaleDateString('fr-FR')}
                              </td>
                            )}
                            {colonnesVisibles.numeroPiece && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {ecriture.numeroPiece}
                              </td>
                            )}
                            {colonnesVisibles.numeroCompte && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {ecriture.numeroCompte}
                              </td>
                            )}
                            {colonnesVisibles.libelle && (
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                {ecriture.libelle}
                              </td>
                            )}
                            {colonnesVisibles.debit && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {ecriture.debit ? `${ecriture.debit.toFixed(2)}€` : '-'}
                              </td>
                            )}
                            {colonnesVisibles.credit && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {ecriture.credit ? `${ecriture.credit.toFixed(2)}€` : '-'}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GestalisCardContent>
              </GestalisCard>

              {/* Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setColonnesVisibles({
                      date: true,
                      numeroPiece: true,
                      numeroCompte: true,
                      libelle: true,
                      debit: true,
                      credit: true
                    })}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Afficher tout
                  </Button>
                  <Button
                    onClick={() => setColonnesVisibles({
                      date: false,
                      numeroPiece: false,
                      numeroCompte: false,
                      libelle: false,
                      debit: false,
                      credit: false
                    })}
                    variant="outline"
                    size="sm"
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Masquer tout
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={onClose} variant="outline">
                    Annuler
                  </Button>
                  
                  <Button
                    onClick={() => handleExport('CSV')}
                    disabled={!equilibreValide() || loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                  
                  <Button
                    onClick={() => handleExport('EXCEL')}
                    disabled={!equilibreValide() || loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exporter Excel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewEcrituresModal;
