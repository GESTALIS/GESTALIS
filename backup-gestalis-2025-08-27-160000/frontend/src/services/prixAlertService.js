// Service de détection des variations de prix et alertes
class PrixAlertService {
  constructor() {
    this.storageKey = 'gestalis_historique_prix';
    this.alertThresholds = {
      forte: { montant: 10, pourcentage: 15 },    // +10€ ou +15%
      moyenne: { montant: 5, pourcentage: 10 },   // +5€ ou +10%
      info: { montant: 2, pourcentage: 5 }        // +2€ ou +5%
    };
  }

  // Enregistrer un prix lors de la création d'une facture
  enregistrerPrix(produitId, fournisseur, prix, dateFacture, numeroFacture) {
    try {
      const historique = this.chargerHistorique();
      
      const entree = {
        id: Date.now(),
        produitId,
        fournisseur,
        prix,
        dateFacture,
        numeroFacture,
        timestamp: new Date().toISOString()
      };
      
      historique.push(entree);
      
      // Garder seulement les 100 dernières entrées pour éviter l'explosion
      if (historique.length > 100) {
        historique.splice(0, historique.length - 100);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(historique));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du prix:', error);
      return false;
    }
  }

  // Charger l'historique des prix
  chargerHistorique() {
    try {
      const historiqueJson = localStorage.getItem(this.storageKey);
      return historiqueJson ? JSON.parse(historiqueJson) : [];
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      return [];
    }
  }

  // Détecter les variations de prix pour un produit/fournisseur
  detecterVariationPrix(produitId, fournisseur, prixActuel) {
    try {
      const historique = this.chargerHistorique();
      
      // Filtrer par produit et fournisseur
      const prixPrecedents = historique.filter(entree => 
        entree.produitId === produitId && 
        entree.fournisseur === fournisseur
      );
      
      if (prixPrecedents.length === 0) {
        return null; // Premier prix pour ce produit/fournisseur
      }
      
      // Trier par date (plus récent en premier)
      prixPrecedents.sort((a, b) => new Date(b.dateFacture) - new Date(a.dateFacture));
      
      const dernierPrix = prixPrecedents[0];
      const variation = prixActuel - dernierPrix.prix;
      const pourcentageVariation = (variation / dernierPrix.prix) * 100;
      
      // Déterminer le niveau d'alerte
      const niveauAlerte = this.determinerNiveauAlerte(variation, pourcentageVariation);
      
      if (niveauAlerte === 'aucune') {
        return null;
      }
      
      return {
        niveauAlerte,
        ancienPrix: dernierPrix.prix,
        nouveauPrix: prixActuel,
        variation: variation,
        pourcentageVariation: pourcentageVariation,
        derniereFacture: dernierPrix.numeroFacture,
        dateDerniereFacture: dernierPrix.dateFacture,
        produitId,
        fournisseur
      };
    } catch (error) {
      console.error('Erreur lors de la détection de variation:', error);
      return null;
    }
  }

  // Déterminer le niveau d'alerte basé sur les seuils
  determinerNiveauAlerte(variation, pourcentageVariation) {
    const { forte, moyenne, info } = this.alertThresholds;
    
    // Vérifier les seuils d'alerte forte
    if (variation >= forte.montant || pourcentageVariation >= forte.pourcentage) {
      return 'forte';
    }
    
    // Vérifier les seuils d'alerte moyenne
    if (variation >= moyenne.montant || pourcentageVariation >= moyenne.pourcentage) {
      return 'moyenne';
    }
    
    // Vérifier les seuils d'information
    if (variation >= info.montant || pourcentageVariation >= info.pourcentage) {
      return 'info';
    }
    
    return 'aucune';
  }

  // Obtenir l'historique complet d'un produit/fournisseur
  obtenirHistoriqueProduit(produitId, fournisseur) {
    try {
      const historique = this.chargerHistorique();
      
      return historique
        .filter(entree => 
          entree.produitId === produitId && 
          entree.fournisseur === fournisseur
        )
        .sort((a, b) => new Date(b.dateFacture) - new Date(a.dateFacture))
        .map(entree => ({
          prix: entree.prix,
          dateFacture: entree.dateFacture,
          numeroFacture: entree.numeroFacture,
          variation: null, // Sera calculé si nécessaire
          pourcentageVariation: null
        }))
        .map((entree, index, array) => {
          if (index > 0) {
            const variation = entree.prix - array[index - 1].prix;
            const pourcentageVariation = (variation / array[index - 1].prix) * 100;
            
            return {
              ...entree,
              variation,
              pourcentageVariation
            };
          }
          return entree;
        });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return [];
    }
  }

  // Obtenir les statistiques de prix pour un produit/fournisseur
  obtenirStatistiquesPrix(produitId, fournisseur) {
    try {
      const historique = this.obtenirHistoriqueProduit(produitId, fournisseur);
      
      if (historique.length === 0) {
        return null;
      }
      
      const prix = historique.map(entree => entree.prix);
      const prixMin = Math.min(...prix);
      const prixMax = Math.max(...prix);
      const prixMoyen = prix.reduce((sum, prix) => sum + prix, 0) / prix.length;
      
      // Calculer la tendance (basée sur les 3 derniers prix)
      let tendance = 'stable';
      if (historique.length >= 3) {
        const derniersPrix = historique.slice(0, 3).map(entree => entree.prix);
        const premiereVariation = derniersPrix[1] - derniersPrix[0];
        const deuxiemeVariation = derniersPrix[2] - derniersPrix[1];
        
        if (premiereVariation > 0 && deuxiemeVariation > 0) {
          tendance = 'hausse';
        } else if (premiereVariation < 0 && deuxiemeVariation < 0) {
          tendance = 'baisse';
        } else if (Math.abs(premiereVariation) < 1 && Math.abs(deuxiemeVariation) < 1) {
          tendance = 'stable';
        } else {
          tendance = 'variable';
        }
      }
      
      return {
        prixMin,
        prixMax,
        prixMoyen,
        prixActuel: historique[0].prix,
        nombreFactures: historique.length,
        tendance,
        derniereFacture: historique[0].numeroFacture,
        dateDerniereFacture: historique[0].dateFacture
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return null;
    }
  }

  // Configurer les seuils d'alerte
  configurerSeuils(nouveauxSeuils) {
    try {
      this.alertThresholds = {
        ...this.alertThresholds,
        ...nouveauxSeuils
      };
      
      // Sauvegarder la configuration
      localStorage.setItem('gestalis_seuils_alerte', JSON.stringify(this.alertThresholds));
      return true;
    } catch (error) {
      console.error('Erreur lors de la configuration des seuils:', error);
      return false;
    }
  }

  // Charger la configuration des seuils
  chargerSeuils() {
    try {
      const seuilsJson = localStorage.getItem('gestalis_seuils_alerte');
      if (seuilsJson) {
        this.alertThresholds = JSON.parse(seuilsJson);
      }
      return this.alertThresholds;
    } catch (error) {
      console.error('Erreur lors du chargement des seuils:', error);
      return this.alertThresholds;
    }
  }

  // Nettoyer l'historique (supprimer les entrées anciennes)
  nettoyerHistorique(joursMaximum = 365) {
    try {
      const historique = this.chargerHistorique();
      const dateLimite = new Date();
      dateLimite.setDate(dateLimite.getDate() - joursMaximum);
      
      const historiqueFiltre = historique.filter(entree => 
        new Date(entree.dateFacture) > dateLimite
      );
      
      localStorage.setItem(this.storageKey, JSON.stringify(historiqueFiltre));
      return historique.length - historiqueFiltre.length; // Nombre d'entrées supprimées
    } catch (error) {
      console.error('Erreur lors du nettoyage de l\'historique:', error);
      return 0;
    }
  }
}

// Créer et exporter une instance unique
const prixAlertService = new PrixAlertService();

// Charger la configuration au démarrage
prixAlertService.chargerSeuils();

export default prixAlertService;
