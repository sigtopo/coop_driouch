
import React from 'react';
import { Search, MapPin, User, Info, Filter, X, ChevronDown, Building2 } from 'lucide-react';
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
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[2900] md:hidden transition-opacity" onClick={onToggle} />
      )}

      <aside className={`sidebar-container w-full md:w-[380px] h-full bg-white shadow-2xl flex flex-col z-[3100] border-r border-gray-100 transition-all duration-500 ease-in-out ${isOpen ? 'sidebar-open' : ''}`}>
        
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-br from-green-600 to-green-700 text-white relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">المنصة الذكية</h2>
            </div>
            <button onClick={onToggle} className="md:hidden p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Commune Selector - Key Feature */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-green-100 uppercase tracking-widest ml-1">اختر الجماعة الترابية</label>
            <div className="relative">
              <select 
                value={selectedCommune}
                onChange={(e) => onCommuneChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm appearance-none outline-none focus:bg-white focus:text-gray-900 transition-all font-semibold cursor-pointer"
              >
                <option value="All" className="text-gray-900">جميع الجماعات (إقليم الدريوش)</option>
                {communes.map(c => <option key={c} value={c} className="text-gray-900">{c}</option>)}
              </select>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/60" size={16} />
            </div>
          </div>
        </div>

        {/* Filters Body */}
        <div className="p-5 border-b border-gray-100 space-y-4 bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Search size={14} className="text-green-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">البحث المتقدم</span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="relative group">
              <input 
                type="text"
                placeholder="اسم التعاونية..."
                value={coopSearch}
                onChange={(e) => onCoopSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm group-hover:border-green-200"
              />
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={16} />
            </div>

            <div className="relative group">
              <input 
                type="text"
                placeholder="اسم الرئيس أو المسير..."
                value={nameSearch}
                onChange={(e) => onNameSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm group-hover:border-green-200"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={16} />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">النتائج: {cooperatives.length} تعاونية</span>
          </div>
          <Info size={14} className="text-gray-300 hover:text-green-500 cursor-help" />
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-gray-50/30">
          {cooperatives.map((coop, idx) => {
            const props = coop.properties as CooperativeProperties;
            const coopId = coop.id || idx.toString();
            return (
              <div 
                key={coopId} 
                onClick={() => onCooperativeSelect(coopId)}
                className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-green-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
                  <MapPin size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-extrabold text-gray-900 leading-tight group-hover:text-green-700 transition-colors">
                    {props["Nom de coopérative"] || props.nom || "N/A"}
                  </h3>
                  <div className="flex flex-col gap-1 mt-1.5">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <User size={10} className="text-green-600" />
                      <span className="text-[11px] font-semibold truncate">
                        {props["Nom et prénom président/gestionnaire"] || "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded-full uppercase tracking-tighter">
                        {props.Commune}
                      </span>
                      <span className="text-[9px] text-green-600 font-black uppercase">
                        {props["Filière d'activité"] || 'خدمات'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {cooperatives.length === 0 && (
            <div className="text-center py-24 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-300" size={32} />
              </div>
              <p className="text-lg font-bold text-gray-900 mb-1">لا توجد نتائج</p>
              <p className="text-sm text-gray-400">حاول تغيير معايير البحث أو الجماعة المختارة</p>
            </div>
          )}
        </div>

        {/* Professional Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-gray-900 tracking-widest uppercase">SIGAID DRIOUCH</span>
          </div>
          <img src="https://aid-maroc.com/wp-content/uploads/2021/04/Logo-222.png" className="h-6 opacity-60 hover:opacity-100 transition-opacity" alt="logo" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
