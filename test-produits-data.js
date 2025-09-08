// Script de test pour vérifier les données de produits
console.log('🔍 Test des données de produits...');

// Vérifier le localStorage
const storeData = localStorage.getItem('gestalis_produits_services');
console.log('📦 Données du store:', storeData);

if (storeData) {
  try {
    const produits = JSON.parse(storeData);
    console.log('✅ Produits parsés:', produits);
    console.log('📊 Nombre de produits:', produits.length);
    
    // Tester la recherche
    const query = 'carburant';
    const filtered = produits.filter(p => 
      p.actif && (
        p.designation?.toLowerCase().includes(query.toLowerCase()) ||
        p.code?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    console.log('🔍 Résultats de recherche pour "carburant":', filtered);
    
    // Formater les résultats
    const resultats = filtered.map(produit => ({
      id: produit.id,
      label: `${produit.code} — ${produit.designation} (${produit.unite})${produit.prixUnitaire ? ` - ${produit.prixUnitaire}€` : ''}`,
      data: produit
    }));
    
    console.log('📋 Résultats formatés:', resultats);
    
  } catch (error) {
    console.error('❌ Erreur parsing:', error);
  }
} else {
  console.log('❌ Aucune donnée trouvée dans le store');
  
  // Créer des données de test
  const produitsTest = [
    {
      id: 1,
      code: 'CARB-001',
      designation: 'Carburant Diesel',
      categorie: 'Carburant',
      unite: 'L',
      prixUnitaire: 1.85,
      description: 'Carburant diesel pour engins de chantier',
      actif: true,
      dateCreation: new Date().toISOString()
    },
    {
      id: 2,
      code: 'TELECOM-001',
      designation: 'Abonnement téléphonie mobile',
      categorie: 'Télécom',
      unite: 'Mois',
      prixUnitaire: 45.00,
      description: 'Forfait mobile illimité pour équipe chantier',
      actif: true,
      dateCreation: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('gestalis_produits_services', JSON.stringify(produitsTest));
  console.log('✅ Données de test créées');
}
