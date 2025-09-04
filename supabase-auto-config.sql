-- =====================================================
-- CONFIGURATION SUPABASE AUTOMATIQUE GESTALIS
-- Script complet pour configurer automatiquement la base
-- =====================================================

-- =====================================================
-- 1. CRÉATION DES TABLES AVEC STRUCTURE OPTIMISÉE
-- =====================================================

-- Table fournisseurs (ID en BIGINT pour compatibilité)
CREATE TABLE IF NOT EXISTS fournisseurs (
    id BIGSERIAL PRIMARY KEY,
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

-- Table produits
CREATE TABLE IF NOT EXISTS produits (
    id BIGSERIAL PRIMARY KEY,
    code_produit VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(255) NOT NULL,
    description TEXT,
    prix_unitaire_ht DECIMAL(10,2),
    unite VARCHAR(20) DEFAULT 'unité',
    tva DECIMAL(5,2) DEFAULT 20.00,
    stock_actuel INTEGER DEFAULT 0,
    stock_minimum INTEGER DEFAULT 0,
    fournisseur_id BIGINT REFERENCES fournisseurs(id),
    statut VARCHAR(50) DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
