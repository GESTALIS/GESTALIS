# 🔑 GUIDE CRÉATION TOKEN SUPABASE

## 🚀 DÉPLOIEMENT AUTOMATIQUE GESTALIS

**Pour déployer automatiquement, vous devez créer un token d'accès Supabase :**

---

## 📋 ÉTAPES À SUIVRE :

### 1️⃣ **Aller sur Supabase**
- Ouvrir : [https://supabase.com](https://supabase.com)
- Cliquer sur **"Start your project"**

### 2️⃣ **Se connecter**
- Se connecter avec votre compte **GitHub**
- Cliquer sur **"Continue with GitHub"**

### 3️⃣ **Accéder aux tokens**
- Une fois connecté, cliquer sur votre **avatar** (en haut à droite)
- Cliquer sur **"Account"**
- Dans le menu de gauche, cliquer sur **"Access Tokens"**

### 4️⃣ **Créer un nouveau token**
- Cliquer sur **"Generate new token"**
- Donner un nom : `gestalis-deployment`
- Cliquer sur **"Generate token"**

### 5️⃣ **Copier le token**
- **⚠️ IMPORTANT :** Copier le token immédiatement !
- Il ne sera plus visible après cette page
- Le token ressemble à : `sbp_1234567890abcdef...`

---

## 💻 UTILISATION DU TOKEN :

### **Option 1 : Variable d'environnement (Recommandé)**
```bash
# Windows PowerShell
$env:SUPABASE_ACCESS_TOKEN="votre_token_ici"

# Windows CMD
set SUPABASE_ACCESS_TOKEN=votre_token_ici

# Linux/Mac
export SUPABASE_ACCESS_TOKEN="votre_token_ici"
```

### **Option 2 : Fichier .env**
Créer un fichier `.env` à la racine du projet :
```bash
SUPABASE_ACCESS_TOKEN=votre_token_ici
```

---

## 🎯 APRÈS AVOIR CRÉÉ LE TOKEN :

**Revenez ici et dites-moi : "TOKEN CRÉÉ"**

**Je lancerai alors le déploiement automatique complet !**

---

## ⚠️ SÉCURITÉ :

- **Ne partagez JAMAIS** ce token
- **Ne le committez JAMAIS** dans Git
- **Supprimez-le** après le déploiement si nécessaire

---

## 🚀 PRÊT À DÉPLOYER ?

**Créez le token et dites-moi "TOKEN CRÉÉ" !**
