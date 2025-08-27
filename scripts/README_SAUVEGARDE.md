# 📚 GUIDE DE SAUVEGARDE GESTALIS ERP

## 🎯 **OBJECTIF**
Ce guide explique comment utiliser les scripts de sauvegarde pour protéger votre projet GESTALIS ERP.

## 📁 **STRUCTURE DES SCRIPTS**

### 1. **`backup-gestalis-rapide.ps1`** - Sauvegarde quotidienne
- **Usage** : Sauvegarde Git rapide (30 secondes)
- **Quand** : Chaque jour, avant de commencer le travail
- **Ce qu'il fait** : Commit + Push vers GitHub
- **Ce qu'il NE fait PAS** : Pas de ZIP, pas de DB

### 2. **`backup-gestalis-complet.ps1`** - Sauvegarde complète
- **Usage** : Sauvegarde complète hebdomadaire
- **Quand** : Chaque semaine, avant les grosses modifications
- **Ce qu'il fait** : Git + ZIP + .env + DB + Rapport
- **Durée** : 2-5 minutes selon la taille du projet

## 🚀 **UTILISATION RAPIDE**

### **Sauvegarde quotidienne (Git uniquement)**
```powershell
# Dans PowerShell, depuis le dossier racine GESTALIS
.\scripts\backup-gestalis-rapide.ps1
```

### **Sauvegarde complète (tout)**
```powershell
# Dans PowerShell, depuis le dossier racine GESTALIS
.\scripts\backup-gestalis-complet.ps1
```

### **Sauvegarde complète avec options**
```powershell
# Ignorer la sauvegarde Git
.\scripts\backup-gestalis-complet.ps1 -SkipGit

# Ignorer la création du ZIP
.\scripts\backup-gestalis-complet.ps1 -SkipZip

# Ignorer la sauvegarde de la base
.\scripts\backup-gestalis-complet.ps1 -SkipDB

# Changer le dossier de destination
.\scripts\backup-gestalis-complet.ps1 -BackupPath "E:\MesBackups\GESTALIS"
```

## 📊 **CE QUI EST SAUVEGARDÉ**

### **Sauvegarde Git (quotidienne)**
✅ Code source versionné
✅ Historique des modifications
✅ Synchronisation avec GitHub
✅ Collaboration en équipe

### **Sauvegarde complète (hebdomadaire)**
✅ Code source (ZIP)
✅ Fichiers de configuration (.env)
✅ Base de données (si Docker disponible)
✅ Rapport détaillé
✅ Nettoyage automatique (garde 5 sauvegardes)

## 🔒 **SÉCURITÉ**

### **Fichiers PROTÉGÉS (jamais sur GitHub)**
- `.env` (variables d'environnement)
- `node_modules/` (dépendances)
- Fichiers de base de données
- Logs et caches

### **Fichiers VERSIONNÉS (sur GitHub)**
- Code source
- Configuration des composants
- Documentation
- Scripts de sauvegarde

## 📅 **PLAN DE SAUVEGARDE RECOMMANDÉ**

### **Quotidien (avant de commencer)**
```powershell
.\scripts\backup-gestalis-rapide.ps1
```

### **Hebdomadaire (vendredi soir)**
```powershell
.\scripts\backup-gestalis-complet.ps1
```

### **Avant les grosses modifications**
```powershell
.\scripts\backup-gestalis-complet.ps1
```

## 🔄 **RESTAURATION**

### **Depuis une sauvegarde Git**
```bash
git clone https://github.com/GESTALIS/GESTALIS.git
cd GESTALIS
npm install
```

### **Depuis une sauvegarde ZIP**
1. Décompresser l'archive
2. Recréer les fichiers `.env` depuis `env_backup/`
3. Réinstaller les dépendances : `npm install`
4. Importer la base si nécessaire

## ⚠️ **POINTS D'ATTENTION**

### **Avant la première utilisation**
- Vérifier que Git est configuré
- Vérifier que PowerShell peut exécuter des scripts
- Tester sur un projet de test

### **En cas d'erreur**
- Vérifier les logs PowerShell
- Vérifier l'espace disque disponible
- Vérifier les permissions d'écriture

### **Maintenance**
- Nettoyer les anciennes sauvegardes (automatique)
- Vérifier l'espace disque régulièrement
- Tester la restauration sur une machine de test

## 🛠️ **DÉPANNAGE**

### **Erreur "Execution Policy"**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Erreur "Git not found"**
- Vérifier que Git est installé
- Vérifier que Git est dans le PATH

### **Erreur "Permission denied"**
- Exécuter PowerShell en tant qu'administrateur
- Vérifier les permissions sur le dossier de destination

## 📞 **SUPPORT**

En cas de problème :
1. Vérifier les messages d'erreur
2. Consulter le rapport de sauvegarde
3. Vérifier l'espace disque
4. Tester sur un projet simple

---

**💡 CONSEIL :** Testez toujours la restauration sur une machine de test avant de faire confiance à vos sauvegardes !

