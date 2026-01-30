
import React from 'react';
import { Search, MapPin, Filter, ArrowRight } from 'lucide-react';
import { CooperativeProperties } from '../types';

interface SidebarProps {
  communes: string[];
  selectedCommune: string;
  onCommuneChange: (val: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  cooperatives: any[];
  onCooperativeSelect: (id: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  communes, 
  selectedCommune, 
  onCommuneChange, 
  searchQuery, 
  onSearchChange, 
  cooperatives,
  onCooperativeSelect
}) => {
  return (
    <aside className="w-80 h-full bg-white shadow-xl flex flex-col z-[1500] border-r border-gray-200">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-600 uppercase mb-4 flex items-center gap-2">
          <Filter size={16} className="text-green-600" />
          Filtres de recherche
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Commune</label>
            <div className="relative">
              <select 
                value={selectedCommune}
                onChange={(e) => onCommuneChange(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none cursor-pointer"
              >
                <option value="All">Toutes les communes</option>
                {communes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <MapPin size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Nom de la coopérative</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Chercher une coopérative..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Résultats ({cooperatives.length})</span>
        </div>
        
        <div className="space-y-2">
          {cooperatives.map((coop, idx) => {
            const props = coop.properties as CooperativeProperties;
            const name = props.NomCoop || props.nom || props.NAME || props.Name || "Coopérative Sans Nom";
            const commune = props.Commune || props.commune || "N/A";
            
            return (
              <button 
                key={idx}
                onClick={() => onCooperativeSelect(idx.toString())}
                className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all group shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                      {name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={12} /> {commune}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
                </div>
              </button>
            );
          })}
          {cooperatives.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">Aucune coopérative trouvée</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-gray-50 text-[10px] text-gray-400 text-center border-t border-gray-200">
        &copy; {new Date().getFullYear()} SIGaid - Association Initiative & Développement
      </div>
    </aside>
  );
};

export default Sidebar;
