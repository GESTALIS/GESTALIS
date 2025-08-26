import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Espace vide à droite pour équilibrer */}
        <div className="flex items-center">
          <div className="w-6 h-6"></div>
        </div>
      </div>
    </header>
  );
};

export default Header; 