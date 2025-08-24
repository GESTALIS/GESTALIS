# 🎨 Système de Design GESTALIS - Version Professionnelle

## 🚀 **Vue d'ensemble**

Ce système de design remplace l'ancien système de couleurs multiples par **5 familles de dégradés cohérentes** ancrées sur l'identité visuelle GESTALIS.

## 🎯 **Les 5 Familles de Dégradés**

### **1. Brand (Identité principale)**
- **Couleur** : `from-[#004b5d] to-[#0b899b]`
- **Usage** : Dashboard, RH
- **Style** : Bleu/teal professionnel

### **2. Ops (Opérations/Terrain)**
- **Couleur** : `from-[#0b6aa1] to-[#14b3c6]`
- **Usage** : Chantiers, Logistique, Achats
- **Style** : Bleu opérationnel

### **3. Sales (Vente/Commercial)**
- **Couleur** : `from-[#f89032] to-[#ba8a36]`
- **Usage** : Vente, Gestion Commerciale, Tiers
- **Style** : Orange/chaud commercial

### **4. Finance (Financier)**
- **Couleur** : `from-[#003a4a] to-[#2a6db0]`
- **Usage** : Trésorerie, Analyse
- **Style** : Bleu foncé financier

### **5. Admin (Système)**
- **Couleur** : `from-[#334155] to-[#4f46e5]`
- **Usage** : IA, Administration
- **Style** : Slate/violet système

## 🧩 **Composants**

### **ModuleHeader**
Composant unifié pour tous les en-têtes de modules.

```tsx
import ModuleHeader from '../components/layout/ModuleHeader';

<ModuleHeader
  moduleKey="achats"
  title="Module Achats"
  description="Gestion des fournisseurs, commandes et factures"
  icon={<ShoppingCart className="h-5 w-5" />}
  actions={
    <div className="flex gap-2">
      <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white">
        Action
      </button>
    </div>
  }
/>
```

### **Sidebar**
La sidebar utilise automatiquement les bonnes couleurs selon le module.

## 📁 **Structure des Fichiers**

```
src/
├── theme/
│   ├── gradients.ts          # Définition des couleurs
│   └── README.md            # Ce fichier
├── components/layout/
│   ├── ModuleHeader.tsx     # Composant header unifié
│   └── Sidebar.jsx          # Sidebar avec nouvelles couleurs
└── examples/
    └── ModuleHeaderUsage.jsx # Exemples d'utilisation
```

## 🎨 **Utilisation**

### **1. Dans une page de module**
```tsx
import ModuleHeader from '../components/layout/ModuleHeader';

export default function ChantiersPage() {
  return (
    <>
      <ModuleHeader
        moduleKey="chantiers"
        title="Module Chantiers"
        description="Gestion des chantiers et suivi des travaux"
        icon={<Building2 className="h-5 w-5" />}
      />
      {/* Contenu de la page */}
    </>
  );
}
```

### **2. Ajout d'actions**
```tsx
<ModuleHeader
  moduleKey="achats"
  title="Module Achats"
  description="Gestion des fournisseurs"
  icon={<ShoppingCart className="h-5 w-5" />}
  actions={
    <div className="flex gap-2">
      <button className="px-3 py-2 bg-white/15 border border-white/20 rounded-lg text-white hover:bg-white/25">
        Nouveau fournisseur
      </button>
    </div>
  }
/>
```

## 🔧 **Personnalisation**

### **Ajouter une nouvelle couleur**
```ts
// Dans src/theme/gradients.ts
export const gradients = {
  // ... couleurs existantes
  custom: "bg-gradient-to-r from-[#FF0000] to-[#00FF00]",
} as const;

export const moduleGradient: Record<string, GradientKey> = {
  // ... mappings existants
  nouveauModule: "custom",
};
```

### **Modifier une couleur existante**
```ts
// Dans src/theme/gradients.ts
export const gradients = {
  brand: "bg-gradient-to-r from-[#NouvelleCouleur] to-[#AutreCouleur]",
  // ... autres couleurs
} as const;
```

## ✅ **Avantages du Nouveau Système**

1. **Cohérence visuelle** : 5 familles au lieu de 12 couleurs
2. **Maintenance facile** : Centralisé dans un seul fichier
3. **Professionnel** : Couleurs ancrées sur l'identité GESTALIS
4. **Accessible** : Contraste AA respecté
5. **Évolutif** : Facile d'ajouter de nouveaux modules

## 🚫 **Règles d'Usage**

1. **Ne jamais mélanger 2 dégradés** dans le même écran
2. **Utiliser uniquement** les couleurs définies dans `gradients.ts`
3. **Toujours passer** par le composant `ModuleHeader`
4. **Respecter** le mapping `moduleGradient`

## 🔍 **Dépannage**

### **Problème** : Couleur ne s'affiche pas
**Solution** : Vérifier que le `moduleKey` existe dans `moduleGradient`

### **Problème** : Header ne s'affiche pas
**Solution** : Vérifier l'import de `ModuleHeader`

### **Problème** : Couleurs incohérentes
**Solution** : Vérifier que `gradients.ts` est bien importé

---

**🎉 Votre application GESTALIS a maintenant un design professionnel et cohérent !**

