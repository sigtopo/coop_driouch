
export interface CooperativeProperties {
  "Filière d'activité"?: string;
  "Nom de coopérative"?: string;
  "X"?: any;
  "Y"?: any;
  "Province"?: string;
  "Cercle"?: string;
  "Commune"?: string;
  "Douar/Quartier"?: string;
  "Date de création"?: string;
  "Nombre des adhérents"?: any;
  "Nombre des femmes"?: any;
  "Nombre des jeunes"?: any;
  "Capital social"?: any;
  "Nom et prénom président/gestionnaire"?: string;
  "Genre"?: string;
  "Date de naissance"?: string;
  "Niveau scolaire"?: string;
  "Tel"?: string;
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
