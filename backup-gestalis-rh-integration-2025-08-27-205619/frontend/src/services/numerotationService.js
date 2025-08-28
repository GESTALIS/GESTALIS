/**
 * Service de numérotation automatique des pièces comptables
 * Format par défaut inspiré d'ONAYA : AC{MM}{YYYY}-{SEQ:4}
 */

class NumerotationService {
  constructor() {
    // Formats par défaut (ONAYA-like)
    this.formatsParDefaut = {
      'FACTURE_ACHAT': 'AC{MM}{YYYY}-{SEQ:4}',
      'AVOIR_FOURNISSEUR': 'AVF{MM}{YYYY}-{SEQ:4}',
      'FACTURE_VENTE': 'VE{MM}{YYYY}-{SEQ:4}',
      'AVOIR_CLIENT': 'AVC{MM}{YYYY}-{SEQ:4}',
      'BON_COMMANDE': 'BC{MM}{YYYY}-{SEQ:4}',
      'BON_LIVRAISON': 'BL{MM}{YYYY}-{SEQ:4}'
    };

    // Variables disponibles pour personnalisation
    this.variablesDisponibles = {
      '{TYPE}': 'Code type pièce (AC, AVF, VE, AVC, BC, BL)',
      '{YYYY}': 'Année sur 4 chiffres',
      '{YY}': 'Année sur 2 chiffres',
      '{MM}': 'Mois sur 2 chiffres',
      '{SEQ}': 'Séquence incrémentale',
      '{SEQ:4}': 'Séquence avec padding 4 chiffres (0001)',
      '{SEQ:5}': 'Séquence avec padding 5 chiffres (00001)',
      '{FOUR_CODE}': 'Code fournisseur',
      '{FOUR_NAME}': 'Nom abrégé fournisseur',
      '{CHANTIER}': 'Code chantier',
      '{COMPANY}': 'Code société',
      '{USER}': 'Code utilisateur créateur'
    };

    // Politiques de reset
    this.politiquesReset = {
      'monthly': 'Mensuel (par défaut)',
      'yearly': 'Annuel',
      'never': 'Jamais (séquence continue)'
    };
  }

  /**
   * Génère le prochain numéro automatiquement
   * @param {string} typePiece - Type de pièce (FACTURE_ACHAT, AVOIR_FOURNISSEUR, etc.)
   * @param {Date} datePiece - Date de la pièce
   * @param {Object} contexte - Contexte (fournisseur, chantier, société, etc.)
   * @param {string} formatPersonnalise - Format personnalisé (optionnel)
   * @returns {string} Numéro généré
   */
  genererNumero(typePiece, datePiece = new Date(), contexte = {}, formatPersonnalise = null) {
    try {
      // Utiliser le format personnalisé ou le format par défaut
      const format = formatPersonnalise || this.formatsParDefaut[typePiece];
      
      if (!format) {
        throw new Error(`Type de pièce non reconnu: ${typePiece}`);
      }

      // Récupérer la prochaine séquence (incrémentée)
      const sequence = this.getProchaineSequence(typePiece, datePiece, contexte);
      
      // Générer le numéro en remplaçant les variables
      let numero = format;
      
      // Remplacer les variables système
      numero = numero.replace('{TYPE}', this.getCodeType(typePiece));
      numero = numero.replace('{YYYY}', datePiece.getFullYear().toString());
      numero = numero.replace('{YY}', datePiece.getFullYear().toString().slice(-2));
      numero = numero.replace('{MM}', (datePiece.getMonth() + 1).toString().padStart(2, '0'));
      numero = numero.replace('{SEQ}', sequence.toString());
      numero = numero.replace('{SEQ:4}', sequence.toString().padStart(4, '0'));
      numero = numero.replace('{SEQ:5}', sequence.toString().padStart(5, '0'));
      
      // Remplacer les variables de contexte
      if (contexte.fournisseur) {
        numero = numero.replace('{FOUR_CODE}', contexte.fournisseur.code || '');
        numero = numero.replace('{FOUR_NAME}', this.abregerNom(contexte.fournisseur.raisonSociale || ''));
      }
      
      if (contexte.chantier) {
        numero = numero.replace('{CHANTIER}', contexte.chantier.code || '');
      }
      
      if (contexte.societe) {
        numero = numero.replace('{COMPANY}', contexte.societe.code || '');
      }
      
      if (contexte.utilisateur) {
        numero = numero.replace('{USER}', contexte.utilisateur.code || '');
      }

      return numero;
    } catch (error) {
      console.error('Erreur lors de la génération du numéro:', error);
      throw error;
    }
  }

  /**
   * Récupère la séquence actuelle pour un type de pièce
   * @param {string} typePiece - Type de pièce
   * @param {Date} datePiece - Date de la pièce
   * @param {Object} contexte - Contexte
   * @returns {number} Séquence actuelle
   */
  getSequenceActuelle(typePiece, datePiece, contexte) {
    // TODO: Récupérer depuis la base de données
    // Pour l'instant, simulation avec localStorage
    
    const key = `sequence_${typePiece}_${datePiece.getFullYear()}_${(datePiece.getMonth() + 1).toString().padStart(2, '0')}`;
    const sequence = parseInt(localStorage.getItem(key) || '0');
    
    return sequence;
  }

  /**
   * Incrémente et retourne la prochaine séquence
   * @param {string} typePiece - Type de pièce
   * @param {Date} datePiece - Date de la pièce
   * @param {Object} contexte - Contexte
   * @returns {number} Prochaine séquence
   */
  getProchaineSequence(typePiece, datePiece, contexte) {
    const sequence = this.getSequenceActuelle(typePiece, datePiece, contexte);
    const prochaineSequence = sequence + 1;
    
    // Sauvegarder la nouvelle séquence
    const key = `sequence_${typePiece}_${datePiece.getFullYear()}_${(datePiece.getMonth() + 1).toString().padStart(2, '0')}`;
    localStorage.setItem(key, prochaineSequence.toString());
    
    return prochaineSequence;
  }

  /**
   * Nettoie complètement toutes les séquences (pour tests et debug)
   */
  nettoyerToutesSequences() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('sequence_') || key.startsWith('reserve_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('Toutes les séquences et réservations ont été nettoyées');
  }

  /**
   * Nettoie les séquences pour une période spécifique
   * @param {string} typePiece - Type de pièce
   * @param {Date} datePiece - Date de la pièce
   */
  nettoyerSequencesPeriode(typePiece, datePiece) {
    const keySequence = `sequence_${typePiece}_${datePiece.getFullYear()}_${(datePiece.getMonth() + 1).toString().padStart(2, '0')}`;
    const keyReserve = `reserve_${typePiece}_${datePiece.getFullYear()}_${(datePiece.getMonth() + 1).toString().padStart(2, '0')}`;
    
    localStorage.removeItem(keySequence);
    localStorage.removeItem(keyReserve);
    
    console.log(`Séquences nettoyées pour ${typePiece} - ${datePiece.getMonth() + 1}/${datePiece.getFullYear()}`);
  }

  /**
   * Retourne le code type pour un type de pièce
   * @param {string} typePiece - Type de pièce
   * @returns {string} Code type
   */
  getCodeType(typePiece) {
    const codesTypes = {
      'FACTURE_ACHAT': 'AC',
      'AVOIR_FOURNISSEUR': 'AVF',
      'FACTURE_VENTE': 'VE',
      'AVOIR_CLIENT': 'AVC',
      'BON_COMMANDE': 'BC',
      'BON_LIVRAISON': 'BL'
    };
    
    return codesTypes[typePiece] || 'XX';
  }

  /**
   * Abrège un nom pour l'utiliser dans la numérotation
   * @param {string} nom - Nom complet
   * @returns {string} Nom abrégé
   */
  abregerNom(nom) {
    if (!nom) return '';
    
    // Prendre les 3 premières lettres en majuscules
    return nom.substring(0, 3).toUpperCase();
  }

  /**
   * Prévise le prochain numéro
   * @param {string} typePiece - Type de pièce
   * @param {Date} datePiece - Date de la pièce
   * @param {Object} contexte - Contexte
   * @param {string} formatPersonnalise - Format personnalisé
   * @returns {string} Numéro prévu
   */
  previsualiserNumero(typePiece, datePiece = new Date(), contexte = {}, formatPersonnalise = null) {
    return this.genererNumero(typePiece, datePiece, contexte, formatPersonnalise);
  }

  /**
   * Valide un format personnalisé
   * @param {string} format - Format à valider
   * @returns {Object} Résultat de validation
   */
  validerFormat(format) {
    const resultat = {
      valide: true,
      erreurs: [],
      variablesUtilisees: []
    };

    // Extraire les variables utilisées
    const regex = /\{([^}]+)\}/g;
    let match;
    
    while ((match = regex.exec(format)) !== null) {
      const variable = match[0];
      const nomVariable = match[1];
      
      if (!this.variablesDisponibles[variable]) {
        resultat.valide = false;
        resultat.erreurs.push(`Variable inconnue: ${variable}`);
      } else {
        resultat.variablesUtilisees.push(variable);
      }
    }

    // Vérifier qu'il y a au moins {TYPE} et {SEQ}
    if (!format.includes('{TYPE}')) {
      resultat.valide = false;
      resultat.erreurs.push('Le format doit contenir {TYPE}');
    }
    
    if (!format.includes('{SEQ') && !format.includes('{SEQ:4}') && !format.includes('{SEQ:5}')) {
      resultat.valide = false;
      resultat.erreurs.push('Le format doit contenir une variable de séquence ({SEQ}, {SEQ:4}, {SEQ:5})');
    }

    return resultat;
  }

  /**
   * Récupère tous les formats par défaut
   * @returns {Object} Formats par défaut
   */
  getFormatsParDefaut() {
    return { ...this.formatsParDefaut };
  }

  /**
   * Récupère toutes les variables disponibles
   * @returns {Object} Variables disponibles
   */
  getVariablesDisponibles() {
    return { ...this.variablesDisponibles };
  }

  /**
   * Récupère toutes les politiques de reset
   * @returns {Object} Politiques de reset
   */
  getPolitiquesReset() {
    return { ...this.politiquesReset };
  }

  // Réserver un numéro (simulation de réservation en base)
  reserverNumero(typePiece, datePiece, contexte = {}) {
    try {
      const numero = this.genererNumero(typePiece, datePiece, contexte);
      
      // TODO: En base de données, marquer ce numéro comme "réservé"
      // INSERT INTO numeros_reserves (numero, type, date_reservation, statut, contexte)
      // VALUES (numero, typePiece, NOW(), 'RESERVE', JSON.stringify(contexte))
      
      // Simulation : stocker en localStorage
      const key = `reserve_${typePiece}_${datePiece.getFullYear()}_${(datePiece.getMonth() + 1).toString().padStart(2, '0')}`;
      const reserves = JSON.parse(localStorage.getItem(key) || '[]');
      reserves.push({
        numero,
        dateReservation: new Date().toISOString(),
        statut: 'RESERVE',
        contexte
      });
      localStorage.setItem(key, JSON.stringify(reserves));
      
      return {
        success: true,
        numero,
        message: 'Numéro réservé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        numero: null,
        message: 'Erreur lors de la réservation',
        error: error.message
      };
    }
  }

  // Confirmer un numéro réservé (passage au statut "UTILISE")
  confirmerNumero(typePiece, numero, contexte = {}) {
    try {
      // TODO: En base de données, mettre à jour le statut
      // UPDATE numeros_reserves SET statut = 'UTILISE', date_confirmation = NOW() 
      // WHERE numero = numero AND statut = 'RESERVE'
      
      // Simulation : mettre à jour en localStorage
      const datePiece = new Date();
      const key = `reserve_${typePiece}_${datePiece.getFullYear()}_${(datePiece.getMonth() + 1).toString().padStart(2, '0')}`;
      const reserves = JSON.parse(localStorage.getItem(key) || '[]');
      
      const reserveIndex = reserves.findIndex(r => r.numero === numero);
      if (reserveIndex !== -1) {
        reserves[reserveIndex].statut = 'UTILISE';
        reserves[reserveIndex].dateConfirmation = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(reserves));
      }
      
      return {
        success: true,
        message: 'Numéro confirmé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la confirmation',
        error: error.message
      };
    }
  }

  // Annuler un numéro réservé (passage au statut "ANNULE")
  annulerNumero(typePiece, numero, contexte = {}) {
    try {
      // TODO: En base de données, mettre à jour le statut
      // UPDATE numeros_reserves SET statut = 'ANNULE', date_annulation = NOW() 
      // WHERE numero = numero AND statut = 'RESERVE'
      
      // Simulation : mettre à jour en localStorage
      const datePiece = new Date();
      const key = `reserve_${typePiece}_${datePiece.getFullYear()}_${(datePiece.getMonth() + 1).toString().padStart(2, '0')}`;
      const reserves = JSON.parse(localStorage.getItem(key) || '[]');
      
      const reserveIndex = reserves.findIndex(r => r.numero === numero);
      if (reserveIndex !== -1) {
        reserves[reserveIndex].statut = 'ANNULE';
        reserves[reserveIndex].dateAnnulation = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(reserves));
      }
      
      return {
        success: true,
        message: 'Numéro annulé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de l\'annulation',
        error: error.message
      };
    }
  }

  // Obtenir les statistiques d'une période
  getStatistiquesPeriode(typePiece, datePiece) {
    try {
      const key = `reserve_${typePiece}_${datePiece.getFullYear()}_${(datePiece.getMonth() + 1).toString().padStart(2, '0')}`;
      const reserves = JSON.parse(localStorage.getItem(key) || '[]');
      
      const statistiques = {
        total: reserves.length,
        reserves: reserves.filter(r => r.statut === 'RESERVE').length,
        utilises: reserves.filter(r => r.statut === 'UTILISE').length,
        annules: reserves.filter(r => r.statut === 'ANNULE').length
      };
      
      return statistiques;
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return {
        total: 0,
        reserves: 0,
        utilises: 0,
        annules: 0
      };
    }
  }
}

// Instance singleton
const numerotationService = new NumerotationService();

export default numerotationService;
