import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch Verified Logistics Companies
    const { data: logistics } = await supabase
      .from('logistics_profiles')
      .select('id, company_name, fleet_size, city, state')
      .eq('verification_status', 'verified');

    // Fetch Verified Independent Riders (riders without a logistics_id or explicitly independent)
    // Assuming logistics_id is NULL for independent riders based on schema
    const { data: riders } = await supabase
      .from('rider_profiles')
      .select(`
        id,
        vehicle_type,
        profiles (full_name)
      `)
      .is('logistics_id', null)
      .eq('verification_status', 'verified');

      // Note: rider_profiles has id FK to profiles. We need name from profiles.
      // The query above uses Supabase syntax for joining.

    return NextResponse.json({
      logistics: logistics || [],
      riders: riders?.map(r => ({
        id: r.id,
        name: r.profiles?.[0]?.full_name || "Unknown Rider",
        vehicle: r.vehicle_type
      })) || []
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
