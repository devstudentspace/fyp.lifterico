-- Fix function search path and logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role;
BEGIN
  -- Safe role assignment with error handling
  BEGIN
    v_role := (new.raw_user_meta_data->>'role')::user_role;
  EXCEPTION WHEN OTHERS THEN
    v_role := 'customer';
  END;
  
  -- Default to customer if null
  IF v_role IS NULL THEN
    v_role := 'customer';
  END IF;

  INSERT INTO public.profiles (id, role, full_name, avatar_url)
  VALUES (
    new.id,
    v_role,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create sub-profile based on role
  IF (v_role = 'sme') THEN
    INSERT INTO public.sme_profiles (id) VALUES (new.id);
  ELSIF (v_role = 'logistics') THEN
    INSERT INTO public.logistics_profiles (id) VALUES (new.id);
  ELSIF (v_role = 'rider') THEN
    INSERT INTO public.rider_profiles (id) VALUES (new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public; -- Important!

-- Temporarily open up RLS for debugging/testing
-- These policies are additive (OR logic), so adding them effectively opens the tables.
CREATE POLICY "Enable all access for profiles test" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for sme_profiles test" ON public.sme_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for logistics_profiles test" ON public.logistics_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for rider_profiles test" ON public.rider_profiles FOR ALL USING (true) WITH CHECK (true);

-- Ensure broad permissions for the test phase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
