-- Migration: Create Orders Table and Update Profile Schemas
-- Description: Adds the orders table with RLS policies and updates SME/Logistics profiles with address fields.

-- 1. Update SME Profile Schema
ALTER TABLE public.sme_profiles 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT;

-- 2. Update Logistics Profile Schema
ALTER TABLE public.logistics_profiles 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT;

-- 3. Create Enums (if they don't exist)
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending', 'accepted', 'assigned', 'picked_up', 
        'in_transit', 'delivered', 'cancelled', 'failed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE package_size AS ENUM ('small', 'medium', 'large');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    sme_id UUID REFERENCES public.sme_profiles(id) ON DELETE CASCADE NOT NULL,
    business_id UUID REFERENCES public.logistics_profiles(id) ON DELETE SET NULL, -- Assigned Logistics Company
    
    status order_status DEFAULT 'pending',
    
    -- Pickup Details
    pickup_address TEXT NOT NULL,
    pickup_lat DECIMAL(10,8),
    pickup_lng DECIMAL(11,8),
    pickup_contact_name TEXT NOT NULL,
    pickup_contact_phone TEXT NOT NULL,
    
    -- Delivery Details
    delivery_address TEXT NOT NULL,
    delivery_lat DECIMAL(10,8),
    delivery_lng DECIMAL(11,8),
    delivery_contact_name TEXT NOT NULL,
    delivery_contact_phone TEXT NOT NULL,
    
    -- Package Details
    package_description TEXT,
    package_size package_size DEFAULT 'small',
    
    -- Financials / Metrics
    delivery_fee DECIMAL(10,2) CHECK (delivery_fee >= 0),
    distance_km DECIMAL(10,2),
    estimated_duration_mins INTEGER,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_orders_sme_id ON public.orders(sme_id);
CREATE INDEX IF NOT EXISTS idx_orders_business_id ON public.orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 6. Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies

-- SME: View own orders
CREATE POLICY "SMEs can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = sme_id);

-- SME: Create orders (must be the SME)
CREATE POLICY "SMEs can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = sme_id);

-- SME: Update own orders (only when pending)
CREATE POLICY "SMEs can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = sme_id AND status = 'pending');

-- Logistics: View available (pending & unassigned) OR assigned to them
CREATE POLICY "Logistics can view available or assigned orders" ON public.orders
    FOR SELECT USING (
        (status = 'pending' AND business_id IS NULL) 
        OR 
        business_id = auth.uid()
    );

-- Logistics: Accept/Update assigned orders
CREATE POLICY "Logistics can update assigned orders" ON public.orders
    FOR UPDATE USING (business_id = auth.uid() OR business_id IS NULL); 
    -- Note: Allowing update if NULL allows them to "claim" it (set business_id = their_id)
    -- Ideally, we'd have a function for claiming, but for now this policy + check allows it if we carefully craft the update.
    -- Better policy for claiming:
    -- A logistics user can UPDATE an order WHERE business_id is NULL (to claim it) OR business_id is their ID.

-- Admin: View all
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 8. Order Number Generation Sequence & Trigger
CREATE SEQUENCE IF NOT EXISTS order_number_seq;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Generates LFT-000001, LFT-000002, etc.
    NEW.order_number := 'LFT-' || LPAD(nextval('order_number_seq')::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION generate_order_number();
