import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, FileSpreadsheet, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    // Rediriger vers l'onglet Produits de la page Achats
    navigate('/achats?tab=produits&create=true');
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
