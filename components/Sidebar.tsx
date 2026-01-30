
import React from 'react';
import { Search, MapPin, Users, Info, Filter, X, ChevronRight } from 'lucide-react';
import { CooperativeProperties } from '../types';

interface SidebarProps {
  communes: string[];
  selectedCommune: string;
  onCommuneChange: (val: string) => void;
  coopSearch: string;
  onCoopSearchChange: (val: string) => void;
  nameSearch: string;
  onNameSearchChange: (val: string) => void;
  cooperatives: any[];
  onCooperativeSelect: (id: string | null) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  communes, 
  selectedCommune, 
  onCommuneChange, 
  coopSearch, 
  onCoopSearchChange, 
  nameSearch, 
  onNameSearchChange,
  cooperatives,
  onCooperativeSelect,
  isOpen,
  onToggle
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1900] md:hidden" onClick={onToggle} />
      )}

      <aside className={`sidebar-container w-full md:w-[360px] h-full bg-white shadow-xl flex flex-col z-[2100] border-l border-gray-100 transition-all duration-300 ${isOpen ? 'sidebar-open' : ''}`}>
        
        {/* Mobile Pull Tab */}
        <div className="md:hidden flex justify-center py-2" onClick={onToggle}>
          <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
        </div>

        {/* Header Search & Select */}
        <div className="p-5 border-b border-gray-50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Filter className="text-green-600" size={18} /> Filtrage
            </h2>
            <button onClick={onToggle} className="md:hidden p-1 text-gray-400">
              <X size={20} />
            </button>
          </div>

          {/* Commune Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Commune Territoriale</label>
            <div className="relative">
              <select 
                value={selectedCommune}
                onChange={(e) => onCommuneChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700"
              >
                <option value="All">Toutes les communes</option>
                {communes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRight className="rotate-90" size={14} />
              </div>
            </div>
          </div>

          {/* Search Fields */}
          <div className="space-y-2">
            <div className="relative">
              <input 
                type="text"
                placeholder="Nom de la coopérative..."
                value={coopSearch}
                onChange={(e) => onCoopSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:bg-white focus:border-green-400 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
            <div className="relative">
              <input 
                type="text"
                placeholder="Nom du représentant..."
                value={nameSearch}
                onChange={(e) => onNameSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:bg-white focus:border-green-400 transition-all"
              />
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="px-5 py-2 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coopératives répertoriées</span>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black">{cooperatives.length}</span>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {cooperatives.map((coop, idx) => {
            const props = coop.properties as CooperativeProperties;
            return (
              <div 
                key={idx} 
                onClick={() => onCooperativeSelect(idx.toString())}
                className="p-3 bg-white border border-gray-100 rounded-xl hover:border-green-300 hover:shadow-sm transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <MapPin size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-green-700">
                    {props.NomCoop || props.nom || "N/A"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 truncate">{props.NomPrenom || "Inconnu"}</span>
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">{props.Commune}</span>
                  </div>
                </div>
                <Info size={14} className="text-gray-300 mt-1" />
              </div>
            );
          })}

          {cooperatives.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="text-gray-300" size={24} />
              </div>
              <p className="text-xs font-bold text-gray-400">Aucun résultat trouvé</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 bg-white border-t border-gray-50 flex justify-between items-center text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
          <span>SIGaid &copy; 2024</span>
          <img src="https://aid-maroc.com/wp-content/uploads/2021/04/Logo-222.png" className="h-4 grayscale" alt="logo" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
