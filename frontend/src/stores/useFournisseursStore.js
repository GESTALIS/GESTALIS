import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fournisseursService } from '../services/supabase';

export const useFournisseursStore = create(
  persist(
    (set, get) => ({
      // État
      fournisseurs: [],
      loading: false,
      error: null,
      lastUpdate: null,
      nextFournisseurCode: 'FPRO97-0001',
      
      // Actions
      setFournisseurs: (fournisseurs) => set({ 
        fournisseurs, 
        lastUpdate: new Date().toISOString() 
      }),
      
      addFournisseur: async (fournisseur) => {
        const { fournisseurs, nextFournisseurCode } = get();
        
        try {
          // Créer le fournisseur dans Supabase
          const fournisseurData = {
            ...fournisseur,
            codeFournisseur: nextFournisseurCode,
            statut: 'ACTIF'
          };
          
          const newFournisseur = await fournisseursService.creer(fournisseurData);
          
          // Générer le prochain code
          const currentNumber = parseInt(nextFournisseurCode.split('-')[1]);
          const nextNumber = currentNumber + 1;
          const newCode = `FPRO97-${String(nextNumber).padStart(4, '0')}`;
          
          set({ 
            fournisseurs: [newFournisseur, ...fournisseurs],
            nextFournisseurCode: newCode,
            lastUpdate: new Date().toISOString()
          });
          
          return newFournisseur;
        } catch (error) {
          console.error('❌ Erreur création fournisseur:', error);
          // Fallback sur localStorage en cas d'erreur
          const newFournisseur = {
            ...fournisseur,
            id: Date.now(),
            codeFournisseur: nextFournisseurCode,
            dateCreation: new Date().toISOString(),
            statut: 'ACTIF'
          };
          
          const currentNumber = parseInt(nextFournisseurCode.split('-')[1]);
          const nextNumber = currentNumber + 1;
          const newCode = `FPRO97-${String(nextNumber).padStart(4, '0')}`;
          
          set({ 
            fournisseurs: [newFournisseur, ...fournisseurs],
            nextFournisseurCode: newCode,
            lastUpdate: new Date().toISOString()
          });
          
          return newFournisseur;
        }
      },
      
      updateFournisseur: (id, updates) => {
        const { fournisseurs } = get();
        const updated = fournisseurs.map(f => 
          f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
        );
        
        set({ 
          fournisseurs: updated,
          lastUpdate: new Date().toISOString()
        });
      },
      
      deleteFournisseur: (id) => {
        const { fournisseurs } = get();
        set({ 
          fournisseurs: fournisseurs.filter(f => f.id !== id),
          lastUpdate: new Date().toISOString()
        });
      },
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Getters
      getFournisseurById: (id) => {
        const { fournisseurs } = get();
        return fournisseurs.find(f => f.id === id);
      },
      
      getFournisseursByStatus: (status) => {
        const { fournisseurs } = get();
        return fournisseurs.filter(f => f.statut === status);
      },
      
      // Charger les fournisseurs depuis Supabase
      loadFromSupabase: async () => {
        const { setLoading, setError, setFournisseurs } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          const data = await fournisseursService.lister();
          setFournisseurs(data);
          
          console.log('✅ Fournisseurs chargés depuis Supabase:', data.length);
        } catch (error) {
          console.error('❌ Erreur chargement Supabase:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      },
      
      // Synchronisation avec Supabase (optionnel)
      syncFromSupabase: async () => {
        const { setLoading, setError, setFournisseurs } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Appel API Supabase (à implémenter selon votre API)
          const response = await fetch('/api/fournisseurs');
          if (response.ok) {
            const data = await response.json();
            setFournisseurs(data);
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
      name: 'gestalis-fournisseurs-store',
      partialize: (state) => ({
        fournisseurs: state.fournisseurs,
        nextFournisseurCode: state.nextFournisseurCode,
        lastUpdate: state.lastUpdate
      })
    }
  )
);
