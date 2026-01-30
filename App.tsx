
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';
import { DATA_URLS } from './constants';
import { GeoDataState, CooperativeProperties } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<GeoDataState>({
    province: null,
    communes: null,
    cooperatives: null,
    loading: true,
    error: null,
  });

  const [selectedCommune, setSelectedCommune] = useState<string>('All');
  const [coopSearch, setCoopSearch] = useState<string>('');
  const [nameSearch, setNameSearch] = useState<string>('');
  const [selectedCoopId, setSelectedCoopId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(window.innerWidth > 768);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provRes, commRes, coopRes] = await Promise.all([
          fetch(DATA_URLS.PROVINCE).then(r => r.json()),
          fetch(DATA_URLS.COMMUNES).then(r => r.json()),
          fetch(DATA_URLS.COOPERATIVES).then(r => r.json()),
        ]);

        setData({
          province: provRes,
          communes: commRes,
          cooperatives: coopRes,
          loading: false,
          error: null,
        });
      } catch (err) {
        setData(prev => ({ ...prev, loading: false, error: "Erreur de chargement des données" }));
      }
    };

    fetchData();
  }, []);

  const communeListFromCoops = useMemo(() => {
    if (!data.cooperatives) return [];
    const names = data.cooperatives.features
      .map((f: any) => f.properties.Commune || f.properties.commune)
      .filter((n: any) => n && n !== "Commune");
    return Array.from(new Set(names)).sort() as string[];
  }, [data.cooperatives]);

  const filteredCooperatives = useMemo(() => {
    if (!data.cooperatives) return [];
    return data.cooperatives.features.filter((f: any) => {
      const props = f.properties as CooperativeProperties;
      if (!props.NomCoop && !props.nom) return false;

      const coopName = (props.NomCoop || props.nom || '').toLowerCase();
      const repName = (props.NomPrenom || '').toLowerCase();
      const commune = (props.Commune || props.commune || '');
      
      const matchesCoopSearch = coopName.includes(coopSearch.toLowerCase());
      const matchesNameSearch = repName.includes(nameSearch.toLowerCase());
      const matchesCommune = selectedCommune === 'All' || commune === selectedCommune;

      return matchesCoopSearch && matchesNameSearch && matchesCommune;
    });
  }, [data.cooperatives, coopSearch, nameSearch, selectedCommune]);

  if (data.loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/10 border-t-green-500 rounded-full animate-spin"></div>
          <p className="mt-6 text-xs font-bold text-gray-400 animate-pulse tracking-widest uppercase">Initialisation SIGaid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Header />
      
      {/* Mobile Toggle Trigger */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 z-[2500] w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-green-700 transition-all active:scale-95"
      >
        <Menu size={24} />
      </button>

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 relative order-2 md:order-1">
          <MapComponent 
            geoData={data} 
            filteredCooperatives={filteredCooperatives}
            selectedCommune={selectedCommune}
            selectedCoopId={selectedCoopId}
          />
        </main>
        
        <Sidebar 
          communes={communeListFromCoops}
          selectedCommune={selectedCommune}
          onCommuneChange={setSelectedCommune}
          coopSearch={coopSearch}
          onCoopSearchChange={setCoopSearch}
          nameSearch={nameSearch}
          onNameSearchChange={setNameSearch}
          cooperatives={filteredCooperatives}
          onCooperativeSelect={(id) => {
            setSelectedCoopId(id);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  );
};

export default App;
