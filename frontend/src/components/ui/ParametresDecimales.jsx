import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import produitsService from '../../services/produitsService';

const ParametresDecimales = ({ isOpen, onClose }) => {
  const [decimales, setDecimales] = useState(2);
  const [decimalesTemporaires, setDecimalesTemporaires] = useState(2);

  useEffect(() => {
    if (isOpen) {
      const decimalesActuelles = produitsService.getDecimales();
      setDecimales(decimalesActuelles);
      setDecimalesTemporaires(decimalesActuelles);
    }
  }, [isOpen]);

  const sauvegarder = () => {
    produitsService.setDecimales(decimalesTemporaires);
    setDecimales(decimalesTemporaires);
    onClose();
  };

  const reinitialiser = () => {
    setDecimalesTemporaires(2);
  };

  const annuler = () => {
    setDecimalesTemporaires(decimales);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Paramètres des décimales
            </h3>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de décimales
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={decimalesTemporaires}
                  onChange={(e) => setDecimalesTemporaires(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-blue-600 min-w-[3rem] text-center">
                  {decimalesTemporaires}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {decimalesTemporaires === 0 && "Aucune décimale (ex: 100€)"}
                {decimalesTemporaires === 1 && "1 décimale (ex: 100.5€)"}
                {decimalesTemporaires === 2 && "2 décimales (ex: 100.50€)"}
                {decimalesTemporaires === 3 && "3 décimales (ex: 100.500€)"}
                {decimalesTemporaires === 4 && "4 décimales (ex: 100.5000€)"}
              </p>
            </div>

            {/* Exemple */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Exemple d'affichage</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Prix unitaire :</span>
                  <span className="font-mono">{produitsService.formaterNombre(123.4567)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantité :</span>
                  <span className="font-mono">{produitsService.formaterNombre(45.6789)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Montant HT :</span>
                  <span className="font-mono">{produitsService.formaterNombre(123.4567 * 45.6789)}€</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note :</strong> Ce paramètre affecte l'affichage de tous les montants et nombres dans l'application.
                Les calculs internes conservent leur précision maximale.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
          <button
            onClick={reinitialiser}
            className="px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={annuler}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={sauvegarder}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresDecimales;
