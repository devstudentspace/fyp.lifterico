-- Migration: Add Admin RLS Policies
-- Description: Allow Admins to view all profile data using JWT metadata to avoid recursion.

-- 1. Profiles Table
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 2. SME Profiles
CREATE POLICY "Admins can view all sme_profiles" ON public.sme_profiles
FOR SELECT TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 3. Logistics Profiles
CREATE POLICY "Admins can view all logistics_profiles" ON public.logistics_profiles
FOR SELECT TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 4. Rider Profiles
CREATE POLICY "Admins can view all rider_profiles" ON public.rider_profiles
FOR SELECT TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 5. Fleet Invites (Optional, but good for completeness)
CREATE POLICY "Admins can view all fleet_invites" ON public.fleet_invites
FOR SELECT TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
