/**
 * Service de comptabilisation des factures
 * Génération des écritures comptables selon les règles métier
 */

class ComptabiliteService {
  constructor() {
    this.storageKey = 'gestalis_parametres_comptables';
    this.initialiserParametres();
  }

  /**
   * Initialiser les paramètres comptables par défaut
   */
  initialiserParametres() {
    const parametresExistants = this.chargerParametres();
    if (!parametresExistants) {
      const parametresDefaut = {
        // Comptes par défaut
        comptes: {
          banque: '512000',
          fournisseurs: 'F0000',
          charges: '600000',
          tva: '445660',
          retenueGarantie: '487000'
        },
        
        // Mapping catégories → comptes de charge
        mappingCategories: {
          'Carburant': '606300',
          'Matériaux': '601000',
          'Transport': '624000',
          'Sous-traitance': '604000',
          'Divers': '606800'
        },
        
        // Format du libellé
        formatLibelle: '{FOURNISSEUR} - {CHANTIER} - {ARTICLE}',
        
        // Colonnes d'export
        colonnesExport: [
          'Date',
          'Numéro de pièce',
          'Compte',
          'Libellé',
          '(Vide)',
          '(Vide)',
          'Débit',
          'Crédit'
        ],
        
        // Ordre des colonnes
        ordreColonnes: [0, 1, 2, 3, 4, 5, 6, 7]
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(parametresDefaut));
    }
  }

  /**
   * Charger les paramètres comptables
   */
  chargerParametres() {
    try {
      const parametres = localStorage.getItem(this.storageKey);
      return parametres ? JSON.parse(parametres) : null;
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres comptables:', error);
      return null;
    }
  }

  /**
   * Sauvegarder les paramètres comptables
   */
  sauvegarderParametres(parametres) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(parametres));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      return false;
    }
  }

  /**
   * Générer les écritures comptables pour une facture
   */
  genererEcrituresComptables(facture) {
    try {
      const parametres = this.chargerParametres();
      if (!parametres) {
        throw new Error('Paramètres comptables non trouvés');
      }

      // Valider la facture
      const validation = this.validerFacture(facture);
      if (!validation.valide) {
        return {
          success: false,
          error: validation.message
        };
      }

      const ecritures = [];
      const dateFacture = new Date(facture.dateFacture).toLocaleDateString('fr-FR');

      // 1. Écriture de charge (Débit)
      facture.lignes.forEach(ligne => {
        const compteCharge = this.obtenirCompteCharge(ligne.categorie, parametres);
        const libelle = this.formaterLibelle(facture, ligne, parametres);
        
        // Gérer la ventilation multi-chantiers
        if (ligne.ventilation && ligne.ventilation.splits) {
          ligne.ventilation.splits.forEach(split => {
            ecritures.push({
              date: dateFacture,
              numeroPiece: facture.numeroPiece,
              compte: compteCharge,
              libelle: `${libelle} - ${split.note || 'Ventilation'}`,
              debit: split.ht,
              credit: 0
            });
          });
        } else {
          // Pas de ventilation, ligne simple
          ecritures.push({
            date: dateFacture,
            numeroPiece: facture.numeroPiece,
            compte: compteCharge,
            libelle: libelle,
            debit: ligne.montantHT,
            credit: 0
          });
        }
      });

      // 2. Écriture de TVA si applicable
      if (facture.tva > 0) {
        ecritures.push({
          date: dateFacture,
          numeroPiece: facture.numeroPiece,
          compte: parametres.comptes.tva,
          libelle: `TVA ${facture.tva}% - ${facture.raisonTva}`,
          debit: facture.montantTTC - facture.montantHT,
          credit: 0
        });
      }

      // 3. Écriture de retenue de garantie si applicable
      if (facture.retenueGarantie > 0) {
        ecritures.push({
          date: dateFacture,
          numeroPiece: facture.numeroPiece,
          compte: parametres.comptes.retenueGarantie,
          libelle: `Retenue de garantie ${facture.retenuePourcentage}%`,
          debit: facture.retenueGarantie,
          credit: 0
        });
      }

      // 4. Écriture de fournisseur (Crédit)
      const montantTotal = this.calculerTotalHT(facture) + (facture.tva > 0 ? facture.montantTTC - facture.montantHT : 0) + facture.retenueGarantie;
      
      ecritures.push({
        date: dateFacture,
        numeroPiece: facture.numeroPiece,
        compte: facture.fournisseur.compteFournisseur,
        libelle: `Facture ${facture.numeroFacture} - ${facture.fournisseur.raisonSociale}`,
        debit: 0,
        credit: montantTotal
      });

      // 5. Écriture de banque (Crédit) pour le montant net
      const montantNet = facture.montantTTC - facture.retenueGarantie;
      ecritures.push({
        date: dateFacture,
        numeroPiece: facture.numeroPiece,
        compte: parametres.comptes.banque,
        libelle: `Paiement ${facture.numeroFacture} - ${facture.fournisseur.raisonSociale}`,
        debit: 0,
        credit: montantNet
      });

      return {
        success: true,
        ecritures: ecritures,
        totalDebit: ecritures.filter(e => e.debit > 0).reduce((sum, e) => sum + e.debit, 0),
        totalCredit: ecritures.filter(e => e.credit > 0).reduce((sum, e) => sum + e.credit, 0)
      };

    } catch (error) {
      console.error('Erreur lors de la génération des écritures:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Valider une facture pour la comptabilisation
   */
  validerFacture(facture) {
    if (!facture) {
      return { valide: false, message: 'Facture non définie' };
    }

    if (!facture.fournisseur?.compteFournisseur) {
      return { valide: false, message: 'Compte fournisseur manquant' };
    }

    if (!facture.lignes || facture.lignes.length === 0) {
      return { valide: false, message: 'Aucune ligne de facture' };
    }

    if (facture.statutComptable === 'COMPTABILISEE') {
      return { valide: false, message: 'Facture déjà comptabilisée' };
    }

    return { valide: true };
  }

  /**
   * Obtenir le compte de charge pour une catégorie
   */
  obtenirCompteCharge(categorie, parametres) {
    return parametres.mappingCategories[categorie] || parametres.mappingCategories['Divers'];
  }

  /**
   * Formater le libellé selon le template configuré
   */
  formaterLibelle(facture, ligne, parametres) {
    let libelle = parametres.formatLibelle;
    
    libelle = libelle.replace('{FOURNISSEUR}', facture.fournisseur.raisonSociale);
    libelle = libelle.replace('{CHANTIER}', facture.chantier.nom);
    libelle = libelle.replace('{ARTICLE}', ligne.designation || ligne.produit);
    
    return libelle;
  }

  /**
   * Calculer le total HT d'une facture
   */
  calculerTotalHT(facture) {
    if (facture.lignes && facture.lignes.length > 0) {
      return facture.lignes.reduce((total, ligne) => {
        if (ligne.ventilation && ligne.ventilation.splits) {
          return total + ligne.ventilation.splits.reduce((sum, split) => sum + split.ht, 0);
        }
        return total + ligne.montantHT;
      }, 0);
    }
    return facture.montantHT || 0;
  }

  /**
   * Exporter les écritures en CSV
   */
  exporterCSV(ecritures, numeroPiece) {
    try {
      const parametres = this.chargerParametres();
      const colonnes = parametres.colonnesExport;
      const ordre = parametres.ordreColonnes;

      // Réorganiser les colonnes selon l'ordre configuré
      const colonnesOrdonnees = ordre.map(index => colonnes[index]);
      
      const csvContent = [
        colonnesOrdonnees.join(';'),
        ...ecritures.map(ecriture => [
          ecriture.date,
          ecriture.numeroPiece,
          ecriture.compte,
          ecriture.libelle,
          '', // Colonne vide
          '', // Colonne vide
          ecriture.debit.toFixed(2).replace('.', ','),
          ecriture.credit.toFixed(2).replace('.', ',')
        ].join(';'))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ecritures_comptables_${numeroPiece}_${new Date().toISOString().split('T')[0]}.csv`);
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

  /**
   * Exporter les écritures en Excel
   */
  async exporterExcel(ecritures, numeroPiece) {
    try {
      // Note: Pour une vraie implémentation, utiliser une bibliothèque comme xlsx
      // Ici on simule avec un export CSV renommé
      return this.exporterCSV(ecritures, numeroPiece);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      return false;
    }
  }

  /**
   * Générer les écritures pour un avoir
   */
  genererEcrituresAvoir(avoir) {
    try {
      // Pour un avoir, inverser les écritures de la facture d'origine
      const ecrituresFacture = this.genererEcrituresComptables(avoir);
      
      if (!ecrituresFacture.success) {
        return ecrituresFacture;
      }

      // Inverser les écritures
      const ecrituresAvoir = ecrituresFacture.ecritures.map(ecriture => ({
        ...ecriture,
        debit: ecriture.credit,
        credit: ecriture.debit,
        libelle: `AVOIR - ${ecriture.libelle}`
      }));

      return {
        success: true,
        ecritures: ecrituresAvoir,
        totalDebit: ecrituresAvoir.filter(e => e.debit > 0).reduce((sum, e) => sum + e.debit, 0),
        totalCredit: ecrituresAvoir.filter(e => e.credit > 0).reduce((sum, e) => sum + e.credit, 0)
      };

    } catch (error) {
      console.error('Erreur lors de la génération des écritures d\'avoir:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instance singleton
const comptabiliteService = new ComptabiliteService();

export default comptabiliteService;
