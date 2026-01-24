import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role
  const role = user.user_metadata?.role;
  if (role !== 'sme') {
    return NextResponse.json({ error: "Forbidden: Only SMEs can create orders" }, { status: 403 });
  }

  try {
    const json = await request.json();
    
    // Basic Validation
    const requiredFields = [
      'pickup_address', 'pickup_contact_name', 'pickup_contact_phone',
      'delivery_address', 'delivery_contact_name', 'delivery_contact_phone'
    ];
    
    for (const field of requiredFields) {
      if (!json[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Construct payload dynamically to avoid sending undefined/null for optional fields
    // if the schema cache is stale or strict.
    const payload: any = {
      sme_id: user.id,
      status: json.business_id || json.rider_id ? 'assigned' : 'pending',
      pickup_address: json.pickup_address,
      pickup_lat: json.pickup_lat,
      pickup_lng: json.pickup_lng,
      pickup_contact_name: json.pickup_contact_name,
      pickup_contact_phone: json.pickup_contact_phone,
      delivery_address: json.delivery_address,
      delivery_lat: json.delivery_lat,
      delivery_lng: json.delivery_lng,
      delivery_contact_name: json.delivery_contact_name,
      delivery_contact_phone: json.delivery_contact_phone,
      package_description: json.package_description,
      package_size: json.package_size || 'small',
      delivery_fee: json.delivery_fee,
      distance_km: json.distance_km,
      estimated_duration_mins: json.estimated_duration_mins
    };

    if (json.customer_id) {
        payload.customer_id = json.customer_id;
    }

    if (json.business_id) {
        payload.business_id = json.business_id;
    }

    // Only add rider_id if it's explicitly provided and truthy
    // This handles the case where the migration might not have propagated fully
    // or if the client sends an empty string.
    if (json.rider_id) {
        payload.rider_id = json.rider_id;
    }

    const { data, error } = await supabase
      .from('orders')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      // Fallback: If error is about missing column 'rider_id', retry without it
      // This is a temporary fix for schema cache issues.
      if (error.message.includes("rider_id") && payload.rider_id) {
          console.warn("Retrying without rider_id due to schema error...");
          delete payload.rider_id;
          const { data: retryData, error: retryError } = await supabase
            .from('orders')
            .insert(payload)
            .select()
            .single();
          
          if (retryError) {
              return NextResponse.json({ error: retryError.message }, { status: 500 });
          }
          return NextResponse.json(retryData);
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = user.user_metadata?.role;

  // Special handling for Customer role (Recipient)
  if (role === 'customer') {
      // 1. Get user's phone number from profile
      const { data: profile } = await supabase
          .from('profiles')
          .select('phone_number')
          .eq('id', user.id)
          .single();

      if (!profile?.phone_number) {
          return NextResponse.json([]); // No phone, no orders
      }

      // 2. Use Admin Client to bypass RLS and find orders for this phone or ID
      const adminSupabase = createAdminClient();
      if (!adminSupabase) {
           return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
      }

      // Try to match by customer_id OR phone number
      const { data: customerOrders, error: customerError } = await adminSupabase
          .from('orders')
          .select('*')
          .or(`customer_id.eq.${user.id},delivery_contact_phone.eq.${profile.phone_number}`)
          .order('created_at', { ascending: false });

      if (customerError) {
          // Fallback: If error is likely due to missing 'customer_id' column (migration not run), 
          // retry with just phone number.
          if (customerError.message.includes("customer_id")) {
              const { data: retryData, error: retryError } = await adminSupabase
                  .from('orders')
                  .select('*')
                  .eq('delivery_contact_phone', profile.phone_number)
                  .order('created_at', { ascending: false });
              
              if (retryError) return NextResponse.json({ error: retryError.message }, { status: 500 });
              return NextResponse.json(retryData);
          }
          return NextResponse.json({ error: customerError.message }, { status: 500 });
      }

      return NextResponse.json(customerOrders);
  }

  // RLS policies automatically filter the results for other roles:
  // - SME: Sees only their own orders
  // - Logistics: Sees pending/unassigned OR assigned to them
  // - Admin: Sees all
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}