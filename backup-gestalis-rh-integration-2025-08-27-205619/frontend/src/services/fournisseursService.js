/**
 * Service de gestion des fournisseurs
 * Gère les opérations CRUD et les données de test
 */

class FournisseursService {
  constructor() {
    this.initialiserDonneesTest();
  }

  // Initialiser les données de test
  initialiserDonneesTest() {
    try {
      const fournisseursExistants = localStorage.getItem('gestalis_fournisseurs');
      if (!fournisseursExistants) {
        const donneesTest = [
          {
            id: 1,
            raisonSociale: 'TotalEnergies',
            codeFournisseur: 'TOTAL001',
            siret: '12345678901234',
            adresseSiege: '2 Place Jean Millier, La Défense 6',
            codePostal: '92400',
            ville: 'Courbevoie',
            pays: 'France',
            telephone: '01 47 44 45 46',
            email: 'contact@totalenergies.com',
            siteWeb: 'https://www.totalenergies.com',
            activite: 'Énergie et pétrole',
            regimeFiscal: 'NORMAL',
            tvaIntracommunautaire: 'FR12345678901',
            contactPrincipal: 'Jean Dupont',
            notes: 'Fournisseur principal de carburant',
            compteFournisseur: 'FTOTAL',
            actif: true,
            dateCreation: new Date('2024-01-15').toISOString()
          },
          {
            id: 2,
            raisonSociale: 'Béton Express',
            codeFournisseur: 'BETON001',
            siret: '98765432109876',
            adresseSiege: '15 Rue des Carrières',
            codePostal: '97300',
            ville: 'Cayenne',
            pays: 'France',
            telephone: '05 94 30 12 34',
            email: 'contact@betonexpress.gf',
            siteWeb: 'https://www.betonexpress.gf',
            activite: 'Béton et matériaux de construction',
            regimeFiscal: 'NORMAL',
            tvaIntracommunautaire: 'FR98765432109',
            contactPrincipal: 'Marie Martin',
            notes: 'Spécialiste béton prêt à l\'emploi',
            compteFournisseur: 'FBETON',
            actif: true,
            dateCreation: new Date('2024-02-20').toISOString()
          },
          {
            id: 3,
            raisonSociale: 'Location Pro Guyane',
            codeFournisseur: 'LOC001',
            siret: '45678912345678',
            adresseSiege: '8 Avenue des Palmiers',
            codePostal: '97300',
            ville: 'Cayenne',
            pays: 'France',
            telephone: '05 94 35 67 89',
            email: 'info@locationpro.gf',
            siteWeb: 'https://www.locationpro.gf',
            activite: 'Location d\'engins et matériel',
            regimeFiscal: 'NORMAL',
            tvaIntracommunautaire: 'FR45678912345',
            contactPrincipal: 'Pierre Durand',
            notes: 'Location d\'engins de chantier',
            compteFournisseur: 'FLOC',
            actif: true,
            dateCreation: new Date('2024-03-10').toISOString()
          },
          {
            id: 4,
            raisonSociale: 'Transport Guyane Express',
            codeFournisseur: 'TRANS001',
            siret: '78912345678912',
            adresseSiege: '25 Route de Montabo',
            codePostal: '97300',
            ville: 'Cayenne',
            pays: 'France',
            telephone: '05 94 38 90 12',
            email: 'contact@transportguyane.gf',
            siteWeb: 'https://www.transportguyane.gf',
            activite: 'Transport et logistique',
            regimeFiscal: 'NORMAL',
            tvaIntracommunautaire: 'FR78912345678',
            contactPrincipal: 'Sophie Bernard',
            notes: 'Transport de marchandises et matériaux',
            compteFournisseur: 'FTRANS',
            actif: true,
            dateCreation: new Date('2024-04-05').toISOString()
          },
          {
            id: 5,
            raisonSociale: 'Sous-traitance BTP Guyane',
            codeFournisseur: 'SOUS001',
            siret: '32109876543210',
            adresseSiege: '12 Chemin de la Crique',
            codePostal: '97300',
            ville: 'Cayenne',
            pays: 'France',
            telephone: '05 94 32 45 67',
            email: 'info@soustraitancebtp.gf',
            siteWeb: 'https://www.soustraitancebtp.gf',
            activite: 'Sous-traitance BTP',
            regimeFiscal: 'NORMAL',
            tvaIntracommunautaire: 'FR32109876543',
            contactPrincipal: 'Marc Leroy',
            notes: 'Sous-traitance spécialisée BTP',
            compteFournisseur: 'FSOUS',
            actif: true,
            dateCreation: new Date('2024-05-12').toISOString()
          },
          {
            id: 6,
            raisonSociale: 'Matériaux Guyane',
            codeFournisseur: 'MAT001',
            siret: '65432109876543',
            adresseSiege: '45 Boulevard de la République',
            codePostal: '97300',
            ville: 'Cayenne',
            pays: 'France',
            telephone: '05 94 36 78 90',
            email: 'contact@materiauxguyane.gf',
            siteWeb: 'https://www.materiauxguyane.gf',
            activite: 'Vente de matériaux de construction',
            regimeFiscal: 'NORMAL',
            tvaIntracommunautaire: 'FR65432109876',
            contactPrincipal: 'Lucie Moreau',
            notes: 'Matériaux de construction et outillage',
            compteFournisseur: 'FMAT',
            actif: true,
            dateCreation: new Date('2024-06-18').toISOString()
          }
        ];

        localStorage.setItem('gestalis_fournisseurs', JSON.stringify(donneesTest));
        console.log('Données de test des fournisseurs initialisées');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des données de test:', error);
    }
  }

  // Obtenir tous les fournisseurs
  obtenirFournisseurs() {
    try {
      const fournisseurs = localStorage.getItem('gestalis_fournisseurs');
      return fournisseurs ? JSON.parse(fournisseurs) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
      return [];
    }
  }

  // Obtenir un fournisseur par ID
  obtenirFournisseur(id) {
    try {
      const fournisseurs = this.obtenirFournisseurs();
      return fournisseurs.find(f => f.id === id);
    } catch (error) {
      console.error('Erreur lors de la récupération du fournisseur:', error);
      return null;
    }
  }

  // Rechercher des fournisseurs
  rechercherFournisseurs(terme) {
    try {
      const fournisseurs = this.obtenirFournisseurs();
      if (!terme) return fournisseurs;

      const termeLower = terme.toLowerCase();
      return fournisseurs.filter(f => 
        f.actif && (
          f.raisonSociale.toLowerCase().includes(termeLower) ||
          f.codeFournisseur.toLowerCase().includes(termeLower) ||
          f.contactPrincipal.toLowerCase().includes(termeLower)
        )
      );
    } catch (error) {
      console.error('Erreur lors de la recherche des fournisseurs:', error);
      return [];
    }
  }

  // Créer un nouveau fournisseur
  creerFournisseur(fournisseur) {
    try {
      const fournisseurs = this.obtenirFournisseurs();
      
      // Validation du compte fournisseur
      if (!fournisseur.compteFournisseur) {
        throw new Error('Le compte fournisseur est obligatoire');
      }
      
      if (!fournisseur.compteFournisseur.startsWith('F')) {
        throw new Error('Le compte fournisseur doit commencer par "F"');
      }

      // Vérifier l'unicité du compte
      const compteExiste = fournisseurs.find(f => 
        f.compteFournisseur === fournisseur.compteFournisseur
      );
      
      if (compteExiste) {
        throw new Error(`Le compte ${fournisseur.compteFournisseur} est déjà utilisé`);
      }

      const nouveauFournisseur = {
        ...fournisseur,
        id: Date.now(),
        actif: true,
        dateCreation: new Date().toISOString()
      };

      fournisseurs.push(nouveauFournisseur);
      localStorage.setItem('gestalis_fournisseurs', JSON.stringify(fournisseurs));

      return nouveauFournisseur;
    } catch (error) {
      console.error('Erreur lors de la création du fournisseur:', error);
      throw error;
    }
  }

  // Mettre à jour un fournisseur
  mettreAJourFournisseur(id, modifications) {
    try {
      const fournisseurs = this.obtenirFournisseurs();
      const index = fournisseurs.findIndex(f => f.id === id);
      
      if (index === -1) {
        throw new Error('Fournisseur non trouvé');
      }

      // Validation du compte fournisseur si modifié
      if (modifications.compteFournisseur) {
        if (!modifications.compteFournisseur.startsWith('F')) {
          throw new Error('Le compte fournisseur doit commencer par "F"');
        }

        // Vérifier l'unicité du compte (sauf pour le fournisseur actuel)
        const compteExiste = fournisseurs.find(f => 
          f.id !== id && f.compteFournisseur === modifications.compteFournisseur
        );
        
        if (compteExiste) {
          throw new Error(`Le compte ${modifications.compteFournisseur} est déjà utilisé`);
        }
      }

      fournisseurs[index] = {
        ...fournisseurs[index],
        ...modifications,
        dateModification: new Date().toISOString()
      };

      localStorage.setItem('gestalis_fournisseurs', JSON.stringify(fournisseurs));
      return fournisseurs[index];
    } catch (error) {
      console.error('Erreur lors de la mise à jour du fournisseur:', error);
      throw error;
    }
  }

  // Supprimer un fournisseur (désactivation)
  supprimerFournisseur(id) {
    try {
      const fournisseurs = this.obtenirFournisseurs();
      const index = fournisseurs.findIndex(f => f.id === id);
      
      if (index === -1) {
        throw new Error('Fournisseur non trouvé');
      }

      fournisseurs[index].actif = false;
      fournisseurs[index].dateSuppression = new Date().toISOString();

      localStorage.setItem('gestalis_fournisseurs', JSON.stringify(fournisseurs));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du fournisseur:', error);
      throw error;
    }
  }

  // Obtenir les suggestions de fournisseurs
  obtenirSuggestions(terme, limite = 10) {
    try {
      const fournisseurs = this.rechercherFournisseurs(terme);
      return fournisseurs.slice(0, limite).map(f => ({
        id: f.id,
        label: f.raisonSociale,
        code: f.codeFournisseur,
        compte: f.compteFournisseur,
        contact: f.contactPrincipal,
        telephone: f.telephone
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      return [];
    }
  }

  // Obtenir les statistiques des fournisseurs
  obtenirStatistiques() {
    try {
      const fournisseurs = this.obtenirFournisseurs();
      const actifs = fournisseurs.filter(f => f.actif);
      const inactifs = fournisseurs.filter(f => !f.actif);
      
      // Compter par activité
      const activites = {};
      actifs.forEach(f => {
        if (f.activite) {
          activites[f.activite] = (activites[f.activite] || 0) + 1;
        }
      });

      return {
        total: fournisseurs.length,
        actifs: actifs.length,
        inactifs: inactifs.length,
        activites,
        derniereCreation: actifs.length > 0 ? 
          Math.max(...actifs.map(f => new Date(f.dateCreation))) : null
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total: 0,
        actifs: 0,
        inactifs: 0,
        activites: {},
        derniereCreation: null
      };
    }
  }

  // Exporter les fournisseurs
  exporterFournisseurs(format = 'json') {
    try {
      const fournisseurs = this.obtenirFournisseurs();
      
      if (format === 'csv') {
        // Export CSV
        const headers = [
          'ID', 'Raison Sociale', 'Code Fournisseur', 'SIRET', 'Adresse', 'Code Postal',
          'Ville', 'Pays', 'Téléphone', 'Email', 'Site Web', 'Activité', 'Régime Fiscal',
          'TVA Intracommunautaire', 'Contact Principal', 'Compte Fournisseur', 'Actif'
        ].join(';');

        const rows = fournisseurs.map(f => [
          f.id, f.raisonSociale, f.codeFournisseur, f.siret, f.adresseSiege,
          f.codePostal, f.ville, f.pays, f.telephone, f.email, f.siteWeb,
          f.activite, f.regimeFiscal, f.tvaIntracommunautaire, f.contactPrincipal,
          f.compteFournisseur, f.actif ? 'Oui' : 'Non'
        ].join(';'));

        const csvContent = [headers, ...rows].join('\n');
        
        // Créer et télécharger le fichier
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `fournisseurs_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return true;
      } else {
        // Export JSON
        const dataStr = JSON.stringify(fournisseurs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fournisseurs_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        return true;
      }
    } catch (error) {
      console.error('Erreur lors de l\'export des fournisseurs:', error);
      throw error;
    }
  }

  // Importer des fournisseurs
  importerFournisseurs(fichier) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const contenu = e.target.result;
          let fournisseurs;
          
          if (fichier.name.endsWith('.csv')) {
            // Import CSV (basique)
            const lignes = contenu.split('\n');
            const headers = lignes[0].split(';');
            fournisseurs = lignes.slice(1).filter(l => l.trim()).map(ligne => {
              const valeurs = ligne.split(';');
              const fournisseur = {};
              headers.forEach((header, index) => {
                fournisseur[header.toLowerCase().replace(/\s+/g, '')] = valeurs[index] || '';
              });
              return fournisseur;
            });
          } else {
            // Import JSON
            fournisseurs = JSON.parse(contenu);
          }

          // Validation et import
          const fournisseursValides = fournisseurs.filter(f => 
            f.raisonsociale && f.comptefournisseur
          );

          if (fournisseursValides.length === 0) {
            throw new Error('Aucun fournisseur valide trouvé dans le fichier');
          }

          // Ajouter les fournisseurs
          fournisseursValides.forEach(f => {
            try {
              this.creerFournisseur({
                raisonSociale: f.raisonsociale,
                codeFournisseur: f.codefournisseur || f.raisonsociale.substring(0, 8).toUpperCase(),
                compteFournisseur: f.comptefournisseur,
                siret: f.siret || '',
                adresseSiege: f.adresse || '',
                codePostal: f.codepostal || '',
                ville: f.ville || '',
                pays: f.pays || 'France',
                telephone: f.telephone || '',
                email: f.email || '',
                activite: f.activite || '',
                contactPrincipal: f.contactprincipal || ''
              });
            } catch (error) {
              console.warn(`Erreur lors de l'import du fournisseur ${f.raisonsociale}:`, error);
            }
          });

          resolve(fournisseursValides.length);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsText(fichier);
    });
  }
}

export default new FournisseursService();
