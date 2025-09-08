import React, { useState, useEffect } from 'react';
import SelectionPeriodeFacture from './SelectionPeriodeFacture';
import NouvelleFacture from './NouvelleFacture';

const NouvelleFactureWorkflow = ({ onCancel }) => {
  // Récupérer l'état depuis localStorage pour persister entre les navigations
  const [etape, setEtape] = useState(() => {
    const savedEtape = localStorage.getItem('nouvelle-facture-etape');
    return savedEtape ? parseInt(savedEtape) : 1;
  });
  
  const [parametresEtape1, setParametresEtape1] = useState(() => {
    const savedParams = localStorage.getItem('nouvelle-facture-params');
    return savedParams ? JSON.parse(savedParams) : null;
  });

  // Sauvegarder l'état dans localStorage
  useEffect(() => {
    localStorage.setItem('nouvelle-facture-etape', etape.toString());
  }, [etape]);
  
  useEffect(() => {
    if (parametresEtape1) {
      localStorage.setItem('nouvelle-facture-params', JSON.stringify(parametresEtape1));
    }
  }, [parametresEtape1]);

  // Gérer le retour depuis SmartPicker - s'assurer qu'on reste à l'étape 2
  useEffect(() => {
    const smartpickerContext = sessionStorage.getItem('smartpicker_return_context');
    if (smartpickerContext) {
      try {
        const { returnTo } = JSON.parse(smartpickerContext);
        if (returnTo && returnTo.includes('nouvelle-facture')) {
          console.log('🔄 Retour SmartPicker détecté - Passage à l\'étape 2');
          // Créer des paramètres par défaut si nécessaire
          if (!parametresEtape1) {
            const defaultParams = {
              typePiece: 'FACTURE_ACHAT',
              numeroPiece: '',
              periode: new Date().toISOString().split('T')[0].substring(0, 7) // YYYY-MM
            };
            setParametresEtape1(defaultParams);
          }
          setEtape(2);
        }
      } catch (error) {
        console.error('Erreur lors du parsing du contexte SmartPicker:', error);
      }
    }
  }, []); // Dépendances vides pour ne s'exécuter qu'une fois

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
    // Nettoyer le localStorage
    localStorage.removeItem('nouvelle-facture-etape');
    localStorage.removeItem('nouvelle-facture-params');
    
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
