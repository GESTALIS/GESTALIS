import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../services/supabase';

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
      
      addCompte: async (compte) => {
        const { comptes } = get();
        
        try {
          // Créer le compte dans Supabase
          const { data, error } = await supabase
            .from('plan_comptable')
            .insert([{
              numero: compte.numero,
              intitule: compte.nom,
              classe: compte.classe,
              type: compte.type,
              description: compte.description,
              journal_centralisation: compte.journalCentralisation,
              saisie_autorisee: compte.saisieAutorisee,
              actif: compte.actif
            }])
            .select();
          
          if (error) throw error;
          
          const newCompte = {
            ...compte,
            id: data[0].id,
            dateCreation: new Date().toISOString()
          };
          
          set({ 
            comptes: [newCompte, ...comptes],
            lastUpdate: new Date().toISOString()
          });
          
          return newCompte;
        } catch (error) {
          console.error('❌ Erreur création compte:', error);
          // Fallback sur localStorage en cas d'erreur
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
        }
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
      
      // Charger les comptes depuis Supabase
      loadFromSupabase: async () => {
        const { setLoading, setError, setComptes } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          const { data, error } = await supabase
            .from('plan_comptable')
            .select('*')
            .order('numero');
          
          if (error) throw error;
          
          // Transformer les données Supabase vers le format local
          const comptes = data.map(compte => ({
            id: compte.id,
            numero: compte.numero,
            nom: compte.intitule,
            classe: compte.classe,
            type: compte.type,
            description: compte.description,
            journalCentralisation: compte.journal_centralisation,
            saisieAutorisee: compte.saisie_autorisee,
            actif: compte.actif,
            dateCreation: compte.created_at
          }));
          
          setComptes(comptes);
          
          console.log('✅ Comptes chargés depuis Supabase:', comptes.length);
        } catch (error) {
          console.error('❌ Erreur chargement comptes Supabase:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
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
