// Service de gestion de la bibliothèque de produits/services
class ProduitsService {
  constructor() {
    this.storageKey = 'gestalis_produits_services';
    this.decimalesKey = 'gestalis_decimales_config';
  }

  // Configuration des décimales
  getDecimales() {
    try {
      const decimales = localStorage.getItem(this.decimalesKey);
      return decimales ? parseInt(decimales) : 2; // Par défaut : 2 décimales
    } catch (error) {
      console.error('Erreur lors de la récupération des décimales:', error);
      return 2;
    }
  }

  setDecimales(decimales) {
    try {
      localStorage.setItem(this.decimalesKey, decimales.toString());
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des décimales:', error);
      return false;
    }
  }

  // Formater un nombre selon la configuration des décimales
  formaterNombre(nombre) {
    const decimales = this.getDecimales();
    return Number(nombre).toFixed(decimales);
  }

  // Charger tous les produits/services
  chargerProduits() {
    try {
      const produitsJson = localStorage.getItem(this.storageKey);
      if (produitsJson) {
        return JSON.parse(produitsJson);
      } else {
        // Créer les données par défaut si elles n'existent pas
        const produitsParDefaut = this.getProduitsParDefaut();
        this.sauvegarderProduits(produitsParDefaut);
        return produitsParDefaut;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      return this.getProduitsParDefaut();
    }
  }

  // Sauvegarder tous les produits
  sauvegarderProduits(produits) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(produits));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des produits:', error);
      return false;
    }
  }

  // Produits par défaut
  getProduitsParDefaut() {
    return [
      {
        id: 1,
        code: 'CARB-001',
        designation: 'Carburant Diesel',
        categorie: 'Carburant',
        unite: 'L',
        prixUnitaire: 1.85,
        description: 'Carburant diesel pour engins de chantier',
        actif: true,
        dateCreation: new Date().toISOString()
      },
      {
        id: 2,
        code: 'TELECOM-001',
        designation: 'Abonnement téléphonie mobile',
        categorie: 'Télécom',
        unite: 'Mois',
        prixUnitaire: 45.00,
        description: 'Forfait mobile illimité pour équipe chantier',
        actif: true,
        dateCreation: new Date().toISOString()
      },
      {
        id: 3,
        code: 'TRANS-001',
        designation: 'Transport de matériaux',
        categorie: 'Transport',
        unite: 'Km',
        prixUnitaire: 0.85,
        description: 'Transport de matériaux par camion',
        actif: true,
        dateCreation: new Date().toISOString()
      },
      {
        id: 4,
        code: 'MAT-001',
        designation: 'Ciment Portland',
        categorie: 'Matériel',
        unite: 'T',
        prixUnitaire: 120.00,
        description: 'Ciment Portland 32.5 pour construction',
        actif: true,
        dateCreation: new Date().toISOString()
      },
      {
        id: 5,
        code: 'SERV-001',
        designation: 'Location d\'engins',
        categorie: 'Services',
        unite: 'Jour',
        prixUnitaire: 350.00,
        description: 'Location d\'engins de chantier',
        actif: true,
        dateCreation: new Date().toISOString()
      }
    ];
  }

  // Sauvegarder un produit
  sauvegarderProduit(produit) {
    try {
      const produits = this.chargerProduits();
      
      if (produit.id) {
        // Modification
        const index = produits.findIndex(p => p.id === produit.id);
        if (index !== -1) {
          produits[index] = { ...produit, dateModification: new Date().toISOString() };
        }
      } else {
        // Nouveau produit
        produit.id = Date.now();
        produit.dateCreation = new Date().toISOString();
        produit.actif = true;
        produits.push(produit);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(produits));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit:', error);
      return false;
    }
  }

  // Supprimer un produit (désactivation)
  supprimerProduit(id) {
    try {
      const produits = this.chargerProduits();
      const index = produits.findIndex(p => p.id === id);
      
      if (index !== -1) {
        produits[index].actif = false;
        produits[index].dateSuppression = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(produits));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      return false;
    }
  }

  // Rechercher des produits
  rechercherProduits(terme, categorie = null) {
    try {
      const produits = this.chargerProduits();
      let resultats = produits.filter(p => p.actif);
      
      // Filtre par catégorie
      if (categorie) {
        resultats = resultats.filter(p => p.categorie === categorie);
      }
      
      // Filtre par terme de recherche
      if (terme) {
        const termeLower = terme.toLowerCase();
        resultats = resultats.filter(p => 
          p.code.toLowerCase().includes(termeLower) ||
          p.designation.toLowerCase().includes(termeLower) ||
          p.description.toLowerCase().includes(termeLower)
        );
      }
      
      return resultats;
    } catch (error) {
      console.error('Erreur lors de la recherche de produits:', error);
      return [];
    }
  }

  // Obtenir les catégories
  obtenirCategories() {
    try {
      const produits = this.chargerProduits();
      const categories = [...new Set(produits.filter(p => p.actif).map(p => p.categorie))];
      
      // Ajouter "Divers" par défaut et le mettre en premier
      if (!categories.includes('Divers')) {
        categories.unshift('Divers');
      }
      
      return categories.sort((a, b) => {
        // "Divers" toujours en premier
        if (a === 'Divers') return -1;
        if (b === 'Divers') return 1;
        return a.localeCompare(b);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return ['Divers'];
    }
  }

  // Obtenir un produit par ID
  obtenirProduit(id) {
    try {
      const produits = this.chargerProduits();
      return produits.find(p => p.id === id && p.actif);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return null;
    }
  }

  // Obtenir les produits populaires
  obtenirProduitsPopulaires(limite = 10) {
    try {
      const produits = this.chargerProduits();
      return produits
        .filter(p => p.actif)
        .sort((a, b) => (b.compteurUtilisation || 0) - (a.compteurUtilisation || 0))
        .slice(0, limite);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits populaires:', error);
      return [];
    }
  }

  // Incrémenter le compteur d'utilisation
  incrementerUtilisation(id) {
    try {
      const produits = this.chargerProduits();
      const index = produits.findIndex(p => p.id === id);
      
      if (index !== -1) {
        produits[index].compteurUtilisation = (produits[index].compteurUtilisation || 0) + 1;
        localStorage.setItem(this.storageKey, JSON.stringify(produits));
      }
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation de l\'utilisation:', error);
    }
  }

  // Valider un produit
  validerProduit(produit) {
    const erreurs = [];
    
    if (!produit.code || produit.code.trim() === '') {
      erreurs.push('Le code est obligatoire');
    }
    
    if (!produit.designation || produit.designation.trim() === '') {
      erreurs.push('La désignation est obligatoire');
    }
    
    if (!produit.categorie) {
      erreurs.push('La catégorie est obligatoire');
    }
    
    if (!produit.unite || produit.unite.trim() === '') {
      erreurs.push('L\'unité est obligatoire');
    }
    
    if (produit.prixUnitaire === null || produit.prixUnitaire === undefined || produit.prixUnitaire < 0) {
      erreurs.push('Le prix unitaire doit être positif');
    }
    
    // Vérifier l'unicité du code
    const produits = this.chargerProduits();
    const produitExistant = produits.find(p => p.code === produit.code && p.id !== produit.id && p.actif);
    if (produitExistant) {
      erreurs.push('Ce code existe déjà');
    }
    
    return {
      valide: erreurs.length === 0,
      erreurs
    };
  }

  // Exporter en CSV
  exporterCSV() {
    try {
      const produits = this.chargerProduits().filter(p => p.actif);
      const headers = ['Code', 'Désignation', 'Catégorie', 'Unité', 'Prix unitaire', 'Description'];
      
      const csvContent = [
        headers.join(','),
        ...produits.map(p => [
          p.code,
          `"${p.designation}"`,
          p.categorie,
          p.unite,
          this.formaterNombre(p.prixUnitaire),
          `"${p.description || ''}"`
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `produits_services_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      return false;
    }
  }

  // Importer depuis CSV
  async importerCSV(file) {
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const produits = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const produit = {
            code: values[0],
            designation: values[1],
            categorie: values[2],
            unite: values[3],
            prixUnitaire: parseFloat(values[4]) || 0,
            description: values[5] || '',
            dateCreation: new Date().toISOString(),
            actif: true
          };
          
          if (this.validerProduit(produit).valide) {
            produits.push(produit);
          }
        }
      }
      
      // Sauvegarder les produits importés
      const produitsExistants = this.chargerProduits();
      const nouveauxProduits = [...produitsExistants, ...produits];
      localStorage.setItem(this.storageKey, JSON.stringify(nouveauxProduits));
      
      return {
        success: true,
        importes: produits.length,
        total: nouveauxProduits.length
      };
    } catch (error) {
      console.error('Erreur lors de l\'import CSV:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instance singleton
const produitsService = new ProduitsService();

// Initialiser les données par défaut au démarrage
produitsService.chargerProduits();

export default produitsService;
