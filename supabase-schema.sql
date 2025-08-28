-- =====================================================
-- SCHÉMA SUPABASE COMPLET POUR GESTALIS
-- Toutes les tables pour tous les modules
-- =====================================================

-- =====================================================
-- MODULE ACHATS - FOURNISSEURS
-- =====================================================
CREATE TABLE IF NOT EXISTS fournisseurs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code_fournisseur VARCHAR(20) UNIQUE NOT NULL,
    raison_sociale VARCHAR(255) NOT NULL,
    siret VARCHAR(14),
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'France',
    telephone VARCHAR(20),
    email VARCHAR(255),
    contact_principal VARCHAR(255),
    conditions_paiement TEXT,
    notes TEXT,
    statut VARCHAR(50) DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MODULE ACHATS - PRODUITS
-- =====================================================
CREATE TABLE IF NOT EXISTS categories_produits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    couleur VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code_produit VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(255) NOT NULL,
    description TEXT,
    categorie_id UUID REFERENCES categories_produits(id),
    prix_unitaire_ht DECIMAL(10,2),
    unite VARCHAR(20) DEFAULT 'unité',
    tva DECIMAL(5,2) DEFAULT 20.00,
    stock_actuel INTEGER DEFAULT 0,
    stock_minimum INTEGER DEFAULT 0,
    fournisseur_id UUID REFERENCES fournisseurs(id),
    statut VARCHAR(50) DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MODULE ACHATS - FACTURES
-- =====================================================
CREATE TABLE IF NOT EXISTS factures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_facture VARCHAR(50) UNIQUE NOT NULL,
    fournisseur_id UUID REFERENCES fournisseurs(id) NOT NULL,
    chantier_id UUID,
    date_facture DATE NOT NULL,
    date_echeance DATE,
    montant_ht DECIMAL(12,2) NOT NULL,
    montant_tva DECIMAL(12,2) NOT NULL,
    montant_ttc DECIMAL(12,2) NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente',
    conditions_paiement TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lignes_facture (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    facture_id UUID REFERENCES factures(id) ON DELETE CASCADE,
    produit_id UUID REFERENCES produits(id),
    designation VARCHAR(255) NOT NULL,
    quantite DECIMAL(10,3) NOT NULL,
    prix_unitaire_ht DECIMAL(10,2) NOT NULL,
    montant_ht DECIMAL(12,2) NOT NULL,
    tva DECIMAL(5,2) DEFAULT 20.00,
    montant_tva DECIMAL(12,2) NOT NULL,
    montant_ttc DECIMAL(12,2) NOT NULL,
    ordre INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MODULE CHANTIERS
-- =====================================================
CREATE TABLE IF NOT EXISTS chantiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    numero_externe VARCHAR(50),
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    client VARCHAR(255),
    date_debut DATE,
    date_fin_prevue DATE,
    date_fin_reelle DATE,
    montant_ht DECIMAL(12,2),
    montant_ttc DECIMAL(12,2),
    statut VARCHAR(50) DEFAULT 'en_cours',
    chef_chantier VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MODULE CESSIONS DE CRÉANCE
-- =====================================================
CREATE TABLE IF NOT EXISTS cessions_creance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference VARCHAR(20) UNIQUE NOT NULL,
    chantier_id UUID REFERENCES chantiers(id),
    fournisseur_id UUID REFERENCES fournisseurs(id),
    montant_cession DECIMAL(12,2) NOT NULL,
    date_cession DATE NOT NULL,
    date_echeance DATE,
    statut VARCHAR(50) DEFAULT 'en_cours',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MODULE SOUS-TRAITANTS
-- =====================================================
CREATE TABLE IF NOT EXISTS sous_traitants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code_sous_traitant VARCHAR(20) UNIQUE NOT NULL,
    raison_sociale VARCHAR(255) NOT NULL,
    siret VARCHAR(14),
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(255),
    specialite VARCHAR(255),
    taux_horaire DECIMAL(8,2),
    statut VARCHAR(50) DEFAULT 'actif',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MODULE PERSONNEL/RH
-- =====================================================
CREATE TABLE IF NOT EXISTS employes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    matricule VARCHAR(20) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(255),
    poste VARCHAR(255),
    departement VARCHAR(100),
    date_embauche DATE,
    salaire_brut DECIMAL(8,2),
    statut VARCHAR(50) DEFAULT 'actif',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MODULE COMPTABILITÉ
-- =====================================================
CREATE TABLE IF NOT EXISTS comptes_comptables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_compte VARCHAR(20) UNIQUE NOT NULL,
    intitule VARCHAR(255) NOT NULL,
    type_compte VARCHAR(50) NOT NULL,
    solde_initial DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ecritures_comptables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_ecriture VARCHAR(50) UNIQUE NOT NULL,
    date_ecriture DATE NOT NULL,
    reference VARCHAR(255),
    libelle TEXT NOT NULL,
    montant DECIMAL(12,2) NOT NULL,
    sens VARCHAR(10) CHECK (sens IN ('debit', 'credit')),
    compte_id UUID REFERENCES comptes_comptables(id),
    facture_id UUID REFERENCES factures(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE HISTORIQUE DES PRIX (pour système d'alerte)
-- =====================================================
CREATE TABLE IF NOT EXISTS historique_prix (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fournisseur_id UUID REFERENCES fournisseurs(id),
    produit_designation VARCHAR(255) NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    date_prix DATE NOT NULL,
    facture_id UUID REFERENCES factures(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEX POUR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_factures_fournisseur ON factures(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_factures_chantier ON factures(chantier_id);
CREATE INDEX IF NOT EXISTS idx_lignes_facture_facture ON lignes_facture(facture_id);
CREATE INDEX IF NOT EXISTS idx_produits_categorie ON produits(categorie_id);
CREATE INDEX IF NOT EXISTS idx_cessions_chantier ON cessions_creance(chantier_id);
CREATE INDEX IF NOT EXISTS idx_cessions_fournisseur ON cessions_creance(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_historique_prix_fournisseur ON historique_prix(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_historique_prix_designation ON historique_prix(produit_designation);

-- =====================================================
-- FONCTIONS ET TRIGGERS
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_fournisseurs_updated_at BEFORE UPDATE ON fournisseurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produits_updated_at BEFORE UPDATE ON produits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON factures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chantiers_updated_at BEFORE UPDATE ON chantiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cessions_creance_updated_at BEFORE UPDATE ON cessions_creance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sous_traitants_updated_at BEFORE UPDATE ON sous_traitants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employes_updated_at BEFORE UPDATE ON employes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONNÉES DE BASE
-- =====================================================

-- Catégories de produits par défaut
INSERT INTO categories_produits (nom, description, couleur) VALUES
('Matériaux', 'Matériaux de construction', '#3B82F6'),
('Outillage', 'Outils et équipements', '#10B981'),
('Services', 'Prestations de services', '#F59E0B'),
('Équipements', 'Équipements lourds', '#EF4444'),
('Consommables', 'Fournitures consommables', '#8B5CF6')
ON CONFLICT DO NOTHING;

-- Comptes comptables de base
INSERT INTO comptes_comptables (numero_compte, intitule, type_compte) VALUES
('401', 'Fournisseurs', 'passif'),
('411', 'Clients', 'actif'),
('512', 'Banque', 'actif'),
('530', 'Caisse', 'actif'),
('607', 'Achats de marchandises', 'charge'),
('706', 'Prestations de services', 'produit'),
('4456', 'État, TVA déductible', 'actif'),
('4457', 'État, TVA collectée', 'passif')
ON CONFLICT DO NOTHING;
