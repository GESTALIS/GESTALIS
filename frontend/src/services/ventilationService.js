// Service de gestion des modèles de ventilation multi-chantiers
class VentilationService {
  constructor() {
    this.storageKey = 'gestalis_ventilation_modeles';
  }

  // Sauvegarder un modèle de ventilation
  sauvegarderModele(fournisseurId, categorieProduit, ventilation) {
    try {
      const modeles = this.chargerModeles();
      const cle = this.genererCle(fournisseurId, categorieProduit);
      
      modeles[cle] = {
        ...ventilation,
        dateCreation: new Date().toISOString(),
        dateUtilisation: new Date().toISOString(),
        compteurUtilisation: 1
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(modeles));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du modèle:', error);
      return false;
    }
  }

  // Charger un modèle de ventilation
  chargerModele(fournisseurId, categorieProduit) {
    try {
      const modeles = this.chargerModeles();
      const cle = this.genererCle(fournisseurId, categorieProduit);
      const modele = modeles[cle];
      
      if (modele) {
        // Mettre à jour la date d'utilisation et le compteur
        modele.dateUtilisation = new Date().toISOString();
        modele.compteurUtilisation = (modele.compteurUtilisation || 0) + 1;
        this.sauvegarderModele(fournisseurId, categorieProduit, modele);
      }
      
      return modele;
    } catch (error) {
      console.error('Erreur lors du chargement du modèle:', error);
      return null;
    }
  }

  // Charger tous les modèles
  chargerModeles() {
    try {
      const modelesJson = localStorage.getItem(this.storageKey);
      return modelesJson ? JSON.parse(modelesJson) : {};
    } catch (error) {
      console.error('Erreur lors du chargement des modèles:', error);
      return {};
    }
  }

  // Supprimer un modèle
  supprimerModele(fournisseurId, categorieProduit) {
    try {
      const modeles = this.chargerModeles();
      const cle = this.genererCle(fournisseurId, categorieProduit);
      
      if (modeles[cle]) {
        delete modeles[cle];
        localStorage.setItem(this.storageKey, JSON.stringify(modeles));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression du modèle:', error);
      return false;
    }
  }

  // Nettoyer les modèles anciens (plus de 1 an)
  nettoyerModelesAnciens() {
    try {
      const modeles = this.chargerModeles();
      const dateLimite = new Date();
      dateLimite.setFullYear(dateLimite.getFullYear() - 1);
      
      let nettoyes = 0;
      Object.keys(modeles).forEach(cle => {
        const modele = modeles[cle];
        if (new Date(modele.dateCreation) < dateLimite) {
          delete modeles[cle];
          nettoyes++;
        }
      });
      
      if (nettoyes > 0) {
        localStorage.setItem(this.storageKey, JSON.stringify(modeles));
      }
      
      return nettoyes;
    } catch (error) {
      console.error('Erreur lors du nettoyage des modèles:', error);
      return 0;
    }
  }

  // Obtenir les modèles les plus utilisés
  obtenirModelesPopulaires(limite = 10) {
    try {
      const modeles = this.chargerModeles();
      const modelesArray = Object.entries(modeles).map(([cle, modele]) => ({
        cle,
        ...modele,
        fournisseurId: this.extraireFournisseurId(cle),
        categorieProduit: this.extraireCategorieProduit(cle)
      }));
      
      return modelesArray
        .sort((a, b) => (b.compteurUtilisation || 0) - (a.compteurUtilisation || 0))
        .slice(0, limite);
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles populaires:', error);
      return [];
    }
  }

  // Rechercher des modèles par fournisseur
  rechercherModelesParFournisseur(fournisseurId) {
    try {
      const modeles = this.chargerModeles();
      const resultats = [];
      
      Object.entries(modeles).forEach(([cle, modele]) => {
        if (cle.startsWith(`fournisseur_${fournisseurId}_`)) {
          resultats.push({
            cle,
            ...modele,
            fournisseurId: this.extraireFournisseurId(cle),
            categorieProduit: this.extraireCategorieProduit(cle)
          });
        }
      });
      
      return resultats;
    } catch (error) {
      console.error('Erreur lors de la recherche par fournisseur:', error);
      return [];
    }
  }

  // Rechercher des modèles par catégorie
  rechercherModelesParCategorie(categorieProduit) {
    try {
      const modeles = this.chargerModeles();
      const resultats = [];
      
      Object.entries(modeles).forEach(([cle, modele]) => {
        if (cle.includes(`_${categorieProduit}`)) {
          resultats.push({
            cle,
            ...modele,
            fournisseurId: this.extraireFournisseurId(cle),
            categorieProduit: this.extraireCategorieProduit(cle)
          });
        }
      });
      
      return resultats;
    } catch (error) {
      console.error('Erreur lors de la recherche par catégorie:', error);
      return [];
    }
  }

  // Générer une clé unique pour un modèle
  genererCle(fournisseurId, categorieProduit) {
    return `fournisseur_${fournisseurId}_categorie_${categorieProduit}`;
  }

  // Extraire l'ID du fournisseur depuis une clé
  extraireFournisseurId(cle) {
    const match = cle.match(/fournisseur_(\d+)_/);
    return match ? match[1] : null;
  }

  // Extraire la catégorie de produit depuis une clé
  extraireCategorieProduit(cle) {
    const match = cle.match(/categorie_(.+)$/);
    return match ? match[1] : null;
  }

  // Valider une ventilation
  validerVentilation(ventilation, ligne) {
    const erreurs = [];
    
    if (!ventilation.modeVentilation) {
      erreurs.push('Mode de ventilation manquant');
    }
    
    if (!ventilation.splits || ventilation.splits.length === 0) {
      erreurs.push('Aucun chantier sélectionné');
    }
    
    if (ventilation.splits) {
      const { totalPercent, totalAmount, totalQuantity } = this.calculerTotaux(ventilation);
      
      if (ventilation.modeVentilation === 'PERCENT' && Math.abs(totalPercent - 100) > 0.01) {
        erreurs.push(`Somme des pourcentages doit être 100% (actuel: ${totalPercent.toFixed(2)}%)`);
      }
      
      if (ventilation.modeVentilation === 'AMOUNT' && Math.abs(totalAmount - ligne.montantHT) > 0.01) {
        erreurs.push(`Somme des montants doit être ${ligne.montantHT.toFixed(2)}€ (actuel: ${totalAmount.toFixed(2)}€)`);
      }
      
      if (ventilation.modeVentilation === 'QUANTITY' && Math.abs(totalQuantity - ligne.quantite) > 0.01) {
        erreurs.push(`Somme des quantités doit être ${ligne.quantite} (actuel: ${totalQuantity})`);
      }
    }
    
    return {
      valide: erreurs.length === 0,
      erreurs
    };
  }

  // Calculer les totaux d'une ventilation
  calculerTotaux(ventilation) {
    if (!ventilation.splits) {
      return { totalPercent: 0, totalAmount: 0, totalQuantity: 0 };
    }
    
    const totalPercent = ventilation.splits.reduce((sum, split) => 
      sum + (ventilation.modeVentilation === 'PERCENT' ? split.value : 0), 0);
    
    const totalAmount = ventilation.splits.reduce((sum, split) => 
      sum + split.ht, 0);
    
    const totalQuantity = ventilation.splits.reduce((sum, split) => 
      sum + (ventilation.modeVentilation === 'QUANTITY' ? split.value : 0), 0);
    
    return { totalPercent, totalAmount, totalQuantity };
  }

  // Appliquer un modèle à une nouvelle ligne
  appliquerModele(modele, ligne, chantiers) {
    if (!modele || !modele.splits) {
      return null;
    }
    
    // Vérifier que tous les chantiers du modèle existent encore
    const splitsValides = modele.splits.filter(split => 
      chantiers.some(c => c.id === split.chantierId)
    );
    
    if (splitsValides.length === 0) {
      return null;
    }
    
    // Adapter les valeurs selon le mode et la nouvelle ligne
    const nouvelleVentilation = {
      modeVentilation: modele.modeVentilation,
      splits: splitsValides.map(split => {
        let nouvelleValeur = split.value;
        let nouveauHT = split.ht;
        
        if (modele.modeVentilation === 'PERCENT') {
          // Le pourcentage reste le même
          nouveauHT = (ligne.montantHT * split.value) / 100;
        } else if (modele.modeVentilation === 'AMOUNT') {
          // Ajuster proportionnellement au nouveau montant
          const ratio = ligne.montantHT / modele.sumCheck.amount;
          nouvelleValeur = Math.round(split.value * ratio * 100) / 100;
          nouveauHT = nouvelleValeur;
        } else if (modele.modeVentilation === 'QUANTITY') {
          // Ajuster proportionnellement à la nouvelle quantité
          const ratio = ligne.quantite / modele.sumCheck.quantity;
          nouvelleValeur = Math.round(split.value * ratio * 100) / 100;
          nouveauHT = (ligne.montantHT * nouvelleValeur) / ligne.quantite;
        }
        
        return {
          chantierId: split.chantierId,
          value: Math.round(nouvelleValeur * 100) / 100,
          ht: Math.round(nouveauHT * 100) / 100,
          note: split.note
        };
      }),
      sumCheck: {
        percent: modele.modeVentilation === 'PERCENT' ? 100 : null,
        amount: ligne.montantHT,
        quantity: modele.modeVentilation === 'QUANTITY' ? ligne.quantite : null
      }
    };
    
    return nouvelleVentilation;
  }
}

// Instance singleton
const ventilationService = new VentilationService();

export default ventilationService;
