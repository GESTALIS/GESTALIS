import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProduitsStore = create(
  persist(
    (set, get) => ({
      // Ã‰tat
      produits: [],
      loading: false,
      error: null,
      lastUpdate: null,
      
      // Actions
      setProduits: (produits) => set({ 
        produits, 
        lastUpdate: new Date().toISOString() 
      }),
      
      addProduit: (produit) => {
        const { produits } = get();
        const newProduit = {
          ...produit,
          id: Date.now(),
          dateCreation: new Date().toISOString(),
          statut: 'ACTIF',
          is_deleted: false,
          updated_at: new Date().toISOString()
        };
        
        set({ 
          produits: [newProduit, ...produits],
          lastUpdate: new Date().toISOString()
        });
        return newProduit;
      },
      
      updateProduit: (id, updates) => {
        const { produits } = get();
        const updated = produits.map(p => 
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        );
        
        set({ 
          produits: updated,
          lastUpdate: new Date().toISOString()
        });
      },
      
      deleteProduit: (id) => {
        const { produits } = get();
        // Soft delete : marquer comme supprimÃ© au lieu de supprimer
        const updated = produits.map(p => 
          p.id === id ? { ...p, is_deleted: true, updated_at: new Date().toISOString() } : p
        );
        set({ 
          produits: updated,
          lastUpdate: new Date().toISOString()
        });
      },
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Getters
      getProduitById: (id) => {
        const { produits } = get();
        return produits.find(p => p.id === id);
      },
      
      getProduitsByCategorie: (categorie) => {
        const { produits } = get();
        return produits.filter(p => p.categorie === categorie);
      },
      
      getProduitsByStatus: (status) => {
        const { produits } = get();
        return produits.filter(p => p.statut === status);
      },
      
      // Charger les produits depuis Supabase
      loadFromSupabase: async () => {
        const { setLoading, setError, setProduits } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Pour l'instant, utiliser localStorage en attendant l'implÃ©mentation Supabase
          const produitsLocal = localStorage.getItem('gestalis-produits-store');
          if (produitsLocal) {
            const produits = JSON.parse(produitsLocal);
            // Filtrer les produits non supprimÃ©s (soft delete)
            const produitsActifs = produits.filter(p => !p.is_deleted);
            setProduits(produitsActifs);
          } else {
            setProduits([]);
          }
          
          console.log('âœ… Produits chargÃ©s depuis localStorage (en attendant Supabase)');
        } catch (error) {
          console.error('âŒ Erreur chargement produits:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      },
      
      // Synchronisation avec Supabase (optionnel)
      syncFromSupabase: async () => {
        const { setLoading, setError, setProduits } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Appel API Supabase (Ã  implÃ©menter selon votre API)
          const response = await fetch('/api/produits');
          if (response.ok) {
            const data = await response.json();
            setProduits(data);
          }
        } catch (error) {
          console.error('âŒ Erreur sync Supabase:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'gestalis-produits-store',
      partialize: (state) => ({
        produits: state.produits,
        lastUpdate: state.lastUpdate
      })
    }
  )
);

