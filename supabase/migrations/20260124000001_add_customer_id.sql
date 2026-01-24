-- Migration: Add customer_id to orders table
-- Description: Links an order to a registered customer user (recipient).

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);

-- Update RLS Policy for Customers to view their own orders via ID
-- (This complements the existing phone-number based logic or replaces it)
DROP POLICY IF EXISTS "Customers can view received orders" ON public.orders;

CREATE POLICY "Customers can view received orders" ON public.orders
    FOR SELECT TO authenticated USING (
        customer_id = auth.uid()
        OR
        delivery_contact_phone IN (
            SELECT phone_number FROM public.profiles WHERE id = auth.uid()
        )
    );
