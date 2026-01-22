import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('type');

    let data: any[] = [];
    let tableName = '';
    let selectQuery = '';

    switch (userType) {
      case 'riders':
        tableName = 'rider_profiles';
        selectQuery = `
          id,
          verification_status,
          current_status,
          vehicle_type,
          license_plate,
          created_at,
          profiles!rider_profiles_id_fkey (full_name, phone_number),
          logistics_profiles:logistics_id (company_name)
        `;
        break;
      case 'smes':
        tableName = 'sme_profiles';
        selectQuery = `
          id,
          business_name,
          business_address,
          city,
          state,
          industry_type,
          verification_status,
          created_at,
          profiles!sme_profiles_id_fkey (full_name, phone_number)
        `;
        break;
      case 'logistics':
        tableName = 'logistics_profiles';
        selectQuery = `
          id,
          company_name,
          registration_number,
          fleet_size,
          address,
          city,
          state,
          verification_status,
          created_at,
          profiles!logistics_profiles_id_fkey (full_name, phone_number)
        `;
        break;
      case 'customers':
        tableName = 'profiles';
        selectQuery = `
          id,
          full_name,
          phone_number,
          role,
          created_at
        `;
        break;
      default:
        return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    const { data: rawData, error } = await supabase
      .from(tableName)
      .select(selectQuery);

    if (error) {
      console.error(`Error fetching ${userType}:`, error);
      return NextResponse.json({ error: `Failed to fetch ${userType}` }, { status: 500 });
    }

    // Process the data to match the expected format
    if (userType === 'riders') {
      data = rawData?.map((r: any) => {
        const profile = r.profiles?.[0];
        const logistics = r.logistics_profiles?.[0];

        return {
          id: r.id,
          name: profile?.full_name || "Unknown",
          email: "", // Will be populated later
          role: 'rider',
          status: r.verification_status,
          joinedAt: r.created_at,
          details: {
            phone: profile?.phone_number,
            vehicle_type: r.vehicle_type,
            license_plate: r.license_plate,
            current_status: r.current_status,
            fleet: logistics?.company_name || "Independent"
          }
        };
      }) || [];
    } else if (userType === 'smes') {
      data = rawData?.map((s: any) => {
        const profile = s.profiles?.[0];

        return {
          id: s.id,
          name: s.business_name || "Unknown SME",
          email: "", // Will be populated later
          role: 'sme',
          status: s.verification_status,
          joinedAt: s.created_at,
          details: {
            contact_person: profile?.full_name,
            phone: profile?.phone_number,
            industry: s.industry_type,
            address: s.business_address,
            location: `${s.city}, ${s.state}`
          }
        };
      }) || [];
    } else if (userType === 'logistics') {
      data = rawData?.map((l: any) => {
        const profile = l.profiles?.[0];

        return {
          id: l.id,
          name: l.company_name || "Unknown Company",
          email: "", // Will be populated later
          role: 'logistics',
          status: l.verification_status,
          joinedAt: l.created_at,
          details: {
            manager_name: profile?.full_name,
            phone: profile?.phone_number,
            rc_number: l.registration_number,
            fleet_size: l.fleet_size,
            address: l.address,
            location: `${l.city}, ${l.state}`
          }
        };
      }) || [];
    } else if (userType === 'customers') {
      data = rawData?.map((c: any) => ({
        id: c.id,
        name: c.full_name || "Unknown",
        email: "", // Will be populated later
        role: 'customer',
        status: 'active', // Default for customers
        joinedAt: c.created_at,
        details: {
          phone: c.phone_number || "N/A"
        }
      })) || [];
    }

    // Fetch auth user emails
    // This would require admin privileges which might not be available in this context
    // For now, we'll return the data as is
    // In a real implementation, you'd need to fetch email data separately

    return NextResponse.json({ users: data });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}