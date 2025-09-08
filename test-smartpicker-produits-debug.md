# Test SmartPicker Produits - DEBUG COMPLET

## 🎯 **Objectif :**
Déboguer les 3 problèmes identifiés :
1. Le bouton "+ Créer" n'ouvre pas le formulaire
2. Le retour ne fonctionne pas après création
3. La recherche ne trouve pas les produits existants

## 🔧 **Corrections apportées :**

### **1. Label corrigé :**
- ✅ Changé `label="Produit/Service"` en `label="Produit"`
- ✅ Le `returnField` sera maintenant "produit" au lieu de "produit/service"

### **2. Bouton "+ Créer" corrigé :**
- ✅ Supprimé la condition `!value` qui empêchait l'affichage
- ✅ Le bouton s'affiche maintenant même si un produit est déjà sélectionné

### **3. Logique de retour vérifiée :**
- ✅ La logique dans `Achats.jsx` gère bien `returnField === 'produit'`
- ✅ Le contexte est correctement sauvegardé et restauré

## 📋 **Tests de débogage :**

### **Test 1 : Vérifier les données de produits**
```javascript
// Ouvrir la console du navigateur et exécuter :
const storeData = localStorage.getItem('gestalis_produits_services');
console.log('Données du store:', storeData);

if (storeData) {
  const produits = JSON.parse(storeData);
  console.log('Produits:', produits);
  console.log('Nombre de produits:', produits.length);
} else {
  console.log('❌ Aucune donnée trouvée - créer des données de test');
}
```

### **Test 2 : Vérifier la recherche**
```javascript
// Tester la fonction de recherche
const query = 'carburant';
const storeData = localStorage.getItem('gestalis_produits_services');
if (storeData) {
  const produits = JSON.parse(storeData);
  const filtered = produits.filter(p => 
    p.actif && (
      p.designation?.toLowerCase().includes(query.toLowerCase()) ||
      p.code?.toLowerCase().includes(query.toLowerCase())
    )
  );
  console.log('Résultats pour "carburant":', filtered);
}
```

### **Test 3 : Vérifier le contexte SmartPicker**
1. Aller sur `/achats/nouvelle-facture`
2. Cliquer sur le champ "Produit/Service"
3. Taper "test123" (produit qui n'existe pas)
4. Vérifier que le bouton "+ Créer un produit" apparaît
5. Cliquer sur le bouton
6. Vérifier dans la console que le contexte est sauvegardé :
```javascript
const context = sessionStorage.getItem('smartpicker_return_context');
console.log('Contexte SmartPicker:', context);
```

### **Test 4 : Vérifier le retour**
1. Créer un produit depuis le SmartPicker
2. Vérifier que l'utilisateur revient à la facture
3. Vérifier que le produit est sélectionné
4. Vérifier dans la console :
```javascript
const selectedProduit = localStorage.getItem('selectedProduit');
console.log('Produit sélectionné:', selectedProduit);
```

## 🐛 **Points de débogage :**

### **Console logs à vérifier :**
- `🔍 SmartPicker Debug:` - Vérifier les paramètres du bouton
- `🔄 Retour depuis SmartPicker détecté:` - Vérifier le contexte
- `🚀 Ouverture du modal de création depuis SmartPicker` - Vérifier l'ouverture
- `💾 Produit formaté pour retour:` - Vérifier le format
- `✅ Produit sélectionné automatiquement:` - Vérifier la sélection

### **Vérifications manuelles :**
1. **Données** : Les produits existent-ils dans le localStorage ?
2. **Recherche** : La fonction `searchProduits` retourne-t-elle des résultats ?
3. **Bouton** : Le bouton "+ Créer" s'affiche-t-il ?
4. **Navigation** : La redirection vers `/achats?tab=produits&create=true` fonctionne-t-elle ?
5. **Modal** : Le modal de création s'ouvre-t-il ?
6. **Retour** : Le retour vers la facture fonctionne-t-il ?
7. **Sélection** : Le produit est-il automatiquement sélectionné ?

## 📝 **Actions de débogage :**

### **Si les données n'existent pas :**
```javascript
// Créer des données de test
const produitsTest = [
  {
    id: 1,
    code: 'CARB-001',
    designation: 'Carburant Diesel',
    categorie: 'Carburant',
    unite: 'L',
    prixUnitaire: 1.85,
    actif: true
  }
];
localStorage.setItem('gestalis_produits_services', JSON.stringify(produitsTest));
```

### **Si le bouton ne s'affiche pas :**
- Vérifier que `createUrl` est défini
- Vérifier que la requête fait au moins 2 caractères
- Vérifier que `results.length === 0`
- Vérifier que `!loading`

### **Si le retour ne fonctionne pas :**
- Vérifier le contexte dans `sessionStorage`
- Vérifier que `returnField === 'produit'`
- Vérifier que `returnTo.includes('nouvelle-facture')`
- Vérifier que le produit est sauvegardé dans `localStorage`
