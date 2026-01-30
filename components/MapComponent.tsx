
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MAP_STYLES, DEFAULT_VIEW, DEFAULT_ZOOM, SATELLITE_URL, SATELLITE_ATTRIBUTION } from '../constants';
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
}> = ({ selectedCommune, communesLayer, selectedCoopId, coopLayerRef }) => {
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
      const targetLayer = layers.find((l: any) => l.feature && l.feature.id === selectedCoopId) || layers[parseInt(selectedCoopId)];
      if (targetLayer) {
        if (targetLayer.getLatLng) {
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

    const popupContent = `
      <div class="p-0 font-sans text-left">
        <div class="bg-green-700 text-white p-3 shadow-md">
          <h3 class="font-bold text-base leading-tight uppercase">${name}</h3>
          <p class="text-[10px] opacity-80 mt-0.5">${p.activité || 'Activité non spécifiée'}</p>
        </div>
        
        <div class="p-4 bg-white space-y-3">
          <section>
            <h4 class="text-[9px] font-bold text-green-600 uppercase tracking-widest mb-1 border-b pb-0.5">📍 Localisation</h4>
            <div class="grid grid-cols-2 text-[11px] gap-y-1">
              <span class="text-gray-400">Commune:</span><span class="font-bold text-gray-700 text-right">${p.Commune || '-'}</span>
              <span class="text-gray-400">Douar/Quartier:</span><span class="font-bold text-gray-700 text-right">${p.Douar_Quar || '-'}</span>
            </div>
          </section>

          <section>
            <h4 class="text-[9px] font-bold text-green-600 uppercase tracking-widest mb-1 border-b pb-0.5">👤 Contact</h4>
            <div class="grid grid-cols-2 text-[11px] gap-y-1">
              <span class="text-gray-400">Représentant:</span><span class="font-bold text-gray-700 text-right">${p.NomPrenom || '-'}</span>
              <span class="text-gray-400">Téléphone:</span><span class="font-bold text-green-600 text-right">${p.Tel || '-'}</span>
            </div>
          </section>

          <section>
            <h4 class="text-[9px] font-bold text-green-600 uppercase tracking-widest mb-1 border-b pb-0.5">📊 Statistiques</h4>
            <div class="flex justify-between gap-1 text-center">
              <div class="flex-1 bg-green-50 p-1.5 rounded">
                <div class="text-[8px] text-green-600">Membres</div>
                <div class="font-black text-green-800">${p["nbr adhér"] || 0}</div>
              </div>
              <div class="flex-1 bg-pink-50 p-1.5 rounded">
                <div class="text-[8px] text-pink-600">Femmes</div>
                <div class="font-black text-pink-800">${p.nbr_femmes || 0}</div>
              </div>
              <div class="flex-1 bg-blue-50 p-1.5 rounded">
                <div class="text-[8px] text-blue-600">Jeunes</div>
                <div class="font-black text-blue-800">${p.nbr_jeunes || 0}</div>
              </div>
            </div>
          </section>
        </div>
        
        <div class="bg-gray-50 p-2 text-[9px] text-center text-gray-400 border-t">
          AID MAROC &copy; 2024 - SIGaid Driouch
        </div>
      </div>
    `;
    
    layer.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'custom-popup-professional'
    });
    
    layer.on('mouseover', (e: any) => e.target.setStyle(MAP_STYLES.HIGHLIGHT));
    layer.on('mouseout', (e: any) => e.target.setStyle(MAP_STYLES.COOPERATIVES));
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
          url={SATELLITE_URL}
          attribution={SATELLITE_ATTRIBUTION}
          maxZoom={19}
        />

        {geoData.province && <GeoJSON data={geoData.province} style={MAP_STYLES.PROVINCE} />}
        {geoData.communes && <GeoJSON data={geoData.communes} style={MAP_STYLES.COMMUNES} />}

        <GeoJSON 
          key={`coops-${selectedCommune}-${filteredCooperatives.length}-${Date.now()}`}
          ref={coopLayerRef}
          data={coopGeoJSON as any}
          style={() => MAP_STYLES.COOPERATIVES}
          pointToLayer={(feature, latlng) => L.circleMarker(latlng, MAP_STYLES.COOPERATIVES)}
          onEachFeature={onEachCoop}
        />

        <MapEffect 
          selectedCommune={selectedCommune} 
          communesLayer={geoData.communes}
          selectedCoopId={selectedCoopId}
          coopLayerRef={coopLayerRef}
        />
      </MapContainer>

      {/* Floating Badge */}
      <div className="absolute top-4 left-4 z-[1000] bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-[10px] font-bold text-white flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        LIVE: Province de Driouch
      </div>
    </div>
  );
};

export default MapComponent;
