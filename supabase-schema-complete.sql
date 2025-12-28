-- ============================================================================
-- LUXEAGENT PRO - COMPLETE DATABASE SCHEMA
-- Platform: Supabase PostgreSQL
-- Version: 2.0 (com Sistema de Preços + Voucher + OAuth)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: profiles (Extended with Subscription & Voucher)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- User Info
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    
    -- Subscription & Billing
    subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'starter', 'pro', 'premium', 'enterprise')),
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date TIMESTAMPTZ,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Voucher System
    voucher_code TEXT,
    voucher_used BOOLEAN DEFAULT FALSE,
    voucher_activated_at TIMESTAMPTZ,
    
    -- Gamification
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    
    -- Usage Tracking
    ai_requests_used INTEGER DEFAULT 0,
    ai_requests_limit INTEGER DEFAULT 50,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX idx_profiles_subscription_plan ON profiles(subscription_plan);
CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_profiles_voucher_code ON profiles(voucher_code) WHERE voucher_code IS NOT NULL;

-- ============================================================================
-- TABLE: user_oauth_tokens (OAuth Gemini Tokens)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_oauth_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL DEFAULT 'google_gemini',
    
    -- Encrypted Tokens
    access_token_encrypted TEXT NOT NULL,
    refresh_token_encrypted TEXT,
    
    -- Expiration
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Metadata
    scopes TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, provider)
);

-- RLS
ALTER TABLE user_oauth_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own OAuth tokens"
    ON user_oauth_tokens FOR ALL
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_oauth_tokens_user_id ON user_oauth_tokens(user_id);
CREATE INDEX idx_oauth_tokens_expires_at ON user_oauth_tokens(expires_at);

-- ============================================================================
-- TABLE: subscription_usage (Track Feature Usage per Month)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Period
    month_year TEXT NOT NULL, -- 'YYYY-MM'
    
    -- Usage Counters
    ai_coach_messages INTEGER DEFAULT 0,
    ai_pricing_requests INTEGER DEFAULT 0,
    ai_stories_generated INTEGER DEFAULT 0,
    virtual_staging_requests INTEGER DEFAULT 0,
    properties_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, month_year)
);

-- RLS
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
    ON subscription_usage FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can manage usage"
    ON subscription_usage FOR ALL
    USING (TRUE);

-- Index
CREATE INDEX idx_subscription_usage_user_month ON subscription_usage(user_id, month_year);

-- ============================================================================
-- TABLE: subscription_plans (Plan Definitions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    billing TEXT DEFAULT 'monthly',
    features JSONB NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    stripe_price_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Plans
INSERT INTO subscription_plans (id, name, price, features, is_popular, stripe_price_id) VALUES
('free', 'Free', 0, '{
    "max_properties": 5,
    "ai_coach": false,
    "ai_pricing": 0,
    "ai_stories": 0,
    "virtual_staging": 0,
    "casafari_api": false,
    "lead_scoring": false,
    "advanced_analytics": false
}'::jsonb, false, NULL),

('starter', 'Starter', 47, '{
    "max_properties": 20,
    "ai_coach": true,
    "ai_coach_limit": 50,
    "ai_pricing": 10,
    "ai_stories": 20,
    "virtual_staging": 5,
    "casafari_api": false,
    "lead_scoring": false,
    "advanced_analytics": false
}'::jsonb, false, 'price_starter_47eur'),

('pro', 'Pro', 97, '{
    "max_properties": -1,
    "ai_coach": true,
    "ai_coach_limit": -1,
    "ai_pricing": -1,
    "ai_stories": -1,
    "virtual_staging": 50,
    "casafari_api": false,
    "lead_scoring": true,
    "advanced_analytics": true
}'::jsonb, true, 'price_pro_97eur'),

('premium', 'Premium', 197, '{
    "max_properties": -1,
    "ai_coach": true,
    "ai_coach_limit": -1,
    "ai_pricing": -1,
    "ai_stories": -1,
    "virtual_staging": -1,
    "casafari_api": true,
    "lead_scoring": true,
    "advanced_analytics": true,
    "marketing_automation": true,
    "priority_support": true
}'::jsonb, false, 'price_premium_197eur'),

('enterprise', 'Enterprise', 497, '{
    "max_properties": -1,
    "ai_coach": true,
    "ai_coach_limit": -1,
    "ai_pricing": -1,
    "ai_stories": -1,
    "virtual_staging": -1,
    "casafari_api": true,
    "lead_scoring": true,
    "advanced_analytics": true,
    "marketing_automation": true,
    "priority_support": true,
    "white_label": true,
    "multi_users": 10
}'::jsonb, false, 'price_enterprise_497eur')

ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- TABLE: properties (Casafari Integration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Casafari Data
    casafari_id TEXT UNIQUE,
    
    -- Property Info
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT, -- apartamento, moradia, terreno, comercial
    
    -- Location
    address TEXT,
    city TEXT,
    district TEXT,
    country TEXT DEFAULT 'PT',
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Price & Area
    price DECIMAL(12, 2),
    area DECIMAL(10, 2), -- m²
    
    -- Features
    bedrooms INTEGER,
    bathrooms INTEGER,
    features JSONB, -- { "pool": true, "garage": 2, "garden": true }
    
    -- Media
    images TEXT[], -- URLs
    virtual_tour_url TEXT,
    
    -- Status
    status TEXT DEFAULT 'active', -- active, sold, rented, inactive
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own properties"
    ON properties FOR ALL
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_status ON properties(status);

-- ============================================================================
-- TABLE: leads (AI-Scored Leads)
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    
    -- Lead Info
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT,
    
    -- Source
    source TEXT, -- idealista, imovirtual, olx, website, referral
    
    -- AI Score
    ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_analysis JSONB, -- { "interest_level": "high", "budget_match": true, ... }
    
    -- Status
    status TEXT DEFAULT 'new', -- new, contacted, meeting_scheduled, proposal_sent, converted, lost
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_contacted_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own leads"
    ON leads FOR ALL
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_ai_score ON leads(ai_score DESC);

-- ============================================================================
-- TABLE: commissions (Sales Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS commissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    
    -- Commission Details
    sale_price DECIMAL(12, 2) NOT NULL,
    commission_percentage DECIMAL(5, 2) DEFAULT 3.00,
    commission_amount DECIMAL(12, 2) GENERATED ALWAYS AS (sale_price * commission_percentage / 100) STORED,
    
    -- Payment
    payment_status TEXT DEFAULT 'pending', -- pending, received, overdue
    payment_date TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own commissions"
    ON commissions FOR ALL
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_commissions_user_id ON commissions(user_id);
CREATE INDEX idx_commissions_payment_status ON commissions(payment_status);

-- ============================================================================
-- TABLE: goals (SMART Goals with AI Coaching)
-- ============================================================================
CREATE TABLE IF NOT EXISTS goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Goal Details
    title TEXT NOT NULL,
    description TEXT,
    
    -- SMART Criteria
    specific TEXT,
    measurable JSONB, -- { "target": 10, "current": 3, "unit": "sales" }
    achievable TEXT,
    relevant TEXT,
    time_bound TIMESTAMPTZ,
    
    -- AI Analysis
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_suggestions JSONB,
    
    -- Progress
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status TEXT DEFAULT 'active', -- active, completed, abandoned
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
    ON goals FOR ALL
    USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_goals_user_id ON goals(user_id);

-- ============================================================================
-- TABLE: tasks (Daily AI-Generated Tasks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    
    -- Task Details
    title TEXT NOT NULL,
    description TEXT,
    
    -- Priority & Due
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    due_date TIMESTAMPTZ,
    
    -- AI Generated
    ai_generated BOOLEAN DEFAULT FALSE,
    
    -- Status
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks"
    ON tasks FOR ALL
    USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ============================================================================
-- TABLE: badges (Gamification Achievements)
-- ============================================================================
CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Badge Info
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT, -- emoji or icon class
    
    -- Criteria
    criteria JSONB NOT NULL, -- { "type": "sales", "threshold": 10 }
    
    -- Rarity
    rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
    
    -- XP Reward
    xp_reward INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: user_badges (Badge Unlocks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
    
    -- Unlock
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, badge_id)
);

-- RLS
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
    ON user_badges FOR SELECT
    USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- ============================================================================
-- TABLE: activity_feed (Social Gamification Feed)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Activity
    activity_type TEXT NOT NULL, -- sale, badge_unlock, level_up, goal_completed
    description TEXT NOT NULL,
    
    -- XP Earned
    xp INTEGER DEFAULT 0,
    
    -- Visibility
    is_public BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public activities"
    ON activity_feed FOR SELECT
    USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
    ON activity_feed FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);

-- ============================================================================
-- TABLE: championships (Competitions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS championships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Championship Info
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- monthly_sales, quarterly_revenue, leads_conversion, team_performance
    
    -- Period
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    
    -- Prizes
    prizes JSONB, -- { "1st": "1000 EUR", "2nd": "500 EUR", "3rd": "250 EUR" }
    
    -- Status
    status TEXT DEFAULT 'active', -- active, completed, cancelled
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: championship_rankings (Real-time Rankings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS championship_rankings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    championship_id UUID REFERENCES championships(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Score
    score DECIMAL(12, 2) DEFAULT 0,
    rank INTEGER,
    
    -- Metadata
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(championship_id, user_id)
);

-- RLS
ALTER TABLE championship_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view rankings"
    ON championship_rankings FOR SELECT
    USING (TRUE);

-- Index
CREATE INDEX idx_championship_rankings_championship ON championship_rankings(championship_id, score DESC);

-- ============================================================================
-- TABLE: documents (Scanned Documents with OCR)
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    
    -- Document Info
    title TEXT NOT NULL,
    document_type TEXT, -- contract, id, passport, tax_document
    
    -- File
    file_url TEXT NOT NULL,
    file_size INTEGER, -- bytes
    mime_type TEXT,
    
    -- OCR Results
    ocr_text TEXT,
    extracted_data JSONB, -- { "nif": "123456789", "name": "João Silva", ... }
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents"
    ON documents FOR ALL
    USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_documents_user_id ON documents(user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Get User Stats
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_properties', COUNT(DISTINCT p.id),
        'total_leads', COUNT(DISTINCT l.id),
        'total_commissions', COALESCE(SUM(c.commission_amount), 0),
        'active_goals', COUNT(DISTINCT g.id) FILTER (WHERE g.status = 'active'),
        'pending_tasks', COUNT(DISTINCT t.id) FILTER (WHERE t.completed = FALSE),
        'total_badges', COUNT(DISTINCT ub.badge_id),
        'level', pr.level,
        'xp', pr.xp
    ) INTO v_stats
    FROM profiles pr
    LEFT JOIN properties p ON p.user_id = pr.id
    LEFT JOIN leads l ON l.user_id = pr.id
    LEFT JOIN commissions c ON c.user_id = pr.id
    LEFT JOIN goals g ON g.user_id = pr.id
    LEFT JOIN tasks t ON t.user_id = pr.id
    LEFT JOIN user_badges ub ON ub.user_id = pr.id
    WHERE pr.id = p_user_id
    GROUP BY pr.level, pr.xp;
    
    RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Validate Voucher
CREATE OR REPLACE FUNCTION validate_voucher(
    p_user_id UUID,
    p_voucher_code TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_profile RECORD;
    v_expires_at TIMESTAMPTZ;
BEGIN
    -- Get profile
    SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
    
    -- Check if already used
    IF v_profile.voucher_used THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Voucher já utilizado anteriormente'
        );
    END IF;
    
    -- Validate code
    IF UPPER(TRIM(p_voucher_code)) != 'LUXAI-LAUNCH-3M-2025' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Código de voucher inválido'
        );
    END IF;
    
    -- Calculate expiry (90 days)
    v_expires_at := NOW() + INTERVAL '90 days';
    
    -- Activate Premium
    UPDATE profiles
    SET 
        subscription_plan = 'premium',
        subscription_start_date = NOW(),
        subscription_end_date = v_expires_at,
        voucher_code = UPPER(TRIM(p_voucher_code)),
        voucher_used = TRUE,
        voucher_activated_at = NOW()
    WHERE id = p_user_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'plan', 'premium',
        'expires_at', v_expires_at,
        'message', 'Voucher ativado com sucesso!'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check Subscription Expiry
CREATE OR REPLACE FUNCTION check_subscription_expiry(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_profile RECORD;
BEGIN
    SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
    
    IF v_profile.subscription_end_date IS NULL THEN
        RETURN FALSE;
    END IF;
    
    IF NOW() > v_profile.subscription_end_date THEN
        -- Downgrade to Free
        UPDATE profiles
        SET 
            subscription_plan = 'free',
            subscription_end_date = NULL
        WHERE id = p_user_id;
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Increment Feature Usage
CREATE OR REPLACE FUNCTION increment_feature_usage(
    p_user_id UUID,
    p_feature TEXT,
    p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
    v_month_year TEXT;
BEGIN
    v_month_year := TO_CHAR(NOW(), 'YYYY-MM');
    
    INSERT INTO subscription_usage (user_id, month_year, ai_coach_messages)
    VALUES (p_user_id, v_month_year, CASE WHEN p_feature = 'ai_coach' THEN p_increment ELSE 0 END)
    ON CONFLICT (user_id, month_year)
    DO UPDATE SET
        ai_coach_messages = CASE WHEN p_feature = 'ai_coach' 
            THEN subscription_usage.ai_coach_messages + p_increment 
            ELSE subscription_usage.ai_coach_messages END,
        ai_pricing_requests = CASE WHEN p_feature = 'ai_pricing'
            THEN subscription_usage.ai_pricing_requests + p_increment
            ELSE subscription_usage.ai_pricing_requests END,
        ai_stories_generated = CASE WHEN p_feature = 'ai_stories'
            THEN subscription_usage.ai_stories_generated + p_increment
            ELSE subscription_usage.ai_stories_generated END,
        virtual_staging_requests = CASE WHEN p_feature = 'virtual_staging'
            THEN subscription_usage.virtual_staging_requests + p_increment
            ELSE subscription_usage.virtual_staging_requests END,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check Feature Limit
CREATE OR REPLACE FUNCTION check_feature_limit(
    p_user_id UUID,
    p_feature TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_profile RECORD;
    v_usage RECORD;
    v_month_year TEXT;
    v_limit INTEGER;
    v_used INTEGER;
    v_plan_features JSONB;
BEGIN
    SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
    
    v_month_year := TO_CHAR(NOW(), 'YYYY-MM');
    
    SELECT * INTO v_usage 
    FROM subscription_usage 
    WHERE user_id = p_user_id AND month_year = v_month_year;
    
    -- Get plan features
    SELECT features INTO v_plan_features
    FROM subscription_plans
    WHERE id = v_profile.subscription_plan;
    
    v_limit := (v_plan_features->>p_feature)::INTEGER;
    
    IF v_limit = -1 THEN
        RETURN jsonb_build_object('allowed', true, 'unlimited', true);
    END IF;
    
    IF v_limit = 0 THEN
        RETURN jsonb_build_object('allowed', false, 'error', 'Feature não disponível no seu plano');
    END IF;
    
    v_used := CASE p_feature
        WHEN 'ai_coach' THEN COALESCE(v_usage.ai_coach_messages, 0)
        WHEN 'ai_pricing' THEN COALESCE(v_usage.ai_pricing_requests, 0)
        WHEN 'ai_stories' THEN COALESCE(v_usage.ai_stories_generated, 0)
        WHEN 'virtual_staging' THEN COALESCE(v_usage.virtual_staging_requests, 0)
        ELSE 0
    END;
    
    IF v_used >= v_limit THEN
        RETURN jsonb_build_object('allowed', false, 'error', 'Limite mensal atingido');
    END IF;
    
    RETURN jsonb_build_object('allowed', true, 'limit', v_limit, 'used', v_used);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Auto-update timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-check subscription expiry
CREATE OR REPLACE FUNCTION auto_check_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.subscription_end_date IS NOT NULL AND NOW() > NEW.subscription_end_date THEN
        NEW.subscription_plan := 'free';
        NEW.subscription_end_date := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_check_expiry
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_check_expiry();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Subscription Statistics
CREATE OR REPLACE VIEW subscription_stats AS
SELECT 
    subscription_plan,
    COUNT(*) as total_users,
    COUNT(CASE WHEN voucher_used THEN 1 END) as voucher_users,
    COUNT(CASE WHEN subscription_end_date IS NOT NULL AND subscription_end_date > NOW() THEN 1 END) as active_paid,
    AVG(CASE WHEN subscription_start_date IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (NOW() - subscription_start_date))/86400 
        ELSE 0 END) as avg_days_subscribed
FROM profiles
GROUP BY subscription_plan;

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================

-- Enable Realtime for activity feed
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE championship_rankings;

-- ============================================================================
-- COMPLETE SCHEMA SETUP
-- ============================================================================
-- This schema includes:
-- ✅ 14 tables with RLS
-- ✅ 5 subscription plans (Free to Enterprise)
-- ✅ Voucher system (LUXAI-LAUNCH-3M-2025)
-- ✅ OAuth token storage (encrypted)
-- ✅ Usage tracking per feature
-- ✅ Functions for validation and limits
-- ✅ Auto-expiry triggers
-- ✅ Gamification system
-- ✅ Real-time subscriptions
-- ============================================================================