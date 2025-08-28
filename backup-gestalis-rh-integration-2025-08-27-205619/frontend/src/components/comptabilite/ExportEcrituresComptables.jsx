import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Download, 
  FileSpreadsheet,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../ui/GestalisCard';
import { Button } from '../ui/button';
import comptabiliteService from '../../services/comptabiliteService';

const ExportEcrituresComptables = ({ facture, onClose, onExport }) => {
  const [ecritures, setEcritures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(true);
  const [parametres, setParametres] = useState(null);

  useEffect(() => {
    if (facture) {
      genererEcritures();
      chargerParametres();
    }
  }, [facture]);

  // Charger les paramètres comptables
  const chargerParametres = () => {
    try {
      const parametresSauvegardes = localStorage.getItem('gestalis_parametres_comptables');
      if (parametresSauvegardes) {
        setParametres(JSON.parse(parametresSauvegardes));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  // Générer les écritures comptables
  const genererEcritures = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ecrituresGenerees = comptabiliteService.genererEcrituresComptables(facture);
      setEcritures(ecrituresGenerees);
      
    } catch (error) {
      console.error('Erreur lors de la génération des écritures:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Exporter en CSV
  const exporterCSV = async () => {
    try {
      await comptabiliteService.exporterCSV(ecritures);
      if (onExport) {
        onExport('csv');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      alert('❌ Erreur lors de l\'export CSV');
    }
  };

  // Exporter en Excel
  const exporterExcel = async () => {
    try {
      await comptabiliteService.exporterExcel(ecritures);
      if (onExport) {
        onExport('excel');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      alert('❌ Erreur lors de l\'export Excel');
    }
  };

  // Obtenir les colonnes visibles et triées
  const obtenirColonnesVisibles = () => {
    if (!parametres) return [];
    
    return parametres.exportComptable.colonnes
      .filter(col => col.visible)
      .sort((a, b) => a.ordre - b.ordre);
  };

  // Formater une valeur pour l'affichage
  const formaterValeur = (ecriture, colonneId) => {
    const valeur = ecriture[colonneId];
    
    if (colonneId === 'debit' || colonneId === 'credit') {
      return valeur ? parseFloat(valeur).toFixed(2) + ' €' : '';
    }
    
    if (colonneId === 'date') {
      return valeur ? new Date(valeur).toLocaleDateString('fr-FR') : '';
    }
    
    return valeur || '';
  };

  // Calculer le total des débits
  const calculerTotalDebits = () => {
    return ecritures.reduce((total, ecriture) => {
      return total + (parseFloat(ecriture.debit) || 0);
    }, 0);
  };

  // Calculer le total des crédits
  const calculerTotalCredits = () => {
    return ecritures.reduce((total, ecriture) => {
      return total + (parseFloat(ecriture.credit) || 0);
    }, 0);
  };

  // Vérifier l'équilibre comptable
  const verifierEquilibre = () => {
    const totalDebits = calculerTotalDebits();
    const totalCredits = calculerTotalCredits();
    const difference = Math.abs(totalDebits - totalCredits);
    
    return {
      equilibre: difference < 0.01,
      totalDebits,
      totalCredits,
      difference
    };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Génération des écritures comptables...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="bg-red-500 px-6 py-4 border-b flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-white" />
            <h3 className="text-lg font-semibold text-white">
              Erreur de comptabilisation
            </h3>
          </div>
          
          <div className="p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 text-sm mb-6">
              Vérifiez que :
            </p>
            <ul className="text-gray-600 text-sm space-y-2 mb-6">
              <li>• Le fournisseur a un compte comptable configuré</li>
              <li>• Toutes les lignes ont une catégorie valide</li>
              <li>• Les paramètres comptables sont configurés</li>
            </ul>
            
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Fermer
              </Button>
              <Button
                onClick={genererEcritures}
                className="flex-1"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const colonnesVisibles = obtenirColonnesVisibles();
  const equilibre = verifierEquilibre();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-white" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Écritures Comptables - {facture.numeroPiece}
              </h3>
              <p className="text-blue-100 text-sm">
                {facture.fournisseur?.raisonSociale || facture.fournisseur?.nom || 'Fournisseur'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? 'Masquer' : 'Afficher'}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              Fermer
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          {/* Informations de la facture */}
          <GestalisCard className="mb-6">
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Informations de la facture
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Numéro de pièce :</span>
                  <span className="ml-2 text-gray-900">{facture.numeroPiece}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date :</span>
                  <span className="ml-2 text-gray-900">
                    {facture.dateFacture ? new Date(facture.dateFacture).toLocaleDateString('fr-FR') : 'Non définie'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total HT :</span>
                  <span className="ml-2 text-gray-900 font-semibold">
                    {comptabiliteService.calculerTotalHT(facture).toFixed(2)} €
                  </span>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Écritures comptables */}
          <GestalisCard className="mb-6">
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Écritures comptables générées
                <span className="text-sm font-normal text-gray-500">
                  ({ecritures.length} écritures)
                </span>
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              {previewMode && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {colonnesVisibles.map((colonne) => (
                          <th key={colonne.id} className="text-left py-3 px-4 font-medium text-gray-700">
                            {colonne.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ecritures.map((ecriture, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          {colonnesVisibles.map((colonne) => (
                            <td key={colonne.id} className="py-3 px-4">
                              <span className={`
                                ${colonne.id === 'debit' || colonne.id === 'credit' ? 'font-mono' : ''}
                                ${colonne.id === 'debit' && ecriture.debit ? 'text-red-600' : ''}
                                ${colonne.id === 'credit' && ecriture.credit ? 'text-green-600' : ''}
                              `}>
                                {formaterValeur(ecriture, colonne.id)}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {!previewMode && (
                <div className="text-center py-8 text-gray-500">
                  <EyeOff className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aperçu masqué</p>
                </div>
              )}
            </GestalisCardContent>
          </GestalisCard>

          {/* Vérification de l'équilibre */}
          <GestalisCard className="mb-6">
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                {equilibre.equilibre ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                Vérification de l'équilibre comptable
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {equilibre.totalDebits.toFixed(2)} €
                  </div>
                  <div className="text-sm text-gray-600">Total Débits</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {equilibre.totalCredits.toFixed(2)} €
                  </div>
                  <div className="text-sm text-gray-600">Total Crédits</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${equilibre.equilibre ? 'text-green-600' : 'text-red-600'}`}>
                    {equilibre.difference.toFixed(2)} €
                  </div>
                  <div className="text-sm text-gray-600">
                    {equilibre.equilibre ? 'Équilibre OK' : 'Écart détecté'}
                  </div>
                </div>
              </div>
              
              {!equilibre.equilibre && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    ⚠️ Attention : L'écart de {equilibre.difference.toFixed(2)} € doit être corrigé avant l'export.
                  </p>
                </div>
              )}
            </GestalisCardContent>
          </GestalisCard>

          {/* Actions d'export */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={exporterCSV}
              disabled={!equilibre.equilibre}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Exporter CSV
            </Button>
            
            <Button
              onClick={exporterExcel}
              disabled={!equilibre.equilibre}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exporter Excel
            </Button>
          </div>

          {!equilibre.equilibre && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                L'export est désactivé tant que l'équilibre comptable n'est pas respecté.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportEcrituresComptables;
