import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // État global
      isOnline: navigator.onLine,
      lastSync: null,
      syncStatus: 'idle', // 'idle' | 'syncing' | 'success' | 'error'
      error: null,
      notifications: [],
      
      // Actions
      setOnlineStatus: (status) => set({ isOnline: status }),
      setSyncStatus: (status) => set({ syncStatus: status }),
      updateLastSync: () => set({ lastSync: new Date().toISOString() }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Gestion des notifications
      addNotification: (notification) => {
        const { notifications } = get();
        const newNotification = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...notification
        };
        set({ notifications: [newNotification, ...notifications] });
      },
      
      removeNotification: (id) => {
        const { notifications } = get();
        set({ notifications: notifications.filter(n => n.id !== id) });
      },
      
      clearNotifications: () => set({ notifications: [] }),
      
      // Synchronisation intelligente
      syncWithSupabase: async () => {
        const { setSyncStatus, updateLastSync, setError } = get();
        
        try {
          setSyncStatus('syncing');
          
          // Logique de synchronisation avec Supabase
          // ... (à implémenter selon votre API)
          
          setSyncStatus('success');
          updateLastSync();
        } catch (error) {
          console.error('❌ Erreur synchronisation:', error);
          setSyncStatus('error');
          setError(error.message);
        }
      },
      
      // Gestion de la connexion réseau
      handleOnlineStatusChange: () => {
        const isOnline = navigator.onLine;
        set({ isOnline });
        
        if (isOnline) {
          // Tentative de synchronisation automatique
          get().syncWithSupabase();
        }
      }
    }),
    {
      name: 'gestalis-app-store',
      partialize: (state) => ({
        // Ne persister que certains champs
        lastSync: state.lastSync,
        syncStatus: state.syncStatus,
        notifications: state.notifications
      })
    }
  )
);
