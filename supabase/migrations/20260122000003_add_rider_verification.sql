-- Migration: Add verification_status to rider_profiles
-- Description: Adds the missing verification_status column to rider_profiles table.

ALTER TABLE public.rider_profiles
ADD COLUMN IF NOT EXISTS verification_status verification_status DEFAULT 'unverified';

-- Update RLS to allow logistics to see verification status of their riders (already covered by "view own data" policy if they are owner, but for logistics viewing riders, we rely on the policy:
-- "Logistics can view own riders" -> need to ensure this exists or is covered.
-- The previous schema migration had policies for Riders viewing themselves.
-- We need to ensure Logistics companies can view their fleet's profiles.

CREATE POLICY "Logistics can view their fleet riders" ON public.rider_profiles
    FOR SELECT USING (
        logistics_id = auth.uid()
    );

-- Also allow logistics to update their fleet riders (e.g. verify them?)
-- For now, maybe just view. Creating them via API uses service role, so that's fine.
