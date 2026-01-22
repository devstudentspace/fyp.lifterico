import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch pending invites for this user's email
  const { data: invites } = await supabase
    .from('fleet_invites')
    .select(`
      id,
      status,
      created_at,
      logistics_profiles (
        company_name,
        city,
        state
      )
    `)
    .eq('email', user.email)
    .eq('status', 'pending');

  return NextResponse.json(invites || []);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { inviteId, action } = await request.json();

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Verify the invite belongs to this user
    const { data: invite } = await supabase
      .from('fleet_invites')
      .select('*, logistics_profiles(*)')
      .eq('id', inviteId)
      .eq('email', user.email)
      .eq('status', 'pending')
      .single();

    if (!invite) {
      return NextResponse.json({ error: "Invite not found or already processed" }, { status: 404 });
    }

    if (action === 'accept') {
      // 1. Update rider profile with logistics_id
      const { error: updateError } = await supabase
        .from('rider_profiles')
        .update({ logistics_id: invite.logistics_id })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 2. Update invite status
      await supabase
        .from('fleet_invites')
        .update({ status: 'accepted' })
        .eq('id', inviteId);
        
      return NextResponse.json({ message: "Invite accepted! You have joined the fleet." });
    } else {
      // Reject
      await supabase
        .from('fleet_invites')
        .update({ status: 'rejected' })
        .eq('id', inviteId);
        
      return NextResponse.json({ message: "Invite rejected." });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
