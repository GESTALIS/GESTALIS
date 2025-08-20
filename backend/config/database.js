const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Création du client Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Test de connexion
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connexion à la base de données PostgreSQL établie via Prisma');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    return false;
  }
};

// Fonction utilitaire pour exécuter des requêtes (compatibilité)
const query = async (sql, params = []) => {
  try {
    const result = await prisma.$queryRawUnsafe(sql, ...params);
    return { rows: result || [], rowCount: result ? result.length : 0 };
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution de la requête:', error);
    throw error;
  }
};

// Fonction pour exécuter des requêtes d'insertion/mise à jour (compatibilité)
const run = async (sql, params = []) => {
  try {
    const result = await prisma.$executeRawUnsafe(sql, ...params);
    return { 
      lastID: 0, 
      changes: result,
      rows: [{ id: 0 }]
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution de la requête:', error);
    throw error;
  }
};

// Fonction pour obtenir un client du pool (compatibilité)
const getClient = () => {
  return prisma;
};

// Fermeture de la base de données
const close = async () => {
  try {
    await prisma.$disconnect();
    console.log('🔌 Connexion à la base de données fermée');
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture de la base:', error.message);
  }
};

module.exports = {
  db: prisma,
  query,
  run,
  getClient,
  testConnection,
  close
};
