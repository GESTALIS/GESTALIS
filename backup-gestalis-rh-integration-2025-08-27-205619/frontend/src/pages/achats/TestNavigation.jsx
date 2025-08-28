import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';

const TestNavigation = () => {
  const navigate = useNavigate();

  const testNavigation = (path) => {
    console.log(`🚀 Test de navigation vers: ${path}`);
    try {
      navigate(path);
    } catch (error) {
      console.error('❌ Erreur de navigation:', error);
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Test de Navigation</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Navigation vers les pages Achats</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => testNavigation('/achats')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Page Achats
                </button>
                <button
                  onClick={() => testNavigation('/achats/commandes')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Page Commandes
                </button>
                <button
                  onClick={() => testNavigation('/achats/creation-bon-commande')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Création Bon de Commande
                </button>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-2">Navigation vers d'autres pages</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => testNavigation('/')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => testNavigation('/chantiers')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Chantiers
                </button>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">Informations de débogage</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <p>• Vérifiez la console du navigateur pour les logs</p>
                <p>• L'URL devrait changer lors de la navigation</p>
                <p>• Si la navigation échoue, un fallback vers window.location sera utilisé</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/achats')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux Achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNavigation;
