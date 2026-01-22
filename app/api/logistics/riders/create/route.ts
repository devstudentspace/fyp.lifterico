import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 1. Verify the requester is a verified Logistics user
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check role and verification
  const { data: profile } = await supabase
    .from('logistics_profiles')
    .select('id, verification_status')
    .eq('id', user.id)
    .single();

  if (!profile || profile.verification_status !== 'verified') {
    return NextResponse.json({ error: "Only verified logistics companies can create riders." }, { status: 403 });
  }

  // 2. Initialize Admin Client
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json({ error: "Server configuration error: Missing Service Role Key" }, { status: 500 });
  }
  
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    const json = await request.json();
    const { email, password, full_name, phone_number, vehicle_type, license_plate } = json;

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Create User in Auth
    const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for manually created riders
      user_metadata: {
        role: 'rider',
        full_name,
        phone_number // Storing in metadata as well for consistency
      }
    });

    if (createError) throw createError;
    if (!newUser.user) throw new Error("Failed to create user object");

    // 4. Update/Create Rider Profile
    // The trigger `handle_new_user` will create the basic profiles entries.
    // We need to update the `rider_profiles` to link it to this logistics company and set vehicle details.
    
    // Give the trigger a moment or just update directly (RLS bypass needed? Yes, admin client)
    
    // Update basic profile phone number
    await adminSupabase
      .from('profiles')
      .update({ phone_number })
      .eq('id', newUser.user.id);

    // Update Rider Profile with Fleet details
    const { error: profileError } = await adminSupabase
      .from('rider_profiles')
      .update({
        logistics_id: user.id, // Link to current logistics user
        vehicle_type,
        license_plate,
        verification_status: 'verified', // Auto-verify since created by business
        current_status: 'offline'
      })
      .eq('id', newUser.user.id);

    if (profileError) throw profileError;

    return NextResponse.json({ message: "Rider created successfully", id: newUser.user.id });

  } catch (error: any) {
    console.error("Create Rider Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
