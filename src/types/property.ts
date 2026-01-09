// Property Types and Interfaces

export type PropertyType = 'apartment' | 'house' | 'condo' | 'land' | 'commercial';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'deleted';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  
  // Pricing
  price: number;
  
  // Location
  address: string;
  city: string;
  state: string;
  zip_code: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  
  // Property details
  bedrooms?: number;
  bathrooms?: number;
  area?: number; // in square meters
  garage_spaces?: number;
  
  // Features
  features?: string[];
  amenities?: string[];
  has_pool?: boolean;
  has_garage?: boolean;
  has_elevator?: boolean;
  has_air_conditioning?: boolean;
  
  // Media
  images?: string[];
  thumbnail?: string;
  virtual_tour_url?: string;
  
  // Additional info
  year_built?: number;
  lot_size?: number;
  property_tax?: number;
  hoa_fee?: number;
  
  // Metadata
  created_by: string;
  created_at: string;
  updated_at: string;
  views?: number;
}

export interface PropertyCreateInput {
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  garage_spaces?: number;
  features?: string[];
  amenities?: string[];
  images?: string[];
  thumbnail?: string;
  virtual_tour_url?: string;
  year_built?: number;
  lot_size?: number;
  property_tax?: number;
  hoa_fee?: number;
}

export interface PropertyUpdateInput extends Partial<PropertyCreateInput> {
  status?: PropertyStatus;
}

export interface PropertyFilterParams {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  status?: PropertyStatus;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  page?: number;
  limit?: number;
}

export interface PropertyListResponse {
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Luxury Property Features
export const LUXURY_FEATURES = [
  'Piscina',
  'Academia',
  'Sauna',
  'Churrasqueira',
  'Jardim',
  'Salão de Festas',
  'Segurança 24h',
  'Portão Eletrônico',
  'Sistema de Segurança',
  'Elevador',
  'Varanda',
  'Vista para o Mar',
  'Vista para Montanha',
  'Ar Condicionado',
  'Aquecimento',
  'Lareira',
  'Closet',
  'Suíte Master',
  'Hidromassagem',
  'Adega',
  'Home Theater',
  'Escritório',
  'Brinquedoteca',
  'Pet Place',
  'Lavanderia',
  'Depósito'
] as const;

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'condo', label: 'Condomínio' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' }
];

export const PROPERTY_STATUSES: { value: PropertyStatus; label: string }[] = [
  { value: 'active', label: 'Ativo' },
  { value: 'pending', label: 'Pendente' },
  { value: 'sold', label: 'Vendido' },
  { value: 'rented', label: 'Alugado' },
  { value: 'deleted', label: 'Excluído' }
];

export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type BrazilianState = typeof BRAZILIAN_STATES[number];
