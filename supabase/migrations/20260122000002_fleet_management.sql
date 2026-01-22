-- Migration: Create Fleet Invites Table
-- Description: System for Logistics companies to invite riders.

CREATE TABLE IF NOT EXISTS public.fleet_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    logistics_id UUID REFERENCES public.logistics_profiles(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fleet_invites_email ON public.fleet_invites(email);
CREATE INDEX IF NOT EXISTS idx_fleet_invites_logistics_id ON public.fleet_invites(logistics_id);

-- RLS
ALTER TABLE public.fleet_invites ENABLE ROW LEVEL SECURITY;

-- Logistics can see/create invites they made
CREATE POLICY "Logistics can view own invites" ON public.fleet_invites
    FOR SELECT USING (logistics_id = auth.uid());

CREATE POLICY "Logistics can create invites" ON public.fleet_invites
    FOR INSERT WITH CHECK (logistics_id = auth.uid());

CREATE POLICY "Logistics can update own invites" ON public.fleet_invites
    FOR UPDATE USING (logistics_id = auth.uid());

-- Riders (Users) can see invites sent to their email
-- Note: auth.email() isn't directly available in simple RLS without a secure wrapper or claim.
-- Standard Supabase approach: we can trust the client to filter or use a function.
-- Better: Use a function or link to `auth.users` if possible, but email is in `auth.users`.
-- For simplicity in MVP, we might need a function to fetch "my invites" that checks against the user's email securely.
-- OR, we can allow authenticated users to select WHERE email = current_user_email.
-- Supabase `auth.jwt()` contains email.

CREATE POLICY "Users can view invites to their email" ON public.fleet_invites
    FOR SELECT USING (email = (select email from auth.users where id = auth.uid()));

CREATE POLICY "Users can update invites to their email" ON public.fleet_invites
    FOR UPDATE USING (email = (select email from auth.users where id = auth.uid()));

