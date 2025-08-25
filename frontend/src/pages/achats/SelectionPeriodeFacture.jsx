import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ArrowLeft,
  Calendar,
  Calculator,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../components/ui/GestalisCard';
import { GestalisButton } from '../../components/ui/gestalis-button';
import { Input } from '../../components/ui/input';
import numerotationService from '../../services/numerotationService';

const SelectionPeriodeFacture = ({ onContinue, onCancel }) => {
  const [selection, setSelection] = useState({
    typePiece: 'FACTURE_ACHAT',
    mois: new Date().getMonth() + 1,
    annee: new Date().getFullYear()
  });

  const [statistiques, setStatistiques] = useState({
    nombrePieces: 0,
    prochainNumero: '',
    periode: '',
    stats: { total: 0, reserves: 0, utilises: 0, annules: 0 }
  });

  const [loading, setLoading] = useState(false);

  // Types de pièces disponibles
  const typesPieces = [
    { key: 'FACTURE_ACHAT', label: 'Facture d\'achat', prefix: 'AC', description: 'Facture fournisseur classique' },
    { key: 'AVOIR_FOURNISSEUR', label: 'Avoir fournisseur', prefix: 'AVF', description: 'Avoir ou remboursement fournisseur' }
  ];

  // Mois disponibles
  const mois = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' }
  ];

  // Années disponibles (année courante + 2 ans)
  const annees = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i);

  // Calculer les statistiques quand la sélection change
  useEffect(() => {
    calculerStatistiques();
  }, [selection]);

  // Calculer les statistiques pour la période sélectionnée
  const calculerStatistiques = async () => {
    try {
      setLoading(true);
      
      const datePiece = new Date(selection.annee, selection.mois - 1, 1);
      const contexte = {
        societe: { code: 'GESTALIS' }, // TODO: Récupérer depuis le contexte utilisateur
        utilisateur: { code: 'USER' } // TODO: Récupérer depuis le contexte utilisateur
      };

      // Obtenir les vraies statistiques de la période
      const stats = numerotationService.getStatistiquesPeriode(selection.typePiece, datePiece);
      const nombreFactures = stats.utilises; // Seules les factures utilisées comptent
      
      // Générer le prochain numéro
      const prochainNumero = numerotationService.genererNumero(selection.typePiece, datePiece, contexte);
      
      // Formater la période
      const moisLabel = mois.find(m => m.value === selection.mois)?.label;
      const periode = `${moisLabel} ${selection.annee}`;

      setStatistiques({
        nombrePieces: nombreFactures,
        prochainNumero,
        periode,
        stats: stats // Garder toutes les stats pour l'affichage
      });

    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      setStatistiques({
        nombrePieces: 0,
        prochainNumero: 'ERREUR',
        periode: '',
        stats: { total: 0, reserves: 0, utilises: 0, annules: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  // Gérer la sélection
  const handleSelectionChange = (field, value) => {
    setSelection(prev => ({ ...prev, [field]: value }));
  };

  // Continuer vers le formulaire
  const handleContinue = () => {
    if (statistiques.prochainNumero && statistiques.prochainNumero !== 'ERREUR') {
      onContinue({
        ...selection,
        numeroPiece: statistiques.prochainNumero,
        periode: statistiques.periode
      });
    }
  };

  // Obtenir le type de pièce sélectionné
  const typeSelectionne = typesPieces.find(t => t.key === selection.typePiece);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <FileText className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Nouvelle Facture</h1>
              <p className="text-blue-100 text-lg">Étape 1 : Sélection de la période</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          
          {/* Sélection du type de pièce */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Type de document
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {typesPieces.map(type => (
                  <div
                    key={type.key}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selection.typePiece === type.key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectionChange('typePiece', type.key)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selection.typePiece === type.key
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selection.typePiece === type.key && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                        <div className="text-xs text-blue-600 font-mono mt-1">
                          Préfixe : {type.prefix}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Sélection de la période */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Période de facturation
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mois *
                  </label>
                  <select
                    value={selection.mois}
                    onChange={(e) => handleSelectionChange('mois', parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    {mois.map(m => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année *
                  </label>
                  <select
                    value={selection.annee}
                    onChange={(e) => handleSelectionChange('annee', parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    {annees.map(annee => (
                      <option key={annee} value={annee}>
                        {annee}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Statistiques et prévisualisation */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Résumé de la période
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Calcul des statistiques...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Informations de la période */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Période sélectionnée</span>
                    </div>
                    <p className="text-blue-800 text-lg">
                      {statistiques.periode} - {typeSelectionne?.label}
                    </p>
                  </div>

                  {/* Résumé simplifié */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Factures existantes</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {statistiques.nombrePieces}
                      </div>
                      <div className="text-sm text-gray-600">
                        {statistiques.nombrePieces === 0 
                          ? 'Aucune facture ce mois-ci'
                          : `${statistiques.nombrePieces} facture${statistiques.nombrePieces > 1 ? 's' : ''} déjà créée${statistiques.nombrePieces > 1 ? 's' : ''}`
                        }
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Prochain numéro</span>
                      </div>
                      <div className="text-3xl font-bold text-green-700 font-mono mb-1">
                        {statistiques.prochainNumero}
                      </div>
                      <div className="text-sm text-green-600">
                        {statistiques.nombrePieces === 0 
                          ? '1ère facture du mois'
                          : `${statistiques.nombrePieces + 1}ème facture du mois`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </GestalisCardContent>
          </GestalisCard>

          {/* Actions */}
          <div className="flex justify-between items-center">
            {/* Bouton de nettoyage temporaire */}
            <button
              onClick={() => {
                // Nettoyer toutes les séquences
                numerotationService.nettoyerToutesSequences();
                // Recalculer les statistiques après nettoyage
                setTimeout(() => calculerStatistiques(), 100);
              }}
              className="px-4 py-2 text-xs bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
              title="Nettoyer toutes les séquences (résout le problème de numérotation)"
            >
              🧹 Nettoyer séquences
            </button>
            
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              
              <GestalisButton
                onClick={handleContinue}
                disabled={loading || !statistiques.prochainNumero || statistiques.prochainNumero === 'ERREUR'}
                className="px-6 py-3"
              >
                Continuer vers le formulaire
              </GestalisButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionPeriodeFacture;
