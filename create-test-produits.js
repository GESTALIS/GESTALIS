// Script pour créer des données de test de produits
console.log('🔧 Création des données de test de produits...');

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
  },
  {
    id: 3,
    code: 'TRANS-001',
    designation: 'Transport de matériaux',
    categorie: 'Transport',
    unite: 'Km',
    prixUnitaire: 0.85,
    description: 'Transport de matériaux par camion',
    actif: true,
    dateCreation: new Date().toISOString()
  },
  {
    id: 4,
    code: 'MAT-001',
    designation: 'Ciment Portland',
    categorie: 'Matériel',
    unite: 'T',
    prixUnitaire: 120.00,
    description: 'Ciment Portland 32.5 pour construction',
    actif: true,
    dateCreation: new Date().toISOString()
  },
  {
    id: 5,
    code: 'SERV-001',
    designation: 'Location d\'engins',
    categorie: 'Services',
    unite: 'Jour',
    prixUnitaire: 350.00,
    description: 'Location d\'engins de chantier',
    actif: true,
    dateCreation: new Date().toISOString()
  }
];

// Sauvegarder dans le localStorage
localStorage.setItem('gestalis_produits_services', JSON.stringify(produitsTest));

console.log('✅ Données de test créées :', produitsTest.length, 'produits');
console.log('📦 Données sauvegardées dans localStorage');

// Tester la recherche
const query = 'carburant';
const filtered = produitsTest.filter(p => 
  p.actif && (
    p.designation?.toLowerCase().includes(query.toLowerCase()) ||
    p.code?.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase())
  )
);

console.log('🔍 Test de recherche pour "carburant":', filtered);
console.log('📋 Résultats trouvés:', filtered.length);
