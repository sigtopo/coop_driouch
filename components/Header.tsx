
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-gradient-to-r from-[#00AA01] to-white shadow-md z-[2000]">
      <div className="flex items-center gap-4">
        <img 
          src="https://aid-maroc.com/wp-content/uploads/2021/04/Logo-222.png" 
          alt="AID Maroc Logo" 
          className="h-12 drop-shadow-sm"
        />
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-800 leading-tight">SIGaid Driouch</h1>
          <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Plateforme des Coopératives</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-gray-700">
          <span className="bg-white/80 px-3 py-1 rounded-full border border-green-100 shadow-sm">Province de Driouch</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
