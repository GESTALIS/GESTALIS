# 🧪 TEST SMARTPICKER CHANTIERS

## ✅ CORRECTIONS APPLIQUÉES :

### **1. searchService.js :**
- ✅ **searchChantiers** : Utilise maintenant les vraies données du localStorage
- ✅ **Source** : `localStorage.getItem('gestalis-chantiers')`
- ✅ **Fallback** : Supabase si le store n'est pas disponible
- ✅ **Recherche** : Par nom, code, et clientNom

### **2. NouveauChantier.jsx :**
- ✅ **Logique de retour étendue** : Gère maintenant `nouvelle-facture` en plus de `creation-bon-commande`
- ✅ **Messages adaptés** : "Facture" ou "Bon de Commande" selon la destination
- ✅ **Retour automatique** : Vers le formulaire d'origine

## 🧪 PROCÉDURE DE TEST :

### **TEST 1 : Recherche de chantiers existants**
1. Aller sur `/achats/nouvelle-facture`
2. Passer à l'étape 2 (formulaire de saisie)
3. Cliquer sur le champ "Chantier"
4. Taper le nom d'un chantier existant
5. **VÉRIFIER** : Les vrais chantiers du module apparaissent

### **TEST 2 : Création d'un nouveau chantier**
1. Taper un nom de chantier inexistant : "test123"
2. **VÉRIFIER** : Le bouton "+ Créer un chantier" apparaît
3. Cliquer sur le bouton
4. **VÉRIFIER** : Redirection vers `/chantiers/nouveau`

### **TEST 3 : Retour automatique**
1. Créer le chantier avec les informations
2. **VÉRIFIER** : Retour automatique vers l'étape 2 de la facture
3. **VÉRIFIER** : Chantier sélectionné automatiquement
4. **VÉRIFIER** : Message "Vous allez être redirigé vers le Facture"

## 🔍 DEBUG :

### **Console logs attendus :**
- `🔍 searchChantiers - Query: [nom] Results: [liste des vrais chantiers]`
- `🔍 Contexte SmartPicker trouvé:`
- `🚀 Retour vers le formulaire depuis SmartPicker:`
- `✅ Chantier sélectionné automatiquement:`

### **localStorage à vérifier :**
```javascript
// Dans la console du navigateur
localStorage.getItem('gestalis-chantiers') // Doit contenir les chantiers
localStorage.getItem('selectedChantier') // Doit contenir le chantier sélectionné
```

## 📝 NOTES :

- La logique est maintenant identique à celle des fournisseurs
- Les chantiers sont récupérés depuis le localStorage du module chantiers
- Le retour fonctionne pour les Bons de Commande ET les Factures
- L'état de l'étape est préservé grâce aux corrections précédentes
