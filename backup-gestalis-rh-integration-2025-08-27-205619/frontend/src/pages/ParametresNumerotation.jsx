import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  FileText, 
  Save, 
  Eye, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { GestalisButton } from '../components/ui/gestalis-button';
import { Input } from '../components/ui/input';
import numerotationService from '../services/numerotationService';

const ParametresNumerotation = () => {
  const [configurations, setConfigurations] = useState({});
  const [dateTest, setDateTest] = useState(new Date().toISOString().split('T')[0]);
  const [contexteTest, setContexteTest] = useState({
    fournisseur: { code: 'FOUR001', raisonSociale: 'Entreprise Test' },
    chantier: { code: 'CHANT001' },
    societe: { code: 'GESTALIS' },
    utilisateur: { code: 'USER001' }
  });
  const [previsualisations, setPrevisualisations] = useState({});
  const [saving, setSaving] = useState(false);

  // Types de pièces disponibles
  const typesPieces = [
    { key: 'FACTURE_ACHAT', label: 'Facture d\'achat', description: 'Factures fournisseurs' },
    { key: 'AVOIR_FOURNISSEUR', label: 'Avoir fournisseur', description: 'Avoirs émis aux fournisseurs' },
    { key: 'FACTURE_VENTE', label: 'Facture de vente', description: 'Factures clients' },
    { key: 'AVOIR_CLIENT', label: 'Avoir client', description: 'Avoirs émis aux clients' },
    { key: 'BON_COMMANDE', label: 'Bon de commande', description: 'Commandes fournisseurs' },
    { key: 'BON_LIVRAISON', label: 'Bon de livraison', description: 'Livraisons clients' }
  ];

  // Politiques de reset
  const politiquesReset = [
    { key: 'monthly', label: 'Mensuel (par défaut)', description: 'Séquence remise à zéro chaque mois' },
    { key: 'yearly', label: 'Annuel', description: 'Séquence remise à zéro chaque année' },
    { key: 'never', label: 'Jamais', description: 'Séquence continue sans reset' }
  ];

  useEffect(() => {
    chargerConfigurations();
  }, []);

  useEffect(() => {
    genererPrevisualisations();
  }, [configurations, dateTest, contexteTest]);

  const chargerConfigurations = () => {
    // Charger depuis localStorage (TODO: Remplacer par API)
    const configs = {};
    typesPieces.forEach(type => {
      const config = localStorage.getItem(`numerotation_${type.key}`);
      if (config) {
        configs[type.key] = JSON.parse(config);
      } else {
        // Configuration par défaut
        configs[type.key] = {
          format: numerotationService.getFormatsParDefaut()[type.key],
          reset: 'monthly',
          longueurSequence: 4,
          personnalise: false
        };
      }
    });
    setConfigurations(configs);
  };

  const genererPrevisualisations = () => {
    const prevs = {};
    typesPieces.forEach(type => {
      try {
        const config = configurations[type.key];
        if (config && config.format) {
          const numero = numerotationService.previsualiserNumero(
            type.key,
            new Date(dateTest),
            contexteTest,
            config.personnalise ? config.format : null
          );
          prevs[type.key] = numero;
        }
      } catch (error) {
        prevs[type.key] = 'ERREUR';
      }
    });
    setPrevisualisations(prevs);
  };

  const handleConfigChange = (typeKey, field, value) => {
    setConfigurations(prev => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        [field]: value
      }
    }));
  };

  const validerFormat = (format) => {
    return numerotationService.validerFormat(format);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Valider tous les formats
      let hasErrors = false;
      typesPieces.forEach(type => {
        const config = configurations[type.key];
        if (config.personnalise && config.format) {
          const validation = validerFormat(config.format);
          if (!validation.valide) {
            hasErrors = true;
            console.error(`Erreurs pour ${type.label}:`, validation.erreurs);
          }
        }
      });

      if (hasErrors) {
        alert('❌ Certains formats contiennent des erreurs. Vérifiez la console.');
        return;
      }

      // Sauvegarder dans localStorage (TODO: Remplacer par API)
      typesPieces.forEach(type => {
        localStorage.setItem(`numerotation_${type.key}`, JSON.stringify(configurations[type.key]));
      });

      alert('✅ Configuration sauvegardée avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const resetConfiguration = (typeKey) => {
    const formatDefaut = numerotationService.getFormatsParDefaut()[typeKey];
    setConfigurations(prev => ({
      ...prev,
      [typeKey]: {
        format: formatDefaut,
        reset: 'monthly',
        longueurSequence: 4,
        personnalise: false
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Paramètres de numérotation</h1>
              <p className="text-blue-100 text-lg">Configuration automatique des numéros de pièces</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          
          {/* Informations générales */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Informations sur la numérotation automatique
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 mb-3">
                  <strong>Format par défaut inspiré d'ONAYA :</strong> AC{'{MM}'}{'{YYYY}'}-{'{SEQ:4}'}
                </p>
                <p className="text-blue-700 text-sm">
                  Exemple : AC012025-0001 (Achat + Janvier 2025 + Séquence 0001)
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  Chaque société peut personnaliser ses formats en utilisant les variables disponibles.
                </p>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Configuration par type de pièce */}
          {typesPieces.map(type => {
            const config = configurations[type.key] || {};
            const previsualisation = previsualisations[type.key] || '';
            const validation = config.personnalise && config.format ? validerFormat(config.format) : null;
            
            return (
              <GestalisCard key={type.key}>
                <GestalisCardHeader>
                  <GestalisCardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {type.label}
                  </GestalisCardTitle>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </GestalisCardHeader>
                <GestalisCardContent className="space-y-4">
                  
                  {/* Format de numérotation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format de numérotation
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={config.format || ''}
                        onChange={(e) => handleConfigChange(type.key, 'format', e.target.value)}
                        placeholder="Format par défaut"
                        className="flex-1"
                        disabled={!config.personnalise}
                      />
                      <button
                        onClick={() => resetConfiguration(type.key)}
                        className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        title="Remettre le format par défaut"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Personnalisation */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id={`personnalise_${type.key}`}
                        checked={config.personnalise || false}
                        onChange={(e) => handleConfigChange(type.key, 'personnalise', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`personnalise_${type.key}`} className="text-sm text-gray-700">
                        Personnaliser le format
                      </label>
                    </div>
                  </div>

                  {/* Politique de reset */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Politique de reset
                    </label>
                    <select
                      value={config.reset || 'monthly'}
                      onChange={(e) => handleConfigChange(type.key, 'reset', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      {politiquesReset.map(politique => (
                        <option key={politique.key} value={politique.key}>
                          {politique.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      {politiquesReset.find(p => p.key === config.reset)?.description}
                    </p>
                  </div>

                  {/* Longueur de séquence */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longueur de séquence
                    </label>
                    <Input
                      type="number"
                      value={config.longueurSequence || 4}
                      onChange={(e) => handleConfigChange(type.key, 'longueurSequence', parseInt(e.target.value))}
                      min="1"
                      max="10"
                      className="w-32"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Nombre de chiffres pour la séquence (ex: 4 = 0001, 5 = 00001)
                    </p>
                  </div>

                  {/* Validation du format */}
                  {config.personnalise && config.format && validation && (
                    <div className={`p-3 rounded-lg ${
                      validation.valide ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {validation.valide ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          validation.valide ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {validation.valide ? 'Format valide' : 'Format invalide'}
                        </span>
                      </div>
                      
                      {!validation.valide && validation.erreurs.length > 0 && (
                        <ul className="mt-2 text-sm text-red-700">
                          {validation.erreurs.map((erreur, index) => (
                            <li key={index}>• {erreur}</li>
                          ))}
                        </ul>
                      )}
                      
                      {validation.variablesUtilisees.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">Variables utilisées :</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {validation.variablesUtilisees.map((variable, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {variable}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Prévisualisation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prévisualisation
                    </label>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <code className="text-lg font-mono text-gray-800">
                        {previsualisation || 'Aucune prévisualisation disponible'}
                      </code>
                    </div>
                  </div>
                </GestalisCardContent>
              </GestalisCard>
            );
          })}

          {/* Variables disponibles */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Variables disponibles pour personnalisation
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(numerotationService.getVariablesDisponibles()).map(([variable, description]) => (
                  <div key={variable} className="p-3 border rounded-lg">
                    <code className="font-mono text-blue-600 font-medium">{variable}</code>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                  </div>
                ))}
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Contexte de test */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Contexte de test pour prévisualisation
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de test
                  </label>
                  <Input
                    type="date"
                    value={dateTest}
                    onChange={(e) => setDateTest(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code fournisseur de test
                  </label>
                  <Input
                    value={contexteTest.fournisseur.code}
                    onChange={(e) => setContexteTest(prev => ({
                      ...prev,
                      fournisseur: { ...prev.fournisseur, code: e.target.value }
                    }))}
                    placeholder="FOUR001"
                    className="w-full"
                  />
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <GestalisButton
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Sauvegarder la configuration
                </>
              )}
            </GestalisButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresNumerotation;
