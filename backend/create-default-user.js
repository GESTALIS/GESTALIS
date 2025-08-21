const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDefaultUser() {
  try {
    console.log('🔍 Vérification de la connexion à la base de données...');
    
    // Test de connexion
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');
    
    // Vérifier si l'utilisateur existe déjà
    console.log('🔍 Recherche de l\'utilisateur admin@gestalis.com...');
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@gestalis.com' }
    });

    if (existingUser) {
      console.log('✅ Utilisateur admin@gestalis.com existe déjà');
      console.log('📊 Détails:', { id: existingUser.id, email: existingUser.email, role: existingUser.role, active: existingUser.active });
      return;
    }

    console.log('🔧 Création de l\'utilisateur par défaut...');
    
    // Créer l'utilisateur par défaut
    const hashedPassword = await bcrypt.hash('gestalis123', 12);
    console.log('🔐 Mot de passe hashé créé');
    
    const user = await prisma.user.create({
      data: {
        email: 'admin@gestalis.com',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        active: true
      }
    });

    console.log('✅ Utilisateur par défaut créé avec succès!');
    console.log('📊 Détails:', { id: user.id, email: user.email, role: user.role, active: user.active });
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:');
    console.error('📝 Message:', error.message);
    console.error('🔍 Code:', error.code);
    console.error('📚 Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Connexion à la base de données fermée');
  }
}

createDefaultUser();
