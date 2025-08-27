import React, { useState } from 'react';
import SelectionPeriodeFacture from './SelectionPeriodeFacture';
import NouvelleFacture from './NouvelleFacture';

const NouvelleFactureWorkflow = ({ onCancel }) => {
  const [etape, setEtape] = useState(1); // 1 = sélection période, 2 = formulaire
  const [parametresEtape1, setParametresEtape1] = useState(null);

  // Passer à l'étape 2 avec les paramètres sélectionnés
  const handleContinueEtape1 = (parametres) => {
    setParametresEtape1(parametres);
    setEtape(2);
  };

  // Retourner à l'étape 1
  const handleRetourEtape1 = () => {
    setEtape(1);
    setParametresEtape1(null);
  };

  // Annuler complètement le workflow
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  };

  // Rendu conditionnel selon l'étape
  if (etape === 1) {
    return (
      <SelectionPeriodeFacture
        onContinue={handleContinueEtape1}
        onCancel={handleCancel}
      />
    );
  }

  if (etape === 2) {
    return (
      <NouvelleFacture
        parametresEtape1={parametresEtape1}
        onRetourEtape1={handleRetourEtape1}
        onCancel={handleCancel}
      />
    );
  }

  return null;
};

export default NouvelleFactureWorkflow;
