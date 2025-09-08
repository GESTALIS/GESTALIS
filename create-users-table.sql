-- =====================================================
-- CRÉATION DE LA TABLE USERS POUR GESTALIS
-- Table manquante pour les utilisateurs/créateurs
-- =====================================================

-- Table des utilisateurs (pour les créateurs de bons de commande)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user', 'viewer')),
    actif BOOLEAN DEFAULT true,
    telephone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_actif ON users(actif);

-- Insérer quelques utilisateurs de test (basés sur vos données existantes)
INSERT INTO users (email, nom, prenom, role, actif) VALUES
('admin@gestalis.com', 'Admin', 'Super', 'admin', true),
('user@gestalis.com', 'User', 'Test', 'user', true),
('jean.dupont@gestalis.com', 'Dupont', 'Jean', 'manager', true),
('marie.martin@gestalis.com', 'Martin', 'Marie', 'user', true)
ON CONFLICT (email) DO NOTHING;

-- Afficher les utilisateurs créés
SELECT * FROM users ORDER BY created_at;

