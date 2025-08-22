const { PrismaClient } = require('@prisma/client');

// Configuration pour Supabase
const supabasePrisma = new PrismaClient();

async function migrateToSupabase() {
  try {
    console.log('🚀 Début de la migration vers Supabase...');
    
    // Test de connexion
    await supabasePrisma.$connect();
    console.log('✅ Connexion à Supabase réussie !');
    
    // Créer des données de test
    console.log('📝 Création de données de test...');
    
    // Créer un fournisseur de test
    const fournisseur = await supabasePrisma.fournisseur.create({
      data: {
        codeFournisseur: 'FPRO97-0001',
        raisonSociale: 'Fournisseur Test Supabase',
        siret: '12345678901234',
        devise: 'EUR',
        estSousTraitant: false,
        pasDeTvaGuyane: false
      }
    });
    
    console.log('✅ Fournisseur créé:', fournisseur.codeFournisseur);
    
    // Créer un contact de test
    const contact = await supabasePrisma.contact.create({
      data: {
        fournisseurId: fournisseur.id,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@test.com',
        telephone: '0123456789',
        fonction: 'Directeur Commercial'
      }
    });
    
    console.log('✅ Contact créé:', contact.nom, contact.prenom);
    
    // Créer un compte comptable de test
    const compte = await supabasePrisma.planComptable.create({
      data: {
        numeroCompte: 'F0001',
        intitule: 'Fournisseurs - Test Supabase',
        typeCompte: 'FOURNISSEUR'
      }
    });
    
    console.log('✅ Compte comptable créé:', compte.numeroCompte);
    
    console.log('🎉 Migration vers Supabase terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await supabasePrisma.$disconnect();
  }
}

// Exécuter la migration
migrateToSupabase();
