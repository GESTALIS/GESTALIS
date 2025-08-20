-- Script d'initialisation de la base de données GESTALIS
-- PostgreSQL

-- Création de la base de données (à exécuter manuellement)
-- CREATE DATABASE gestalis_db;
-- CREATE USER gestalis_user WITH PASSWORD 'gestalis_password';
-- GRANT ALL PRIVILEGES ON DATABASE gestalis_db TO gestalis_user;

-- Connexion à la base de données
\c gestalis_db;

-- Extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    siret VARCHAR(14),
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'France',
    telephone VARCHAR(20),
    email VARCHAR(100),
    contact_principal VARCHAR(100),
    notes TEXT,
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'prospect')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des fournisseurs
CREATE TABLE IF NOT EXISTS fournisseurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    siret VARCHAR(14),
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'France',
    telephone VARCHAR(20),
    email VARCHAR(100),
    contact_principal VARCHAR(100),
    specialite VARCHAR(100),
    notes TEXT,
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des chantiers
CREATE TABLE IF NOT EXISTS chantiers (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    description TEXT,
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    client_id INTEGER REFERENCES clients(id),
    statut VARCHAR(20) DEFAULT 'en_preparation' CHECK (statut IN ('en_preparation', 'en_cours', 'suspendu', 'termine', 'annule')),
    date_debut DATE,
    date_fin_prevue DATE,
    date_fin_reelle DATE,
    budget_initial DECIMAL(15,2),
    budget_actuel DECIMAL(15,2),
    pourcentage_avancement INTEGER DEFAULT 0 CHECK (pourcentage_avancement >= 0 AND pourcentage_avancement <= 100),
    responsable_id INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des demandes de prix
CREATE TABLE IF NOT EXISTS demandes_prix (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    objet VARCHAR(200) NOT NULL,
    description TEXT,
    chantier_id INTEGER REFERENCES chantiers(id),
    fournisseur_id INTEGER REFERENCES fournisseurs(id),
    date_demande DATE DEFAULT CURRENT_DATE,
    date_reponse DATE,
    montant_ht DECIMAL(15,2),
    montant_tva DECIMAL(15,2),
    montant_total DECIMAL(15,2),
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'recue', 'acceptee', 'refusee', 'annulee')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des commandes fournisseurs
CREATE TABLE IF NOT EXISTS commandes_fournisseurs (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    demande_prix_id INTEGER REFERENCES demandes_prix(id),
    fournisseur_id INTEGER REFERENCES fournisseurs(id),
    chantier_id INTEGER REFERENCES chantiers(id),
    date_commande DATE DEFAULT CURRENT_DATE,
    date_livraison_prevue DATE,
    date_livraison_reelle DATE,
    montant_ht DECIMAL(15,2),
    montant_tva DECIMAL(15,2),
    montant_total DECIMAL(15,2),
    statut VARCHAR(20) DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'livree', 'annulee', 'retardee')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des factures fournisseurs
CREATE TABLE IF NOT EXISTS factures_fournisseurs (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    commande_id INTEGER REFERENCES commandes_fournisseurs(id),
    fournisseur_id INTEGER REFERENCES fournisseurs(id),
    date_facture DATE,
    date_echeance DATE,
    montant_ht DECIMAL(15,2),
    montant_tva DECIMAL(15,2),
    montant_total DECIMAL(15,2),
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'payee', 'partiellement_payee', 'en_retard')),
    montant_paye DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des devis clients
CREATE TABLE IF NOT EXISTS devis_clients (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    client_id INTEGER REFERENCES clients(id),
    chantier_id INTEGER REFERENCES chantiers(id),
    objet VARCHAR(200) NOT NULL,
    description TEXT,
    date_devis DATE DEFAULT CURRENT_DATE,
    date_validite DATE,
    montant_ht DECIMAL(15,2),
    montant_tva DECIMAL(15,2),
    montant_total DECIMAL(15,2),
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'accepte', 'refuse', 'expire', 'annule')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des factures clients
CREATE TABLE IF NOT EXISTS factures_clients (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    devis_id INTEGER REFERENCES devis_clients(id),
    client_id INTEGER REFERENCES clients(id),
    chantier_id INTEGER REFERENCES chantiers(id),
    date_facture DATE DEFAULT CURRENT_DATE,
    date_echeance DATE,
    montant_ht DECIMAL(15,2),
    montant_tva DECIMAL(15,2),
    montant_total DECIMAL(15,2),
    statut VARCHAR(20) DEFAULT 'emise' CHECK (statut IN ('emise', 'payee', 'partiellement_payee', 'en_retard', 'annulee')),
    montant_paye DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des règlements
CREATE TABLE IF NOT EXISTS reglements (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('recette', 'depense')),
    montant DECIMAL(15,2) NOT NULL,
    date_reglement DATE DEFAULT CURRENT_DATE,
    mode_reglement VARCHAR(50),
    reference VARCHAR(100),
    facture_id INTEGER,
    facture_type VARCHAR(20) CHECK (facture_type IN ('client', 'fournisseur')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des équipes
CREATE TABLE IF NOT EXISTS equipes (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    responsable_id INTEGER REFERENCES users(id),
    specialite VARCHAR(100),
    nombre_membres INTEGER DEFAULT 1,
    statut VARCHAR(20) DEFAULT 'active' CHECK (statut IN ('active', 'inactive', 'en_formation')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des affectations équipe-chantier
CREATE TABLE IF NOT EXISTS affectations_equipes (
    id SERIAL PRIMARY KEY,
    equipe_id INTEGER REFERENCES equipes(id),
    chantier_id INTEGER REFERENCES chantiers(id),
    date_debut DATE DEFAULT CURRENT_DATE,
    date_fin DATE,
    role VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_clients_nom ON clients(nom);
CREATE INDEX IF NOT EXISTS idx_fournisseurs_nom ON fournisseurs(nom);
CREATE INDEX IF NOT EXISTS idx_chantiers_statut ON chantiers(statut);
CREATE INDEX IF NOT EXISTS idx_chantiers_client ON chantiers(client_id);
CREATE INDEX IF NOT EXISTS idx_demandes_prix_statut ON demandes_prix(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes_fournisseurs(statut);
CREATE INDEX IF NOT EXISTS idx_factures_statut ON factures_fournisseurs(statut);
CREATE INDEX IF NOT EXISTS idx_factures_clients_statut ON factures_clients(statut);

-- Triggers pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Application des triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fournisseurs_updated_at BEFORE UPDATE ON fournisseurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chantiers_updated_at BEFORE UPDATE ON chantiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demandes_prix_updated_at BEFORE UPDATE ON demandes_prix FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commandes_updated_at BEFORE UPDATE ON commandes_fournisseurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON factures_fournisseurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_factures_clients_updated_at BEFORE UPDATE ON factures_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reglements_updated_at BEFORE UPDATE ON reglements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipes_updated_at BEFORE UPDATE ON equipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affectations_updated_at BEFORE UPDATE ON affectations_equipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion d'un utilisateur admin par défaut
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) 
VALUES (
    'admin',
    'admin@gestalis.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', -- mot de passe: admin123
    'Administrateur',
    'GESTALIS',
    'admin',
    true
) ON CONFLICT (username) DO NOTHING;

-- Insertion d'un utilisateur de test
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) 
VALUES (
    'testuser',
    'test@gestalis.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', -- mot de passe: test123
    'Utilisateur',
    'Test',
    'user',
    true
) ON CONFLICT (username) DO NOTHING;

-- Message de confirmation
SELECT 'Base de données GESTALIS initialisée avec succès!' as message;
