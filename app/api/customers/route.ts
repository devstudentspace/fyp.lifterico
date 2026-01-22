import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch profiles with role 'customer'
    // Note: In a real production app, you wouldn't expose ALL customers to every SME.
    // This would likely be "customers who have ordered from this SME before" or an address book.
    // For this MVP prototype, we list all 'customer' users to demonstrate functionality.
    const { data: customers } = await supabase
      .from('profiles')
      .select('id, full_name, phone_number')
      .eq('role', 'customer')
      .limit(20); // Limit to avoid dumping huge database

    return NextResponse.json(customers || []);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
