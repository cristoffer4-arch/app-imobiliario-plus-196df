-- ============================================================================
-- lux.ai PRO - SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Portuguese Luxury Real Estate Platform
-- Complete Schema with RLS (Row Level Security)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    company TEXT,
    role TEXT DEFAULT 'consultant',
    
    -- Subscription
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date TIMESTAMPTZ,
    stripe_customer_id TEXT,
    
    -- Gamification
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_sales INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    
    -- AI Usage
    ai_requests_used INTEGER DEFAULT 0,
    ai_requests_limit INTEGER DEFAULT 50,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================================
-- PROPERTIES TABLE (Casafari Integration)
-- ============================================================================
CREATE TABLE properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Property Details
    casafari_id TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT NOT NULL,
    
    -- Location
    address TEXT,
    city TEXT,
    district TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Portugal',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Specifications
    price DECIMAL(12,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    gross_area DECIMAL(10,2),
    net_area DECIMAL(10,2),
    land_area DECIMAL(10,2),
    
    -- Features
    features JSONB DEFAULT '[]',
    amenities JSONB DEFAULT '[]',
    
    -- Media
    images JSONB DEFAULT '[]',
    main_image TEXT,
    virtual_tour_url TEXT,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'rented', 'inactive')),
    portal_urls JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own properties"
    ON properties FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties"
    ON properties FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties"
    ON properties FOR UPDATE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_casafari_id ON properties(casafari_id);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_city ON properties(city);

-- ============================================================================
-- LEADS TABLE (AI Scoring)
-- ============================================================================
CREATE TABLE leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    
    -- Contact Info
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Lead Source
    source TEXT,
    source_url TEXT,
    
    -- AI Analysis
    ai_score INTEGER DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_analysis TEXT,
    ai_recommended_actions JSONB DEFAULT '[]',
    
    -- Status
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'converted', 'lost')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Engagement
    last_contact_date TIMESTAMPTZ,
    next_followup_date TIMESTAMPTZ,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own leads"
    ON leads FOR ALL
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_ai_score ON leads(ai_score DESC);
CREATE INDEX idx_leads_status ON leads(status);

-- ============================================================================
-- COMMISSIONS TABLE
-- ============================================================================
CREATE TABLE commissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    
    -- Commission Details
    property_address TEXT,
    sale_price DECIMAL(12,2) NOT NULL,
    commission_percentage DECIMAL(5,2) DEFAULT 3.00,
    amount DECIMAL(10,2) NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
    paid_date TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own commissions"
    ON commissions FOR SELECT
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_commissions_user_id ON commissions(user_id);
CREATE INDEX idx_commissions_status ON commissions(status);

-- ============================================================================
-- GOALS TABLE (SMART Goals)
-- ============================================================================
CREATE TABLE goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Goal Details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    metric TEXT NOT NULL,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    
    -- Timeline
    start_date TIMESTAMPTZ DEFAULT NOW(),
    deadline TIMESTAMPTZ NOT NULL,
    
    -- Progress
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'cancelled')),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own goals"
    ON goals FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================================
-- TASKS TABLE (AI-Generated Daily Tasks)
-- ============================================================================
CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    
    -- Task Details
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    
    -- Timeline
    due_date TIMESTAMPTZ,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    
    -- AI Generated
    ai_generated BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own tasks"
    ON tasks FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================================
-- BADGES TABLE
-- ============================================================================
CREATE TABLE badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    criteria JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default badges
INSERT INTO badges (id, name, description, icon, rarity) VALUES
    ('first_sale', 'Primeira Venda', 'Complete sua primeira venda', '🏆', 'common'),
    ('specialist', 'Especialista', 'Alcance nível 5', '⭐', 'rare'),
    ('diamond_agent', 'Agente Diamante', 'Alcance nível 10', '💎', 'legendary'),
    ('thousand_xp', '1000 XP', 'Acumule 1000 XP', '🎯', 'common'),
    ('ten_thousand_xp', '10.000 XP', 'Acumule 10.000 XP', '🚀', 'epic'),
    ('luxury_master', 'Master Luxo', 'Venda 10 imóveis de luxo', '👑', 'legendary'),
    ('speed_demon', 'Velocidade', 'Complete 5 vendas em um mês', '⚡', 'rare'),
    ('top_monthly', 'Top do Mês', 'Seja #1 no ranking mensal', '🥇', 'epic');

-- ============================================================================
-- USER_BADGES TABLE (Many-to-Many)
-- ============================================================================
CREATE TABLE user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id TEXT REFERENCES badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own badges"
    ON user_badges FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- ACTIVITY_FEED TABLE (Social Gamification)
-- ============================================================================
CREATE TABLE activity_feed (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Activity Details
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    
    -- Related Entities
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    badge_id TEXT REFERENCES badges(id) ON DELETE SET NULL,
    
    -- Visibility
    is_public BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view public feed"
    ON activity_feed FOR SELECT
    USING (is_public = TRUE);

CREATE POLICY "Users can insert own activities"
    ON activity_feed FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);

-- ============================================================================
-- CHAMPIONSHIPS TABLE
-- ============================================================================
CREATE TABLE championships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    
    -- Timeline
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    
    -- Rules
    criteria JSONB,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed')),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CHAMPIONSHIP_RANKINGS TABLE
-- ============================================================================
CREATE TABLE championship_rankings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    championship_id UUID REFERENCES championships(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Ranking
    rank INTEGER,
    score DECIMAL(10,2),
    
    -- Metadata
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(championship_id, user_id)
);

-- Enable RLS
ALTER TABLE championship_rankings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view championship rankings"
    ON championship_rankings FOR SELECT
    USING (TRUE);

-- ============================================================================
-- DOCUMENTS TABLE (Scanner Integration)
-- ============================================================================
CREATE TABLE documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    
    -- Document Details
    title TEXT NOT NULL,
    document_type TEXT,
    file_url TEXT,
    
    -- OCR Results
    extracted_text TEXT,
    extracted_data JSONB,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own documents"
    ON documents FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE (
    total_properties BIGINT,
    total_leads BIGINT,
    total_commission DECIMAL,
    xp INTEGER,
    level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM properties WHERE properties.user_id = get_user_stats.user_id),
        (SELECT COUNT(*) FROM leads WHERE leads.user_id = get_user_stats.user_id),
        (SELECT COALESCE(SUM(amount), 0) FROM commissions WHERE commissions.user_id = get_user_stats.user_id AND status = 'pending'),
        (SELECT profiles.xp FROM profiles WHERE profiles.id = get_user_stats.user_id),
        (SELECT profiles.level FROM profiles WHERE profiles.id = get_user_stats.user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update profile timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- REALTIME SUBSCRIPTIONS (Enable for all tables)
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE championship_rankings;
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
