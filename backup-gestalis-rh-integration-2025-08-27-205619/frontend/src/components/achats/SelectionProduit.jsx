import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, FileSpreadsheet, Download, Upload } from 'lucide-react';
import { Input } from '../../components/ui/input';
import produitsService from '../../services/produitsService';
import prixAlertService from '../../services/prixAlertService';
import AlertePrixModal from './AlertePrixModal';

const SelectionProduit = ({ 
  produitSelectionne, 
  onSelectionner, 
  onNouveauProduit,
  categorieFiltree = null,
  fournisseurFiltre = null
}) => {
  const [recherche, setRecherche] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNouveauProduit, setShowNouveauProduit] = useState(false);
  const [nouveauProduit, setNouveauProduit] = useState({
    code: '',
    designation: '',
    categorie: categorieFiltree || 'Divers',
    unite: '',
    prixUnitaire: 0,
    description: '',
    fournisseur: fournisseurFiltre || ''
  });
  const [erreurs, setErreurs] = useState({});
  const [showImportExport, setShowImportExport] = useState(false);
  const [alertePrix, setAlertePrix] = useState(null);
  const [produitEnSelection, setProduitEnSelection] = useState(null);
  const wrapperRef = useRef(null);

  // Charger les suggestions au changement de recherche avec tri intelligent
  useEffect(() => {
    if (recherche.trim()) {
      const resultats = produitsService.rechercherProduits(recherche, categorieFiltree);
      
      // Tri intelligent par priorité fournisseur
      const resultatsTries = trierParPrioriteFournisseur(resultats, fournisseurFiltre);
      
      setSuggestions(resultatsTries);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [recherche, categorieFiltree, fournisseurFiltre]);

  // Fonction de tri intelligent par priorité fournisseur
  const trierParPrioriteFournisseur = (produits, fournisseurFacture) => {
    if (!fournisseurFacture) return produits;

    return produits.sort((a, b) => {
      const aEstFournisseurFacture = a.fournisseur === fournisseurFacture;
      const bEstFournisseurFacture = b.fournisseur === fournisseurFacture;
      
      // 1er critère : Fournisseur de la facture en priorité
      if (aEstFournisseurFacture && !bEstFournisseurFacture) return -1;
      if (!aEstFournisseurFacture && bEstFournisseurFacture) return 1;
      
      // 2ème critère : Fréquence d'usage (plus utilisé = plus prioritaire)
      const usageA = a.compteurUtilisation || 0;
      const usageB = b.compteurUtilisation || 0;
      
      return usageB - usageA;
    });
  };

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowImportExport(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Sélectionner un produit avec vérification des prix
  const selectionnerProduit = (produit) => {
    // Vérifier s'il y a une variation de prix
    if (fournisseurFiltre && produit.fournisseur === fournisseurFiltre) {
      const alerte = prixAlertService.detecterVariationPrix(
        produit.id, 
        produit.fournisseur, 
        produit.prixUnitaire
      );
      
      if (alerte) {
        // Afficher l'alerte avant de sélectionner
        setAlertePrix(alerte);
        setProduitEnSelection(produit);
        setShowSuggestions(false);
        return;
      }
    }
    
    // Pas d'alerte, sélectionner directement
    finaliserSelectionProduit(produit);
  };

  // Finaliser la sélection du produit (après gestion de l'alerte)
  const finaliserSelectionProduit = (produit) => {
    onSelectionner(produit);
    setRecherche(produit.designation);
    setShowSuggestions(false);
    produitsService.incrementerUtilisation(produit.id);
    
    // Enregistrer le prix dans l'historique (simulation avec données factices)
    if (fournisseurFiltre) {
      prixAlertService.enregistrerPrix(
        produit.id,
        produit.fournisseur,
        produit.prixUnitaire,
        new Date().toISOString(),
        'FACT-' + Date.now() // Numéro de facture simulé
      );
    }
  };

  // Gérer les actions de l'alerte prix
  const handleAccepterPrix = () => {
    if (produitEnSelection) {
      finaliserSelectionProduit(produitEnSelection);
    }
    setAlertePrix(null);
    setProduitEnSelection(null);
  };

  const handleModifierPrix = () => {
    // Ici on pourrait ouvrir un modal de modification du prix
    // Pour l'instant, on accepte le prix
    handleAccepterPrix();
  };

  const handleAnnulerSelection = () => {
    setAlertePrix(null);
    setProduitEnSelection(null);
    setShowSuggestions(true);
  };

  const handleFermerAlerte = () => {
    setAlertePrix(null);
    setProduitEnSelection(null);
    setShowSuggestions(true);
  };

  // Ouvrir le formulaire de nouveau produit
  const ouvrirNouveauProduit = () => {
    setNouveauProduit({
      code: '',
      designation: '',
      categorie: categorieFiltree || 'Divers',
      unite: '',
      prixUnitaire: 0,
      description: '',
      fournisseur: fournisseurFiltre || ''
    });
    setErreurs({});
    setShowNouveauProduit(true);
    setShowSuggestions(false);
  };

  // Sauvegarder le nouveau produit
  const sauvegarderProduit = () => {
    // Validation manuelle
    const erreurs = {};
    
    if (!nouveauProduit.code.trim()) erreurs['Le code est obligatoire'] = true;
    if (!nouveauProduit.designation.trim()) erreurs['La désignation est obligatoire'] = true;
    if (!nouveauProduit.categorie.trim()) erreurs['La catégorie est obligatoire'] = true;
    if (!nouveauProduit.unite.trim()) erreurs['L\'unité est obligatoire'] = true;
    if (nouveauProduit.prixUnitaire <= 0) erreurs['Le prix unitaire doit être positif'] = true;
    if (!nouveauProduit.fournisseur.trim()) erreurs['Le fournisseur est obligatoire'] = true;
    
    if (Object.keys(erreurs).length > 0) {
      setErreurs(erreurs);
      return;
    }
    
    // Si validation OK, utiliser le service
    const validation = produitsService.validerProduit(nouveauProduit);
    
    if (validation.valide) {
      const produitSauvegarde = produitsService.sauvegarderProduit(nouveauProduit);
      if (produitSauvegarde) {
        onNouveauProduit(nouveauProduit);
        setShowNouveauProduit(false);
        setRecherche(nouveauProduit.designation);
        // Recharger les suggestions
        const resultats = produitsService.rechercherProduits(recherche, categorieFiltree);
        const resultatsTries = trierParPrioriteFournisseur(resultats, fournisseurFiltre);
        setSuggestions(resultatsTries);
      }
    } else {
      setErreurs(validation.erreurs.reduce((acc, err) => {
        acc[err] = err;
        return acc;
      }, {}));
    }
  };

  // Gérer l'import CSV
  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const resultat = await produitsService.importerCSV(file);
      if (resultat.success) {
        alert(`Import réussi : ${resultat.importes} produits importés sur ${resultat.total} total`);
        // Recharger les suggestions
        const resultats = produitsService.rechercherProduits(recherche, categorieFiltree);
        const resultatsTries = trierParPrioriteFournisseur(resultats, fournisseurFiltre);
        setSuggestions(resultatsTries);
      } else {
        alert(`Erreur lors de l'import : ${resultat.error}`);
      }
    }
  };

  // Gérer l'export CSV
  const handleExportCSV = () => {
    const success = produitsService.exporterCSV();
    if (success) {
      alert('Export CSV réussi !');
    } else {
      alert('Erreur lors de l\'export CSV');
    }
  };

  // Obtenir les catégories disponibles
  const categories = produitsService.obtenirCategories();

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Champ de recherche */}
      <div className="relative">
        <Input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Rechercher un produit/service..."
          className="w-full pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <button
            type="button"
            onClick={() => setShowImportExport(!showImportExport)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Import/Export"
          >
            <FileSpreadsheet className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={ouvrirNouveauProduit}
            className="p-1 text-blue-400 hover:text-blue-600"
            title="Nouveau produit"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Suggestions avec tri intelligent */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((produit) => (
            <div
              key={produit.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => selectionnerProduit(produit)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{produit.designation}</div>
                  <div className="text-sm text-gray-600">
                    {produit.code} • {produit.categorie} • {produit.unite}
                  </div>
                  {/* Affichage du fournisseur avec indicateur de priorité */}
                  <div className="text-xs text-blue-600 font-medium">
                    {produit.fournisseur}
                    {produit.fournisseur === fournisseurFiltre && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        Fournisseur facture
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-blue-600">
                    {produitsService.formaterNombre(produit.prixUnitaire)}€
                  </div>
                  <div className="text-xs text-gray-500">
                    {produit.compteurUtilisation || 0} utilisations
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aucun résultat */}
      {showSuggestions && recherche.trim() && suggestions.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500">
            <p>Aucun produit trouvé</p>
            <button
              onClick={ouvrirNouveauProduit}
              className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
            >
              Créer ce produit
            </button>
          </div>
        </div>
      )}

      {/* Modal nouveau produit */}
      {showNouveauProduit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Nouveau produit/service
              </h3>
              <button
                onClick={() => setShowNouveauProduit(false)}
                className="text-white hover:text-blue-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code *
                  </label>
                  <Input
                    value={nouveauProduit.code}
                    onChange={(e) => setNouveauProduit({...nouveauProduit, code: e.target.value})}
                    placeholder="Ex: CARB-001"
                    className="w-full"
                  />
                  {erreurs['Le code est obligatoire'] && (
                    <p className="text-xs text-red-600 mt-1">Le code est obligatoire</p>
                  )}
                  {erreurs['Ce code existe déjà'] && (
                    <p className="text-xs text-red-600 mt-1">Ce code existe déjà</p>
                  )}
                </div>

                {/* Désignation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Désignation *
                  </label>
                  <Input
                    value={nouveauProduit.designation}
                    onChange={(e) => setNouveauProduit({...nouveauProduit, designation: e.target.value})}
                    placeholder="Nom du produit/service"
                    className="w-full"
                  />
                  {erreurs['La désignation est obligatoire'] && (
                    <p className="text-xs text-red-600 mt-1">La désignation est obligatoire</p>
                  )}
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={nouveauProduit.categorie}
                    onChange={(e) => setNouveauProduit({...nouveauProduit, categorie: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {erreurs['La catégorie est obligatoire'] && (
                    <p className="text-xs text-red-600 mt-1">La catégorie est obligatoire</p>
                  )}
                </div>

                {/* Unité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unité *
                  </label>
                  <Input
                    value={nouveauProduit.unite}
                    onChange={(e) => setNouveauProduit({...nouveauProduit, unite: e.target.value})}
                    placeholder="Ex: L, Kg, H, etc."
                    className="w-full"
                  />
                  {erreurs['L\'unité est obligatoire'] && (
                    <p className="text-xs text-red-600 mt-1">L'unité est obligatoire</p>
                  )}
                </div>

                {/* Prix unitaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix unitaire HT *
                  </label>
                  <Input
                    type="number"
                    value={nouveauProduit.prixUnitaire}
                    onChange={(e) => setNouveauProduit({...nouveauProduit, prixUnitaire: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full"
                  />
                  {erreurs['Le prix unitaire doit être positif'] && (
                    <p className="text-xs text-red-600 mt-1">Le prix unitaire doit être positif</p>
                  )}
                </div>

                {/* Fournisseur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fournisseur *
                  </label>
                  <Input
                    value={nouveauProduit.fournisseur}
                    onChange={(e) => setNouveauProduit({...nouveauProduit, fournisseur: e.target.value})}
                    placeholder="Nom du fournisseur"
                    className="w-full"
                  />
                  {erreurs['Le fournisseur est obligatoire'] && (
                    <p className="text-xs text-red-600 mt-1">Le fournisseur est obligatoire</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={nouveauProduit.description}
                    onChange={(e) => setNouveauProduit({...nouveauProduit, description: e.target.value})}
                    placeholder="Description optionnelle du produit/service"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowNouveauProduit(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={sauvegarderProduit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Créer le produit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import/Export */}
      {showImportExport && (
        <div className="absolute z-20 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-48">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Import CSV
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <div className="border-t pt-3">
              <button
                onClick={handleExportCSV}
                className="w-full px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center justify-center gap-2 text-sm"
              >
                <Download className="h-4 w-4" />
                Exporter CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'alerte prix */}
      <AlertePrixModal
        alerte={alertePrix}
        onAccepter={handleAccepterPrix}
        onModifier={handleModifierPrix}
        onAnnuler={handleAnnulerSelection}
        onFermer={handleFermerAlerte}
      />
    </div>
  );
};

export default SelectionProduit;
