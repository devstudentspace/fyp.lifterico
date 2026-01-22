import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is logistics
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'logistics') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Fetch riders linked to this logistics company
    // We join with 'profiles' to get the name and email (email is tricky, usually in auth.users, but we might have it in profiles or need a secure way)
    // For now, profiles has name and phone.
    const { data: riders, error } = await supabase
      .from('rider_profiles')
      .select(`
        id,
        vehicle_type,
        license_plate,
        current_status,
        verification_status,
        profiles!id (
          full_name,
          phone_number,
          avatar_url
        )
      `)
      .eq('logistics_id', user.id);

    if (error) throw error;

    return NextResponse.json(riders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
