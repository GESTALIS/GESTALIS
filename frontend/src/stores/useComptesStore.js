import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useComptesStore = create(
  persist(
    (set, get) => ({
      // État
      comptes: [],
      journaux: [],
      loading: false,
      error: null,
      lastUpdate: null,
      
      // Actions
      setComptes: (comptes) => set({ comptes, lastUpdate: new Date().toISOString() }),
      setJournaux: (journaux) => set({ journaux, lastUpdate: new Date().toISOString() }),
      
      addCompte: (compte) => {
        const { comptes } = get();
        const newCompte = {
          ...compte,
          id: Date.now(),
          dateCreation: new Date().toISOString()
        };
        
        set({ 
          comptes: [newCompte, ...comptes],
          lastUpdate: new Date().toISOString()
        });
        return newCompte;
      },
      
      updateCompte: (id, updates) => {
        const { comptes } = get();
        const updated = comptes.map(c => 
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        );
        
        set({ 
          comptes: updated,
          lastUpdate: new Date().toISOString()
        });
      },
      
      deleteCompte: (id) => {
        const { comptes } = get();
        set({ 
          comptes: comptes.filter(c => c.id !== id),
          lastUpdate: new Date().toISOString()
        });
      },
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Getters
      getCompteById: (id) => {
        const { comptes } = get();
        return comptes.find(c => c.id === id);
      },
      
      getCompteByNumero: (numero) => {
        const { comptes } = get();
        return comptes.find(c => c.numero === numero);
      },
      
      getComptesByType: (type) => {
        const { comptes } = get();
        return comptes.filter(c => c.type === type);
      },
      
      // Synchronisation avec Supabase (optionnel)
      syncFromSupabase: async () => {
        const { setLoading, setError, setComptes } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Appel API Supabase (à implémenter selon votre API)
          const response = await fetch('/api/comptes');
          if (response.ok) {
            const data = await response.json();
            setComptes(data);
          }
        } catch (error) {
          console.error('❌ Erreur sync Supabase:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'gestalis-comptes-store',
      partialize: (state) => ({
        comptes: state.comptes,
        journaux: state.journaux,
        lastUpdate: state.lastUpdate
      })
    }
  )
);
