const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUsers() {
  try {
    console.log('🚀 Création des utilisateurs GESTALIS...');
    
    const users = [
      {
        email: 'admin@gestalis.com',
        password: 'admin123',
        nom: 'Administrateur',
        prenom: 'GESTALIS',
        role: 'ADMIN'
      },
      {
        email: 'cmpt@gestalis.com',
        password: 'compta123',
        nom: 'Dubois',
        prenom: 'Marie',
        role: 'COMPTABLE'
      }
    ];
    
    for (const userData of users) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (existingUser) {
        console.log(`✅ L'utilisateur ${userData.email} existe déjà !`);
        continue;
      }
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          nom: userData.nom,
          prenom: userData.prenom,
          role: userData.role
        }
      });
      
      console.log(`✅ Utilisateur ${userData.role} créé avec succès !`);
      console.log(`📧 Email: ${userData.email}`);
      console.log(`🔑 Mot de passe: ${userData.password}`);
      console.log(`👤 Rôle: ${userData.role}`);
      console.log('---');
    }
    
    console.log('🎉 Tous les utilisateurs ont été créés !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
