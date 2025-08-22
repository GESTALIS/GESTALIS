# 🚀 Migration vers Supabase - Guide Complet

## 📋 Prérequis

✅ **Base Supabase créée** avec les tables :
- `fournisseurs` (15 colonnes)
- `contacts` (8 colonnes avec Foreign Key)
- Relations configurées

## 🔧 Configuration

### 1. Récupérer le mot de passe Supabase

**Dans votre dashboard Supabase :**
1. **Settings** → **Database**
2. **Database Password** (le mot de passe que vous avez créé)

### 2. Modifier le fichier `env.supabase`

**Remplacez `VOTRE_MOT_DE_PASSE` par votre vrai mot de passe :**
```bash
DATABASE_URL="postgresql://postgres.esczdkgknrozwovlfbki:VRAI_MOT_DE_PASSE@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

### 3. Générer le client Prisma Supabase

```bash
cd backend
cp env.supabase .env
npx prisma generate --schema=./prisma/schema-supabase.prisma
```

### 4. Tester la connexion

```bash
node migrate-to-supabase.js
```

## 📊 Structure des Tables

### Table `fournisseurs`
- `id` (uuid, Primary Key)
- `code_fournisseur` (text, unique)
- `raison_sociale` (text, NOT NULL)
- `siret` (text)
- `tva_intracommunautaire` (text)
- `code_ape_naf` (text)
- `forme_juridique` (text)
- `capital_social` (numeric)
- `adresse_siege` (text)
- `adresse_livraison` (text)
- `plafond_credit` (numeric)
- `devise` (text, default: 'EUR')
- `est_sous_traitant` (boolean, default: false)
- `pas_de_tva_guyane` (boolean, default: false)
- `compte_comptable` (text)
- `created_at` (timestamp, default: now())

### Table `contacts`
- `id` (uuid, Primary Key)
- `fournisseur_id` (uuid, Foreign Key vers fournisseurs.id)
- `nom` (text)
- `prenom` (text)
- `email` (text)
- `telephone` (text)
- `fonction` (text)
- `created_at` (timestamp, default: now())

## 🔗 Relations

- **`contacts.fournisseur_id`** → **`fournisseurs.id`**
- **Action on delete** : CASCADE
- **Action on update** : CASCADE

## 🧪 Test de la Migration

Le script `migrate-to-supabase.js` va :
1. **Tester la connexion** à Supabase
2. **Créer un fournisseur** de test
3. **Créer un contact** de test
4. **Créer un compte comptable** de test

## ✅ Vérification

**Après migration réussie :**
- **Tables créées** dans Supabase
- **Données de test** insérées
- **Relations** fonctionnelles
- **Prisma** connecté à Supabase

## 🚀 Prochaines Étapes

1. **Modifier le code frontend** pour utiliser Supabase
2. **Tester** la création de fournisseurs
3. **Vérifier** la synchronisation des données
4. **Déployer** l'app complète sur Render

## 🆘 En cas de Problème

**Erreur de connexion :**
- Vérifiez le mot de passe dans `env.supabase`
- Vérifiez que Supabase est actif
- Vérifiez les tables créées

**Erreur Prisma :**
- Vérifiez le schéma `schema-supabase.prisma`
- Régénérez le client : `npx prisma generate`
- Vérifiez les variables d'environnement
