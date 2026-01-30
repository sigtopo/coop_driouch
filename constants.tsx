
export const DATA_URLS = {
  PROVINCE: "https://raw.githubusercontent.com/sigtopo/coop_driouch/refs/heads/main/PROVINCE_DRIOUCH.geojson",
  COMMUNES: "https://raw.githubusercontent.com/sigtopo/coop_driouch/refs/heads/main/COMMUNES_DRIOUCH.geojson",
  COOPERATIVES: "https://raw.githubusercontent.com/sigtopo/coop_driouch/refs/heads/main/CooperativesDriouch.geojson"
};

export const MAP_STYLES = {
  PROVINCE: {
    color: "#059669",
    weight: 3,
    fillOpacity: 0,
    interactive: false // منع التحديد
  },
  COMMUNES: {
    color: "#94a3b8",
    weight: 1,
    dashArray: '3, 6',
    fillOpacity: 0.02,
    interactive: false // منع التحديد
  },
  COOPERATIVES: {
    color: "#ffffff",
    fillColor: "#059669",
    weight: 2,
    fillOpacity: 1,
    radius: 7,
    interactive: true
  },
  HIGHLIGHT: {
    color: "#ffffff",
    weight: 3,
    fillOpacity: 1,
    fillColor: "#10b981",
    radius: 10
  }
};

export const DEFAULT_VIEW: [number, number] = [34.95, -3.40];
export const DEFAULT_ZOOM = 10;
export const BASEMAP_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const BASEMAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
