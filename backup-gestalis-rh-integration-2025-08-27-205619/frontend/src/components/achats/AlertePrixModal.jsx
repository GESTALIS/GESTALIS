import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Info, X, Check, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';

const AlertePrixModal = ({ 
  alerte, 
  onAccepter, 
  onModifier, 
  onAnnuler, 
  onFermer 
}) => {
  if (!alerte) return null;

  // Déterminer l'icône et la couleur selon le niveau d'alerte
  const getIconeEtCouleur = (niveau) => {
    switch (niveau) {
      case 'forte':
        return {
          icone: AlertTriangle,
          couleur: 'text-red-600',
          bgCouleur: 'bg-red-50',
          borderCouleur: 'border-red-200'
        };
      case 'moyenne':
        return {
          icone: TrendingUp,
          couleur: 'text-orange-600',
          bgCouleur: 'bg-orange-50',
          borderCouleur: 'border-orange-200'
        };
      case 'info':
        return {
          icone: Info,
          couleur: 'text-blue-600',
          bgCouleur: 'bg-blue-50',
          borderCouleur: 'border-blue-200'
        };
      default:
        return {
          icone: Info,
          couleur: 'text-gray-600',
          bgCouleur: 'bg-gray-50',
          borderCouleur: 'border-gray-200'
        };
    }
  };

  const { icone: Icone, couleur, bgCouleur, borderCouleur } = getIconeEtCouleur(alerte.niveauAlerte);
  const estHausse = alerte.variation > 0;
  const variationAbsolue = Math.abs(alerte.variation);
  const pourcentageAbsolu = Math.abs(alerte.pourcentageVariation);

  // Formater la date de la dernière facture
  const formaterDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header avec style dégradé bleu uniforme */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icone className={`h-6 w-6 ${couleur.replace('text-', 'text-white')}`} />
            <h3 className="text-lg font-semibold text-white">
              Alerte Variation de Prix
            </h3>
          </div>
          <button
            onClick={onFermer}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu de l'alerte */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Résumé de l'alerte */}
          <div className={`${bgCouleur} ${borderCouleur} border rounded-lg p-4 mb-6`}>
            <div className="flex items-center gap-3 mb-3">
              <Icone className={`h-5 w-5 ${couleur}`} />
              <span className={`font-semibold ${couleur}`}>
                {alerte.niveauAlerte === 'forte' && '⚠️ Alerte Forte'}
                {alerte.niveauAlerte === 'moyenne' && '⚠️ Alerte Moyenne'}
                {alerte.niveauAlerte === 'info' && 'ℹ️ Information'}
              </span>
            </div>
            
            <div className="text-sm text-gray-700">
              <p className="mb-2">
                <strong>Variation détectée :</strong>
              </p>
              <div className="flex items-center gap-2">
                {estHausse ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                <span className={`font-medium ${estHausse ? 'text-red-600' : 'text-green-600'}`}>
                  {estHausse ? '+' : '-'}{variationAbsolue.toFixed(2)}€ 
                  ({estHausse ? '+' : '-'}{pourcentageAbsolu.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Détails de la variation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Ancien prix */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Prix précédent</h4>
              <div className="text-2xl font-bold text-gray-900">
                {alerte.ancienPrix.toFixed(2)}€
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Facture {alerte.derniereFacture}
              </div>
              <div className="text-sm text-gray-500">
                {formaterDate(alerte.dateDerniereFacture)}
              </div>
            </div>

            {/* Nouveau prix */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-700 mb-2">Prix actuel</h4>
              <div className="text-2xl font-bold text-blue-900">
                {alerte.nouveauPrix.toFixed(2)}€
              </div>
              <div className="text-sm text-blue-600 mt-1">
                Nouvelle facture
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Détails de la variation</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Variation absolue :</span>
                <span className={`ml-2 font-medium ${estHausse ? 'text-red-600' : 'text-green-600'}`}>
                  {estHausse ? '+' : '-'}{variationAbsolue.toFixed(2)}€
                </span>
              </div>
              <div>
                <span className="text-gray-500">Variation relative :</span>
                <span className={`ml-2 font-medium ${estHausse ? 'text-red-600' : 'text-green-600'}`}>
                  {estHausse ? '+' : '-'}{pourcentageAbsolu.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Dernière facture :</span>
                <span className="ml-2 font-medium text-gray-700">
                  {alerte.derniereFacture}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Date :</span>
                <span className="ml-2 font-medium text-gray-700">
                  {formaterDate(alerte.dateDerniereFacture)}
                </span>
              </div>
            </div>
          </div>

          {/* Recommandations selon le niveau d'alerte */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Recommandations</h4>
            <div className="text-sm text-yellow-700">
              {alerte.niveauAlerte === 'forte' && (
                <p>
                  <strong>⚠️ Attention :</strong> Cette variation importante nécessite une vérification 
                  avant validation. Vérifiez la cohérence avec les conditions commerciales.
                </p>
              )}
              {alerte.niveauAlerte === 'moyenne' && (
                <p>
                  <strong>⚠️ Vérification recommandée :</strong> Cette variation modérée peut être 
                  normale selon les conditions du marché ou les accords commerciaux.
                </p>
              )}
              {alerte.niveauAlerte === 'info' && (
                <p>
                  <strong>ℹ️ Information :</strong> Cette variation mineure est probablement normale. 
                  Vous pouvez procéder en toute sécurité.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <Button
            onClick={onAnnuler}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </Button>
          
          <Button
            onClick={onModifier}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier le prix
          </Button>
          
          <Button
            onClick={onAccepter}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Accepter le prix
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertePrixModal;
