-- Script SQL pour ajouter les colonnes de soft delete aux tables Supabase
-- À exécuter dans l'éditeur SQL de Supabase si les colonnes n'existent pas

-- Table fournisseurs
ALTER TABLE fournisseurs 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Table chantiers (si elle existe)
ALTER TABLE chantiers 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Table produits (si elle existe)
ALTER TABLE produits 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Créer des index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_fournisseurs_is_deleted ON fournisseurs(is_deleted);
CREATE INDEX IF NOT EXISTS idx_chantiers_is_deleted ON chantiers(is_deleted);
CREATE INDEX IF NOT EXISTS idx_produits_is_deleted ON produits(is_deleted);

-- Créer des triggers pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour fournisseurs
DROP TRIGGER IF EXISTS update_fournisseurs_updated_at ON fournisseurs;
CREATE TRIGGER update_fournisseurs_updated_at
    BEFORE UPDATE ON fournisseurs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers pour chantiers
DROP TRIGGER IF EXISTS update_chantiers_updated_at ON chantiers;
CREATE TRIGGER update_chantiers_updated_at
    BEFORE UPDATE ON chantiers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers pour produits
DROP TRIGGER IF EXISTS update_produits_updated_at ON produits;
CREATE TRIGGER update_produits_updated_at
    BEFORE UPDATE ON produits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour documenter les colonnes
COMMENT ON COLUMN fournisseurs.is_deleted IS 'Indique si le fournisseur est supprimé (soft delete)';
COMMENT ON COLUMN fournisseurs.updated_at IS 'Date de dernière modification automatique';
COMMENT ON COLUMN chantiers.is_deleted IS 'Indique si le chantier est supprimé (soft delete)';
COMMENT ON COLUMN chantiers.updated_at IS 'Date de dernière modification automatique';
COMMENT ON COLUMN produits.is_deleted IS 'Indique si le produit est supprimé (soft delete)';
COMMENT ON COLUMN produits.updated_at IS 'Date de dernière modification automatique';
