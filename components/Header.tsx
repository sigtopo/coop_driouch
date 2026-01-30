
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-gray-100 z-[2000] shrink-0">
      <div className="flex items-center gap-4">
        <div className="p-1.5 bg-green-50 rounded-lg">
          <img 
            src="https://aid-maroc.com/wp-content/uploads/2021/04/Logo-222.png" 
            alt="AID Maroc" 
            className="h-8 md:h-9"
          />
        </div>
        <div className="border-l border-gray-200 pl-4">
          <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">SIGaid <span className="text-green-600">Driouch</span></h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest -mt-1">Observatoire des Coopératives</p>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-[9px] font-black text-white bg-green-600 px-2 py-1 rounded">PROVINCE</span>
        <span className="text-[10px] font-bold text-gray-500">Driouch, Maroc</span>
      </div>
    </header>
  );
};

export default Header;
