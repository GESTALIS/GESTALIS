# 🧪 TEST SMARTPICKER FACTURES

## ✅ CORRECTIONS APPLIQUÉES :

### 1. **SmartPicker.jsx** :
- ✅ Corrigé `window.location.pathname` → `window.location.href` pour le retour
- ✅ Le contexte de retour inclut maintenant l'URL complète

### 2. **NouvelleFacture.jsx** :
- ✅ Imports SmartPicker ajoutés
- ✅ useEffect pour retour fournisseur ajouté
- ✅ useEffect pour retour chantier ajouté
- ✅ SmartPickers remplaçant les champs de recherche
- ✅ URL chantier corrigée : `/chantiers/nouveau`

### 3. **Achats.jsx** :
- ✅ Logique de retour étendue pour `nouvelle-facture`
- ✅ Modal de création s'ouvre pour les factures
- ✅ Retour automatique après création

### 4. **searchService.js** :
- ✅ Données de test ajoutées pour debug
- ✅ Console.log pour tracer les recherches

## 🧪 TESTS À EFFECTUER :

### **TEST 1 : Bouton "+ Créer" fournisseur**
1. Aller sur `/achats/nouvelle-facture`
2. Cliquer sur le champ "Fournisseur"
3. Taper "test" (2+ caractères)
4. Vérifier que le bouton "+ Créer un fournisseur" apparaît
5. Cliquer sur le bouton
6. Vérifier la redirection vers `/achats?tab=fournisseurs&create=true`

### **TEST 2 : Ouverture du modal de création**
1. Après redirection, vérifier que le modal de création s'ouvre
2. Vérifier que le champ "Raison sociale" est pré-rempli avec "test"

### **TEST 3 : Retour automatique**
1. Créer le fournisseur
2. Vérifier le retour automatique vers la facture
3. Vérifier que le fournisseur est sélectionné

### **TEST 4 : Même logique pour chantier**
1. Répéter les tests 1-3 avec le champ "Chantier"
2. URL de retour : `/chantiers/nouveau`

## 🔍 DEBUG :

Si les tests échouent, vérifier :
1. Console du navigateur pour les logs
2. `sessionStorage.getItem('smartpicker_return_context')`
3. `localStorage.getItem('selectedFournisseur')` / `selectedChantier`

## 📝 NOTES :

- Les données de test sont temporaires dans `searchService.js`
- Une fois les tests validés, remettre les vraies requêtes Supabase
- La logique est maintenant identique aux Bons de Commande
