-- Phase 4: Subscription & Payment Schema
-- This migration adds tables for managing user subscriptions with Stripe

-- Subscription tiers enum
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');

-- Subscription status enum
CREATE TYPE subscription_status AS ENUM (
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unpaid',
  'incomplete',
  'incomplete_expired',
  'paused'
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stripe data
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,

  -- Subscription details
  tier subscription_tier NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',

  -- Billing period
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,

  -- Trial
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT user_subscriptions_user_id_unique UNIQUE (user_id)
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Usage metrics
  qr_codes_generated INTEGER DEFAULT 0,
  qr_codes_created INTEGER DEFAULT 0,
  scans_tracked INTEGER DEFAULT 0,

  -- Period tracking
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT usage_records_user_period_unique UNIQUE (user_id, period_start)
);

-- Payment history table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stripe data
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_invoice_id TEXT,

  -- Payment details
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,

  -- Metadata
  description TEXT,
  receipt_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX idx_usage_records_period ON usage_records(period_start, period_end);
CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_records_updated_at
  BEFORE UPDATE ON usage_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_history_updated_at
  BEFORE UPDATE ON payment_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- User subscriptions policies
CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON user_subscriptions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Usage records policies
CREATE POLICY "Users can view their own usage"
  ON usage_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all usage records"
  ON usage_records FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Payment history policies
CREATE POLICY "Users can view their own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payment history"
  ON payment_history FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Function to initialize free subscription for new users
CREATE OR REPLACE FUNCTION initialize_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Create free tier subscription for new user
  INSERT INTO user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');

  -- Initialize usage record for current month
  INSERT INTO usage_records (
    user_id,
    period_start,
    period_end,
    qr_codes_generated,
    qr_codes_created,
    scans_tracked
  )
  VALUES (
    NEW.id,
    date_trunc('month', now()),
    date_trunc('month', now() + interval '1 month'),
    0,
    0,
    0
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create subscription when user signs up
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_subscription();

-- Function to get current usage limits based on tier
CREATE OR REPLACE FUNCTION get_usage_limits(p_tier subscription_tier)
RETURNS TABLE (
  qr_codes_limit INTEGER,
  scans_limit INTEGER,
  custom_branding BOOLEAN,
  analytics_enabled BOOLEAN,
  api_access BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE p_tier
      WHEN 'free' THEN 10
      WHEN 'pro' THEN 1000
      WHEN 'enterprise' THEN -1 -- unlimited
    END AS qr_codes_limit,
    CASE p_tier
      WHEN 'free' THEN 100
      WHEN 'pro' THEN 100000
      WHEN 'enterprise' THEN -1 -- unlimited
    END AS scans_limit,
    CASE p_tier
      WHEN 'free' THEN false
      WHEN 'pro' THEN true
      WHEN 'enterprise' THEN true
    END AS custom_branding,
    CASE p_tier
      WHEN 'free' THEN false
      WHEN 'pro' THEN true
      WHEN 'enterprise' THEN true
    END AS analytics_enabled,
    CASE p_tier
      WHEN 'free' THEN false
      WHEN 'pro' THEN false
      WHEN 'enterprise' THEN true
    END AS api_access;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has reached limits
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id UUID,
  p_limit_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier subscription_tier;
  v_current_usage INTEGER;
  v_limit INTEGER;
  v_period_start TIMESTAMPTZ;
BEGIN
  -- Get user's current tier
  SELECT tier INTO v_tier
  FROM user_subscriptions
  WHERE user_id = p_user_id AND status = 'active';

  IF NOT FOUND THEN
    v_tier := 'free';
  END IF;

  -- Get current period start
  v_period_start := date_trunc('month', now());

  -- Get current usage
  IF p_limit_type = 'qr_codes' THEN
    SELECT qr_codes_created INTO v_current_usage
    FROM usage_records
    WHERE user_id = p_user_id AND period_start = v_period_start;

    SELECT qr_codes_limit INTO v_limit
    FROM get_usage_limits(v_tier);
  ELSIF p_limit_type = 'scans' THEN
    SELECT scans_tracked INTO v_current_usage
    FROM usage_records
    WHERE user_id = p_user_id AND period_start = v_period_start;

    SELECT scans_limit INTO v_limit
    FROM get_usage_limits(v_tier);
  ELSE
    RETURN false;
  END IF;

  -- -1 means unlimited
  IF v_limit = -1 THEN
    RETURN true;
  END IF;

  -- Check if under limit
  RETURN COALESCE(v_current_usage, 0) < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage counters
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_usage_type TEXT
)
RETURNS VOID AS $$
DECLARE
  v_period_start TIMESTAMPTZ;
  v_period_end TIMESTAMPTZ;
BEGIN
  -- Get current month period
  v_period_start := date_trunc('month', now());
  v_period_end := date_trunc('month', now() + interval '1 month');

  -- Insert or update usage record
  IF p_usage_type = 'qr_codes_created' THEN
    INSERT INTO usage_records (user_id, period_start, period_end, qr_codes_created)
    VALUES (p_user_id, v_period_start, v_period_end, 1)
    ON CONFLICT (user_id, period_start)
    DO UPDATE SET qr_codes_created = usage_records.qr_codes_created + 1;
  ELSIF p_usage_type = 'qr_codes_generated' THEN
    INSERT INTO usage_records (user_id, period_start, period_end, qr_codes_generated)
    VALUES (p_user_id, v_period_start, v_period_end, 1)
    ON CONFLICT (user_id, period_start)
    DO UPDATE SET qr_codes_generated = usage_records.qr_codes_generated + 1;
  ELSIF p_usage_type = 'scans_tracked' THEN
    INSERT INTO usage_records (user_id, period_start, period_end, scans_tracked)
    VALUES (p_user_id, v_period_start, v_period_end, 1)
    ON CONFLICT (user_id, period_start)
    DO UPDATE SET scans_tracked = usage_records.scans_tracked + 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE user_subscriptions IS 'Stores user subscription information linked to Stripe';
COMMENT ON TABLE usage_records IS 'Tracks monthly usage metrics per user';
COMMENT ON TABLE payment_history IS 'Records all payment transactions';
