import React, { useState, useEffect } from 'react';
import { 
  History, 
  X, 
  FileText, 
  Calendar,
  User,
  Calculator,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../ui/GestalisCard';
import { Button } from '../ui/button';
import facturesService from '../../services/facturesService';
import batchesComptablesService from '../../services/batchesComptablesService';

const HistoriqueFactureModal = ({ isOpen, onClose, facture }) => {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && facture) {
      chargerHistorique();
    }
  }, [isOpen, facture]);

  const chargerHistorique = async () => {
    try {
      setLoading(true);
      
      // Charger l'historique de la facture
      const hist = await facturesService.obtenirHistorique(facture.id);
      setHistorique(hist);
      
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setHistorique([]);
    } finally {
      setLoading(false);
    }
  };

  const formaterDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIconeStatut = (statut) => {
    switch (statut) {
      case 'COMPTABILISEE':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'EN_COURS':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'ERREUR':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLibelleStatut = (statut) => {
    switch (statut) {
      case 'COMPTABILISEE':
        return 'Comptabilisée';
      case 'EN_COURS':
        return 'En cours de comptabilisation';
      case 'ERREUR':
        return 'Erreur de comptabilisation';
      default:
        return 'Non comptabilisée';
    }
  };

  if (!isOpen || !facture) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-6 w-6" />
              <div>
                <h3 className="text-xl font-bold">Historique de la facture</h3>
                <p className="text-blue-100 text-sm">
                  {facture.numeroPiece} - {facture.fournisseur?.raisonSociale}
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
              <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Informations de la facture */}
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Informations de la facture
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Numéro de pièce</span>
                      <p className="text-sm text-gray-900">{facture.numeroPiece}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Fournisseur</span>
                      <p className="text-sm text-gray-900">{facture.fournisseur?.raisonSociale}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date de création</span>
                      <p className="text-sm text-gray-900">
                        {formaterDate(facture.dateCreation)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Montant HT</span>
                      <p className="text-sm text-gray-900 font-medium">
                        {facture.montantTotal?.toLocaleString('fr-FR', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        })}
                      </p>
                    </div>
                  </div>
                </GestalisCardContent>
              </GestalisCard>

              {/* Historique des opérations */}
              <GestalisCard>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historique des opérations
                  </GestalisCardTitle>
                </GestalisCardHeader>
                <GestalisCardContent>
                  {historique.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Aucun historique disponible pour cette facture
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {historique.map((operation, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0">
                            {getIconeStatut(operation.statut)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                {operation.action}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {formaterDate(operation.date)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {getLibelleStatut(operation.statut)}
                            </p>
                            {operation.utilisateur && (
                              <p className="text-sm text-gray-500 mt-1">
                                Par : {operation.utilisateur}
                              </p>
                            )}
                            {operation.details && (
                              <p className="text-sm text-gray-600 mt-2">
                                {operation.details}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

export default HistoriqueFactureModal;
