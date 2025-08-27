import React from 'react';
import { Building2, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-600 rounded-2xl">
            <Building2 className="h-16 w-16 text-white" />
          </div>
          <div className="p-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl">
            <Sparkles className="h-16 w-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-teal-600 bg-clip-text text-transparent">
          GESTALIS
        </h1>
        
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          ERP BTP - Gestion complète de vos chantiers, achats et fournisseurs
        </p>
        
        <div className="text-lg text-gray-500">
          Utilisez le menu latéral pour accéder à vos modules
        </div>
      </div>
    </div>
  );
};

export default Home;
