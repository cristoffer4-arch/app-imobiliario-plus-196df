// Portuguese-specific property types and interfaces
// Extends the base Property interface with PT market-specific fields

import { Property } from './property';

// Portuguese Tipologia (T0, T1, T2, etc.)
export type TipologiaPT = 
  | 'T0' 
  | 'T1' 
  | 'T2' 
  | 'T3' 
  | 'T4' 
  | 'T5' 
  | 'T6+' 
  | 'Loft' 
  | 'Duplex' 
  | 'Fração';

// Energy Certificate (Certificado Energético)
export type CertificadoEnergetico = 'A+' | 'A' | 'B' | 'B-' | 'C' | 'D' | 'E' | 'F';

// Orientation (Orientação solar)
export type OrientacaoPT = 'Norte' | 'Sul' | 'Este' | 'Oeste' | 'Nascente' | 'Poente';

// View types (Vista)
export type VistaPT = 'mar' | 'cidade' | 'serra' | 'rio' | 'campo' | 'parque' | 'jardim';

// Portuguese Property interface extending base Property
export interface PropertyPT extends Property {
  // Tipologia
  tipologia: TipologiaPT;
  
  // Licenças e Certificações
  licenca_habitacao?: string;
  certificado_energetico?: CertificadoEnergetico;
  al_license?: string; // Alojamento Local license
  al_numero_registo?: string; // AL registration number
  
  // Condomínio
  condominio_mensal?: number;
  condominio_inclui?: string[]; // What's included (water, gas, cleaning, etc.)
  
  // Impostos PT
  imi_anual?: number; // IMI (Imposto Municipal sobre Imóveis)
  imt_estimado?: number; // IMT (Imposto Municipal sobre Transmissões)
  imposto_selo?: number; // Stamp duty
  
  // Características PT
  orientacao?: OrientacaoPT;
  vista?: VistaPT[];
  elevador?: boolean;
  lugar_garagem?: number; // Number of parking spaces
  arrecadacao?: boolean; // Storage room
  varanda?: boolean;
  varanda_area?: number; // Balcony area in m²
  
  // Localização PT
  freguesia?: string; // Parish
  distrito?: string; // District
  concelho?: string; // Municipality
}

// Input type for creating PT properties
export interface PropertyPTCreateInput {
  // Required fields
  title: string;
  tipologia: TipologiaPT;
  price: number;
  area: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  
  // PT specific
  distrito: string;
  concelho: string;
  freguesia?: string;
  
  // Optional basic fields
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  
  // PT specific optional
  licenca_habitacao?: string;
  certificado_energetico?: CertificadoEnergetico;
  al_license?: string;
  al_numero_registo?: string;
  condominio_mensal?: number;
  condominio_inclui?: string[];
  imi_anual?: number;
  imt_estimado?: number;
  imposto_selo?: number;
  orientacao?: OrientacaoPT;
  vista?: VistaPT[];
  elevador?: boolean;
  lugar_garagem?: number;
  arrecadacao?: boolean;
  varanda?: boolean;
  varanda_area?: number;
  
  // Media
  images?: string[];
  thumbnail?: string;
  features?: string[];
}

// Input type for updating PT properties
export interface PropertyPTUpdateInput extends Partial<PropertyPTCreateInput> {
  status?: 'active' | 'pending' | 'sold' | 'rented' | 'deleted';
}

// Filter parameters for PT properties
export interface PropertyPTFilterParams {
  tipologia?: TipologiaPT | TipologiaPT[];
  distrito?: string | string[];
  concelho?: string | string[];
  freguesia?: string;
  certificado_energetico?: CertificadoEnergetico | CertificadoEnergetico[];
  
  // Price range
  minPrice?: number;
  maxPrice?: number;
  
  // Condomínio
  maxCondominio?: number;
  
  // AL filter
  hasALLicense?: boolean;
  
  // Orientation and view
  orientacao?: OrientacaoPT | OrientacaoPT[];
  vista?: VistaPT | VistaPT[];
  
  // Features
  hasElevador?: boolean;
  minGaragem?: number;
  hasArrecadacao?: boolean;
  hasVaranda?: boolean;
  
  // General
  minBedrooms?: number;
  maxBedrooms?: number;
  minArea?: number;
  maxArea?: number;
  
  // Pagination
  page?: number;
  limit?: number;
}

// Constants for Portuguese districts
export const DISTRITOS_PT = [
  'Aveiro',
  'Beja',
  'Braga',
  'Bragança',
  'Castelo Branco',
  'Coimbra',
  'Évora',
  'Faro',
  'Guarda',
  'Leiria',
  'Lisboa',
  'Portalegre',
  'Porto',
  'Santarém',
  'Setúbal',
  'Viana do Castelo',
  'Vila Real',
  'Viseu',
  'Açores',
  'Madeira'
] as const;

export type DistritosPT = typeof DISTRITOS_PT[number];

// Major Portuguese councils for quick reference
export const MAJOR_COUNCILS_PT = {
  Lisboa: ['Lisboa', 'Cascais', 'Sintra', 'Oeiras', 'Loures', 'Almada', 'Amadora'],
  Porto: ['Porto', 'Vila Nova de Gaia', 'Matosinhos', 'Gondomar', 'Maia', 'Povoa de Varzim'],
  Faro: ['Albufeira', 'Faro', 'Lagos', 'Portimão', 'Tavira', 'Olhão', 'Loulé']
} as const;

// Tipologia labels for UI
export const TIPOLOGIA_LABELS: Record<TipologiaPT, string> = {
  T0: 'T0 (Estúdio)',
  T1: 'T1 (1 Quarto)',
  T2: 'T2 (2 Quartos)',
  T3: 'T3 (3 Quartos)',
  T4: 'T4 (4 Quartos)',
  T5: 'T5 (5 Quartos)',
  'T6+': 'T6+ (6+ Quartos)',
  'Loft': 'Loft',
  'Duplex': 'Duplex',
  'Fração': 'Fração'
};

// Energy certificate colors for UI
export const CERTIFICADO_COLORS: Record<CertificadoEnergetico, string> = {
  'A+': '#00a651',
  'A': '#6cc24a',
  'B': '#c8d400',
  'B-': '#fff200',
  'C': '#fbb040',
  'D': '#f68b1f',
  'E': '#ee1c25',
  'F': '#b91622'
};
