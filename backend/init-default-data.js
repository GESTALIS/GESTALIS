const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initialiserDonneesDefaut() {
  try {
    console.log('🚀 Initialisation des données par défaut...');

    // 1. Initialiser le plan comptable de base
    console.log('📊 Initialisation du plan comptable...');
    
    const comptesDefaut = [
      {
        numeroCompte: '401000',
        intitule: 'Fournisseurs - Achats de biens et services',
        categorie: 'FOURNISSEURS',
        description: 'Compte principal pour les fournisseurs'
      },
      {
        numeroCompte: '401001',
        intitule: 'Fournisseurs - Matériaux',
        categorie: 'FOURNISSEURS',
        description: 'Fournisseurs de matériaux de construction'
      },
      {
        numeroCompte: '401002',
        intitule: 'Fournisseurs - Sous-traitance',
        categorie: 'FOURNISSEURS',
        description: 'Fournisseurs de services de sous-traitance'
      },
      {
        numeroCompte: '401003',
        intitule: 'Fournisseurs - Services',
        categorie: 'FOURNISSEURS',
        description: 'Fournisseurs de services divers'
      },
      {
        numeroCompte: 'F0001',
        intitule: 'Fournisseur - Matériaux Plus',
        categorie: 'FOURNISSEURS',
        description: 'Compte fournisseur généré automatiquement'
      },
      {
        numeroCompte: 'F0002',
        intitule: 'Fournisseur - Sous-traitance Pro',
        categorie: 'FOURNISSEURS',
        description: 'Compte fournisseur généré automatiquement'
      }
    ];

    for (const compte of comptesDefaut) {
      await prisma.planComptable.upsert({
        where: { numeroCompte: compte.numeroCompte },
        update: {},
        create: compte
      });
    }

    console.log('✅ Plan comptable initialisé');

    // 2. Initialiser les conditions de paiement par défaut
    console.log('💳 Initialisation des conditions de paiement...');
    
    const conditionsDefaut = [
      {
        libelle: 'Comptant',
        delai: 0,
        description: 'Paiement immédiat à la livraison',
        actif: true
      },
      {
        libelle: '30 jours',
        delai: 30,
        description: 'Paiement sous 30 jours',
        actif: true
      },
      {
        libelle: '45 jours fin de mois',
        delai: 45,
        description: 'Paiement sous 45 jours fin de mois',
        actif: true
      },
      {
        libelle: '60 jours',
        delai: 60,
        description: 'Paiement sous 60 jours',
        actif: true
      },
      {
        libelle: '90 jours',
        delai: 90,
        description: 'Paiement sous 90 jours',
        actif: true
      }
    ];

    for (const condition of conditionsDefaut) {
      await prisma.conditionsPaiement.upsert({
        where: { libelle: condition.libelle },
        update: {},
        create: condition
      });
    }

    console.log('✅ Conditions de paiement initialisées');

    console.log('🎉 Initialisation terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter si le script est appelé directement
if (require.main === module) {
  initialiserDonneesDefaut()
    .then(() => {
      console.log('Script d\'initialisation terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { initialiserDonneesDefaut };
