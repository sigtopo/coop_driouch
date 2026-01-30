
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MAP_STYLES, DEFAULT_VIEW, DEFAULT_ZOOM, BASEMAP_URL, BASEMAP_ATTRIBUTION } from '../constants';
import { GeoDataState, CooperativeProperties } from '../types';

interface MapComponentProps {
  geoData: GeoDataState;
  filteredCooperatives: any[];
  selectedCommune: string;
  selectedCoopId: string | null;
}

const MapEffect: React.FC<{
  selectedCommune: string;
  communesLayer: any | null;
  selectedCoopId: string | null;
  coopLayerRef: React.MutableRefObject<any>;
  filteredCooperatives: any[];
}> = ({ selectedCommune, communesLayer, selectedCoopId, coopLayerRef, filteredCooperatives }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCommune === 'All' && communesLayer) {
      try {
        map.fitBounds(L.geoJSON(communesLayer).getBounds(), { padding: [50, 50] });
      } catch (e) {}
    } else if (communesLayer) {
      const communeFeature = communesLayer.features.find((f: any) => 
        (f.properties.NAME || f.properties.Name || f.properties.nom) === selectedCommune
      );
      if (communeFeature) {
        map.fitBounds(L.geoJSON(communeFeature).getBounds(), { padding: [100, 100], maxZoom: 13 });
      }
    }
  }, [selectedCommune, communesLayer, map]);

  useEffect(() => {
    if (selectedCoopId && coopLayerRef.current) {
      const layers = coopLayerRef.current.getLayers();
      let targetLayer = layers.find((l: any) => l.feature && (l.feature.id === selectedCoopId || l.feature.properties.id === selectedCoopId));
      
      if (!targetLayer) {
        const index = parseInt(selectedCoopId);
        if (!isNaN(index) && layers[index]) {
          targetLayer = layers[index];
        }
      }

      if (targetLayer) {
        if (targetLayer.getLatLng) {
          map.setView(targetLayer.getLatLng(), 15);
        }
        targetLayer.openPopup();
      }
    }
  }, [selectedCoopId, map, filteredCooperatives]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ 
  geoData, 
  filteredCooperatives, 
  selectedCommune,
  selectedCoopId
}) => {
  const coopLayerRef = useRef<any>(null);

  const onEachCoop = (feature: any, layer: L.Layer) => {
    const p = feature.properties as CooperativeProperties;
    const name = p["Nom de coopérative"] || p.nom || "Coopérative";
    const coordsStr = feature.geometry?.coordinates && feature.geometry.coordinates.length >= 2 
      ? `${feature.geometry.coordinates[1].toFixed(5)}, ${feature.geometry.coordinates[0].toFixed(5)}` 
      : (p.X && p.Y ? `${p.X}, ${p.Y}` : "Non spécifié");

    const popupContent = `
      <div class="p-0 font-sans text-left">
        <div class="bg-green-700 text-white p-5 shadow-lg relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="font-black text-lg leading-tight uppercase border-b border-white/30 pb-3">${name}</h3>
            <div class="flex items-center gap-2 mt-3">
               <span class="px-2 py-0.5 bg-white/20 rounded text-[9px] font-black uppercase tracking-widest">${p["Filière d'activité"] || 'Activité'}</span>
               <span class="w-1 h-1 bg-green-400 rounded-full"></span>
               <span class="text-[10px] font-bold opacity-80">${p.Commune}</span>
            </div>
          </div>
        </div>
        
        <div class="max-h-[380px] overflow-y-auto custom-scrollbar p-5 bg-white space-y-6">
          <section>
            <h4 class="text-[10px] font-black text-green-700 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <span class="w-4 h-[1px] bg-green-200"></span> الموقع الإداري
            </h4>
            <div class="grid grid-cols-1 gap-2.5">
              <div class="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span class="text-[10px] text-gray-400 font-bold uppercase">الجماعة</span>
                <span class="text-xs font-extrabold text-gray-800">${p.Commune || '-'}</span>
              </div>
              <div class="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span class="text-[10px] text-gray-400 font-bold uppercase">الدائرة</span>
                <span class="text-xs font-bold text-gray-700">${p.Cercle || '-'}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-gray-400 font-bold uppercase">الإحداثيات</span>
                <span class="text-[10px] font-mono text-green-600 bg-green-50 px-1.5 py-0.5 rounded">${coordsStr}</span>
              </div>
            </div>
          </section>

          <section>
            <h4 class="text-[10px] font-black text-green-700 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <span class="w-4 h-[1px] bg-green-200"></span> رئاسة التعاونية
            </h4>
            <div class="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 shadow-inner">
              <div class="mb-3">
                <div class="text-[9px] text-gray-400 font-bold uppercase mb-0.5 tracking-tighter">الاسم واللقب للرئيس</div>
                <div class="text-sm font-black text-gray-900">${p["Nom et prénom président/gestionnaire"] || 'غير مصرح'}</div>
              </div>
              <div class="grid grid-cols-2 gap-4 pt-3 border-t border-white">
                <div>
                  <div class="text-[9px] text-gray-400 font-bold uppercase mb-0.5">الهاتف</div>
                  <div class="text-xs font-black text-green-600">${p.Tel || '-'}</div>
                </div>
                <div>
                  <div class="text-[9px] text-gray-400 font-bold uppercase mb-0.5">تاريخ التأسيس</div>
                  <div class="text-xs font-bold text-gray-700">${p["Date de création"] || '-'}</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h4 class="text-[10px] font-black text-green-700 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <span class="w-4 h-[1px] bg-green-200"></span> المؤشرات الرقمية
            </h4>
            <div class="grid grid-cols-3 gap-2">
              <div class="bg-white p-2.5 rounded-xl border border-gray-100 text-center shadow-sm">
                <div class="text-[8px] text-gray-400 font-black uppercase mb-1 leading-none">الأعضاء</div>
                <div class="text-sm font-black text-green-700">${p["Nombre des adhérents"] || 0}</div>
              </div>
              <div class="bg-white p-2.5 rounded-xl border border-gray-100 text-center shadow-sm">
                <div class="text-[8px] text-gray-400 font-black uppercase mb-1 leading-none">نساء</div>
                <div class="text-sm font-black text-blue-600">${p["Nombre des femmes"] || 0}</div>
              </div>
              <div class="bg-white p-2.5 rounded-xl border border-gray-100 text-center shadow-sm">
                <div class="text-[8px] text-gray-400 font-black uppercase mb-1 leading-none">شباب</div>
                <div class="text-sm font-black text-amber-600">${p["Nombre des jeunes"] || 0}</div>
              </div>
            </div>
            <div class="mt-3 bg-green-600 rounded-xl p-3 flex justify-between items-center shadow-md">
              <span class="text-[9px] text-green-100 font-black uppercase tracking-widest">رأس المال</span>
              <span class="text-sm font-black text-white">${p["Capital social"] || 0} <span class="text-[10px] opacity-80">DH</span></span>
            </div>
          </section>
        </div>
        
        <div class="bg-gray-50/80 backdrop-blur-sm p-4 text-[9px] font-black text-center text-gray-400 border-t flex items-center justify-center gap-4">
          <span>AID MAROC</span>
          <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>SIGAID DRIOUCH</span>
        </div>
      </div>
    `;
    
    layer.bindPopup(popupContent, {
      maxWidth: 320,
      minWidth: 320,
      className: 'custom-popup-professional'
    });
    
    if (layer instanceof L.CircleMarker) {
      layer.on('mouseover', (e: any) => e.target.setStyle(MAP_STYLES.HIGHLIGHT));
      layer.on('mouseout', (e: any) => e.target.setStyle(MAP_STYLES.COOPERATIVES));
    }
  };

  const coopGeoJSON = {
    type: "FeatureCollection",
    features: filteredCooperatives
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={DEFAULT_VIEW} 
        zoom={DEFAULT_ZOOM} 
        zoomControl={false}
        className="w-full h-full"
      >
        <ZoomControl position="bottomright" />
        
        <TileLayer
          url={BASEMAP_URL}
          attribution={BASEMAP_ATTRIBUTION}
        />

        {geoData.province && (
           <GeoJSON 
             key="province-layer"
             data={geoData.province} 
             style={MAP_STYLES.PROVINCE} 
           />
        )}
        {geoData.communes && (
           <GeoJSON 
             key="communes-layer"
             data={geoData.communes} 
             style={MAP_STYLES.COMMUNES} 
           />
        )}

        <GeoJSON 
          key={`coops-${selectedCommune}-${filteredCooperatives.length}-${Date.now()}`}
          ref={coopLayerRef}
          data={coopGeoJSON as any}
          style={() => MAP_STYLES.COOPERATIVES}
          pointToLayer={(feature, latlng) => L.circleMarker(latlng, {
            ...MAP_STYLES.COOPERATIVES,
            radius: window.innerWidth < 768 ? 9 : 7
          })}
          onEachFeature={onEachCoop}
        />

        <MapEffect 
          selectedCommune={selectedCommune} 
          communesLayer={geoData.communes}
          selectedCoopId={selectedCoopId}
          coopLayerRef={coopLayerRef}
          filteredCooperatives={filteredCooperatives}
        />
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur px-4 py-2 rounded-2xl border border-gray-100 shadow-xl hidden md:flex items-center gap-3">
        <div className="relative">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-900 tracking-tight leading-none uppercase">المرصد التفاعلي</span>
          <span className="text-[9px] font-bold text-gray-400 mt-0.5 tracking-tighter">إقليم الدريوش - نسخة احترافية</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
