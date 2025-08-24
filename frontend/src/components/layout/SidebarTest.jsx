import React from 'react';

/**
 * Composant de test pour vérifier les styles de survol de la sidebar
 */
export default function SidebarTest() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Test Sidebar GESTALIS</h1>
      
      <div className="w-64 bg-white shadow-lg rounded-lg p-4 space-y-2">
        <div className="sidebar-item sidebar-dashboard p-3 rounded-lg cursor-pointer">
          📊 TABLEAU DE BORD
        </div>
        
        <div className="sidebar-item sidebar-achats p-3 rounded-lg cursor-pointer">
          🛒 ACHATS
        </div>
        
        <div className="sidebar-item sidebar-vente p-3 rounded-lg cursor-pointer">
          📄 VENTE
        </div>
        
        <div className="sidebar-item sidebar-tresorerie p-3 rounded-lg cursor-pointer">
          💰 TRÉSORERIE
        </div>
        
        <div className="sidebar-item sidebar-admin p-3 rounded-lg cursor-pointer">
          ⚙️ ADMIN
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Instructions :</strong> Survolez chaque élément de la sidebar ci-dessus.<br/>
          Vous devriez voir des dégradés de couleurs différents pour chaque module.
        </p>
      </div>
    </div>
  );
}
