-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'logistics', 'sme', 'rider', 'customer');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE rider_status AS ENUM ('offline', 'online', 'busy');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create role-specific tables
CREATE TABLE public.sme_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT,
  business_address TEXT,
  industry_type TEXT,
  verification_status verification_status DEFAULT 'unverified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.logistics_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT,
  registration_number TEXT,
  fleet_size INTEGER DEFAULT 0,
  verification_status verification_status DEFAULT 'unverified',
  payout_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.rider_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  vehicle_type TEXT,
  license_plate TEXT,
  license_number TEXT,
  current_status rider_status DEFAULT 'offline',
  logistics_id UUID REFERENCES public.logistics_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on sub-tables
ALTER TABLE public.sme_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rider_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can view their own profile.
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: Users can update their own profile.
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- SME: SMEs can view/update their own data
CREATE POLICY "SMEs can view own data" ON public.sme_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "SMEs can update own data" ON public.sme_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Logistics: Logistics can view/update their own data
CREATE POLICY "Logistics can view own data" ON public.logistics_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Logistics can update own data" ON public.logistics_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Riders: Riders can view/update their own data
CREATE POLICY "Riders can view own data" ON public.rider_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Riders can update own data" ON public.rider_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to create a profile entry after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'customer'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create sub-profile based on role
  IF (new.raw_user_meta_data->>'role' = 'sme') THEN
    INSERT INTO public.sme_profiles (id) VALUES (new.id);
  ELSIF (new.raw_user_meta_data->>'role' = 'logistics') THEN
    INSERT INTO public.logistics_profiles (id) VALUES (new.id);
  ELSIF (new.raw_user_meta_data->>'role' = 'rider') THEN
    INSERT INTO public.rider_profiles (id) VALUES (new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
