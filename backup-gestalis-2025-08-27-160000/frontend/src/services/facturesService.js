/**
 * Service de gestion des factures avec architecture comptable séparée
 * Gestion des statuts comptables, traçabilité, et workflow séparé
 */

class FacturesService {
  constructor() {
    this.storageKey = 'gestalis_factures';
    this.batchesKey = 'gestalis_batches_comptables';
    this.initialiserDonneesTest();
  }

  /**
   * Initialiser des données de test
   */
  initialiserDonneesTest() {
    const facturesExistantes = this.obtenirFactures();
    if (facturesExistantes.length === 0) {
      const facturesTest = [
        {
          id: 'F001',
          numeroPiece: 'AC082025-0001',
          numeroFacture: 'FAC-2025-001',
          typePiece: 'FACTURE_ACHAT',
          dateFacture: '2025-08-15',
          fournisseur: {
            id: 'F001',
            raisonSociale: 'TotalEnergies',
            compteFournisseur: 'F0001'
          },
          chantier: {
            id: 'C001',
            nom: 'Chantier Remire-Montjoly',
            code: 'REMIRE'
          },
          montantHT: 1250.00,
          montantTTC: 1250.00,
          tva: 0,
          raisonTva: 'Article 294, 1 du CGI - Pas de TVA en Guyane',
          retenueGarantie: 0,
          factureSousTraitant: false,
          cessionCreance: false,
          statutComptable: 'NON_COMPTABILISEE',
          originType: 'NORMAL',
          originInvoiceId: null,
          exportedAt: null,
          exportedHash: null,
          createdAt: '2025-08-15T10:00:00Z',
          createdBy: 'USER',
          lignes: [
            {
              id: 1,
              produit: 'Gasoil',
              designation: 'Gasoil pour engins',
              categorie: 'Carburant',
              unite: 'L',
              quantite: 500,
              prixUnitaire: 2.50,
              montantHT: 1250.00,
              ventilation: {
                mode: 'PERCENT',
                splits: [
                  { chantierId: 'C001', value: 100, ht: 1250.00, note: 'Engins Remire' }
                ]
              }
            }
          ]
        },
        {
          id: 'F002',
          numeroPiece: 'AC082025-0002',
          numeroFacture: 'FAC-2025-002',
          typePiece: 'FACTURE_ACHAT',
          dateFacture: '2025-08-16',
          fournisseur: {
            id: 'F002',
            raisonSociale: 'Béton Express',
            compteFournisseur: 'F0002'
          },
          chantier: {
            id: 'C002',
            nom: 'Chantier Cayenne Centre',
            code: 'CAYENNE'
          },
          montantHT: 3450.00,
          montantTTC: 3450.00,
          tva: 0,
          raisonTva: 'Article 294, 1 du CGI - Pas de TVA en Guyane',
          retenueGarantie: 0,
          factureSousTraitant: false,
          cessionCreance: false,
          statutComptable: 'COMPTABILISEE',
          originType: 'NORMAL',
          originInvoiceId: null,
          exportedAt: '2025-08-16T14:30:00Z',
          exportedHash: 'hash_batch_001',
          createdAt: '2025-08-16T09:00:00Z',
          createdBy: 'USER',
          lignes: [
            {
              id: 1,
              produit: 'Béton C25/30',
              designation: 'Béton prêt à l\'emploi',
              categorie: 'Matériaux',
              unite: 'm³',
              quantite: 15,
              prixUnitaire: 230.00,
              montantHT: 3450.00,
              ventilation: {
                mode: 'PERCENT',
                splits: [
                  { chantierId: 'C002', value: 100, ht: 3450.00, note: 'Fondations Cayenne' }
                ]
              }
            }
          ]
        }
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(facturesTest));
      console.log('✅ Données de test des factures initialisées');
    }
  }

  /**
   * Obtenir toutes les factures
   */
  obtenirFactures() {
    try {
      const factures = localStorage.getItem(this.storageKey);
      return factures ? JSON.parse(factures) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des factures:', error);
      return [];
    }
  }

  /**
   * Obtenir une facture par ID
   */
  obtenirFacture(id) {
    const factures = this.obtenirFactures();
    return factures.find(f => f.id === id);
  }

  /**
   * Créer une nouvelle facture
   */
  creerFacture(factureData) {
    try {
      const factures = this.obtenirFactures();
      
      const nouvelleFacture = {
        ...factureData,
        id: `F${String(factures.length + 1).padStart(3, '0')}`,
        statutComptable: 'NON_COMPTABILISEE',
        originType: 'NORMAL',
        originInvoiceId: null,
        exportedAt: null,
        exportedHash: null,
        createdAt: new Date().toISOString(),
        createdBy: 'USER'
      };

      factures.push(nouvelleFacture);
      localStorage.setItem(this.storageKey, JSON.stringify(factures));
      
      console.log('✅ Facture créée:', nouvelleFacture.id);
      return nouvelleFacture;
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une facture
   */
  mettreAJourFacture(id, donnees) {
    try {
      const factures = this.obtenirFactures();
      const index = factures.findIndex(f => f.id === id);
      
      if (index === -1) {
        throw new Error('Facture non trouvée');
      }

      // Vérifier que la facture n'est pas comptabilisée
      if (factures[index].statutComptable === 'COMPTABILISEE') {
        throw new Error('Impossible de modifier une facture comptabilisée');
      }

      factures[index] = {
        ...factures[index],
        ...donnees,
        updatedAt: new Date().toISOString(),
        updatedBy: 'USER'
      };

      localStorage.setItem(this.storageKey, JSON.stringify(factures));
      console.log('✅ Facture mise à jour:', id);
      return factures[index];
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la facture:', error);
      throw error;
    }
  }

  /**
   * Supprimer une facture
   */
  supprimerFacture(id) {
    try {
      const factures = this.obtenirFactures();
      const facture = factures.find(f => f.id === id);
      
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      // Vérifier que la facture n'est pas comptabilisée
      if (facture.statutComptable === 'COMPTABILISEE') {
        throw new Error('Impossible de supprimer une facture comptabilisée');
      }

      const facturesFiltrees = factures.filter(f => f.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(facturesFiltrees));
      
      console.log('✅ Facture supprimée:', id);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la facture:', error);
      throw error;
    }
  }

  /**
   * Filtrer les factures
   */
  filtrerFactures(filtres = {}) {
    let factures = this.obtenirFactures();

    // Filtre par statut comptable
    if (filtres.statutComptable) {
      factures = factures.filter(f => f.statutComptable === filtres.statutComptable);
    }

    // Filtre par type de pièce
    if (filtres.typePiece) {
      factures = factures.filter(f => f.typePiece === filtres.typePiece);
    }

    // Filtre par fournisseur
    if (filtres.fournisseur) {
      factures = factures.filter(f => 
        f.fournisseur.raisonSociale.toLowerCase().includes(filtres.fournisseur.toLowerCase())
      );
    }

    // Filtre par période
    if (filtres.dateDebut && filtres.dateFin) {
      factures = factures.filter(f => {
        const dateFacture = new Date(f.dateFacture);
        const dateDebut = new Date(filtres.dateDebut);
        const dateFin = new Date(filtres.dateFin);
        return dateFacture >= dateDebut && dateFacture <= dateFin;
      });
    }

    // Filtre par montant
    if (filtres.montantMin || filtres.montantMax) {
      factures = factures.filter(f => {
        if (filtres.montantMin && f.montantTTC < filtres.montantMin) return false;
        if (filtres.montantMax && f.montantTTC > filtres.montantMax) return false;
        return true;
      });
    }

    return factures;
  }

  /**
   * Obtenir les statistiques des factures
   */
  obtenirStatistiques() {
    const factures = this.obtenirFactures();
    
    const stats = {
      total: factures.length,
      parStatut: {
        NON_COMPTABILISEE: 0,
        EN_COURS: 0,
        COMPTABILISEE: 0,
        ERREUR: 0
      },
      parType: {
        FACTURE_ACHAT: 0,
        AVOIR_FOURNISSEUR: 0
      },
      montantTotal: 0,
      montantComptabilise: 0
    };

    factures.forEach(facture => {
      // Compter par statut
      stats.parStatut[facture.statutComptable]++;
      
      // Compter par type
      stats.parType[facture.typePiece]++;
      
      // Montants
      stats.montantTotal += facture.montantTTC;
      if (facture.statutComptable === 'COMPTABILISEE') {
        stats.montantComptabilise += facture.montantTTC;
      }
    });

    return stats;
  }

  /**
   * Créer un avoir pour annuler une facture
   */
  creerAvoir(factureId, raison) {
    try {
      const facture = this.obtenirFacture(factureId);
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      const factures = this.obtenirFactures();
      const avoirs = factures.filter(f => f.typePiece === 'AVOIR_FOURNISSEUR');
      const numeroAvoir = `AVAC${String(avoirs.length + 1).padStart(4, '0')}`;

      const nouvelAvoir = {
        id: `AV${String(factures.length + 1).padStart(3, '0')}`,
        numeroPiece: numeroAvoir,
        numeroFacture: `AV-${facture.numeroFacture}`,
        typePiece: 'AVOIR_FOURNISSEUR',
        dateFacture: new Date().toISOString().split('T')[0],
        fournisseur: facture.fournisseur,
        chantier: facture.chantier,
        montantHT: -facture.montantHT,
        montantTTC: -facture.montantTTC,
        tva: facture.tva,
        raisonTva: facture.raisonTva,
        retenueGarantie: 0,
        factureSousTraitant: facture.factureSousTraitant,
        cessionCreance: false,
        statutComptable: 'NON_COMPTABILISEE',
        originType: 'AV_ANNULE',
        originInvoiceId: factureId,
        exportedAt: null,
        exportedHash: null,
        createdAt: new Date().toISOString(),
        createdBy: 'USER',
        raison: raison,
        lignes: facture.lignes.map(ligne => ({
          ...ligne,
          montantHT: -ligne.montantHT,
          ventilation: ligne.ventilation
        }))
      };

      factures.push(nouvelAvoir);
      localStorage.setItem(this.storageKey, JSON.stringify(factures));

      // Marquer la facture d'origine comme annulée
      this.mettreAJourFacture(factureId, {
        statutComptable: 'ANNULEE',
        originType: 'AV_ANNULE',
        originInvoiceId: nouvelAvoir.id
      });

      console.log('✅ Avoir créé:', nouvelAvoir.id);
      return nouvelAvoir;
    } catch (error) {
      console.error('Erreur lors de la création de l\'avoir:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'historique d'une facture
   */
  obtenirHistorique(factureId) {
    const factures = this.obtenirFactures();
    const facture = factures.find(f => f.id === factureId);
    
    if (!facture) return [];

    const historique = [facture];

    // Chercher les avoirs liés
    if (facture.originType === 'AV_ANNULE' && facture.originInvoiceId) {
      const factureOrigine = factures.find(f => f.id === facture.originInvoiceId);
      if (factureOrigine) historique.unshift(factureOrigine);
    }

    // Chercher les factures liées à cet avoir
    if (facture.originType === 'AV_ANNULE') {
      const facturesLiees = factures.filter(f => f.originInvoiceId === factureId);
      historique.push(...facturesLiees);
    }

    return historique.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  /**
   * Exporter les factures en CSV
   */
  exporterCSV(factures) {
    try {
      const headers = [
        'ID', 'Numéro Pièce', 'Numéro Facture', 'Type', 'Date', 'Fournisseur',
        'Chantier', 'Montant HT', 'Montant TTC', 'TVA', 'Statut Comptable',
        'Créé le', 'Créé par'
      ];

      const csvContent = [
        headers.join(';'),
        ...factures.map(f => [
          f.id,
          f.numeroPiece,
          f.numeroFacture,
          f.typePiece,
          f.dateFacture,
          f.fournisseur.raisonSociale,
          f.chantier.nom,
          f.montantHT.toFixed(2).replace('.', ','),
          f.montantTTC.toFixed(2).replace('.', ','),
          f.tva.toFixed(2).replace('.', ','),
          f.statutComptable,
          f.createdAt,
          f.createdBy
        ].join(';'))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `factures_${new Date().toISOString().split('T')[0]}.csv`);
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
}

// Instance singleton
const facturesService = new FacturesService();

export default facturesService;
