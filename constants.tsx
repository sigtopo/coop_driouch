
export const DATA_URLS = {
  PROVINCE: "https://raw.githubusercontent.com/geotoposig/AIDSIG/refs/heads/main/PROVINCE_DRIOUCH.geojson",
  COMMUNES: "https://raw.githubusercontent.com/geotoposig/AIDSIG/refs/heads/main/COMMUNES_DRIOUCH.geojson",
  COOPERATIVES: "https://raw.githubusercontent.com/geotoposig/AIDSIG/refs/heads/main/Cooperatives_Driouch.geojson"
};

export const MAP_STYLES = {
  PROVINCE: {
    color: "#ffffff",
    weight: 2,
    fillOpacity: 0,
    interactive: false
  },
  COMMUNES: {
    color: "#cbd5e1",
    weight: 1,
    dashArray: '3, 5',
    fillOpacity: 0.05,
    interactive: false
  },
  COOPERATIVES: {
    color: "#ffffff",
    fillColor: "#00AA01",
    weight: 1,
    fillOpacity: 1,
    radius: 7,
    interactive: true
  },
  HIGHLIGHT: {
    color: "#ffffff",
    weight: 2,
    fillOpacity: 1,
    fillColor: "#f43f5e"
  }
};

export const DEFAULT_VIEW: [number, number] = [34.95, -3.40];
export const DEFAULT_ZOOM = 10;
export const SATELLITE_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
export const SATELLITE_ATTRIBUTION = "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community";
