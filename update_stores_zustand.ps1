# Script PowerShell pour modifier les stores Zustand pour utiliser Supabase uniquement

# 1. Modifier useFournisseursStore.js
$filePath1 = "frontend/src/stores/useFournisseursStore.js"
$content1 = Get-Content $filePath1 -Raw

# Modifier addFournisseur pour utiliser upsert Supabase
$oldAddFournisseur = @"
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
          
          // Recharger toutes les données depuis Supabase pour s'assurer de la cohérence
          const { loadFromSupabase } = get();
          await loadFromSupabase();
          
          set({ 
            nextFournisseurCode: newCode,
            lastUpdate: new Date().toISOString()
          });
          
          return newFournisseur;
        } catch (error) {
          console.error('❌ Erreur création fournisseur:', error);
          throw error;
        }
      },
"@

$newAddFournisseur = @"
      addFournisseur: async (fournisseur) => {
        const { fournisseurs, nextFournisseurCode } = get();
        
        try {
          // Créer le fournisseur dans Supabase avec upsert
          const fournisseurData = {
            ...fournisseur,
            codeFournisseur: nextFournisseurCode,
            statut: 'ACTIF',
            is_deleted: false,
            updated_at: new Date().toISOString()
          };
          
          const newFournisseur = await fournisseursService.creer(fournisseurData);
          
          // Générer le prochain code
          const currentNumber = parseInt(nextFournisseurCode.split('-')[1]);
          const nextNumber = currentNumber + 1;
          const newCode = `FPRO97-${String(nextNumber).padStart(4, '0')}`;
          
          // Recharger toutes les données depuis Supabase pour s'assurer de la cohérence
          const { loadFromSupabase } = get();
          await loadFromSupabase();
          
          set({ 
            nextFournisseurCode: newCode,
            lastUpdate: new Date().toISOString()
          });
          
          return newFournisseur;
        } catch (error) {
          console.error('❌ Erreur création fournisseur:', error);
          throw error;
        }
      },
"@

# Modifier deleteFournisseur pour utiliser soft delete
$oldDeleteFournisseur = @"
      deleteFournisseur: (id) => {
        const { fournisseurs } = get();
        const updated = fournisseurs.filter(f => f.id !== id);
        set({ 
          fournisseurs: updated,
          lastUpdate: new Date().toISOString()
        });
      },
"@

$newDeleteFournisseur = @"
      deleteFournisseur: async (id) => {
        try {
          // Soft delete dans Supabase
          await fournisseursService.supprimer(id);
          
          // Recharger depuis Supabase pour s'assurer de la cohérence
          const { loadFromSupabase } = get();
          await loadFromSupabase();
          
          set({ 
            lastUpdate: new Date().toISOString()
          });
        } catch (error) {
          console.error('❌ Erreur suppression fournisseur:', error);
          throw error;
        }
      },
"@

# Modifier updateFournisseur pour utiliser Supabase
$oldUpdateFournisseur = @"
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
"@

$newUpdateFournisseur = @"
      updateFournisseur: async (id, updates) => {
        try {
          // Mettre à jour dans Supabase
          await fournisseursService.mettreAJour(id, {
            ...updates,
            updated_at: new Date().toISOString()
          });
          
          // Recharger depuis Supabase pour s'assurer de la cohérence
          const { loadFromSupabase } = get();
          await loadFromSupabase();
          
          set({ 
            lastUpdate: new Date().toISOString()
          });
        } catch (error) {
          console.error('❌ Erreur mise à jour fournisseur:', error);
          throw error;
        }
      },
"@

# Effectuer les remplacements pour useFournisseursStore
$content1 = $content1 -replace [regex]::Escape($oldAddFournisseur), $newAddFournisseur
$content1 = $content1 -replace [regex]::Escape($oldDeleteFournisseur), $newDeleteFournisseur
$content1 = $content1 -replace [regex]::Escape($oldUpdateFournisseur), $newUpdateFournisseur

# Sauvegarder useFournisseursStore
Set-Content $filePath1 $content1 -Encoding UTF8

Write-Host "✅ useFournisseursStore modifié pour utiliser Supabase uniquement" -ForegroundColor Green

# 2. Modifier useProduitsStore.js pour ajouter les méthodes Supabase
$filePath2 = "frontend/src/stores/useProduitsStore.js"
$content2 = Get-Content $filePath2 -Raw

# Ajouter les méthodes Supabase pour les produits
$oldSyncFromSupabase = @"
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
"@

$newSyncFromSupabase = @"
      // Charger les produits depuis Supabase
      loadFromSupabase: async () => {
        const { setLoading, setError, setProduits } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Pour l'instant, utiliser localStorage en attendant l'implémentation Supabase
          const produitsLocal = localStorage.getItem('gestalis-produits-store');
          if (produitsLocal) {
            const produits = JSON.parse(produitsLocal);
            // Filtrer les produits non supprimés (soft delete)
            const produitsActifs = produits.filter(p => !p.is_deleted);
            setProduits(produitsActifs);
          } else {
            setProduits([]);
          }
          
          console.log('✅ Produits chargés depuis localStorage (en attendant Supabase)');
        } catch (error) {
          console.error('❌ Erreur chargement produits:', error);
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
"@

# Modifier addProduit pour ajouter is_deleted = false
$oldAddProduit = @"
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
"@

$newAddProduit = @"
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
"@

# Modifier deleteProduit pour soft delete
$oldDeleteProduit = @"
      deleteProduit: (id) => {
        const { produits } = get();
        set({ 
          produits: produits.filter(p => p.id !== id),
          lastUpdate: new Date().toISOString()
        });
      },
"@

$newDeleteProduit = @"
      deleteProduit: (id) => {
        const { produits } = get();
        // Soft delete : marquer comme supprimé au lieu de supprimer
        const updated = produits.map(p => 
          p.id === id ? { ...p, is_deleted: true, updated_at: new Date().toISOString() } : p
        );
        set({ 
          produits: updated,
          lastUpdate: new Date().toISOString()
        });
      },
"@

# Effectuer les remplacements pour useProduitsStore
$content2 = $content2 -replace [regex]::Escape($oldSyncFromSupabase), $newSyncFromSupabase
$content2 = $content2 -replace [regex]::Escape($oldAddProduit), $newAddProduit
$content2 = $content2 -replace [regex]::Escape($oldDeleteProduit), $newDeleteProduit

# Sauvegarder useProduitsStore
Set-Content $filePath2 $content2 -Encoding UTF8

Write-Host "✅ useProduitsStore modifié pour utiliser soft delete" -ForegroundColor Green
