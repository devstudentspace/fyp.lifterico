import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: invites, error } = await supabase
    .from('fleet_invites')
    .select('*')
    .eq('logistics_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(invites);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();
    const email = json.email;

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    // Check if invite already exists
    const { data: existing } = await supabase
      .from('fleet_invites')
      .select('id')
      .eq('logistics_id', user.id)
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existing) {
      return NextResponse.json({ error: "Invite already pending for this email" }, { status: 409 });
    }

    // Create Invite
    const { data, error } = await supabase
      .from('fleet_invites')
      .insert({
        logistics_id: user.id,
        email: email,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
