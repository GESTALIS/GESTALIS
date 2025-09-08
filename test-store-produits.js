// Script de test pour vérifier les données du store produits
console.log('🔍 Test du store produits...');

// Vérifier le store Zustand
const storeData = localStorage.getItem('gestalis-produits-store');
console.log('📦 Données du store Zustand:', storeData);

if (storeData) {
  try {
    const parsed = JSON.parse(storeData);
    const produits = parsed.state?.produits || [];
    console.log('✅ Produits du store:', produits);
    console.log('📊 Nombre de produits:', produits.length);
    
    // Afficher les produits
    produits.forEach(produit => {
      console.log(`- ${produit.code} — ${produit.nom} (${produit.categorie}) - ${produit.statut}`);
    });
    
    // Tester la recherche
    const query = 'test';
    const filtered = produits.filter(p => 
      p.statut === 'ACTIF' && (
        p.nom?.toLowerCase().includes(query.toLowerCase()) ||
        p.code?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    console.log(`🔍 Résultats de recherche pour "${query}":`, filtered);
    
  } catch (error) {
    console.error('❌ Erreur parsing store:', error);
  }
} else {
  console.log('❌ Aucune donnée trouvée dans le store Zustand');
  
  // Vérifier l'ancien store
  const oldStoreData = localStorage.getItem('gestalis_produits_services');
  if (oldStoreData) {
    console.log('📦 Données de l\'ancien store trouvées:', oldStoreData);
  } else {
    console.log('❌ Aucune donnée trouvée dans l\'ancien store non plus');
  }
}

// Fonction pour créer des données de test dans le bon format
function creerProduitsTest() {
  const produitsTest = [
    {
      id: Date.now() + 1,
      code: 'TEST-001',
      nom: 'Produit Test 1',
      description: 'Description du produit test 1',
      categorie: 'Matériaux TP',
      unite: 'U',
      statut: 'ACTIF',
      dateCreation: new Date().toISOString()
    },
    {
      id: Date.now() + 2,
      code: 'TEST-002',
      nom: 'Produit Test 2',
      description: 'Description du produit test 2',
      categorie: 'Équipements TP',
      unite: 'U',
      statut: 'ACTIF',
      dateCreation: new Date().toISOString()
    }
  ];
  
  // Créer le store Zustand
  const storeData = {
    state: {
      produits: produitsTest,
      lastUpdate: new Date().toISOString()
    },
    version: 0
  };
  
  localStorage.setItem('gestalis-produits-store', JSON.stringify(storeData));
  console.log('✅ Produits de test créés dans le store Zustand');
}

// Exposer la fonction globalement
window.creerProduitsTest = creerProduitsTest;
