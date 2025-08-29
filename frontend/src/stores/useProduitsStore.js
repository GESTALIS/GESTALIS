import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProduitsStore = create(
  persist(
    (set, get) => ({
      // État
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
          statut: 'ACTIF'
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
        set({ 
          produits: produits.filter(p => p.id !== id),
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
      
      // Synchronisation avec Supabase (optionnel)
      syncFromSupabase: async () => {
        const { setLoading, setError, setProduits } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Appel API Supabase (à implémenter selon votre API)
          const response = await fetch('/api/produits');
          if (response.ok) {
            const data = await response.json();
            setProduits(data);
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
      name: 'gestalis-produits-store',
      partialize: (state) => ({
        produits: state.produits,
        lastUpdate: state.lastUpdate
      })
    }
  )
);
