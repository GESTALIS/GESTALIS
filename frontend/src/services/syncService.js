import { useFournisseursStore } from '../stores/useFournisseursStore';
import { useComptesStore } from '../stores/useComptesStore';
import { useProduitsStore } from '../stores/useProduitsStore';
import { useAppStore } from '../stores/useAppStore';

class SyncService {
  constructor() {
    this.syncQueue = [];
    this.isSyncing = false;
    this.syncInterval = null;
    this.retryAttempts = 0;
    this.maxRetries = 3;
  }
  
  // Démarrer la synchronisation automatique
  startAutoSync(intervalMs = 30000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      this.syncAllStores();
    }, intervalMs);
    
    console.log('🔄 Synchronisation automatique démarrée:', intervalMs + 'ms');
  }
  
  // Arrêter la synchronisation automatique
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏹️ Synchronisation automatique arrêtée');
    }
  }
  
  // Synchroniser tous les stores
  async syncAllStores() {
    if (this.isSyncing) {
      console.log('⏳ Synchronisation déjà en cours...');
      return;
    }
    
    try {
      this.isSyncing = true;
      console.log('🚀 Début de la synchronisation complète...');
      
      // Synchroniser chaque store
      await Promise.all([
        this.syncFournisseurs(),
        this.syncComptes(),
        this.syncProduits()
      ]);
      
      console.log('✅ Synchronisation complète terminée');
      this.retryAttempts = 0;
      
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation complète:', error);
      this.handleSyncError(error);
    } finally {
      this.isSyncing = false;
    }
  }
  
  // Synchroniser les fournisseurs
  async syncFournisseurs() {
    try {
      const fournisseursStore = useFournisseursStore.getState();
      const response = await fetch('/api/fournisseurs');
      
      if (response.ok) {
        const data = await response.json();
        fournisseursStore.setFournisseurs(data);
        console.log('✅ Fournisseurs synchronisés:', data.length);
      }
    } catch (error) {
      console.error('❌ Erreur sync fournisseurs:', error);
      throw error;
    }
  }
  
  // Synchroniser les comptes
  async syncComptes() {
    try {
      const comptesStore = useComptesStore.getState();
      const response = await fetch('/api/comptes');
      
      if (response.ok) {
        const data = await response.json();
        comptesStore.setComptes(data);
        console.log('✅ Comptes synchronisés:', data.length);
      }
    } catch (error) {
      console.error('❌ Erreur sync comptes:', error);
      throw error;
    }
  }
  
  // Synchroniser les produits
  async syncProduits() {
    try {
      const produitsStore = useProduitsStore.getState();
      const response = await fetch('/api/produits');
      
      if (response.ok) {
        const data = await response.json();
        produitsStore.setProduits(data);
        console.log('✅ Produits synchronisés:', data.length);
      }
    } catch (error) {
      console.error('❌ Erreur sync produits:', error);
      throw error;
    }
  }
  
  // Gérer les erreurs de synchronisation
  handleSyncError(error) {
    this.retryAttempts++;
    
    if (this.retryAttempts <= this.maxRetries) {
      console.log(`🔄 Tentative de reconnexion ${this.retryAttempts}/${this.maxRetries} dans 5s...`);
      
      setTimeout(() => {
        this.syncAllStores();
      }, 5000);
    } else {
      console.error('❌ Nombre maximum de tentatives atteint');
      // Notifier l'utilisateur
      this.notifySyncError(error);
    }
  }
  
  // Notifier les erreurs de synchronisation
  notifySyncError(error) {
    // Utiliser le store global pour notifier
    const appStore = useAppStore.getState();
    appStore.addNotification({
      type: 'error',
      title: 'Erreur de synchronisation',
      message: 'Impossible de synchroniser avec le serveur. Les données sont sauvegardées en local.',
      duration: 10000
    });
  }
  
  // Vérifier la connectivité
  async checkConnectivity() {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        timeout: 5000 
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  // Forcer une synchronisation manuelle
  async forceSync() {
    console.log('🔄 Synchronisation forcée...');
    await this.syncAllStores();
  }
}

// Instance singleton
export const syncService = new SyncService();

// Hook personnalisé pour utiliser le service
export const useSyncService = () => {
  return {
    startAutoSync: syncService.startAutoSync.bind(syncService),
    stopAutoSync: syncService.stopAutoSync.bind(syncService),
    forceSync: syncService.forceSync.bind(syncService),
    checkConnectivity: syncService.checkConnectivity.bind(syncService),
    isSyncing: syncService.isSyncing
  };
};
