import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Commandes = () => {
  const navigate = useNavigate();

  const handleNouveauBonCommande = () => {
    console.log('🚀 Navigation vers création bon de commande...');
    try {
      navigate('/achats/creation-bon-commande');
    } catch (error) {
      console.error('❌ Erreur de navigation:', error);
      // Fallback vers window.location si la navigation React échoue
      window.location.href = '/achats/creation-bon-commande';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bons de commande</h1>
          <p className="text-gray-600 mt-2">Gestion des commandes fournisseurs</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            Filtres
          </button>
          <button 
            onClick={() => navigate('/achats/test-navigation')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
          >
            Test Navigation
          </button>
          <button 
            onClick={handleNouveauBonCommande}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau Bon de Commande
          </button>
        </div>
      </div>

      {/* Contenu de test */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test du composant Commandes</h2>
        <p className="text-gray-600">Si vous voyez ce message, le composant fonctionne correctement !</p>
        <p className="text-gray-600 mt-2">Le bouton "Nouveau Bon de Commande" devrait être visible ci-dessus.</p>
        <p className="text-gray-600 mt-2">Cliquez sur le bouton pour tester la navigation.</p>
      </div>
    </div>
  );
};

export default Commandes; 