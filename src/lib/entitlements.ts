// Plan Entitlements & Feature Gating System
// Defines limits and features for each subscription plan

import { createClient } from '@/lib/supabase/client'

export type PlanType = 'free' | 'starter' | 'pro' | 'premium' | 'enterprise'

export interface PlanLimits {
  // Comparison limits
  max_comparison_properties: number // -1 = unlimited
  can_save_comparison_sets: boolean
  
  // Area notifications limits
  max_saved_areas: number // -1 = unlimited
  in_app_notifications: boolean
  email_notifications: boolean
  push_notifications: boolean
  
  // Favorites
  max_favorites: number // -1 = unlimited
  
  // AI Usage
  max_ai_analyses_per_day: number // -1 = unlimited
  max_ai_analyses_per_month: number // -1 = unlimited
  unlimited_ai_coach: boolean
  
  // Maps & Visualization
  basic_map: boolean
  advanced_map_clusters: boolean
  heatmap: boolean
  draw_areas: boolean
  route_calculation: boolean
  
  // Search & Filters
  basic_filters: boolean
  advanced_filters: boolean
  visible_area_filter: boolean
  
  // Reports & Analytics
  basic_dashboard: boolean
  advanced_dashboard: boolean
  data_export: boolean
  custom_reports: boolean
  
  // Multi-user
  max_users: number
  team_management: boolean
  
  // Support
  support_response_time_hours: number
  priority_support: boolean
  onboarding: boolean
  
  // API & Integrations
  api_access: boolean
  webhooks: boolean
  white_label: boolean
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    // Comparison
    max_comparison_properties: 0,
    can_save_comparison_sets: false,
    
    // Area notifications
    max_saved_areas: 0,
    in_app_notifications: false,
    email_notifications: false,
    push_notifications: false,
    
    // Favorites
    max_favorites: 10,
    
    // AI
    max_ai_analyses_per_day: 1,
    max_ai_analyses_per_month: 30,
    unlimited_ai_coach: false,
    
    // Maps
    basic_map: true,
    advanced_map_clusters: false,
    heatmap: false,
    draw_areas: false,
    route_calculation: false,
    
    // Search
    basic_filters: true,
    advanced_filters: false,
    visible_area_filter: false,
    
    // Reports
    basic_dashboard: true,
    advanced_dashboard: false,
    data_export: false,
    custom_reports: false,
    
    // Multi-user
    max_users: 1,
    team_management: false,
    
    // Support
    support_response_time_hours: 48,
    priority_support: false,
    onboarding: false,
    
    // API
    api_access: false,
    webhooks: false,
    white_label: false
  },
  
  starter: {
    // Comparison
    max_comparison_properties: 2,
    can_save_comparison_sets: false,
    
    // Area notifications
    max_saved_areas: 2,
    in_app_notifications: true,
    email_notifications: false,
    push_notifications: false,
    
    // Favorites
    max_favorites: 50,
    
    // AI
    max_ai_analyses_per_day: -1,
    max_ai_analyses_per_month: 10,
    unlimited_ai_coach: false,
    
    // Maps
    basic_map: true,
    advanced_map_clusters: true,
    heatmap: false,
    draw_areas: false,
    route_calculation: false,
    
    // Search
    basic_filters: true,
    advanced_filters: true,
    visible_area_filter: false,
    
    // Reports
    basic_dashboard: true,
    advanced_dashboard: false,
    data_export: false,
    custom_reports: false,
    
    // Multi-user
    max_users: 1,
    team_management: false,
    
    // Support
    support_response_time_hours: 24,
    priority_support: false,
    onboarding: false,
    
    // API
    api_access: false,
    webhooks: false,
    white_label: false
  },
  
  pro: {
    // Comparison
    max_comparison_properties: 4,
    can_save_comparison_sets: true,
    
    // Area notifications
    max_saved_areas: 10,
    in_app_notifications: true,
    email_notifications: false,
    push_notifications: false,
    
    // Favorites
    max_favorites: -1, // unlimited
    
    // AI
    max_ai_analyses_per_day: -1,
    max_ai_analyses_per_month: 100,
    unlimited_ai_coach: true,
    
    // Maps
    basic_map: true,
    advanced_map_clusters: true,
    heatmap: true,
    draw_areas: true,
    route_calculation: true,
    
    // Search
    basic_filters: true,
    advanced_filters: true,
    visible_area_filter: true,
    
    // Reports
    basic_dashboard: true,
    advanced_dashboard: true,
    data_export: false,
    custom_reports: false,
    
    // Multi-user
    max_users: 1,
    team_management: false,
    
    // Support
    support_response_time_hours: 12,
    priority_support: true,
    onboarding: false,
    
    // API
    api_access: true,
    webhooks: false,
    white_label: false
  },
  
  premium: {
    // Comparison
    max_comparison_properties: -1, // unlimited
    can_save_comparison_sets: true,
    
    // Area notifications
    max_saved_areas: -1, // unlimited
    in_app_notifications: true,
    email_notifications: true,
    push_notifications: true,
    
    // Favorites
    max_favorites: -1,
    
    // AI
    max_ai_analyses_per_day: -1,
    max_ai_analyses_per_month: 500,
    unlimited_ai_coach: true,
    
    // Maps
    basic_map: true,
    advanced_map_clusters: true,
    heatmap: true,
    draw_areas: true,
    route_calculation: true,
    
    // Search
    basic_filters: true,
    advanced_filters: true,
    visible_area_filter: true,
    
    // Reports
    basic_dashboard: true,
    advanced_dashboard: true,
    data_export: true,
    custom_reports: true,
    
    // Multi-user
    max_users: 3,
    team_management: true,
    
    // Support
    support_response_time_hours: 6,
    priority_support: true,
    onboarding: true,
    
    // API
    api_access: true,
    webhooks: true,
    white_label: true
  },
  
  enterprise: {
    // Comparison
    max_comparison_properties: -1,
    can_save_comparison_sets: true,
    
    // Area notifications
    max_saved_areas: -1,
    in_app_notifications: true,
    email_notifications: true,
    push_notifications: true,
    
    // Favorites
    max_favorites: -1,
    
    // AI
    max_ai_analyses_per_day: -1,
    max_ai_analyses_per_month: -1, // truly unlimited
    unlimited_ai_coach: true,
    
    // Maps
    basic_map: true,
    advanced_map_clusters: true,
    heatmap: true,
    draw_areas: true,
    route_calculation: true,
    
    // Search
    basic_filters: true,
    advanced_filters: true,
    visible_area_filter: true,
    
    // Reports
    basic_dashboard: true,
    advanced_dashboard: true,
    data_export: true,
    custom_reports: true,
    
    // Multi-user
    max_users: -1, // unlimited
    team_management: true,
    
    // Support
    support_response_time_hours: 1, // 24/7
    priority_support: true,
    onboarding: true,
    
    // API
    api_access: true,
    webhooks: true,
    white_label: true
  }
}

/**
 * Get user's current plan from Supabase
 */
export async function getUserPlan(): Promise<PlanType> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return 'free'
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_plan')
    .eq('id', user.id)
    .single()
  
  if (!profile || !profile.subscription_plan) {
    return 'free'
  }
  
  return profile.subscription_plan as PlanType
}

/**
 * Get limits for user's current plan
 */
export async function getUserPlanLimits(): Promise<PlanLimits> {
  const plan = await getUserPlan()
  return PLAN_LIMITS[plan]
}

/**
 * Check if user has access to a specific feature
 */
export async function hasFeatureAccess(feature: keyof PlanLimits): Promise<boolean> {
  const limits = await getUserPlanLimits()
  return Boolean(limits[feature])
}

/**
 * Check if user can perform an action based on count limit
 * Returns: { allowed: boolean, current: number, limit: number, upgrade_needed: boolean }
 */
export async function checkLimit(
  limitKey: 'max_comparison_properties' | 'max_saved_areas' | 'max_favorites' | 'max_ai_analyses_per_day' | 'max_ai_analyses_per_month',
  currentCount: number
): Promise<{
  allowed: boolean
  current: number
  limit: number
  upgrade_needed: boolean
  suggested_plan?: PlanType
}> {
  const limits = await getUserPlanLimits()
  const limit = limits[limitKey]
  
  // -1 means unlimited
  if (limit === -1) {
    return {
      allowed: true,
      current: currentCount,
      limit: -1,
      upgrade_needed: false
    }
  }
  
  const allowed = currentCount < limit
  
  // Suggest upgrade plan if limit reached
  let suggested_plan: PlanType | undefined
  if (!allowed) {
    const plan = await getUserPlan()
    if (plan === 'free') suggested_plan = 'starter'
    else if (plan === 'starter') suggested_plan = 'pro'
    else if (plan === 'pro') suggested_plan = 'premium'
    else if (plan === 'premium') suggested_plan = 'enterprise'
  }
  
  return {
    allowed,
    current: currentCount,
    limit,
    upgrade_needed: !allowed,
    suggested_plan
  }
}

/**
 * Get user-friendly upgrade message
 */
export function getUpgradeMessage(feature: string, suggestedPlan?: PlanType): string {
  if (!suggestedPlan) {
    return `A funcionalidade "${feature}" atingiu o limite do seu plano.`
  }
  
  const planNames: Record<PlanType, string> = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
    premium: 'Premium',
    enterprise: 'Enterprise'
  }
  
  return `A funcionalidade "${feature}" atingiu o limite do seu plano. Faça upgrade para ${planNames[suggestedPlan]} para continuar.`
}

/**
 * Check if user's subscription is active (not expired)
 */
export async function isSubscriptionActive(): Promise<boolean> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_end_date')
    .eq('id', user.id)
    .single()
  
  if (!profile || !profile.subscription_end_date) {
    return false
  }
  
  const endDate = new Date(profile.subscription_end_date)
  const now = new Date()
  
  return endDate > now
}
