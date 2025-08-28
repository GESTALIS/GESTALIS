import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Plus, 
  Save, 
  ArrowLeft,
  X,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../components/ui/GestalisCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ParametresComptables = () => {
  // État des paramètres comptables
  const [parametres, setParametres] = useState({
    // Mapping catégorie → compte de charge
    mappingCategories: [
      { id: 1, categorie: 'Carburant', compteSuggere: '6061', compteSelectionne: '6061', actif: true },
      { id: 2, categorie: 'Location', compteSuggere: '6062', compteSelectionne: '6062', actif: true },
      { id: 3, categorie: 'Matériaux', compteSuggere: '602', compteSelectionne: '602', actif: true },
      { id: 4, categorie: 'Sous-traitance', compteSuggere: '604', compteSelectionne: '604', actif: true },
      { id: 5, categorie: 'Transport', compteSuggere: '624', compteSelectionne: '624', actif: true },
      { id: 6, categorie: 'Divers', compteSuggere: '6064', compteSelectionne: '6064', actif: true }
    ],
    
    // Configuration des exports comptables
    exportComptable: {
      colonnes: [
        { id: 'date', label: 'Date', visible: true, ordre: 1 },
        { id: 'numeroPiece', label: 'N° Pièce', visible: true, ordre: 2 },
        { id: 'compte', label: 'N° Compte', visible: true, ordre: 3 },
        { id: 'libelle', label: 'Libellé', visible: true, ordre: 4 },
        { id: 'colonneVide1', label: '[Vide]', visible: true, ordre: 5 },
        { id: 'colonneVide2', label: '[Vide]', visible: true, ordre: 6 },
        { id: 'debit', label: 'Débit', visible: true, ordre: 7 },
        { id: 'credit', label: 'Crédit', visible: true, ordre: 8 }
      ],
      formatLibelle: '[Nom Fournisseur] - [Chantier] - [Nom Article]',
      compteTvaDeductible: '44566',
      compteFournisseurPrefix: 'F'
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAjouterCategorie, setShowAjouterCategorie] = useState(false);
  const [nouvelleCategorie, setNouvelleCategorie] = useState({
    categorie: '',
    compteSuggere: '',
    compteSelectionne: ''
  });

  // Charger les paramètres au démarrage
  useEffect(() => {
    chargerParametres();
  }, []);

  // Charger les paramètres depuis localStorage
  const chargerParametres = () => {
    try {
      const parametresSauvegardes = localStorage.getItem('gestalis_parametres_comptables');
      if (parametresSauvegardes) {
        setParametres(JSON.parse(parametresSauvegardes));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres comptables:', error);
    }
  };

  // Sauvegarder les paramètres
  const sauvegarderParametres = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (parametres.mappingCategories.some(m => !m.compteSelectionne)) {
        alert('Toutes les catégories doivent avoir un compte sélectionné');
        return;
      }
      
      // Sauvegarder dans localStorage
      localStorage.setItem('gestalis_parametres_comptables', JSON.stringify(parametres));
      
      alert('✅ Paramètres comptables sauvegardés avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Ajouter une nouvelle catégorie
  const ajouterCategorie = () => {
    if (!nouvelleCategorie.categorie || !nouvelleCategorie.compteSelectionne) {
      alert('Veuillez remplir la catégorie et le compte');
      return;
    }
    
    const nouvelleCategorieComplete = {
      id: Date.now(),
      categorie: nouvelleCategorie.categorie,
      compteSuggere: nouvelleCategorie.compteSuggere || nouvelleCategorie.compteSelectionne,
      compteSelectionne: nouvelleCategorie.compteSelectionne,
      actif: true
    };
    
    setParametres(prev => ({
      ...prev,
      mappingCategories: [...prev.mappingCategories, nouvelleCategorieComplete]
    }));
    
    setNouvelleCategorie({ categorie: '', compteSuggere: '', compteSelectionne: '' });
    setShowAjouterCategorie(false);
  };

  // Modifier une catégorie
  const modifierCategorie = (id, field, value) => {
    setParametres(prev => ({
      ...prev,
      mappingCategories: prev.mappingCategories.map(m => 
        m.id === id ? { ...m, [field]: value } : m
      )
    }));
  };

  // Supprimer une catégorie
  const supprimerCategorie = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setParametres(prev => ({
        ...prev,
        mappingCategories: prev.mappingCategories.filter(m => m.id !== id)
      }));
    }
  };

  // Activer/désactiver une catégorie
  const toggleCategorie = (id) => {
    setParametres(prev => ({
      ...prev,
      mappingCategories: prev.mappingCategories.map(m => 
        m.id === id ? { ...m, actif: !m.actif } : m
      )
    }));
  };

  // Modifier la configuration d'export
  const modifierExport = (field, value) => {
    setParametres(prev => ({
      ...prev,
      exportComptable: {
        ...prev.exportComptable,
        [field]: value
      }
    }));
  };

  // Modifier l'ordre des colonnes
  const modifierOrdreColonne = (id, direction) => {
    setParametres(prev => {
      const colonnes = [...prev.exportComptable.colonnes];
      const index = colonnes.findIndex(c => c.id === id);
      
      if (direction === 'up' && index > 0) {
        [colonnes[index], colonnes[index - 1]] = [colonnes[index - 1], colonnes[index]];
      } else if (direction === 'down' && index < colonnes.length - 1) {
        [colonnes[index], colonnes[index + 1]] = [colonnes[index + 1], colonnes[index]];
      }
      
      // Mettre à jour l'ordre
      colonnes.forEach((col, idx) => {
        col.ordre = idx + 1;
      });
      
      return {
        ...prev,
        exportComptable: {
          ...prev.exportComptable,
          colonnes
        }
      };
    });
  };

  // Exporter la configuration
  const exporterConfiguration = () => {
    try {
      const dataStr = JSON.stringify(parametres, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'gestalis_parametres_comptables.json';
      link.click();
      URL.revokeObjectURL(url);
      
      alert('✅ Configuration exportée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('❌ Erreur lors de l\'export');
    }
  };

  // Importer la configuration
  const importerConfiguration = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          setParametres(config);
          alert('✅ Configuration importée avec succès !');
        } catch (error) {
          console.error('Erreur lors de l\'import:', error);
          alert('❌ Erreur lors de l\'import - Format invalide');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <Calculator className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Paramètres Comptables
              </h1>
              <p className="text-blue-100 text-lg">
                Configuration du mapping catégorie → compte et des exports comptables
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          
          {/* Actions rapides */}
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setShowAjouterCategorie(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une catégorie
            </Button>
            
            <Button
              onClick={sauvegarderParametres}
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            
            <Button
              onClick={exporterConfiguration}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importerConfiguration}
                className="hidden"
                id="importConfig"
              />
              <Button
                onClick={() => document.getElementById('importConfig').click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importer
              </Button>
            </div>
          </div>

          {/* Mapping Catégorie → Compte */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Mapping Catégorie → Compte de Charge
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Catégorie</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Compte suggéré</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Compte sélectionné</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parametres.mappingCategories.map((mapping) => (
                      <tr key={mapping.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Input
                            value={mapping.categorie}
                            onChange={(e) => modifierCategorie(mapping.id, 'categorie', e.target.value)}
                            className="w-full"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            value={mapping.compteSuggere}
                            onChange={(e) => modifierCategorie(mapping.id, 'compteSuggere', e.target.value)}
                            className="w-full"
                            placeholder="Compte suggéré"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            value={mapping.compteSelectionne}
                            onChange={(e) => modifierCategorie(mapping.id, 'compteSelectionne', e.target.value)}
                            className="w-full font-medium"
                            placeholder="Compte obligatoire"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleCategorie(mapping.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              mapping.actif 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {mapping.actif ? 'Actif' : 'Inactif'}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => supprimerCategorie(mapping.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Configuration Export Comptable */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Configuration Export Comptable
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-6">
              
              {/* Format du libellé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format du libellé automatique
                </label>
                <Input
                  value={parametres.exportComptable.formatLibelle}
                  onChange={(e) => modifierExport('formatLibelle', e.target.value)}
                  className="w-full"
                  placeholder="[Nom Fournisseur] - [Chantier] - [Nom Article]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Variables disponibles : [Nom Fournisseur], [Chantier], [Nom Article], [Catégorie]
                </p>
              </div>

              {/* Comptes spéciaux */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compte TVA déductible
                  </label>
                  <Input
                    value={parametres.exportComptable.compteTvaDeductible}
                    onChange={(e) => modifierExport('compteTvaDeductible', e.target.value)}
                    className="w-full"
                    placeholder="44566"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Compte pour la TVA (0% en Guyane)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Préfixe comptes fournisseurs
                  </label>
                  <Input
                    value={parametres.exportComptable.compteFournisseurPrefix}
                    onChange={(e) => modifierExport('compteFournisseurPrefix', e.target.value)}
                    className="w-full"
                    placeholder="F"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Préfixe pour les comptes fournisseurs (ex: F)
                  </p>
                </div>
              </div>

              {/* Ordre des colonnes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre des colonnes d'export
                </label>
                <div className="space-y-2">
                  {parametres.exportComptable.colonnes.map((colonne) => (
                    <div key={colonne.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex gap-2">
                        <button
                          onClick={() => modifierOrdreColonne(colonne.id, 'up')}
                          disabled={colonne.ordre === 1}
                          className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => modifierOrdreColonne(colonne.id, 'down')}
                          disabled={colonne.ordre === parametres.exportComptable.colonnes.length}
                          className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                        >
                          ↓
                        </button>
                      </div>
                      
                      <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                        {colonne.ordre}.
                      </span>
                      
                      <span className="text-sm text-gray-600 flex-1">
                        {colonne.label}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={colonne.visible}
                          onChange={(e) => {
                            const colonnes = parametres.exportComptable.colonnes.map(c => 
                              c.id === colonne.id ? { ...c, visible: e.target.checked } : c
                            );
                            modifierExport('colonnes', colonnes);
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-xs text-gray-500">Visible</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>
        </div>
      </div>

      {/* Modal Ajouter Catégorie */}
      {showAjouterCategorie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Ajouter une catégorie
              </h3>
              <button
                onClick={() => setShowAjouterCategorie(false)}
                className="text-white hover:text-blue-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la catégorie *
                </label>
                <Input
                  value={nouvelleCategorie.categorie}
                  onChange={(e) => setNouvelleCategorie({...nouvelleCategorie, categorie: e.target.value})}
                  placeholder="Ex: Carburant, Location, etc."
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compte suggéré
                </label>
                <Input
                  value={nouvelleCategorie.compteSuggere}
                  onChange={(e) => setNouvelleCategorie({...nouvelleCategorie, compteSuggere: e.target.value})}
                  placeholder="Ex: 6061, 6062, etc."
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compte sélectionné *
                </label>
                <Input
                  value={nouvelleCategorie.compteSelectionne}
                  onChange={(e) => setNouvelleCategorie({...nouvelleCategorie, compteSelectionne: e.target.value})}
                  placeholder="Ex: 6061, 6062, etc."
                  className="w-full"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
              <Button
                onClick={() => setShowAjouterCategorie(false)}
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                onClick={ajouterCategorie}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParametresComptables;
