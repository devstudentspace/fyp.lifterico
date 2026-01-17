import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error: "Missing configuration",
        message:
          "To seed users, you must add SUPABASE_SERVICE_ROLE_KEY to your .env.local file. This key is required for admin actions.",
      },
      { status: 500 },
    );
  }

  // Create a Supabase client with the Service Role Key to bypass RLS and use Admin Auth
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const testUsers = [
    {
      email: "admin@example.com",
      password: "password",
      role: "admin",
      full_name: "System Admin",
    },
    {
      email: "sme@example.com",
      password: "password",
      role: "sme",
      full_name: "SME Business Owner",
    },
    {
      email: "logistics@example.com",
      password: "password",
      role: "logistics",
      full_name: "Logistics Manager",
    },
    {
      email: "rider@example.com",
      password: "password",
      role: "rider",
      full_name: "Delivery Rider",
    },
    {
      email: "customer@example.com",
      password: "password",
      role: "customer",
      full_name: "Jane Doe Customer",
    },
  ];

  const results = [];

  for (const user of testUsers) {
    // Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const exists = existingUsers?.users.find((u) => u.email === user.email);

    if (exists) {
      results.push({ email: user.email, status: "Already exists", id: exists.id });
      continue;
    }

    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        role: user.role,
        full_name: user.full_name,
      },
    });

    if (error) {
      results.push({ email: user.email, status: "Error", error: error.message });
    } else {
      results.push({ email: user.email, status: "Created", id: data.user.id });
    }
  }

  return NextResponse.json({
    message: "Seeding process completed",
    results,
  });
}
