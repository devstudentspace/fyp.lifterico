-- Add documents column to store file paths/URLs
ALTER TABLE public.sme_profiles ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.logistics_profiles ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.rider_profiles ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Create a storage bucket for documents if it doesn't exist (This usually requires Supabase API/Dashboard, 
-- but we can try inserting if the storage schema is exposed, otherwise we assume the bucket 'documents' exists)
-- For the sake of this environment, we will focus on the Policies.

-- Enable RLS on storage.objects if not enabled (usually is)
-- CREATE POLICY "Users can upload their own documents" ON storage.objects
-- FOR INSERT WITH CHECK ( bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1] );

-- CREATE POLICY "Users can view their own documents" ON storage.objects
-- FOR SELECT USING ( bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1] );

-- CREATE POLICY "Admins can view all documents" ON storage.objects
-- FOR SELECT USING ( bucket_id = 'documents' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );
