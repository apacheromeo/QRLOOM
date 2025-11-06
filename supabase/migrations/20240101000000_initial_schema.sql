-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE plan_type AS ENUM ('free', 'pro');
CREATE TYPE qr_format AS ENUM ('png', 'svg', 'pdf');
CREATE TYPE qr_status AS ENUM ('active', 'archived', 'deleted');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    plan plan_type DEFAULT 'free' NOT NULL,
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Plans table
CREATE TABLE public.plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type plan_type NOT NULL UNIQUE,
    price_monthly DECIMAL(10, 2),
    price_yearly DECIMAL(10, 2),
    features JSONB DEFAULT '[]'::jsonb,
    limits JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- QR Codes table
CREATE TABLE public.qrcodes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- QR Data
    data_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    is_dynamic BOOLEAN DEFAULT FALSE,
    redirect_url TEXT,
    
    -- Customization
    format qr_format DEFAULT 'png' NOT NULL,
    foreground_color TEXT DEFAULT '#000000',
    background_color TEXT DEFAULT '#FFFFFF',
    logo_url TEXT,
    
    -- Metadata
    title TEXT,
    description TEXT,
    status qr_status DEFAULT 'active' NOT NULL,
    
    -- Stats
    scan_count INTEGER DEFAULT 0,
    
    -- Storage
    file_path TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_scanned_at TIMESTAMPTZ
);

-- Scans/Analytics table
CREATE TABLE public.scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    qrcode_id UUID REFERENCES public.qrcodes(id) ON DELETE CASCADE NOT NULL,
    
    -- Location data
    country TEXT,
    city TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Device data
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    
    -- Network
    ip_address INET,
    referrer TEXT,
    
    -- Timestamp
    scanned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_price_id TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_qrcodes_user_id ON public.qrcodes(user_id);
CREATE INDEX idx_qrcodes_short_code ON public.qrcodes(short_code);
CREATE INDEX idx_qrcodes_status ON public.qrcodes(status);
CREATE INDEX idx_qrcodes_created_at ON public.qrcodes(created_at DESC);
CREATE INDEX idx_scans_qrcode_id ON public.scans(qrcode_id);
CREATE INDEX idx_scans_scanned_at ON public.scans(scanned_at DESC);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON public.plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qrcodes_updated_at
    BEFORE UPDATE ON public.qrcodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qrcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- QR Codes policies
CREATE POLICY "Users can view their own QR codes"
    ON public.qrcodes FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create QR codes"
    ON public.qrcodes FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own QR codes"
    ON public.qrcodes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own QR codes"
    ON public.qrcodes FOR DELETE
    USING (auth.uid() = user_id);

-- Scans policies
CREATE POLICY "Anyone can insert scans"
    ON public.scans FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view scans for their QR codes"
    ON public.scans FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.qrcodes
            WHERE qrcodes.id = scans.qrcode_id
            AND qrcodes.user_id = auth.uid()
        )
    );

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Plans are publicly readable
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are publicly readable"
    ON public.plans FOR SELECT
    TO authenticated, anon
    USING (is_active = TRUE);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to increment scan count
CREATE OR REPLACE FUNCTION public.increment_scan_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.qrcodes
    SET 
        scan_count = scan_count + 1,
        last_scanned_at = NEW.scanned_at
    WHERE id = NEW.qrcode_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment scan count
CREATE TRIGGER on_scan_created
    AFTER INSERT ON public.scans
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_scan_count();

-- Insert default plans
INSERT INTO public.plans (name, type, price_monthly, price_yearly, features, limits) VALUES
    (
        'Free',
        'free',
        0.00,
        0.00,
        '["Basic QR generation", "PNG/SVG export", "Save up to 10 QR codes", "Basic analytics", "Ads supported"]'::jsonb,
        '{"max_qr_codes": 10, "max_scans_per_month": 1000, "dynamic_qr": false}'::jsonb
    ),
    (
        'Pro',
        'pro',
        9.99,
        99.00,
        '["Unlimited QR codes", "All export formats (PNG/SVG/PDF)", "Dynamic QR codes", "Advanced analytics", "Custom branding", "Logo upload", "Ad-free experience", "Priority support"]'::jsonb,
        '{"max_qr_codes": -1, "max_scans_per_month": -1, "dynamic_qr": true}'::jsonb
    );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
    ('qr-codes', 'qr-codes', true),
    ('logos', 'logos', true);

-- Storage policies for qr-codes bucket
CREATE POLICY "QR codes are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'qr-codes');

CREATE POLICY "Authenticated users can upload QR codes"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'qr-codes' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own QR codes"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'qr-codes' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own QR codes"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'qr-codes' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for logos bucket
CREATE POLICY "Logos are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'logos' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own logos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'logos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own logos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'logos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
