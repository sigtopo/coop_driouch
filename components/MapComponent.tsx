
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MAP_STYLES, DEFAULT_VIEW, DEFAULT_ZOOM } from '../constants.tsx';
import { GeoDataState, CooperativeProperties } from '../types.ts';

interface MapComponentProps {
  geoData: GeoDataState;
  filteredCooperatives: any[];
  selectedCommune: string;
  selectedCoopId: string | null;
}

const MapEffect: React.FC<{
  selectedCommune: string;
  communesLayer: any | null;
  filteredCoops: any[];
  selectedCoopId: string | null;
  coopLayerRef: React.MutableRefObject<any>;
}> = ({ selectedCommune, communesLayer, filteredCoops, selectedCoopId, coopLayerRef }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCommune === 'All' && communesLayer) {
      map.fitBounds(L.geoJSON(communesLayer).getBounds(), { padding: [50, 50] });
    } else if (communesLayer) {
      const communeFeature = communesLayer.features.find((f: any) => 
        (f.properties.NAME || f.properties.Name || f.properties.nom) === selectedCommune
      );
      if (communeFeature) {
        map.fitBounds(L.geoJSON(communeFeature).getBounds(), { padding: [50, 50] });
      }
    }
  }, [selectedCommune, communesLayer, map]);

  useEffect(() => {
    if (selectedCoopId && coopLayerRef.current) {
      const layers = coopLayerRef.current.getLayers();
      const targetLayer = layers[parseInt(selectedCoopId)];
      if (targetLayer) {
        if (targetLayer.getBounds) {
          map.fitBounds(targetLayer.getBounds(), { padding: [50, 50] });
        } else if (targetLayer.getLatLng) {
          map.setView(targetLayer.getLatLng(), 15);
        }
        targetLayer.openPopup();
      }
    }
  }, [selectedCoopId, map]);

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
    const name = p.NomCoop || "Coopérative";

    // Helper to format numbers safely
    const formatValue = (val: any, suffix: string = '') => {
      if (val === undefined || val === null || val === '') return '-';
      return `${val}${suffix}`;
    };

    const formatCoord = (val: any) => {
      if (val === undefined || val === null || val === '') return '-';
      const num = Number(val);
      return isNaN(num) ? val : num.toFixed(2);
    };

    const coordX = formatCoord(p.X);
    const coordY = formatCoord(p.Y);

    let popupContent = `
      <div class="p-0 min-w-[320px] max-w-[400px] font-sans">
        <div class="bg-green-600 text-white p-3 rounded-t-lg">
          <h3 class="font-bold text-lg leading-tight">${name}</h3>
          <p class="text-xs opacity-90 mt-1">${p.activité || 'Secteur non défini'}</p>
        </div>
        
        <div class="p-3 bg-white max-h-[400px] overflow-y-auto custom-scrollbar shadow-inner text-right" dir="rtl">
          <!-- Localisation Section -->
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b pb-1 text-left">📍 Localisation & Admin</h4>
          <table class="w-full text-xs mb-4" dir="ltr">
            <tr class="border-b border-gray-50"><td class="py-1 text-gray-500 w-1/3 text-left">Commune</td><td class="py-1 font-medium text-right">${p.Commune || '-'}</td></tr>
            <tr class="border-b border-gray-50"><td class="py-1 text-gray-500 text-left">Cercle</td><td class="py-1 font-medium text-right">${p.Cercle || '-'}</td></tr>
            <tr class="border-b border-gray-50"><td class="py-1 text-gray-500 text-left">Douar/Quartier</td><td class="py-1 font-medium text-right">${p.Douar_Quar || '-'}</td></tr>
            <tr><td class="py-1 text-gray-500 text-left">Coordonnées</td><td class="py-1 font-mono text-[9px] text-right">${coordX}, ${coordY}</td></tr>
          </table>

          <!-- Representative Section -->
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b pb-1 text-left">👤 Représentant & Contact</h4>
          <table class="w-full text-xs mb-4" dir="ltr">
            <tr class="border-b border-gray-50"><td class="py-1 text-gray-500 text-left">Nom Complet</td><td class="py-1 font-medium text-right text-gray-800">${p.NomPrenom || '-'}</td></tr>
            <tr class="border-b border-gray-50"><td class="py-1 text-gray-500 text-left">Genre</td><td class="py-1 font-medium text-right">${p.Genre || '-'}</td></tr>
            <tr class="border-b border-gray-50"><td class="py-1 text-gray-500 text-left">Scolarité</td><td class="py-1 font-medium text-right">${p["Niveau sco"] || '-'}</td></tr>
            <tr class="border-b border-gray-50"><td class="py-1 text-gray-500 text-left">Téléphone</td><td class="py-1 font-bold text-right text-green-600">${p.Tel || '-'}</td></tr>
            <tr><td class="py-1 text-gray-500 text-left">Création</td><td class="py-1 font-medium text-right italic text-gray-400 text-[10px]">${p.Date_creat || '-'}</td></tr>
          </table>

          <!-- Stats Section -->
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b pb-1 text-left">📊 Statistiques & Capital</h4>
          <div class="grid grid-cols-2 gap-2 mb-2" dir="ltr">
            <div class="bg-gray-50 p-2 rounded border border-gray-100">
              <span class="block text-[10px] text-gray-400 text-left">Nombre des adhérents</span>
              <span class="text-sm font-bold text-gray-700">${p["nbr adhér"] || 0}</span>
            </div>
            <div class="bg-gray-50 p-2 rounded border border-gray-100">
              <span class="block text-[10px] text-gray-400 text-left">Femmes</span>
              <span class="text-sm font-bold text-pink-600">${p.nbr_femmes || 0}</span>
            </div>
            <div class="bg-gray-50 p-2 rounded border border-gray-100">
              <span class="block text-[10px] text-gray-400 text-left">Jeunes</span>
              <span class="text-sm font-bold text-blue-600">${p.nbr_jeunes || 0}</span>
            </div>
            <div class="bg-gray-50 p-2 rounded border border-gray-100">
              <span class="block text-[10px] text-gray-400 text-left">Capital Social</span>
              <span class="text-sm font-bold text-green-700">${formatValue(p.capitalsoc, ' DH')}</span>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-100 p-2 rounded-b-lg flex justify-between items-center text-[9px] text-gray-500 border-t border-gray-200">
          <span>Plateforme SIGaid Driouch</span>
          <span class="font-bold">AID MAROC</span>
        </div>
      </div>
    `;
    
    layer.bindPopup(popupContent, {
      maxWidth: 400,
      className: 'custom-popup-professional'
    });
    
    if (name) {
      layer.bindTooltip(name, {
        permanent: false,
        direction: "top",
        className: "feature-label",
        offset: [0, -10]
      });
    }

    layer.on('mouseover', (e: any) => {
      e.target.setStyle(MAP_STYLES.HIGHLIGHT);
    });

    layer.on('mouseout', (e: any) => {
      e.target.setStyle(MAP_STYLES.COOPERATIVES);
    });
  };

  const coopGeoJSON = {
    type: "FeatureCollection",
    features: filteredCooperatives
  };

  return (
    <div className="w-full h-full">
      <MapContainer 
        center={DEFAULT_VIEW} 
        zoom={DEFAULT_ZOOM} 
        zoomControl={false}
        className="w-full h-full"
      >
        <ZoomControl position="bottomright" />
        
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
          maxZoom={20}
        />

        {geoData.province && (
          <GeoJSON 
            data={geoData.province} 
            style={MAP_STYLES.PROVINCE}
          />
        )}

        {geoData.communes && (
          <GeoJSON 
            data={geoData.communes} 
            style={MAP_STYLES.COMMUNES}
          />
        )}

        <GeoJSON 
          key={`coops-${selectedCommune}-${filteredCooperatives.length}`}
          ref={coopLayerRef}
          data={coopGeoJSON as any}
          style={() => MAP_STYLES.COOPERATIVES}
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, MAP_STYLES.COOPERATIVES);
          }}
          onEachFeature={onEachCoop}
        />

        <MapEffect 
          selectedCommune={selectedCommune} 
          communesLayer={geoData.communes}
          filteredCoops={filteredCooperatives}
          selectedCoopId={selectedCoopId}
          coopLayerRef={coopLayerRef}
        />

        <div className="absolute top-6 right-6 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-100 min-w-[180px]">
          <h4 className="text-xs font-bold mb-3 text-gray-500 uppercase tracking-widest text-center">Légende SIG</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 group">
              <span className="w-8 h-1 rounded-full bg-white border border-gray-300 shadow-sm"></span>
              <span className="text-xs font-semibold text-gray-700">Province</span>
            </div>
            <div className="flex items-center gap-3 group">
              <span className="w-8 h-1 rounded-full bg-yellow-400 border border-yellow-500 shadow-sm border-dashed"></span>
              <span className="text-xs font-semibold text-gray-700">Communes</span>
            </div>
            <div className="flex items-center gap-3 group">
              <span className="w-4 h-4 rounded-full border-2 border-white bg-green-500 shadow-md"></span>
              <span className="text-xs font-semibold text-gray-700">Coopératives</span>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
