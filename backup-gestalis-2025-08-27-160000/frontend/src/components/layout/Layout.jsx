import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar visible par défaut

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Sidebar toujours fixe, avec possibilité de la fermer/ouvrir */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Contenu principal qui s'adapte à la largeur de la sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 