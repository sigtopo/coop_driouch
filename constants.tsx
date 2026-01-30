
import React from 'react';

export const DATA_URLS = {
  PROVINCE: "https://raw.githubusercontent.com/geotoposig/AIDSIG/refs/heads/main/PROVINCE_DRIOUCH.geojson",
  COMMUNES: "https://raw.githubusercontent.com/geotoposig/AIDSIG/refs/heads/main/COMMUNES_DRIOUCH.geojson",
  COOPERATIVES: "https://raw.githubusercontent.com/geotoposig/AIDSIG/refs/heads/main/Cooperatives_Driouch.geojson"
};

export const MAP_STYLES = {
  PROVINCE: {
    color: "#FFFFFF", // Blanc pour contraster avec le satellite sombre
    weight: 4,
    fillOpacity: 0,
    interactive: false
  },
  COMMUNES: {
    color: "#FACC15", // Jaune vif pour les limites des communes
    weight: 2,
    dashArray: '5, 5',
    fillOpacity: 0.05,
    interactive: false
  },
  COOPERATIVES: {
    color: "#FFFFFF",
    fillColor: "#22C55E", // Vert vif (Tailwind green-500)
    weight: 2,
    fillOpacity: 1,
    radius: 7,
    interactive: true
  },
  HIGHLIGHT: {
    color: "#FFFFFF",
    weight: 3,
    fillOpacity: 1,
    fillColor: "#F43F5E" // Rose/Rouge pour le survol
  }
};

export const DEFAULT_VIEW: [number, number] = [34.95, -3.40];
export const DEFAULT_ZOOM = 9;
