require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // 1. Créer un utilisateur admin
  console.log('👤 Création de l\'utilisateur admin...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gestalis.com' },
    update: {},
    create: {
      email: 'admin@gestalis.com',
      passwordHash: adminPassword,
      role: 'admin',
      active: true
    }
  });
  console.log('✅ Utilisateur admin créé:', admin.email);

  // 2. Créer des tiers (clients et fournisseurs)
  console.log('🏢 Création des tiers...');
  
  const client1 = await prisma.tiers.upsert({
    where: { id: 'client-1' },
    update: {},
    create: {
      id: 'client-1',
      nom: 'Entreprise ABC',
      type: 'CLIENT',
      siret: '12345678901234',
      adresse: '123 Rue de la Paix',
      codePostal: '75001',
      ville: 'Paris',
      telephone: '01 23 45 67 89',
      email: 'contact@abc.com'
    }
  });

  const client2 = await prisma.tiers.upsert({
    where: { id: 'client-2' },
    update: {},
    create: {
      id: 'client-2',
      nom: 'Société XYZ',
      type: 'CLIENT',
      siret: '98765432109876',
      adresse: '456 Avenue des Champs',
      codePostal: '69001',
      ville: 'Lyon',
      telephone: '04 56 78 90 12',
      email: 'info@xyz.fr'
    }
  });

  const fournisseur1 = await prisma.tiers.upsert({
    where: { id: 'fournisseur-1' },
    update: {},
    create: {
      id: 'fournisseur-1',
      nom: 'Matériaux Pro',
      type: 'FOURNISSEUR',
      siret: '11111111111111',
      adresse: '789 Boulevard Industriel',
      codePostal: '31000',
      ville: 'Toulouse',
      telephone: '05 11 22 33 44',
      email: 'contact@materiaux-pro.fr'
    }
  });

  const sousTraitant1 = await prisma.tiers.upsert({
    where: { id: 'soustraitant-1' },
    update: {},
    create: {
      id: 'soustraitant-1',
      nom: 'Électricité Express',
      type: 'SOUSTRAITANT',
      siret: '22222222222222',
      adresse: '321 Rue Technique',
      codePostal: '44000',
      ville: 'Nantes',
      telephone: '02 22 33 44 55',
      email: 'devis@elec-express.fr'
    }
  });

  console.log('✅ Tiers créés:', [client1.nom, client2.nom, fournisseur1.nom, sousTraitant1.nom]);

  // 3. Créer des chantiers
  console.log('🏗️ Création des chantiers...');
  
  const chantier1 = await prisma.chantier.upsert({
    where: { id: 'chantier-1' },
    update: {},
    create: {
      id: 'chantier-1',
      nom: 'Rénovation Immeuble Paris',
      description: 'Rénovation complète d\'un immeuble de bureaux',
      statut: 'en_cours',
      budgetInitial: 1500000.00,
      budgetActuel: 1200000.00,
      dateDebut: new Date('2024-01-15'),
      dateFinPrevue: new Date('2024-12-31')
    }
  });

  const chantier2 = await prisma.chantier.upsert({
    where: { id: 'chantier-2' },
    update: {},
    create: {
      id: 'chantier-2',
      nom: 'Construction École Lyon',
      description: 'Construction d\'une école primaire',
      statut: 'en_preparation',
      budgetInitial: 2500000.00,
      budgetActuel: 2500000.00,
      dateDebut: new Date('2024-03-01'),
      dateFinPrevue: new Date('2025-08-31')
    }
  });

  console.log('✅ Chantiers créés:', [chantier1.nom, chantier2.nom]);

  // 4. Créer des marchés clients
  console.log('📋 Création des marchés clients...');
  
  const marche1 = await prisma.marcheClient.upsert({
    where: { id: 'marche-1' },
    update: {},
    create: {
      id: 'marche-1',
      chantierId: chantier1.id,
      clientId: client1.id,
      reference: 'M-2024-001',
      devise: 'EUR',
      tvaMode: 'STANDARD',
      retenueGarantiePct: 5.00
    }
  });

  const marche2 = await prisma.marcheClient.upsert({
    where: { id: 'marche-2' },
    update: {},
    create: {
      id: 'marche-2',
      chantierId: chantier2.id,
      clientId: client2.id,
      reference: 'M-2024-002',
      devise: 'EUR',
      tvaMode: 'STANDARD',
      retenueGarantiePct: 3.00
    }
  });

  console.log('✅ Marchés créés:', [marche1.reference, marche2.reference]);

  // 5. Créer des contrats de sous-traitance
  console.log('🔧 Création des contrats de sous-traitance...');
  
  const sousTraitance1 = await prisma.sousTraitanceContrat.upsert({
    where: { id: 'st-1' },
    update: {},
    create: {
      id: 'st-1',
      chantierId: chantier1.id,
      sousTraitantId: sousTraitant1.id,
      reference: 'ST-2024-001',
      montantTtc: 150000.00,
      retenueGarantiePct: 5.00,
      cautionRemplacement: true,
      statut: 'actif'
    }
  });

  console.log('✅ Contrat de sous-traitance créé:', sousTraitance1.reference);

  // 6. Créer des factures clients
  console.log('💰 Création des factures clients...');
  
  const factureClient1 = await prisma.factureClient.upsert({
    where: { id: 'fc-1' },
    update: {},
    create: {
      id: 'fc-1',
      chantierId: chantier1.id,
      tiersId: client1.id,
      numero: 'F-2024-001',
      dateFacture: new Date('2024-02-15'),
      montantHT: 50000.00,
      montantTVA: 10000.00,
      montantTotal: 60000.00,
      resteALetrer: 60000.00,
      statut: 'emise'
    }
  });

  console.log('✅ Facture client créée:', factureClient1.numero);

  // 7. Créer des factures fournisseurs
  console.log('📄 Création des factures fournisseurs...');
  
  const factureFournisseur1 = await prisma.factureFournisseur.upsert({
    where: { id: 'ff-1' },
    update: {},
    create: {
      id: 'ff-1',
      chantierId: chantier1.id,
      tiersId: fournisseur1.id,
      numero: 'FF-2024-001',
      dateFacture: new Date('2024-02-10'),
      montantHT: 25000.00,
      montantTVA: 5000.00,
      montantTotal: 30000.00,
      resteALetrer: 30000.00,
      statut: 'recue'
    }
  });

  console.log('✅ Facture fournisseur créée:', factureFournisseur1.numero);

  console.log('🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
