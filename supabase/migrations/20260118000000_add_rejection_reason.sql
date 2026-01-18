-- Add rejection_reason column to profile tables
ALTER TABLE public.sme_profiles ADD COLUMN rejection_reason TEXT;
ALTER TABLE public.logistics_profiles ADD COLUMN rejection_reason TEXT;
ALTER TABLE public.rider_profiles ADD COLUMN rejection_reason TEXT;
