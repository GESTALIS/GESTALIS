import React, { useState, useEffect } from 'react';
import { Plus, Minus, Save, X, ArrowLeft, FileText, Calculator, Upload, Search, Settings, FileImage } from 'lucide-react';
import { GestalisCard, GestalisCardContent, GestalisCardHeader, GestalisCardTitle } from '../../components/ui/GestalisCard';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import numerotationService from '../../services/numerotationService';
import ventilationService from '../../services/ventilationService';
import produitsService from '../../services/produitsService';
import VentilationMultiChantiers from '../../components/achats/VentilationMultiChantiers';
import SelectionProduit from '../../components/achats/SelectionProduit';
import ParametresDecimales from '../../components/ui/ParametresDecimales';
import ExportEcrituresComptables from '../../components/comptabilite/ExportEcrituresComptables';
// NOUVEAUX IMPORTS POUR SMARTPICKER
import SmartPicker from '../../components/SmartPicker';
import { searchFournisseurs, searchChantiers, searchEmployes } from '../../services/searchService';


const NouvelleFacture = ({ parametresEtape1, onRetourEtape1 }) => {
  // État principal de la facture
  const [facture, setFacture] = useState({
    // En-tête (reçu de l'étape 1)
    typePiece: parametresEtape1?.typePiece || 'FACTURE_ACHAT',
    numeroPiece: parametresEtape1?.numeroPiece || '', // Reçu de l'étape 1
    periode: parametresEtape1?.periode || '',
    
    // Champs utilisateur
    numeroFacture: '',         // Numéro de facture manuel (libre)
    dateFacture: new Date().toISOString().split('T')[0],
    fournisseur: '',
    chantier: '',
    echeance: '',
    
    // Lignes de facture
    lignes: [
      {
        id: 1,
        produit: null,
        designation: '',
        categorie: 'Divers',
        unite: 'U',
        quantite: 1,
        prixUnitaire: 0,
        montantHT: 0,
        tva: 0 // TVA fixée à 0% (Article Guyane)
      }
    ],
    
    // Totaux
    sousTotalHT: 0,
    netAPayer: 0,
    
    // Retenue de garantie (uniquement pour sous-traitants)
    retenueGarantie: 0,
    retenuePourcentage: 5, // Par défaut 5% pour sous-traitants
    
    // Cession de créance
    cessionCreance: false,
    
    // Facture sous-traitant
    factureSousTraitant: false,
    
    // Sous-traitant sélectionné
    sousTraitantSelection: '',
    
    // Cession de créance sélectionnée
    cessionCreanceSelection: '',
    
    // Pièces jointes
    piecesJointes: [],
    
    // Notes
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showImportPDF, setShowImportPDF] = useState(false);
  
  // États pour les suggestions et modales
  const [showFournisseurSuggestions, setShowFournisseurSuggestions] = useState(false);
  const [showChantierSuggestions, setShowChantierSuggestions] = useState(false);
  const [showCessionSuggestions, setShowCessionSuggestions] = useState(false);
  const [showSousTraitantSuggestions, setShowSousTraitantSuggestions] = useState(false);
  
  // NOUVEAUX useEffect POUR GÉRER LE RETOUR SMARTPICKER
  useEffect(() => {
    // Gérer le retour depuis la création de fournisseur
    const selectedFournisseur = localStorage.getItem('selectedFournisseur');
    if (selectedFournisseur) {
      try {
        const fournisseur = JSON.parse(selectedFournisseur);
        setFacture(prev => ({
          ...prev,
          fournisseur: fournisseur
        }));
        
        // Nettoyer le localStorage
        localStorage.removeItem('selectedFournisseur');
        
        console.log('✅ Fournisseur sélectionné automatiquement:', fournisseur);
      } catch (error) {
        console.error('Erreur lors du parsing du fournisseur sélectionné:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Gérer le retour depuis la création de chantier
    const selectedChantier = localStorage.getItem('selectedChantier');
    if (selectedChantier) {
      try {
        const chantier = JSON.parse(selectedChantier);
        setFacture(prev => ({
          ...prev,
          chantier: chantier
        }));
        
        // Nettoyer le localStorage
        localStorage.removeItem('selectedChantier');
        
        console.log('✅ Chantier sélectionné automatiquement:', chantier);
      } catch (error) {
        console.error('Erreur lors du parsing du chantier sélectionné:', error);
      }
    }
  }, []);

  // États pour la ventilation multi-chantiers
  const [showVentilation, setShowVentilation] = useState(false);
  const [ligneVentilation, setLigneVentilation] = useState(null);
  const [modelesVentilation, setModelesVentilation] = useState([]);
  
  // État pour les paramètres des décimales
  const [showParametresDecimales, setShowParametresDecimales] = useState(false);
  
  // État pour la comptabilisation
  const [showComptabilisation, setShowComptabilisation] = useState(false);

  // États pour le système d'alerte de changement de prix
  const [alertesPrix, setAlertesPrix] = useState({});
  const [showAlerteVariation, setShowAlerteVariation] = useState(null);
  const [prixHistorique, setPrixHistorique] = useState({});

  // Calculs automatiques
  useEffect(() => {
    calculerTotaux();
  }, [facture.lignes, facture.retenuePourcentage, facture.factureSousTraitant]);

  // Calculer l'échéance automatiquement
  useEffect(() => {
    if (facture.dateFacture && facture.echeance) {
      // L'échéance est maintenant gérée manuellement par l'utilisateur
      // Pas de calcul automatique
    }
  }, [facture.dateFacture]);

  // NOUVEAUX useEffect POUR GÉRER LE RETOUR SMARTPICKER
  useEffect(() => {
    // Gérer le retour depuis la création de fournisseur
    const selectedFournisseur = localStorage.getItem('selectedFournisseur');
    if (selectedFournisseur) {
      try {
        const fournisseur = JSON.parse(selectedFournisseur);
        setFacture(prev => ({
          ...prev,
          fournisseur: fournisseur
        }));
        localStorage.removeItem('selectedFournisseur');
        console.log('✅ Fournisseur sélectionné automatiquement:', fournisseur);
      } catch (error) {
        console.error('Erreur lors du parsing du fournisseur sélectionné:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Gérer le retour depuis la création de chantier
    const selectedChantier = localStorage.getItem('selectedChantier');
    if (selectedChantier) {
      try {
        const chantier = JSON.parse(selectedChantier);
        setFacture(prev => ({
          ...prev,
          chantier: chantier
        }));
        localStorage.removeItem('selectedChantier');
        console.log('✅ Chantier sélectionné automatiquement:', chantier);
      } catch (error) {
        console.error('Erreur lors du parsing du chantier sélectionné:', error);
      }
    }
  }, []);

  // Calculer les totaux
  const calculerTotaux = () => {
    let sousTotal = 0;
    
    facture.lignes.forEach(ligne => {
      const montantLigne = (ligne.quantite * ligne.prixUnitaire);
      sousTotal += montantLigne;
    });
    
    // Retenue de garantie uniquement pour factures de sous-traitants
    let retenue = 0;
    let net = sousTotal;
    
    if (facture.factureSousTraitant && facture.retenuePourcentage > 0) {
      retenue = (sousTotal * facture.retenuePourcentage) / 100;
      net = sousTotal - retenue;
    }
    
    setFacture(prev => ({
      ...prev,
      sousTotalHT: sousTotal,
      retenueGarantie: retenue,
      netAPayer: net
    }));
  };



  // Validation que la date correspond à la période sélectionnée
  const validerDatePeriode = () => {
    if (!parametresEtape1) return true; // Pas de validation si pas d'étape 1
    
    const dateFacture = new Date(facture.dateFacture);
    const moisFacture = dateFacture.getMonth() + 1;
    const anneeFacture = dateFacture.getFullYear();
    
    // Extraire mois et année de la période sélectionnée
    const periodeMatch = facture.periode.match(/(\w+)\s+(\d{4})/);
    if (periodeMatch) {
      const moisSelectionne = getMoisFromLabel(periodeMatch[1]);
      const anneeSelectionnee = parseInt(periodeMatch[2]);
      
      return moisFacture === moisSelectionne && anneeFacture === anneeSelectionnee;
    }
    
    return true; // Si pas de période, pas de validation
  };

  // ===== SYSTÈME D'ALERTE DE CHANGEMENT DE PRIX =====
  
  // Charger l'historique des prix au démarrage
  useEffect(() => {
    const historique = JSON.parse(localStorage.getItem('gestalis-prix-historiques') || '{}');
    setPrixHistorique(historique);
  }, []);

  // Fonction pour générer la clé d'un produit
  const genererCleProduit = (fournisseur, designation) => {
    if (!fournisseur || !designation) return null;
    return `${fournisseur.toLowerCase().trim()}-${designation.toLowerCase().trim()}`;
  };

  // Fonction pour détecter les variations de prix
  const detecterVariationPrix = (ligne, nouveauPrix, index) => {
    if (!facture.fournisseur || !ligne.designation || !nouveauPrix || nouveauPrix <= 0) {
      return { alert: false };
    }

    const cle = genererCleProduit(facture.fournisseur, ligne.designation);
    if (!cle) return { alert: false };

    const ancienPrix = prixHistorique[cle]?.prix || null;
    
    if (ancienPrix && ancienPrix > 0 && Math.abs(nouveauPrix - ancienPrix) > 0.01) {
      const variation = ((nouveauPrix - ancienPrix) / ancienPrix) * 100;
      const seuilAlerte = 5; // 5% de variation pour déclencher l'alerte
      
      if (Math.abs(variation) >= seuilAlerte) {
        return {
          alert: true,
          variation: variation,
          ancienPrix: ancienPrix,
          nouveauPrix: nouveauPrix,
          pourcentage: Math.abs(variation).toFixed(1),
          type: variation > 0 ? 'augmentation' : 'diminution',
          message: `Prix ${variation > 0 ? 'augmenté' : 'diminué'} de ${Math.abs(variation).toFixed(1)}%`,
          dateAncien: prixHistorique[cle]?.date || 'Inconnue',
          ligneIndex: index
        };
      }
    }
    
    return { alert: false };
  };

  // Fonction pour sauvegarder un prix dans l'historique
  const sauvegarderPrixHistorique = (fournisseur, designation, prix) => {
    if (!fournisseur || !designation || !prix || prix <= 0) return;
    
    const cle = genererCleProduit(fournisseur, designation);
    if (!cle) return;

    const nouvelHistorique = {
      ...prixHistorique,
      [cle]: {
        prix: parseFloat(prix),
        date: new Date().toISOString(),
        fournisseur: fournisseur,
        designation: designation
      }
    };

    setPrixHistorique(nouvelHistorique);
    localStorage.setItem('gestalis-prix-historiques', JSON.stringify(nouvelHistorique));
  };

  // Fonction pour afficher l'alerte de variation de prix
  const afficherAlerteVariationPrix = (variation) => {
    setShowAlerteVariation(variation);
    
    // Marquer cette ligne comme ayant une alerte
    setAlertesPrix(prev => ({
      ...prev,
      [variation.ligneIndex]: variation
    }));
  };

  // Fonction pour fermer l'alerte de variation
  const fermerAlerteVariation = () => {
    setShowAlerteVariation(null);
  };

  // Fonction pour accepter le nouveau prix et mettre à jour l'historique
  const accepterNouveauPrix = () => {
    if (showAlerteVariation) {
      const ligne = facture.lignes[showAlerteVariation.ligneIndex];
      sauvegarderPrixHistorique(facture.fournisseur, ligne.designation, showAlerteVariation.nouveauPrix);
      
      // Retirer l'alerte pour cette ligne
      setAlertesPrix(prev => {
        const newAlertes = { ...prev };
        delete newAlertes[showAlerteVariation.ligneIndex];
        return newAlertes;
      });
    }
    fermerAlerteVariation();
  };

  // Fonctions pour les suggestions
  const getFournisseurSuggestions = () => {
    // Récupérer depuis localStorage
    const fournisseurs = JSON.parse(localStorage.getItem('gestalis-fournisseurs') || '[]');
    
    if (!facture.fournisseur) return [];
    
    return fournisseurs.filter(f => 
      f.raisonSociale?.toLowerCase().includes(facture.fournisseur.toLowerCase()) ||
      f.codeFournisseur?.toLowerCase().includes(facture.fournisseur.toLowerCase()) ||
      f.siret?.includes(facture.fournisseur)
    ).map(f => ({
      nom: f.raisonSociale,
      ville: f.ville || 'N/A',
      conditions: f.estSousTraitant ? 'Sous-traitant' : 'Standard'
    }));
  };

  const getChantierSuggestions = () => {
    // Récupérer depuis localStorage
    const chantiers = JSON.parse(localStorage.getItem('gestalis-chantiers') || '[]');
    
    if (!facture.chantier) return [];
    
    return chantiers.filter(c => 
      c.nom?.toLowerCase().includes(facture.chantier.toLowerCase()) ||
      c.codeChantier?.toLowerCase().includes(facture.chantier.toLowerCase()) ||
      c.clientNom?.toLowerCase().includes(facture.chantier.toLowerCase())
    ).map(c => ({
      id: c.id,
      nom: c.nom,
      adresse: `${c.adresse || ''} ${c.codePostal || ''} ${c.ville || ''}`.trim() || 'Adresse non renseignée'
    }));
  };

  const getCessionSuggestions = () => {
    // TODO: Récupérer depuis l'API
    // Pour l'instant, données de test pré-filtrées par chantier
    const cessions = [
      { reference: 'Cession-001', client: 'Client A', montant: '1500.00', statut: 'En cours' },
      { reference: 'Cession-002', client: 'Client B', montant: '2000.00', statut: 'Terminée' },
      { reference: 'Cession-003', client: 'Client A', montant: '1000.00', statut: 'En cours' },
      { reference: 'Cession-004', client: 'Client C', montant: '3000.00', statut: 'Terminée' }
    ];

    if (!facture.chantier) return [];

    return cessions.filter(c => 
      c.client.toLowerCase().includes(facture.chantier.toLowerCase())
    );
  };

  const getSousTraitantSuggestions = () => {
    // TODO: Récupérer depuis l'API
    // Pour l'instant, données de test
    const sousTraitants = [
      { nom: 'Entreprise A', specialite: 'Travaux de maçonnerie', ville: 'Paris', statut: 'Actif' },
      { nom: 'Entreprise B', specialite: 'Travaux de peinture', ville: 'Lyon', statut: 'Actif' },
      { nom: 'Entreprise C', specialite: 'Travaux de plomberie', ville: 'Marseille', statut: 'Actif' },
      { nom: 'Entreprise D', specialite: 'Travaux de menuiserie', ville: 'Toulouse', statut: 'Actif' },
      { nom: 'Entreprise E', specialite: 'Travaux de chauffage', ville: 'Nantes', statut: 'Actif' }
    ];

    if (!facture.sousTraitantSelection) return [];

    return sousTraitants.filter(s => 
      s.nom.toLowerCase().includes(facture.sousTraitantSelection.toLowerCase())
    );
  };

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.fournisseur-field') && !event.target.closest('.chantier-field') && !event.target.closest('.cession-field') && !event.target.closest('.sous-traitant-field')) {
        setShowFournisseurSuggestions(false);
        setShowChantierSuggestions(false);
        setShowCessionSuggestions(false);
        setShowSousTraitantSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Charger les modèles de ventilation pour le fournisseur sélectionné
  useEffect(() => {
    if (facture.fournisseur) {
      const fournisseurId = facture.fournisseur.id || facture.fournisseur;
      if (fournisseurId) {
        const modeles = ventilationService.rechercherModelesParFournisseur(fournisseurId);
        setModelesVentilation(modeles);
      }
    }
  }, [facture.fournisseur]);

  // Ouvrir le modal de ventilation pour une ligne
  const ouvrirVentilation = (ligne) => {
    setLigneVentilation(ligne);
    setShowVentilation(true);
  };

  // Sauvegarder la ventilation d'une ligne
  const sauvegarderVentilation = (ventilation) => {
    if (ligneVentilation) {
      // Mettre à jour la ligne avec la ventilation
      const lignesMiseAJour = facture.lignes.map(ligne => {
        if (ligne.id === ligneVentilation.id) {
          return { ...ligne, ventilation };
        }
        return ligne;
      });
      
      handleInputChange('lignes', lignesMiseAJour);
      
      // Sauvegarder le modèle si demandé
      if (facture.fournisseur && ligneVentilation.categorie) {
        const fournisseurId = facture.fournisseur.id || facture.fournisseur;
        ventilationService.sauvegarderModele(
          fournisseurId, 
          ligneVentilation.categorie, 
          ventilation
        );
      }
      
      setShowVentilation(false);
      setLigneVentilation(null);
    }
  };

  // Annuler la ventilation
  const annulerVentilation = () => {
    setShowVentilation(false);
    setLigneVentilation(null);
  };

  // Obtenir le modèle précédent pour une ligne
  const obtenirModelePrecedent = (ligne) => {
    if (!facture.fournisseur || !ligne.categorie) return null;
    
    const fournisseurId = facture.fournisseur.id || facture.fournisseur;
    return ventilationService.chargerModele(fournisseurId, ligne.categorie);
  };

  // Helper pour convertir les noms de mois
  const getMoisFromLabel = (moisLabel) => {
    const moisMap = {
      'Janvier': 1, 'Février': 2, 'Mars': 3, 'Avril': 4,
      'Mai': 5, 'Juin': 6, 'Juillet': 7, 'Août': 8,
      'Septembre': 9, 'Octobre': 10, 'Novembre': 11, 'Décembre': 12
    };
    return moisMap[moisLabel] || 1;
  };

  // Obtenir le type de pièce sélectionné
  const getTypePieceLabel = () => {
    const types = {
      'FACTURE_ACHAT': 'Facture d\'achat',
      'AVOIR_FOURNISSEUR': 'Avoir fournisseur'
    };
    return types[facture.typePiece] || 'Document';
  };

  // Gérer les changements d'input
  const handleInputChange = (field, value) => {
    setFacture(prev => ({ ...prev, [field]: value }));
    
    // Si le fournisseur change, récupérer ses conditions de paiement
    if (field === 'fournisseur') {
      // recupererConditionsFournisseur(value); // Supprimé
    }
  };

  // Modifier une ligne de facture
  const handleLigneChange = (index, field, value) => {
    const lignesMiseAJour = [...facture.lignes];
    lignesMiseAJour[index] = { ...lignesMiseAJour[index], [field]: value };
    
    // Recalculer le montant HT si la quantité ou le prix unitaire change
    if (field === 'quantite' || field === 'prixUnitaire') {
      const ligne = lignesMiseAJour[index];
      ligne.montantHT = (ligne.quantite || 0) * (ligne.prixUnitaire || 0);
      
      // ===== SYSTÈME D'ALERTE DE CHANGEMENT DE PRIX =====
      if (field === 'prixUnitaire' && value > 0) {
        // Détecter les variations de prix
        const variation = detecterVariationPrix(lignesMiseAJour[index], value, index);
        
        if (variation.alert) {
          // Afficher l'alerte de variation
          afficherAlerteVariationPrix(variation);
        } else {
          // Retirer l'alerte si elle existait pour cette ligne
          setAlertesPrix(prev => {
            const newAlertes = { ...prev };
            delete newAlertes[index];
            return newAlertes;
          });
        }
      }
    }
    
    setFacture(prev => ({
      ...prev,
      lignes: lignesMiseAJour
    }));
  };

  // Ajouter une nouvelle ligne
  const ajouterLigne = () => {
    const nouvelleLigne = {
      id: Date.now(),
      produit: null,
      designation: '',
      quantite: 1,
      prixUnitaire: 0,
      montantHT: 0,
      categorie: 'Divers', // Catégorie par défaut pour la ventilation
      tva: 0 // TVA fixée à 0% (Article Guyane)
    };
    setFacture(prev => ({
      ...prev,
      lignes: [...prev.lignes, nouvelleLigne]
    }));
  };

  // Supprimer une ligne
  const supprimerLigne = (index) => {
    if (facture.lignes.length > 1) {
      setFacture(prev => ({
        ...prev,
        lignes: prev.lignes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImportPDF = () => {
    setShowImportPDF(true);
    // TODO: Implémenter l'import PDF avec OCR
  };

  const handleMatchingBCBL = () => {
    // TODO: Implémenter le matching automatique BC/BL
    alert('🔍 Recherche de correspondance BC/BL en cours...');
  };

  // Sauvegarder la facture
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!facture.numeroPiece || !facture.fournisseur || !facture.chantier) {
        alert('❌ Veuillez remplir les champs obligatoires (Numéro de pièce, Fournisseur, Chantier)');
        return;
      }
      
      // Validation de la date si on vient de l'étape 1
      if (parametresEtape1 && !validerDatePeriode()) {
        alert(`❌ La date de facture doit correspondre à la période sélectionnée : ${facture.periode}`);
        return;
      }
      
      if (facture.lignes.some(ligne => !ligne.designation || ligne.prixUnitaire <= 0)) {
        alert('❌ Veuillez vérifier les lignes de facture');
        return;
      }
      
      // Confirmer le numéro réservé
      if (parametresEtape1) {
        const confirmation = numerotationService.confirmerNumero(
          facture.typePiece, 
          facture.numeroPiece,
          {
            fournisseur: facture.fournisseur,
            chantier: facture.chantier,
            societe: 'GESTALIS',
            utilisateur: 'USER'
          }
        );
        
        if (!confirmation.success) {
          alert(`❌ Erreur lors de la confirmation du numéro : ${confirmation.message}`);
          return;
        }
      }
      
      // TODO: Appel API pour sauvegarder
      console.log('Facture à sauvegarder:', facture);
      
      alert('✅ Facture créée avec succès !');
      
      // Nettoyer le localStorage du workflow
      localStorage.removeItem('nouvelle-facture-etape');
      localStorage.removeItem('nouvelle-facture-params');
      
      // Retourner à la page précédente
      if (onRetourEtape1) {
        onRetourEtape1(); // Retour à l'étape 1
      } else {
        window.history.back();
      }
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Annuler la facture
  const handleCancel = () => {
    // Si on a un numéro réservé, l'annuler
    if (parametresEtape1 && facture.numeroPiece) {
      const annulation = numerotationService.annulerNumero(
        facture.typePiece,
        facture.numeroPiece,
        {
          fournisseur: facture.fournisseur,
          chantier: facture.chantier,
          societe: 'GESTALIS',
          utilisateur: 'USER'
        }
      );
      
      if (annulation.success) {
        console.log('Numéro annulé avec succès');
      }
    }
    
    if (onRetourEtape1) {
      onRetourEtape1(); // Retour à l'étape 1
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* En-tête STICKY avec actions intégrées */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-8 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Nouvelle Facture
                  {facture.numeroPiece && (
                    <span className="text-blue-100 font-normal text-xl ml-2">
                      - {facture.numeroPiece}
                    </span>
                  )}
                </h1>
                <p className="text-blue-100 text-lg">
                  {parametresEtape1 
                    ? `Étape 2 : ${getTypePieceLabel()} - ${facture.periode}`
                    : 'Créer une nouvelle facture fournisseur'
                  }
                </p>
              </div>
            </div>
            
            {/* Actions intégrées */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 mr-4">
                <button
                  onClick={() => setShowParametresDecimales(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  title="Paramètres décimales"
                >
                  <Calculator className="h-5 w-5 text-orange-400" />
                  <span className="hidden sm:inline">Décimales</span>
                </button>

                {/* Bouton Retour étape 1 si disponible */}
                {onRetourEtape1 && (
                  <button
                    onClick={onRetourEtape1}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                    title="Retour à l'étape 1"
                  >
                    <ArrowLeft className="h-5 w-5 text-blue-400" />
                    <span className="hidden sm:inline">Retour à l'étape 1</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => window.location.href = '/achats?tab=factures'}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Retour aux Factures
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-4">
        <div className="space-y-6">
          
          {/* Actions rapides */}
          <div className="flex gap-4 mb-6">
            <Button
              onClick={handleImportPDF}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importer PDF
            </Button>
            
            <Button
              onClick={handleMatchingBCBL}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Rechercher BC/BL
            </Button>
          </div>

          {/* En-tête de la facture - SANS LES BOUTONS EN DOUBLON */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle>
                Étape 2: {parametresEtape1.typePiece === 'FACTURE_ACHAT' ? 'Facture d\'achat' : 'Avoir fournisseur'} - {parametresEtape1.periode}
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de pièce *
                  </label>
                  <Input
                    value={facture.numeroPiece}
                    placeholder="Numéro auto-généré"
                    className="w-full bg-gray-100"
                    readOnly
                  />
                  {parametresEtape1 && (
                    <p className="mt-1 text-xs text-gray-500">
                      {facture.periode} - {getTypePieceLabel()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de facture
                  </label>
                  <Input
                    value={facture.numeroFacture}
                    onChange={(e) => handleInputChange('numeroFacture', e.target.value)}
                    placeholder="Référence facture (optionnel)"
                    className="w-full"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Numéro libre selon vos besoins
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date facture *
                  </label>
                  <Input
                    type="date"
                    value={facture.dateFacture}
                    onChange={(e) => handleInputChange('dateFacture', e.target.value)}
                    className={`w-full ${
                      parametresEtape1 && !validerDatePeriode() 
                        ? 'border-red-500 focus:border-red-500' 
                        : ''
                    }`}
                  />
                  {parametresEtape1 && !validerDatePeriode() && (
                    <p className="mt-1 text-xs text-red-500">
                      ⚠️ La date doit correspondre à {facture.periode}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <SmartPicker
                    value={facture.fournisseur}
                    onChange={(value) => setFacture(prev => ({ ...prev, fournisseur: value }))}
                    fetcher={searchFournisseurs}
                    placeholder="Rechercher un fournisseur..."
                    createUrl="/achats?tab=fournisseurs&create=true"
                    createLabel="Créer un fournisseur"
                    label="Fournisseur *"
                  />
                </div>
                
                <div>
                  <SmartPicker
                    value={facture.chantier}
                    onChange={(value) => setFacture(prev => ({ ...prev, chantier: value }))}
                    fetcher={searchChantiers}
                    placeholder="Rechercher un chantier..."
                    createUrl="/chantiers/nouveau"
                    createLabel="Créer un chantier"
                    label="Chantier *"
                  />
                </div>
              </div>

              {/* Conditions de paiement et échéance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance
                  </label>
                  <Input
                    type="date"
                    value={facture.echeance}
                    onChange={(e) => handleInputChange('echeance', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Options spéciales */}
              <div className="pt-4 border-t">
                {/* Section Facture sous-traitant */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="factureSousTraitant"
                      checked={facture.factureSousTraitant}
                      onChange={(e) => handleInputChange('factureSousTraitant', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="factureSousTraitant" className="text-sm font-medium text-gray-700">
                      Facture sous-traitant
                    </label>
                  </div>
                  
                  {/* Formulaire sous-traitant (si activé) */}
                  {facture.factureSousTraitant && (
                    <div className="ml-6 p-4 bg-gray-50 rounded-lg border sous-traitant-field">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionner le sous-traitant *
                      </label>
                      <div className="relative">
                        <Input
                          value={facture.sousTraitantSelection}
                          onChange={(e) => handleInputChange('sousTraitantSelection', e.target.value)}
                          onFocus={() => setShowSousTraitantSuggestions(true)}
                          placeholder="Rechercher un sous-traitant..."
                          className="w-full pr-20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // TODO: Rediriger vers le module sous-traitant
                            alert('🚧 Module sous-traitant à implémenter !\n\nRedirection vers /sous-traitants');
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          <Plus className="h-3 w-3 inline mr-1" />
                          Nouveau
                        </button>
                      </div>
                      
                      {/* Suggestions sous-traitants */}
                      {showSousTraitantSuggestions && facture.sousTraitantSelection && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {getSousTraitantSuggestions().map((sousTraitant, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                              onClick={() => {
                                handleInputChange('sousTraitantSelection', sousTraitant.nom);
                                setShowSousTraitantSuggestions(false);
                              }}
                            >
                              <div className="font-medium">{sousTraitant.nom}</div>
                              <div className="text-sm text-gray-600">
                                {sousTraitant.specialite} • {sousTraitant.ville} • {sousTraitant.statut}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="mt-1 text-xs text-gray-500">
                        Sélectionnez le sous-traitant concerné par cette facture
                      </p>
                      
                      {/* Configuration retenue de garantie pour sous-traitants */}
                      <div className="mt-4 pt-4 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Retenue de garantie
                        </label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            value={facture.retenuePourcentage}
                            onChange={(e) => {
                              const pourcentage = parseFloat(e.target.value) || 0;
                              handleInputChange('retenuePourcentage', pourcentage);
                            }}
                            placeholder="5"
                            step="0.1"
                            min="0"
                            max="100"
                            className="w-24"
                          />
                          <span className="text-sm text-gray-600">%</span>
                          <span className="text-xs text-gray-500">
                            (Optionnel - Appliquée au total HT)
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Pourcentage de retenue appliqué au total HT de la facture
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Cession de créance */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="cessionCreance"
                      checked={facture.cessionCreance}
                      onChange={(e) => handleInputChange('cessionCreance', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="cessionCreance" className="text-sm font-medium text-gray-700">
                      Cession de créance
                    </label>
                  </div>
                  
                  {/* Formulaire cession de créance (si activé) */}
                  {facture.cessionCreance && (
                    <div className="ml-6 p-4 bg-gray-50 rounded-lg border cession-field">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionner la cession de créance *
                      </label>
                      <div className="relative">
                        <Input
                          value={facture.cessionCreanceSelection}
                          onChange={(e) => handleInputChange('cessionCreanceSelection', e.target.value)}
                          onFocus={() => setShowCessionSuggestions(true)}
                          placeholder="Rechercher une cession de créance..."
                          className="w-full pr-20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // TODO: Rediriger vers le module cession de créance
                            alert('🚧 Module cession de créance à implémenter !\n\nRedirection vers /cessions-creance avec filtre chantier');
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                        >
                          <Plus className="h-3 w-3 inline mr-1" />
                          Nouvelle
                        </button>
                      </div>
                      
                      {/* Suggestions cessions de créance (pré-filtrées par chantier) */}
                      {showCessionSuggestions && facture.cessionCreanceSelection && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {getCessionSuggestions().map((cession, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                              onClick={() => {
                                handleInputChange('cessionCreanceSelection', cession.reference);
                                setShowCessionSuggestions(false);
                              }}
                            >
                              <div className="font-medium">{cession.reference}</div>
                              <div className="text-sm text-gray-600">
                                {cession.client} • {cession.montant}€ • {cession.statut}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="mt-1 text-xs text-gray-500">
                        Pré-filtré par le chantier sélectionné : {facture.chantier || 'Aucun chantier'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Lignes de facture */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Lignes de facture
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="space-y-4">
                {facture.lignes.map((ligne, index) => (
                  <div key={ligne.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
                          {/* Produit/Service */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Produit/Service
                            </label>
                            <SelectionProduit
                              produitSelectionne={ligne.produit}
                              onSelectionner={(produit) => {
                                handleLigneChange(index, 'produit', produit);
                                handleLigneChange(index, 'designation', produit.designation);
                                handleLigneChange(index, 'categorie', produit.categorie);
                                handleLigneChange(index, 'prixUnitaire', produit.prixUnitaire);
                                // Recalculer le montant HT
                                const nouveauMontant = (ligne.quantite || 0) * produit.prixUnitaire;
                                handleLigneChange(index, 'montantHT', nouveauMontant);
                              }}
                              onNouveauProduit={(nouveauProduit) => {
                                // Le produit est déjà sauvegardé par le composant
                                // On peut l'utiliser directement
                                handleLigneChange(index, 'produit', nouveauProduit);
                                handleLigneChange(index, 'designation', nouveauProduit.designation);
                                handleLigneChange(index, 'categorie', nouveauProduit.categorie);
                                handleLigneChange(index, 'prixUnitaire', nouveauProduit.prixUnitaire);
                                // Recalculer le montant HT
                                const nouveauMontant = (ligne.quantite || 0) * nouveauProduit.prixUnitaire;
                                handleLigneChange(index, 'montantHT', nouveauMontant);
                              }}
                              categorieFiltree={ligne.categorie}
                            />
                          </div>

                          {/* Catégorie */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Catégorie
                            </label>
                            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
                              {ligne.categorie || 'Non définie'}
                            </div>
                          </div>

                          {/* Quantité */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantité
                            </label>
                            <Input
                              type="number"
                              value={ligne.quantite}
                              onChange={(e) => {
                                const quantite = parseFloat(e.target.value) || 0;
                                handleLigneChange(index, 'quantite', quantite);
                                // Recalculer le montant HT si le prix unitaire est défini
                                if (ligne.prixUnitaire) {
                                  const nouveauMontant = quantite * ligne.prixUnitaire;
                                  handleLigneChange(index, 'montantHT', nouveauMontant);
                                }
                              }}
                              placeholder="1"
                              step="0.01"
                              className="w-full"
                            />
                          </div>

                          {/* Prix unitaire HT */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Prix unitaire HT
                            </label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={ligne.prixUnitaire}
                                onChange={(e) => {
                                  const prix = parseFloat(e.target.value) || 0;
                                  handleLigneChange(index, 'prixUnitaire', prix);
                                  // Recalculer le montant HT
                                  const nouveauMontant = (ligne.quantite || 0) * prix;
                                  handleLigneChange(index, 'montantHT', nouveauMontant);
                                }}
                                placeholder="0.00"
                                step={`0.${'0'.repeat(produitsService.getDecimales() - 1)}1`}
                                className={`w-full ${alertesPrix[index] ? 'border-orange-500 bg-orange-50' : ''}`}
                              />
                              {/* Indicateur d'alerte de prix */}
                              {alertesPrix[index] && (
                                <div className="absolute -top-2 -right-2">
                                  <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    {alertesPrix[index].pourcentage}%
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Message d'alerte sous le champ */}
                            {alertesPrix[index] && (
                              <div className="mt-1 text-xs text-orange-600 flex items-center gap-1">
                                <span>⚠️</span>
                                <span>
                                  Prix {alertesPrix[index].type === 'augmentation' ? 'augmenté' : 'diminué'} de {alertesPrix[index].pourcentage}%
                                  {alertesPrix[index].ancienPrix && (
                                    <span> (était {alertesPrix[index].ancienPrix.toFixed(2)}€)</span>
                                  )}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Montant HT */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Montant HT
                            </label>
                            <div className="text-lg font-semibold text-gray-900">
                              {produitsService.formaterNombre(ligne.montantHT)}€
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-end gap-2">
                            <Button
                              type="button"
                              onClick={() => ouvrirVentilation(ligne)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Ventiler
                            </Button>
                            <Button
                              type="button"
                              onClick={() => supprimerLigne(index)}
                              variant="destructive"
                              size="sm"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                    {/* Indicateur multi-chantiers */}
                    {ligne.ventilation && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Multi-chantiers
                            </span>
                            <span className="text-sm text-blue-700">
                              {ligne.ventilation.splits.length} chantier{ligne.ventilation.splits.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="text-sm text-blue-600">
                            {ligne.ventilation.modeVentilation === 'PERCENT' && 
                              `${ligne.ventilation.splits.map(s => `${s.value}%`).join(' / ')}`
                            }
                            {ligne.ventilation.modeVentilation === 'AMOUNT' && 
                              `${ligne.ventilation.splits.map(s => `${s.ht.toFixed(2)}€`).join(' / ')}`
                            }
                            {ligne.ventilation.modeVentilation === 'QUANTITY' && 
                              `${ligne.ventilation.splits.map(s => s.value).join(' / ')}`
                            }
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-blue-600">
                          {ligne.ventilation.splits.map((split, idx) => {
                            const chantier = getChantierSuggestions().find(c => c.id === split.chantierId);
                            return (
                              <span key={idx} className="inline-block mr-3">
                                {chantier?.nom}: {split.ht.toFixed(2)}€
                                {split.note && ` (${split.note})`}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Bouton ajouter ligne */}
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={ajouterLigne}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une ligne
                  </Button>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Totaux et calculs */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Totaux et calculs
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Totaux */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className={`grid gap-4 ${facture.factureSousTraitant ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {produitsService.formaterNombre(facture.sousTotalHT)}€
                      </div>
                      <div className="text-sm text-gray-600">Total HT</div>
                    </div>
                    
                    {/* Retenue de garantie (uniquement pour sous-traitants) */}
                    {facture.factureSousTraitant && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {produitsService.formaterNombre(facture.retenueGarantie)}€
                        </div>
                        <div className="text-sm text-orange-600">Retenue de garantie</div>
                        <div className="text-xs text-orange-500">{facture.retenuePourcentage}%</div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {produitsService.formaterNombre(facture.netAPayer)}€
                      </div>
                      <div className="text-sm text-blue-600">Net à payer</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Informations importantes</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>• TVA : 0% (Article 294, 1 du CGI - Pas de TVA en Guyane)</li>
                      {facture.factureSousTraitant && (
                        <li>• Facture sous-traitant : {facture.sousTraitantSelection || 'Non sélectionné'}</li>
                      )}
                      {facture.factureSousTraitant && facture.retenuePourcentage > 0 && (
                        <li>• Retenue de garantie : {facture.retenuePourcentage}% (sous-traitant)</li>
                      )}
                      {facture.cessionCreance && (
                        <li>• Cession de créance activée</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Pièces jointes */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Pièces jointes
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Glissez-déposez vos fichiers ici</p>
                  <p className="text-sm text-gray-500">PDF facture, BC, BL, commentaires...</p>
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Sélectionner des fichiers
                  </button>
                </div>
              </div>
            </GestalisCardContent>
          </GestalisCard>

          {/* Notes */}
          <GestalisCard>
            <GestalisCardHeader>
              <GestalisCardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes et commentaires
              </GestalisCardTitle>
            </GestalisCardHeader>
            <GestalisCardContent>
              <textarea
                value={facture.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notes, conditions spéciales, informations importantes..."
                rows="4"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </GestalisCardContent>
          </GestalisCard>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            {parametresEtape1 && (
              <button
                onClick={onRetourEtape1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Retour à l'étape 1
              </button>
            )}
            
            <button
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              Annuler
            </button>
            
            <Button
              onClick={handleSave}
              disabled={saving || (parametresEtape1 && !validerDatePeriode())}
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
                  Créer la facture
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de ventilation */}
      {showVentilation && ligneVentilation && (
        <VentilationMultiChantiers
          ligne={ligneVentilation}
          chantiers={getChantierSuggestions()}
          onSave={sauvegarderVentilation}
          onCancel={annulerVentilation}
          modelePrecedent={obtenirModelePrecedent(ligneVentilation)}
        />
      )}

      {/* Modal de paramétrage des décimales */}
      {showParametresDecimales && (
        <ParametresDecimales
          isOpen={showParametresDecimales}
          onClose={() => setShowParametresDecimales(false)}
        />
      )}

      {/* Modal de comptabilisation */}
      {showComptabilisation && (
        <ExportEcrituresComptables
          facture={facture}
          onClose={() => setShowComptabilisation(false)}
          onExport={(format) => {
            console.log(`Export ${format} réussi`);
            setShowComptabilisation(false);
          }}
        />
      )}

      {/* Modal d'alerte de variation de prix */}
      {showAlerteVariation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Variation de prix détectée
                </h3>
                <p className="text-sm text-gray-600">
                  {showAlerteVariation.message}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Article :</span>
                  <div className="font-medium">{facture.lignes[showAlerteVariation.ligneIndex]?.designation}</div>
                </div>
                <div>
                  <span className="text-gray-600">Fournisseur :</span>
                  <div className="font-medium">{facture.fournisseur}</div>
                </div>
                <div>
                  <span className="text-gray-600">Ancien prix :</span>
                  <div className="font-medium text-gray-700">{showAlerteVariation.ancienPrix?.toFixed(2)}€</div>
                </div>
                <div>
                  <span className="text-gray-600">Nouveau prix :</span>
                  <div className={`font-medium ${showAlerteVariation.type === 'augmentation' ? 'text-red-600' : 'text-green-600'}`}>
                    {showAlerteVariation.nouveauPrix?.toFixed(2)}€
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Variation :</span>
                  <div className={`font-bold ${showAlerteVariation.type === 'augmentation' ? 'text-red-600' : 'text-green-600'}`}>
                    {showAlerteVariation.type === 'augmentation' ? '+' : '-'}{showAlerteVariation.pourcentage}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={fermerAlerteVariation}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Ignorer
              </button>
              <button
                onClick={accepterNouveauPrix}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Accepter et sauvegarder le prix
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default NouvelleFacture;

