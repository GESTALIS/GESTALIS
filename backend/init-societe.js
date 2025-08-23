const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initSociete() {
  try {
    console.log('🚀 Initialisation des paramètres de la société...');
    
    // Vérifier si une société existe déjà
    const existingSociete = await prisma.societe.findFirst();
    
    if (existingSociete) {
      console.log('✅ Une société existe déjà dans la base de données');
      console.log('📋 Nom:', existingSociete.nom);
      console.log('📋 Raison sociale:', existingSociete.raisonSociale);
      return;
    }
    
    // Créer la société par défaut
    const societe = await prisma.societe.create({
      data: {
        nom: 'Votre Entreprise',
        raisonSociale: 'Votre Raison Sociale',
        siret: '12345678901234',
        tvaIntracommunautaire: 'FR12345678901',
        codeApeNaf: '4391C',
        formeJuridique: 'SARL',
        capitalSocial: 100000,
        adresseSiege: '123 Rue de la Paix\n75001 Paris',
        adresseLivraison: '123 Rue de la Paix\n75001 Paris',
        telephone: '01 23 45 67 89',
        email: 'contact@votreentreprise.fr',
        siteWeb: 'https://www.votreentreprise.fr',
        logoUrl: null,
        logoBase64: null,
        rcs: 'Paris',
        numeroRcs: 'B 123 456 789',
        contactPrincipal: 'Jean Dupont',
        serviceAchats: 'Service Achats',
        serviceComptabilite: 'Service Comptabilité',
        enTeteDefaut: 'Votre Entreprise - Excellence et Qualité',
        piedDePage: 'Merci de votre confiance',
        conditionsGenerales: 'Conditions générales de vente disponibles sur demande',
        devise: 'EUR',
        langue: 'FR',
        fuseauHoraire: 'Europe/Paris'
      }
    });
    
    console.log('✅ Société créée avec succès !');
    console.log('📋 ID:', societe.id);
    console.log('📋 Nom:', societe.nom);
    console.log('📋 Raison sociale:', societe.raisonSociale);
    console.log('📋 Adresse:', societe.adresseSiege);
    
    console.log('\n💡 N\'oubliez pas de modifier ces informations dans l\'interface !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la société:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la fonction
initSociete();
