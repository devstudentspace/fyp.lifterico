import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { id } = await params;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();
    
    // Verify this rider belongs to this logistics company
    const { data: rider } = await supabase
      .from('rider_profiles')
      .select('id')
      .eq('id', id)
      .eq('logistics_id', user.id)
      .single();

    if (!rider) {
      return NextResponse.json({ error: "Rider not found in your fleet" }, { status: 404 });
    }

    // Update allowable fields
    const updates: any = {};
    if (json.vehicle_type) updates.vehicle_type = json.vehicle_type;
    if (json.license_plate) updates.license_plate = json.license_plate;

    const { error } = await supabase
      .from('rider_profiles')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: "Rider updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { id } = await params;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Verify ownership
    const { data: rider } = await supabase
      .from('rider_profiles')
      .select('id')
      .eq('id', id)
      .eq('logistics_id', user.id)
      .single();

    if (!rider) {
      return NextResponse.json({ error: "Rider not found in your fleet" }, { status: 404 });
    }

    // Remove from fleet (set logistics_id to NULL)
    const { error } = await supabase
      .from('rider_profiles')
      .update({ logistics_id: null })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: "Rider removed from fleet" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
