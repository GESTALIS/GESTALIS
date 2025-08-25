import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, RotateCcw, FileSpreadsheet, Equal } from 'lucide-react';

const VentilationMultiChantiers = ({ 
  ligne, 
  chantiers, 
  onSave, 
  onCancel, 
  modelePrecedent = null 
}) => {
  const [modeVentilation, setModeVentilation] = useState('PERCENT');
  const [splits, setSplits] = useState([]);
  const [chantierSelectionne, setChantierSelectionne] = useState('');
  const [valeur, setValeur] = useState('');
  const [note, setNote] = useState('');
  const [erreurs, setErreurs] = useState({});

  // Initialiser avec le modèle précédent ou une ventilation par défaut
  useEffect(() => {
    if (modelePrecedent) {
      setModeVentilation(modelePrecedent.modeVentilation);
      setSplits(modelePrecedent.splits);
    } else {
      // Ventilation par défaut : 100% sur le chantier principal
      if (ligne.chantierId) {
        setSplits([{
          chantierId: ligne.chantierId,
          value: modeVentilation === 'PERCENT' ? 100 : 
                 modeVentilation === 'AMOUNT' ? ligne.montantHT : 
                 ligne.quantite,
          ht: ligne.montantHT,
          note: ''
        }]);
      }
    }
  }, [modelePrecedent, ligne, modeVentilation]);

  // Calculer les totaux de contrôle
  const calculerTotaux = () => {
    const totalPercent = splits.reduce((sum, split) => sum + (modeVentilation === 'PERCENT' ? split.value : 0), 0);
    const totalAmount = splits.reduce((sum, split) => sum + split.ht, 0);
    const totalQuantity = splits.reduce((sum, split) => sum + (modeVentilation === 'QUANTITY' ? split.value : 0), 0);
    
    return { totalPercent, totalAmount, totalQuantity };
  };

  // Valider la ventilation
  const validerVentilation = () => {
    const { totalPercent, totalAmount, totalQuantity } = calculerTotaux();
    const erreurs = {};

    if (modeVentilation === 'PERCENT' && Math.abs(totalPercent - 100) > 0.01) {
      erreurs.percent = `Somme des pourcentages doit être 100% (actuel: ${totalPercent.toFixed(2)}%)`;
    }
    
    if (modeVentilation === 'AMOUNT' && Math.abs(totalAmount - ligne.montantHT) > 0.01) {
      erreurs.amount = `Somme des montants doit être ${ligne.montantHT.toFixed(2)}€ (actuel: ${totalAmount.toFixed(2)}€)`;
    }
    
    if (modeVentilation === 'QUANTITY' && Math.abs(totalQuantity - ligne.quantite) > 0.01) {
      erreurs.quantity = `Somme des quantités doit être ${ligne.quantite} (actuel: ${totalQuantity})`;
    }

    if (splits.length === 0) {
      erreurs.general = 'Au moins un chantier doit être sélectionné';
    }

    setErreurs(erreurs);
    return Object.keys(erreurs).length === 0;
  };

  // Ajouter un split
  const ajouterSplit = () => {
    if (!chantierSelectionne || !valeur) return;

    const newSplit = {
      id: Date.now(),
      chantierId: chantierSelectionne,
      value: parseFloat(valeur),
      ht: 0,
      note: note
    };

    // Calculer le montant HT selon le mode
    if (modeVentilation === 'PERCENT') {
      newSplit.ht = (ligne.montantHT * parseFloat(valeur)) / 100;
    } else if (modeVentilation === 'AMOUNT') {
      newSplit.ht = parseFloat(valeur);
    } else if (modeVentilation === 'QUANTITY') {
      newSplit.ht = (ligne.montantHT * parseFloat(valeur)) / ligne.quantite;
    }

    // Arrondir à 2 décimales
    newSplit.ht = Math.round(newSplit.ht * 100) / 100;

    setSplits([...splits, newSplit]);
    setChantierSelectionne('');
    setValeur('');
    setNote('');
  };

  // Supprimer un split
  const supprimerSplit = (id) => {
    setSplits(splits.filter(split => split.id !== id));
  };

  // Modifier un split
  const modifierSplit = (id, field, value) => {
    setSplits(splits.map(split => {
      if (split.id === id) {
        const updatedSplit = { ...split, [field]: value };
        
        // Recalculer le montant HT si nécessaire
        if (field === 'value') {
          if (modeVentilation === 'PERCENT') {
            updatedSplit.ht = (ligne.montantHT * parseFloat(value)) / 100;
          } else if (modeVentilation === 'AMOUNT') {
            updatedSplit.ht = parseFloat(value);
          } else if (modeVentilation === 'QUANTITY') {
            updatedSplit.ht = (ligne.montantHT * parseFloat(value)) / ligne.quantite;
          }
          updatedSplit.ht = Math.round(updatedSplit.ht * 100) / 100;
        }
        
        return updatedSplit;
      }
      return split;
    }));
  };

  // Répartition en parts égales
  const partsEgales = () => {
    if (splits.length === 0) return;
    
    const chantiersDisponibles = chantiers.filter(c => 
      !splits.some(s => s.chantierId === c.id)
    );
    
    if (chantiersDisponibles.length === 0) return;
    
    const valeurParChantier = modeVentilation === 'PERCENT' ? 100 / (splits.length + chantiersDisponibles.length) :
                              modeVentilation === 'AMOUNT' ? ligne.montantHT / (splits.length + chantiersDisponibles.length) :
                              ligne.quantite / (splits.length + chantiersDisponibles.length);
    
    const newSplits = [...splits];
    
    chantiersDisponibles.forEach(chantier => {
      newSplits.push({
        id: Date.now() + Math.random(),
        chantierId: chantier.id,
        value: Math.round(valeurParChantier * 100) / 100,
        ht: 0,
        note: ''
      });
    });
    
    // Recalculer tous les montants HT
    newSplits.forEach(split => {
      if (modeVentilation === 'PERCENT') {
        split.ht = (ligne.montantHT * split.value) / 100;
      } else if (modeVentilation === 'AMOUNT') {
        split.ht = split.value;
      } else if (modeVentilation === 'QUANTITY') {
        split.ht = (ligne.montantHT * split.value) / ligne.quantite;
      }
      split.ht = Math.round(split.ht * 100) / 100;
    });
    
    setSplits(newSplits);
  };

  // Sauvegarder la ventilation
  const sauvegarder = () => {
    if (!validerVentilation()) return;
    
    const ventilation = {
      modeVentilation,
      splits: splits.map(split => ({
        chantierId: split.chantierId,
        value: split.value,
        ht: split.ht,
        note: split.note
      })),
      sumCheck: {
        percent: modeVentilation === 'PERCENT' ? calculerTotaux().totalPercent : null,
        amount: calculerTotaux().totalAmount,
        quantity: modeVentilation === 'QUANTITY' ? calculerTotaux().totalQuantity : null
      }
    };
    
    onSave(ventilation);
  };

  // Ajuster le dernier split pour tomber juste
  const ajusterDernierSplit = () => {
    if (splits.length === 0) return;
    
    const { totalPercent, totalAmount, totalQuantity } = calculerTotaux();
    const dernierSplit = splits[splits.length - 1];
    
    if (modeVentilation === 'PERCENT') {
      const difference = 100 - totalPercent;
      modifierSplit(dernierSplit.id, 'value', Math.round((dernierSplit.value + difference) * 100) / 100);
    } else if (modeVentilation === 'AMOUNT') {
      const difference = ligne.montantHT - totalAmount;
      modifierSplit(dernierSplit.id, 'value', Math.round((dernierSplit.value + difference) * 100) / 100);
    } else if (modeVentilation === 'QUANTITY') {
      const difference = ligne.quantite - totalQuantity;
      modifierSplit(dernierSplit.id, 'value', Math.round((dernierSplit.value + difference) * 100) / 100);
    }
  };

  const { totalPercent, totalAmount, totalQuantity } = calculerTotaux();
  const chantiersDisponibles = chantiers.filter(c => 
    !splits.some(s => s.chantierId === c.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Ventilation multi-chantiers
            </h3>
            <p className="text-sm text-gray-600">
              Ligne : {ligne.designation} - {ligne.montantHT.toFixed(2)}€ HT
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Sélection du mode */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode de répartition
            </label>
            <div className="flex gap-4">
              {[
                { value: 'PERCENT', label: 'Pourcentage (%)', desc: 'Répartition en % par chantier' },
                { value: 'AMOUNT', label: 'Montant (€)', desc: 'Répartition en montants HT' },
                { value: 'QUANTITY', label: 'Quantité', desc: 'Répartition en quantités' }
              ].map(mode => (
                <label key={mode.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={mode.value}
                    checked={modeVentilation === mode.value}
                    onChange={(e) => setModeVentilation(e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium">{mode.label}</div>
                    <div className="text-xs text-gray-500">{mode.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Boutons d'action rapide */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={partsEgales}
              className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-2"
            >
              <Equal className="h-4 w-4" />
              Parts égales
            </button>
            <button
              onClick={ajusterDernierSplit}
              className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Ajuster dernier
            </button>
            <button
              onClick={() => {/* TODO: Import CSV */}}
              className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Importer CSV
            </button>
          </div>

          {/* Ajout d'un nouveau split */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Ajouter un chantier</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={chantierSelectionne}
                onChange={(e) => setChantierSelectionne(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un chantier</option>
                {chantiersDisponibles.map(chantier => (
                  <option key={chantier.id} value={chantier.id}>
                    {chantier.nom}
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                value={valeur}
                onChange={(e) => setValeur(e.target.value)}
                placeholder={modeVentilation === 'PERCENT' ? 'Pourcentage' : 
                           modeVentilation === 'AMOUNT' ? 'Montant HT' : 'Quantité'}
                step={modeVentilation === 'PERCENT' ? 0.01 : 0.01}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note (optionnel)"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <button
                onClick={ajouterSplit}
                disabled={!chantierSelectionne || !valeur}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Tableau des splits */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Répartition par chantier</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chantier
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {modeVentilation === 'PERCENT' ? 'Pourcentage' : 
                       modeVentilation === 'AMOUNT' ? 'Montant HT' : 'Quantité'}
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant HT
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {splits.map((split, index) => {
                    const chantier = chantiers.find(c => c.id === split.chantierId);
                    return (
                      <tr key={split.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {chantier?.nom || 'Chantier inconnu'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            value={split.value}
                            onChange={(e) => modifierSplit(split.id, 'value', parseFloat(e.target.value))}
                            step={modeVentilation === 'PERCENT' ? 0.01 : 0.01}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          {modeVentilation === 'PERCENT' && '%'}
                          {modeVentilation === 'AMOUNT' && '€'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {split.ht.toFixed(2)}€
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={split.note}
                            onChange={(e) => modifierSplit(split.id, 'note', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Note optionnelle"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => supprimerSplit(split.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totaux de contrôle */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Contrôle des totaux</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalPercent.toFixed(2)}%
                </div>
                <div className="text-sm text-blue-800">Pourcentage total</div>
                {erreurs.percent && (
                  <div className="text-xs text-red-600 mt-1">{erreurs.percent}</div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalAmount.toFixed(2)}€
                </div>
                <div className="text-sm text-blue-800">Montant total HT</div>
                {erreurs.amount && (
                  <div className="text-xs text-red-600 mt-1">{erreurs.amount}</div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalQuantity.toFixed(2)}
                </div>
                <div className="text-sm text-blue-800">Quantité totale</div>
                {erreurs.quantity && (
                  <div className="text-xs text-red-600 mt-1">{erreurs.quantity}</div>
                )}
              </div>
            </div>
            {erreurs.general && (
              <div className="text-center text-red-600 mt-3">{erreurs.general}</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={sauvegarder}
            disabled={splits.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Sauvegarder la ventilation
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentilationMultiChantiers;
