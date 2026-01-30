
export interface CooperativeProperties {
  NomCoop?: string;
  activité?: string;
  X?: any;
  Y?: any;
  Province?: string;
  Cercle?: string;
  Commune?: string;
  Douar_Quar?: string;
  Date_creat?: string;
  "nbr adhér"?: any;
  nbr_femmes?: any;
  nbr_jeunes?: any;
  capitalsoc?: any;
  NomPrenom?: string;
  Genre?: string;
  DateNaissa?: string;
  "Niveau sco"?: string;
  Tel?: string;
  [key: string]: any;
}

export interface CommuneProperties {
  nom?: string;
  NAME?: string;
  Name?: string;
  [key: string]: any;
}

export interface GeoDataState {
  province: any | null;
  communes: any | null;
  cooperatives: any | null;
  loading: boolean;
  error: string | null;
}
