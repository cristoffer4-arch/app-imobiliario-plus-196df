-- Migration: Add subscription and billing tables
-- Based on PRICING-GUIDE.md specifications

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stripe_price_id TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  limits JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Subscription usage tracking
CREATE TABLE IF NOT EXISTS subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- Format: YYYY-MM
  saved_properties INTEGER NOT NULL DEFAULT 0,
  comparisons INTEGER NOT NULL DEFAULT 0,
  ai_requests INTEGER NOT NULL DEFAULT 0,
  saved_areas INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Payment history
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (id, name, price, features, limits) VALUES
('free', 'Free', 0.00, 
  '["Pesquisa básica de propriedades", "Visualização de mapas", "Até 5 propriedades salvas", "Suporte por email"]'::jsonb,
  '{"savedProperties": 5, "comparisons": 0, "aiRequests": 0, "savedAreas": 0}'::jsonb),
('starter', 'Starter', 29.00,
  '["Até 2 comparações de imóveis", "Até 50 propriedades salvas", "10 consultas IA/dia", "Alertas por email", "Mapas interativos básicos", "Análise de ROI básica", "Suporte prioritário"]'::jsonb,
  '{"savedProperties": 50, "comparisons": 2, "aiRequests": 10, "savedAreas": 2}'::jsonb),
('pro', 'Pro', 79.00,
  '["Até 4 comparações de imóveis", "Propriedades ilimitadas", "50 consultas IA/dia", "Alertas em tempo real", "Mapas avançados com heatmap", "Análise completa de ROI", "Dashboard de investimentos", "Exportação de dados", "Suporte prioritário 24/7"]'::jsonb,
  '{"savedProperties": -1, "comparisons": 4, "aiRequests": 50, "savedAreas": 10}'::jsonb),
('premium', 'Premium', 149.00,
  '["Comparações ilimitadas", "Consultas IA ilimitadas", "API access completo", "Relatórios personalizados", "Análise preditiva de mercado", "Integração CRM", "Múltiplos usuários (até 5)", "Suporte dedicado 24/7", "Consultoria mensal"]'::jsonb,
  '{"savedProperties": -1, "comparisons": -1, "aiRequests": -1, "savedAreas": -1}'::jsonb),
('enterprise', 'Enterprise', 497.00,
  '["Tudo do Premium", "White-label", "Usuários ilimitados", "SLA garantido", "Infraestrutura dedicada", "Gerente de conta dedicado", "Treinamento personalizado", "Customização sob demanda"]'::jsonb,
  '{"savedProperties": -1, "comparisons": -1, "aiRequests": -1, "savedAreas": -1}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = NOW();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_user_month ON subscription_usage(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);

-- Enable Row Level Security
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Public can view subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for subscription_usage
CREATE POLICY "Users can view their own usage"
  ON subscription_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON subscription_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON subscription_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for payment_history
CREATE POLICY "Users can view their own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION check_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_subscriptions
    WHERE user_id = user_uuid
    AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current plan limits
CREATE OR REPLACE FUNCTION get_user_plan_limits(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  plan_limits JSONB;
BEGIN
  SELECT sp.limits INTO plan_limits
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_uuid
  AND us.status = 'active'
  AND (us.current_period_end IS NULL OR us.current_period_end > NOW());
  
  -- Return free plan limits if no active subscription
  IF plan_limits IS NULL THEN
    SELECT limits INTO plan_limits
    FROM subscription_plans
    WHERE id = 'free';
  END IF;
  
  RETURN plan_limits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage counter
CREATE OR REPLACE FUNCTION increment_usage(
  user_uuid UUID,
  counter_name TEXT,
  increment_by INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  current_month TEXT;
  current_usage INTEGER;
  limit_value INTEGER;
  plan_limits JSONB;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  -- Get plan limits
  plan_limits := get_user_plan_limits(user_uuid);
  limit_value := (plan_limits->>counter_name)::INTEGER;
  
  -- -1 means unlimited
  IF limit_value = -1 THEN
    -- Insert or update usage without checking limit
    INSERT INTO subscription_usage (user_id, month_year)
    VALUES (user_uuid, current_month)
    ON CONFLICT (user_id, month_year) DO NOTHING;
    
    EXECUTE format(
      'UPDATE subscription_usage SET %I = %I + $1 WHERE user_id = $2 AND month_year = $3',
      counter_name, counter_name
    ) USING increment_by, user_uuid, current_month;
    
    RETURN TRUE;
  END IF;
  
  -- Get current usage
  EXECUTE format(
    'SELECT COALESCE(%I, 0) FROM subscription_usage WHERE user_id = $1 AND month_year = $2',
    counter_name
  ) INTO current_usage USING user_uuid, current_month;
  
  -- Check if limit exceeded
  IF current_usage + increment_by > limit_value THEN
    RETURN FALSE;
  END IF;
  
  -- Insert or update usage
  INSERT INTO subscription_usage (user_id, month_year)
  VALUES (user_uuid, current_month)
  ON CONFLICT (user_id, month_year) DO NOTHING;
  
  EXECUTE format(
    'UPDATE subscription_usage SET %I = %I + $1 WHERE user_id = $2 AND month_year = $3',
    counter_name, counter_name
  ) USING increment_by, user_uuid, current_month;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
