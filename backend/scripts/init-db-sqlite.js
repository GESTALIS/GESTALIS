const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Chemin vers la base de données
const dbPath = path.join(__dirname, '..', 'gestalis.db');

console.log('🚀 Initialisation de la base de données GESTALIS SQLite...');
console.log(`📁 Chemin: ${dbPath}`);

// Création de la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de création de la base:', err.message);
    process.exit(1);
  }
  console.log('✅ Base de données créée/connectée');
});

// Activation des clés étrangères
db.run('PRAGMA foreign_keys = ON');

// Création des tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    const tables = [
      // Table des utilisateurs
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user', 'viewer')),
        is_active INTEGER DEFAULT 1,
        phone TEXT,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )`,

      // Table des clients
      `CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        siret TEXT,
        adresse TEXT,
        code_postal TEXT,
        ville TEXT,
        pays TEXT DEFAULT 'France',
        telephone TEXT,
        email TEXT,
        contact_principal TEXT,
        notes TEXT,
        statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'prospect')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )`,

      // Table des fournisseurs
      `CREATE TABLE IF NOT EXISTS fournisseurs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        siret TEXT,
        adresse TEXT,
        code_postal TEXT,
        ville TEXT,
        pays TEXT DEFAULT 'France',
        telephone TEXT,
        email TEXT,
        contact_principal TEXT,
        specialite TEXT,
        notes TEXT,
        statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )`,

      // Table des chantiers
      `CREATE TABLE IF NOT EXISTS chantiers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        description TEXT,
        adresse TEXT,
        code_postal TEXT,
        ville TEXT,
        client_id INTEGER REFERENCES clients(id),
        statut TEXT DEFAULT 'en_preparation' CHECK (statut IN ('en_preparation', 'en_cours', 'suspendu', 'termine', 'annule')),
        date_debut DATE,
        date_fin_prevue DATE,
        date_fin_reelle DATE,
        budget_initial REAL,
        budget_actuel REAL,
        pourcentage_avancement INTEGER DEFAULT 0 CHECK (pourcentage_avancement >= 0 AND pourcentage_avancement <= 100),
        responsable_id INTEGER REFERENCES users(id),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )`,

      // Table des demandes de prix
      `CREATE TABLE IF NOT EXISTS demandes_prix (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT UNIQUE NOT NULL,
        objet TEXT NOT NULL,
        description TEXT,
        chantier_id INTEGER REFERENCES chantiers(id),
        fournisseur_id INTEGER REFERENCES fournisseurs(id),
        date_demande DATE DEFAULT CURRENT_DATE,
        date_reponse DATE,
        montant_ht REAL,
        montant_tva REAL,
        montant_total REAL,
        statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'recue', 'acceptee', 'refusee', 'annulee')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )`,

      // Table des commandes fournisseurs
      `CREATE TABLE IF NOT EXISTS commandes_fournisseurs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT UNIQUE NOT NULL,
        demande_prix_id INTEGER REFERENCES demandes_prix(id),
        fournisseur_id INTEGER REFERENCES fournisseurs(id),
        chantier_id INTEGER REFERENCES chantiers(id),
        date_commande DATE DEFAULT CURRENT_DATE,
        date_livraison_prevue DATE,
        date_livraison_reelle DATE,
        montant_ht REAL,
        montant_tva REAL,
        montant_total REAL,
        statut TEXT DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'livree', 'annulee', 'retardee')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )`,

      // Table des factures fournisseurs
      `CREATE TABLE IF NOT EXISTS factures_fournisseurs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT UNIQUE NOT NULL,
        commande_id INTEGER REFERENCES commandes_fournisseurs(id),
        fournisseur_id INTEGER REFERENCES fournisseurs(id),
        date_facture DATE,
        date_echeance DATE,
        montant_ht REAL,
        montant_tva REAL,
        montant_total REAL,
        statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'payee', 'partiellement_payee', 'en_retard')),
        montant_paye REAL DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )`,

      // Table des devis clients
      `CREATE TABLE IF NOT EXISTS devis_clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT UNIQUE NOT NULL,
        client_id INTEGER REFERENCES clients(id),
        chantier_id INTEGER REFERENCES chantiers(id),
        objet TEXT NOT NULL,
        description TEXT,
        date_devis DATE DEFAULT CURRENT_DATE,
        date_validite DATE,
        montant_ht REAL,
        montant_tva REAL,
        montant_total REAL,
        statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'accepte', 'refuse', 'expire', 'annule')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )`,

      // Table des factures clients
      `CREATE TABLE IF NOT EXISTS factures_clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT UNIQUE NOT NULL,
        devis_id INTEGER REFERENCES devis_clients(id),
        client_id INTEGER REFERENCES clients(id),
        chantier_id INTEGER REFERENCES chantiers(id),
        date_facture DATE DEFAULT CURRENT_DATE,
        date_echeance DATE,
        montant_ht REAL,
        montant_tva REAL,
        montant_total REAL,
        statut TEXT DEFAULT 'emise' CHECK (statut IN ('emise', 'payee', 'partiellement_payee', 'en_retard', 'annulee')),
        montant_paye REAL DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )`,

      // Table des règlements
      `CREATE TABLE IF NOT EXISTS reglements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('recette', 'depense')),
        montant REAL NOT NULL,
        date_reglement DATE DEFAULT CURRENT_DATE,
        mode_reglement TEXT,
        reference TEXT,
        facture_id INTEGER,
        facture_type TEXT CHECK (facture_type IN ('client', 'fournisseur')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )`,

      // Table des équipes
      `CREATE TABLE IF NOT EXISTS equipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        responsable_id INTEGER REFERENCES users(id),
        specialite TEXT,
        nombre_membres INTEGER DEFAULT 1,
        statut TEXT DEFAULT 'active' CHECK (statut IN ('active', 'inactive', 'en_formation')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Table des affectations équipe-chantier
      `CREATE TABLE IF NOT EXISTS affectations_equipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        equipe_id INTEGER REFERENCES equipes(id),
        chantier_id INTEGER REFERENCES chantiers(id),
        date_debut DATE DEFAULT CURRENT_DATE,
        date_fin DATE,
        role TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    let completed = 0;
    const total = tables.length;

    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Erreur création table ${index + 1}:`, err.message);
          reject(err);
          return;
        }
        
        completed++;
        console.log(`✅ Table ${index + 1}/${total} créée`);
        
        if (completed === total) {
          console.log('🎉 Toutes les tables créées avec succès');
          resolve();
        }
      });
    });
  });
};

// Création des index
const createIndexes = () => {
  return new Promise((resolve, reject) => {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_clients_nom ON clients(nom)',
      'CREATE INDEX IF NOT EXISTS idx_fournisseurs_nom ON fournisseurs(nom)',
      'CREATE INDEX IF NOT EXISTS idx_chantiers_statut ON chantiers(statut)',
      'CREATE INDEX IF NOT EXISTS idx_chantiers_client ON chantiers(client_id)',
      'CREATE INDEX IF NOT EXISTS idx_demandes_prix_statut ON demandes_prix(statut)',
      'CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes_fournisseurs(statut)',
      'CREATE INDEX IF NOT EXISTS idx_factures_statut ON factures_fournisseurs(statut)',
      'CREATE INDEX IF NOT EXISTS idx_factures_clients_statut ON factures_clients(statut)'
    ];

    let completed = 0;
    const total = indexes.length;

    indexes.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Erreur création index ${index + 1}:`, err.message);
          reject(err);
          return;
        }
        
        completed++;
        console.log(`✅ Index ${index + 1}/${total} créé`);
        
        if (completed === total) {
          console.log('🎉 Tous les index créés avec succès');
          resolve();
        }
      });
    });
  });
};

// Insertion des données de test
const insertTestData = async () => {
  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Insertion utilisateur admin
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO users (username, email, password_hash, first_name, last_name, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['admin', 'admin@gestalis.com', hashedPassword, 'Administrateur', 'GESTALIS', 'admin', 1],
        function(err) {
          if (err) {
            console.error('❌ Erreur insertion admin:', err.message);
            reject(err);
          } else {
            console.log('✅ Utilisateur admin créé');
            resolve();
          }
        }
      );
    });

    // Insertion utilisateur test
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO users (username, email, password_hash, first_name, last_name, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['testuser', 'test@gestalis.com', hashedPassword, 'Utilisateur', 'Test', 'user', 1],
        function(err) {
          if (err) {
            console.error('❌ Erreur insertion testuser:', err.message);
            reject(err);
          } else {
            console.log('✅ Utilisateur test créé');
            resolve();
          }
        }
      );
    });

    console.log('🎉 Données de test insérées avec succès');
  } catch (error) {
    console.error('❌ Erreur insertion données de test:', error);
    throw error;
  }
};

// Exécution de l'initialisation
const initDatabase = async () => {
  try {
    console.log('\n📋 Création des tables...');
    await createTables();
    
    console.log('\n📊 Création des index...');
    await createIndexes();
    
    console.log('\n👥 Insertion des données de test...');
    await insertTestData();
    
    console.log('\n🎉 Base de données GESTALIS initialisée avec succès !');
    console.log('\n🔑 Identifiants de connexion:');
    console.log('   Admin: admin / admin123');
    console.log('   User:  testuser / test123');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('❌ Erreur fermeture base:', err.message);
      } else {
        console.log('\n🔌 Base de données fermée');
      }
    });
  }
};

// Démarrage de l'initialisation
initDatabase();
