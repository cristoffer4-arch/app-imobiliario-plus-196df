// Property types for Imobiliário GO
// Real estate property management system

export interface Property {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  property_type: 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
  price: number;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null; // in square meters
  images: string[] | null;
  status: 'available' | 'sold' | 'rented' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyInput {
  title: string;
  description?: string;
  property_type: Property['property_type'];
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  status?: Property['status'];
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {}

export interface PropertyFilters {
  property_type?: Property['property_type'];
  status?: Property['status'];
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  location?: string;
  user_id?: string;
}

export interface PropertyResponse {
  data: Property | Property[];
  error?: string;
  count?: number;
}
