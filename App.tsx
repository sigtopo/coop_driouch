
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import MapComponent from './components/MapComponent.tsx';
import { DATA_URLS, DEFAULT_VIEW, DEFAULT_ZOOM } from './constants.tsx';
import { GeoDataState, CooperativeProperties } from './types.ts';

const App: React.FC = () => {
  const [data, setData] = useState<GeoDataState>({
    province: null,
    communes: null,
    cooperatives: null,
    loading: true,
    error: null,
  });

  const [selectedCommune, setSelectedCommune] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCoopId, setSelectedCoopId] = useState<string | null>(null);

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
        setData(prev => ({ ...prev, loading: false, error: "Erreur lors du chargement des données SIG." }));
      }
    };

    fetchData();
  }, []);

  // List of unique communes for the dropdown
  const communeList = useMemo(() => {
    if (!data.communes) return [];
    const names = data.communes.features.map((f: any) => 
      f.properties.NAME || f.properties.Name || f.properties.nom
    ).filter(Boolean);
    return Array.from(new Set(names)).sort() as string[];
  }, [data.communes]);

  // Filtered cooperatives based on search and commune selection
  const filteredCooperatives = useMemo(() => {
    if (!data.cooperatives) return [];
    return data.cooperatives.features.filter((f: any) => {
      const props = f.properties as CooperativeProperties;
      // Use NomCoop as the primary name field
      const name = (props.NomCoop || props.nom || props.NAME || props.Name || '').toLowerCase();
      const commune = (props.Commune || props.commune || '');
      
      const matchesSearch = name.includes(searchQuery.toLowerCase());
      const matchesCommune = selectedCommune === 'All' || commune === selectedCommune;

      return matchesSearch && matchesCommune;
    });
  }, [data.cooperatives, searchQuery, selectedCommune]);

  if (data.loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Chargement des données cartographiques...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          communes={communeList}
          selectedCommune={selectedCommune}
          onCommuneChange={setSelectedCommune}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cooperatives={filteredCooperatives}
          onCooperativeSelect={setSelectedCoopId}
        />
        <main className="flex-1 relative">
          <MapComponent 
            geoData={data} 
            filteredCooperatives={filteredCooperatives}
            selectedCommune={selectedCommune}
            selectedCoopId={selectedCoopId}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
