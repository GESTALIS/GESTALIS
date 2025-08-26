# 🧾 IMPLÉMENTATION COMPTABILISATION AUTOMATIQUE - GESTALIS

## 🎯 Vue d'ensemble

Cette implémentation ajoute la **comptabilisation automatique des factures fournisseurs** dans GESTALIS, selon les spécifications exactes du user :

- **Comptes fournisseurs personnalisés** au format "F..." (ex: `FTOTAL`, `FBETON`)
- **TVA 0%** (Article 294, 1 du CGI - Guyane)
- **Mapping catégorie → compte** paramétrable
- **Export comptable** au format standard (Date | N° Pièce | N° Compte | Libellé | [Vide] | [Vide] | Débit | Crédit)

---

## 🚀 FONCTIONNALITÉS IMPLÉMENTÉES

### 1. **Champ Compte Fournisseur (Obligatoire)**
- ✅ Ajouté dans `NouveauFournisseur.jsx`
- ✅ Validation format "F..." (ex: `FTOTAL`, `FBETON`, `F00045`)
- ✅ Données de test avec 6 fournisseurs pré-configurés
- ✅ Unicité des comptes vérifiée

### 2. **Page Paramètres Comptables**
- ✅ Route `/parametres-comptables` ajoutée
- ✅ Mapping catégorie → compte configurable
- ✅ Configuration des exports comptables
- ✅ Ordre des colonnes personnalisable
- ✅ Import/Export des configurations

### 3. **Service de Comptabilisation**
- ✅ `comptabiliteService.js` créé
- ✅ Génération automatique des écritures
- ✅ Validation des factures
- ✅ Gestion de la ventilation multi-chantiers
- ✅ Support des avoirs fournisseurs

### 4. **Composant d'Export Comptable**
- ✅ `ExportEcrituresComptables.jsx` créé
- ✅ Aperçu des écritures générées
- ✅ Vérification de l'équilibre comptable
- ✅ Export CSV et Excel
- ✅ Intégré dans le formulaire de facture

### 5. **Bouton Comptabiliser**
- ✅ Ajouté dans `NouvelleFacture.jsx`
- ✅ Ouvre le modal de comptabilisation
- ✅ Validation avant export

---

## 🏗️ ARCHITECTURE TECHNIQUE

### **Services**
```
frontend/src/services/
├── comptabiliteService.js      # Logique de comptabilisation
├── fournisseursService.js      # Gestion des fournisseurs + données test
├── numerotationService.js      # Numérotation automatique (existant)
├── ventilationService.js       # Ventilation multi-chantiers (existant)
└── produitsService.js          # Bibliothèque produits (existant)
```

### **Composants**
```
frontend/src/components/
├── comptabilite/
│   └── ExportEcrituresComptables.jsx  # Modal d'export comptable
├── achats/
│   ├── VentilationMultiChantiers.jsx  # Ventilation (existant)
│   └── SelectionProduit.jsx           # Sélection produits (existant)
└── ui/
    ├── GestalisCard.jsx               # Composants UI (existant)
    └── ParametresDecimales.jsx        # Paramètres décimales (existant)
```

### **Pages**
```
frontend/src/pages/
├── achats/
│   ├── NouvelleFacture.jsx            # Formulaire facture (modifié)
│   ├── fournisseurs/
│   │   └── NouveauFournisseur.jsx     # Formulaire fournisseur (modifié)
│   └── NouvelleFactureWorkflow.jsx    # Workflow 2 étapes (existant)
├── ParametresComptables.jsx           # Nouvelle page
└── ParametresNumerotation.jsx         # Page existante
```

---

## 📊 FORMAT DES ÉCRITURES COMPTABLES

### **Structure Standard**
```
Date | N° Pièce | N° Compte | Libellé | [Vide] | [Vide] | Débit | Crédit
```

### **Exemple Facture Simple (HT 150,00€)**
```
2025-01-15 | AC012025-0001 | 6061 | TotalEnergies - Résidence Les Jardins - Gasoil B7 | | | 150,00 |
2025-01-15 | AC012025-0001 | 44566 | TVA déductible 0% | | | 0,00 |
2025-01-15 | AC012025-0001 | FTOTAL | TotalEnergies | | | | 150,00
```

### **Exemple avec Ventilation Multi-Chantiers (HT 1000,00€)**
```
2025-01-15 | AC012025-0002 | 6061 | TotalEnergies - Chantier A - Gasoil B7 | | | 400,00 |
2025-01-15 | AC012025-0002 | 6061 | TotalEnergies - Chantier B - Gasoil B7 | | | 350,00 |
2025-01-15 | AC012025-0002 | 6061 | TotalEnergies - Chantier C - Gasoil B7 | | | 250,00 |
2025-01-15 | AC012025-0002 | 44566 | TVA déductible 0% | | | 0,00 |
2025-01-15 | AC012025-0002 | FTOTAL | TotalEnergies | | | | 1000,00
```

---

## ⚙️ CONFIGURATION PAR DÉFAUT

### **Mapping Catégorie → Compte**
| Catégorie | Compte Suggéré | Compte Sélectionné |
|------------|----------------|-------------------|
| Carburant | 6061 | 6061 |
| Location | 6062 | 6062 |
| Matériaux | 602 | 602 |
| Sous-traitance | 604 | 604 |
| Transport | 624 | 624 |
| Divers | 6064 | 6064 |

### **Comptes Spéciaux**
- **TVA déductible** : 44566 (montant 0,00€)
- **Préfixe fournisseurs** : F
- **Format libellé** : `[Nom Fournisseur] - [Chantier] - [Nom Article]`

---

## 🔧 UTILISATION

### **1. Configuration Initiale**
1. Aller sur `/parametres-comptables`
2. Vérifier/modifier le mapping catégorie → compte
3. Configurer l'ordre des colonnes d'export
4. Sauvegarder les paramètres

### **2. Création d'un Fournisseur**
1. Aller sur `/achats/fournisseurs/nouveau`
2. Remplir tous les champs obligatoires
3. **IMPORTANT** : Saisir le compte fournisseur au format "F..." (ex: `FTOTAL`)
4. Sauvegarder

### **3. Comptabilisation d'une Facture**
1. Créer une facture avec `/achats/nouvelle-facture`
2. Sélectionner un fournisseur avec compte configuré
3. Ajouter des lignes avec catégories valides
4. Cliquer sur **"Comptabiliser"**
5. Vérifier l'équilibre comptable
6. Exporter en CSV ou Excel

---

## 🧪 DONNÉES DE TEST

### **Fournisseurs Pré-configurés**
- **TotalEnergies** : `FTOTAL` (Carburant)
- **Béton Express** : `FBETON` (Matériaux)
- **Location Pro Guyane** : `FLOC` (Location)
- **Transport Guyane Express** : `FTRANS` (Transport)
- **Sous-traitance BTP Guyane** : `FSOUS` (Sous-traitance)
- **Matériaux Guyane** : `FMAT` (Matériaux)

### **Test de Comptabilisation**
1. Créer une facture avec TotalEnergies
2. Ajouter une ligne "Gasoil B7" (catégorie "Carburant")
3. Cliquer sur "Comptabiliser"
4. Vérifier la génération des 3 écritures
5. Exporter en CSV

---

## ✅ VALIDATIONS IMPLÉMENTÉES

### **Validation des Fournisseurs**
- ✅ Compte fournisseur obligatoire
- ✅ Format "F..." respecté
- ✅ Unicité des comptes

### **Validation des Factures**
- ✅ Fournisseur avec compte valide
- ✅ Toutes les lignes avec catégories configurées
- ✅ Équilibre comptable (Débits = Crédits)

### **Validation des Exports**
- ✅ Colonnes visibles et ordonnées
- ✅ Format CSV avec séparateur ";"
- ✅ Échappement des caractères spéciaux

---

## 🚧 PROCHAINES ÉTAPES (Futur)

### **Intégration Base de Données**
- [ ] Remplacer `localStorage` par Supabase
- [ ] API endpoints pour la comptabilisation
- [ ] Stockage des écritures comptables

### **Fonctionnalités Avancées**
- [ ] Plan comptable complet
- [ ] Validation des comptes existants
- [ ] Gestion des devises
- [ ] Intégration avec logiciels comptables

### **Reporting et Analytics**
- [ ] Tableaux de bord comptables
- [ ] Rapports de ventilation par chantier
- [ ] Analyse des coûts par catégorie
- [ ] Historique des écritures

---

## 🐛 DÉPANNAGE

### **Erreur "Compte fournisseur obligatoire"**
- Vérifier que le fournisseur a un compte au format "F..."
- Aller sur `/parametres-comptables` pour vérifier la configuration

### **Erreur "Catégorie sans compte configuré"**
- Aller sur `/parametres-comptables`
- Ajouter la catégorie manquante
- Associer un compte de charge

### **Équilibre comptable incorrect**
- Vérifier les montants des lignes
- Contrôler la ventilation multi-chantiers
- S'assurer que tous les montants sont en HT

---

## 📝 NOTES TECHNIQUES

### **Performance**
- Génération des écritures en temps réel
- Validation côté client pour la réactivité
- Export CSV optimisé pour les gros volumes

### **Sécurité**
- Validation des données avant comptabilisation
- Vérification de l'unicité des comptes
- Contrôle de l'équilibre comptable

### **Maintenance**
- Configuration centralisée dans `localStorage`
- Service modulaire et extensible
- Logs d'erreur détaillés

---

## 🎉 CONCLUSION

L'implémentation est **100% conforme** aux spécifications du user :

✅ **Comptes "F..."** au lieu de 401  
✅ **TVA 0%** avec mention Article Guyane  
✅ **Mapping catégorie → compte** paramétrable  
✅ **Export standard** Date | N° Pièce | N° Compte | Libellé | [Vide] | [Vide] | Débit | Crédit  
✅ **Libellé automatique** [Fournisseur] - [Chantier] - [Article]  
✅ **Ventilation multi-chantiers** supportée  
✅ **Validation complète** avant export  

**L'application est prête pour les tests !** 🚀
