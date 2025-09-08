# Test SmartPicker pour Produits/Services dans Factures - VERSION CORRIGÉE

## 🎯 **Objectif :**
Tester l'implémentation du SmartPicker pour les Produits/Services dans le module Factures d'achat avec les corrections apportées.

## 🔧 **Corrections apportées :**
- ✅ **Format de données** : Le SmartPicker stocke maintenant le format complet `{ id, label, data }`
- ✅ **Logique de retour** : Le produit créé est automatiquement sélectionné dans la ligne
- ✅ **Affichage** : Le SmartPicker affiche correctement la valeur sélectionnée
- ✅ **Recherche** : Utilise les vraies données du store `gestalis_produits_services`

## 📋 **Scénarios de test :**

### **1. Test de recherche de produits existants**
- [ ] Aller sur `/achats/nouvelle-facture`
- [ ] Cliquer sur le champ "Produit/Service" dans une ligne de facture
- [ ] Taper "carburant" ou "diesel"
- [ ] Vérifier que les produits existants s'affichent
- [ ] Vérifier que les prix et unités sont corrects
- [ ] Sélectionner un produit
- [ ] Vérifier que le produit est bien sélectionné
- [ ] Vérifier que la valeur sélectionnée s'affiche correctement

### **2. Test de création de nouveau produit**
- [ ] Aller sur `/achats/nouvelle-facture`
- [ ] Cliquer sur le champ "Produit/Service"
- [ ] Taper un nom de produit qui n'existe pas (ex: "Nouveau produit test")
- [ ] Vérifier que le message "Aucun résultat trouvé" s'affiche
- [ ] Vérifier que le bouton "+ Créer un produit" est visible
- [ ] Cliquer sur "+ Créer un produit"
- [ ] Vérifier que le modal de création de produit s'ouvre
- [ ] Remplir le formulaire de création :
  - Code : "TEST-001"
  - Nom : "Nouveau produit test"
  - Catégorie : "Divers"
  - Unité : "U"
  - Prix unitaire : 25.00
- [ ] Cliquer sur "Créer le produit"
- [ ] Vérifier que le produit est créé
- [ ] Vérifier que l'utilisateur est redirigé vers la facture
- [ ] Vérifier que le produit est automatiquement sélectionné dans la ligne
- [ ] Vérifier que les champs sont pré-remplis (désignation, catégorie, prix)
- [ ] Vérifier que la valeur sélectionnée s'affiche correctement

### **3. Test de retour automatique**
- [ ] Aller sur `/achats/nouvelle-facture`
- [ ] Sélectionner un fournisseur et un chantier
- [ ] Cliquer sur le champ "Produit/Service"
- [ ] Créer un nouveau produit
- [ ] Vérifier que l'utilisateur revient à l'étape 2 (pas l'étape 1)
- [ ] Vérifier que le fournisseur et le chantier sont toujours sélectionnés
- [ ] Vérifier que le produit créé est sélectionné
- [ ] Vérifier que la valeur sélectionnée s'affiche correctement

### **4. Test de données réelles**
- [ ] Vérifier que les produits affichés sont ceux du store local
- [ ] Vérifier que les prix sont corrects
- [ ] Vérifier que les catégories sont correctes
- [ ] Vérifier que les unités sont correctes

## ✅ **Critères de succès :**
- [ ] La recherche fonctionne avec les vraies données
- [ ] Le bouton "+ Créer" apparaît quand aucun résultat
- [ ] La création de produit fonctionne
- [ ] Le retour automatique fonctionne
- [ ] Les données sont préservées lors du retour
- [ ] Le produit créé est automatiquement sélectionné
- [ ] La valeur sélectionnée s'affiche correctement
- [ ] Le format de données est cohérent

## 🐛 **Problèmes potentiels :**
- [ ] Le produit n'apparaît pas dans la recherche
- [ ] Le bouton "+ Créer" n'apparaît pas
- [ ] La création ne fonctionne pas
- [ ] Le retour ne fonctionne pas
- [ ] Les données sont perdues lors du retour
- [ ] Le produit n'est pas sélectionné automatiquement
- [ ] La valeur sélectionnée ne s'affiche pas
- [ ] Erreur de format de données

## 📝 **Notes :**
- Tester avec différents types de produits
- Vérifier que les prix sont correctement formatés
- Vérifier que les catégories sont correctes
- Vérifier que les unités sont correctes
- Vérifier que le format de données est cohérent entre recherche et sélection
