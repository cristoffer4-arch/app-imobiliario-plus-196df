// Consolidated Type Definitions for App Imobiliario Plus

// ============================================================================
// USER & SUBSCRIPTION TYPES
// ============================================================================

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  subscription_plan: SubscriptionPlan;
  subscription_start_date?: string;
  subscription_end_date?: string;
  xp: number;
  level: number;
  ai_requests_used: number;
  ai_requests_limit: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PROPERTY TYPES
// ============================================================================

export type PropertyType = 'apartment' | 'house' | 'condo' | 'land' | 'commercial';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'deleted';

export interface Property {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  property_type: PropertyType;
  address?: string;
  city?: string;
  district?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: Record<string, any>;
  images?: string[];
  virtual_tour_url?: string;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface PropertyCreateInput {
  title: string;
  description?: string;
  property_type: PropertyType;
  address?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: Record<string, any>;
  images?: string[];
  virtual_tour_url?: string;
  status?: PropertyStatus;
}

export interface PropertyUpdateInput extends Partial<PropertyCreateInput> {}

export interface PropertyFilterParams {
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  city?: string;
  status?: PropertyStatus;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_area?: number;
  max_area?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// LEAD TYPES
// ============================================================================

export type LeadStatus = 'new' | 'contacted' | 'meeting_scheduled' | 'proposal_sent' | 'converted' | 'lost';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';
export type LeadSource = 'idealista' | 'imovirtual' | 'olx' | 'website' | 'referral' | 'other';

export interface Lead {
  id: string;
  user_id: string;
  property_id?: string;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: LeadSource;
  ai_score?: number;
  ai_analysis?: Record<string, any>;
  status: LeadStatus;
  priority: LeadPriority;
  created_at: string;
  updated_at: string;
  last_contacted_at?: string;
}

export interface LeadCreateInput {
  property_id?: string;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: LeadSource;
  status?: LeadStatus;
  priority?: LeadPriority;
}

export interface LeadUpdateInput extends Partial<LeadCreateInput> {
  ai_score?: number;
  ai_analysis?: Record<string, any>;
  last_contacted_at?: string;
}

export interface LeadFilterParams {
  status?: LeadStatus;
  priority?: LeadPriority;
  source?: LeadSource;
  property_id?: string;
  min_score?: number;
  max_score?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// GAMIFICATION TYPES
// ============================================================================

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeType = 
  | 'first_property'
  | '10_properties'
  | '50_properties'
  | '100_properties'
  | 'first_lead'
  | '10_leads'
  | '50_leads'
  | '100_leads'
  | 'first_sale'
  | '10_sales'
  | 'level_5'
  | 'level_10'
  | 'level_25'
  | 'level_50';

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  criteria: Record<string, any>;
  rarity: BadgeRarity;
  xp_reward: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  badge?: Badge;
}

export interface GamificationStats {
  xp: number;
  level: number;
  next_level_xp: number;
  progress_to_next_level: number;
  total_properties: number;
  total_leads: number;
  badges: UserBadge[];
  recent_activities: ActivityFeedItem[];
}

export interface ActivityFeedItem {
  id: string;
  user_id: string;
  activity_type: 'sale' | 'badge_unlock' | 'level_up' | 'goal_completed' | 'property_created' | 'lead_created';
  description: string;
  xp: number;
  is_public: boolean;
  created_at: string;
}

// ============================================================================
// OAUTH & GEMINI TYPES
// ============================================================================

export interface UserOAuthToken {
  id: string;
  user_id: string;
  provider: string;
  access_token_encrypted: string;
  refresh_token_encrypted?: string;
  expires_at: string;
  scopes?: string[];
  created_at: string;
  updated_at: string;
}

export interface GeminiGenerateRequest {
  prompt: string;
  context?: Record<string, any>;
  max_tokens?: number;
}

export interface GeminiGenerateResponse {
  text: string;
  tokens_used?: number;
  model?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}
