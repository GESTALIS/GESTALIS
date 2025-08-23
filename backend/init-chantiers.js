const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initChantiers() {
  try {
    console.log('🚀 Initialisation des chantiers de test...');
    
    // Vérifier si des chantiers existent déjà
    const existingChantiers = await prisma.chantier.findMany();
    
    if (existingChantiers.length > 0) {
      console.log(`✅ ${existingChantiers.length} chantier(s) existent déjà dans la base de données`);
      existingChantiers.forEach(chantier => {
        console.log(`📋 ${chantier.codeChantier}: ${chantier.nom}`);
      });
      return;
    }
    
    // Créer des chantiers de test
    const chantiers = [
      {
        codeChantier: 'CH001',
        nom: 'Rénovation Appartement Paris 16e',
        description: 'Rénovation complète d\'un appartement de 120m² dans le 16e arrondissement',
        adresse: '45 Avenue Victor Hugo',
        ville: 'Paris',
        codePostal: '75016',
        pays: 'France',
        clientNom: 'M. et Mme Martin',
        clientContact: 'M. Martin',
        clientTelephone: '01 45 67 89 12',
        clientEmail: 'martin@email.fr',
        dateDebut: new Date('2024-01-15'),
        dateFinPrevue: new Date('2024-06-30'),
        statut: 'EN_COURS',
        surface: 120.00,
        uniteSurface: 'M2',
        typeChantier: 'RESIDENTIEL',
        budgetPrevisionnel: 85000.00,
        devise: 'EUR',
        chefChantier: 'Jean Dupont',
        conducteurTravaux: 'Pierre Durand'
      },
      {
        codeChantier: 'CH002',
        nom: 'Construction Maison Neuve Lyon',
        description: 'Construction d\'une maison individuelle de 180m² avec garage',
        adresse: '123 Chemin des Fleurs',
        ville: 'Lyon',
        codePostal: '69000',
        pays: 'France',
        clientNom: 'M. et Mme Dubois',
        clientContact: 'M. Dubois',
        clientTelephone: '04 78 12 34 56',
        clientEmail: 'dubois@email.fr',
        dateDebut: new Date('2024-03-01'),
        dateFinPrevue: new Date('2024-12-31'),
        statut: 'EN_COURS',
        surface: 180.00,
        uniteSurface: 'M2',
        typeChantier: 'RESIDENTIEL',
        budgetPrevisionnel: 280000.00,
        devise: 'EUR',
        chefChantier: 'Marc Leroy',
        conducteurTravaux: 'Thomas Moreau',
        architecte: 'Agence Architecture Moderne'
      },
      {
        codeChantier: 'CH003',
        nom: 'Rénovation Bureau Commercial Marseille',
        description: 'Rénovation d\'un espace de bureau de 300m² pour une agence immobilière',
        adresse: '78 Boulevard de la République',
        ville: 'Marseille',
        codePostal: '13001',
        pays: 'France',
        clientNom: 'Agence Immobilière du Sud',
        clientContact: 'Mme Rodriguez',
        clientTelephone: '04 91 23 45 67',
        clientEmail: 'contact@agence-sud.fr',
        dateDebut: new Date('2024-02-15'),
        dateFinPrevue: new Date('2024-05-15'),
        statut: 'EN_COURS',
        surface: 300.00,
        uniteSurface: 'M2',
        typeChantier: 'COMMERCIAL',
        budgetPrevisionnel: 120000.00,
        devise: 'EUR',
        chefChantier: 'Antoine Bernard',
        conducteurTravaux: 'Laurent Petit'
      }
    ];
    
    for (const chantierData of chantiers) {
      const chantier = await prisma.chantier.create({
        data: chantierData
      });
      console.log(`✅ Chantier créé: ${chantier.codeChantier} - ${chantier.nom}`);
    }
    
    console.log('\n🎉 Initialisation des chantiers terminée avec succès !');
    console.log('💡 Ces chantiers peuvent maintenant être utilisés dans les bons de commande');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des chantiers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la fonction
initChantiers();
