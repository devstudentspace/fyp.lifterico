-- Migration: Add Rider Direct Assignment
-- Description: Adds rider_id to orders and updates RLS for direct rider assignment.

-- 1. Add rider_id to orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS rider_id UUID REFERENCES public.rider_profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_rider_id ON public.orders(rider_id);

-- 2. Update RLS for Logistics to also see if rider_id is NULL (available to them) OR assigned to them
-- (Existing policy "Logistics can view available or assigned orders" might need tweak if logic changes, 
-- but for now, if business_id is set, it's theirs. If rider_id is set, it's a specific rider's.)

-- 3. Add RLS for Riders
-- Riders can view orders if:
-- a) Assigned directly (rider_id = auth.uid())
-- b) Assigned to their logistics company (logic: rider.logistics_id = order.business_id) - FUTURE/Later
-- For now, focused on Direct Assignment as per requirement "Individual Riders".

CREATE POLICY "Riders can view assigned orders" ON public.orders
    FOR SELECT USING (
        rider_id = auth.uid()
    );

CREATE POLICY "Riders can update assigned orders" ON public.orders
    FOR UPDATE USING (
        rider_id = auth.uid()
    );

-- 4. Allow SMEs to assign rider_id (INSERT/UPDATE)
-- Existing SME policies allow INSERT/UPDATE on own orders, so no change needed to policies, just schema.
