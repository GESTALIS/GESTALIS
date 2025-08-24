import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import {
  Printer,
  FileText,
  Mail,
  Search,
  Filter,
  SortAsc,
  Plus,
  Copy,
  Trash2,
  CheckCircle,
  Settings,
  Save,
  Eye,
  Edit,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  Play,
  Clipboard,
  RotateCcw,
  RotateCw
} from 'lucide-react';

// Composant Toolbar classique GESTALIS
const Toolbar = () => {
  const handleAction = (action) => {
    console.log(`Action: ${action}`);
    // Actions simplifiées pour le moment
  };

    return (
    <div className="sticky top-0 z-20 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-lg">
      {/* Menu Barre moderne (première ligne) */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-8 h-12">
            {['Fichier', 'Edition', 'Référentiel', 'Imports', 'Exports', 'Outils', 'Historiques', 'Paramètres'].map((menu) => (
              <button 
                key={menu}
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-white/80 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent hover:border-blue-200"
              >
                {menu}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar moderne (deuxième ligne) */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Actions rapides (gauche) */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-green-50 p-2 rounded-xl border border-emerald-200">
                <button
                  onClick={() => handleAction('create')}
                  className="p-2.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Créer"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('validate')}
                  className="p-2.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Valider"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('delete')}
                  className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Supprimer"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="w-px h-8 bg-slate-300"></div>
            </div>

            {/* Documents (centre-gauche) */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-xl border border-blue-200">
                <button
                  onClick={() => handleAction('print')}
                  className="p-2.5 text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Imprimer"
                >
                  <Printer className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('email')}
                  className="p-2.5 text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Email"
                >
                  <Mail className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('pdf')}
                  className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="PDF"
                >
                  <FileText className="h-5 w-5" />
                </button>
              </div>

              <div className="w-px h-8 bg-slate-300"></div>
            </div>

            {/* Recherche (centre) */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-50 to-gray-50 p-2 rounded-xl border border-slate-200">
                <button
                  onClick={() => handleAction('search')}
                  className="p-2.5 text-slate-700 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Recherche"
                >
                  <Search className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('filter')}
                  className="p-2.5 text-slate-700 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Filtres"
                >
                  <Filter className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('sort')}
                  className="p-2.5 text-slate-700 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Tri"
                >
                  <SortAsc className="h-5 w-5" />
                </button>
              </div>

              <div className="w-px h-8 bg-slate-300"></div>
            </div>

            {/* Navigation (centre-droite) */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-violet-50 p-2 rounded-xl border border-purple-200">
                <button
                  onClick={() => handleAction('previous')}
                  className="p-2.5 text-purple-700 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Précédent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('next')}
                  className="p-2.5 text-purple-700 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Suivant"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('start')}
                  className="p-2.5 text-purple-700 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Début"
                >
                  <Play className="h-5 w-5" />
                </button>
              </div>

              <div className="w-px h-8 bg-slate-300"></div>
            </div>

            {/* Édition (droite) */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded-xl border border-amber-200">
                <button
                  onClick={() => handleAction('save')}
                  className="p-2.5 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Sauvegarder"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('copy')}
                  className="p-2.5 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Copier"
                >
                  <Copy className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('paste')}
                  className="p-2.5 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Coller"
                >
                  <Clipboard className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('undo')}
                  className="p-2.5 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Annuler"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction('redo')}
                  className="p-2.5 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  title="Rétablir"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar visible par défaut

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Toolbar intégrée ici */}
        <Toolbar />
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 