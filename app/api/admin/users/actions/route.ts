import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json();
    const { userId, role, action } = requestBody;

    if (!userId || !role || !action) {
      console.error("Missing required fields:", { userId, role, action });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let tableName = '';
    let updateData: any = {};
    let successMessage = '';

    switch (role) {
      case 'sme':
        tableName = 'sme_profiles';
        break;
      case 'logistics':
        tableName = 'logistics_profiles';
        break;
      case 'rider':
        tableName = 'rider_profiles';
        break;
      case 'customer':
        tableName = 'profiles';
        // For customers, we'll use a different field to track status
        // Assuming there might be an account_status field or similar
        break;
      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    switch (action) {
      case 'approve':
        if (role === 'customer') {
          // For customers, we might not need to approve them in the same way
          // Just return a message or handle differently
          return NextResponse.json({ error: "Customer approval not applicable" }, { status: 400 });
        } else {
          updateData.verification_status = 'verified';
        }
        successMessage = 'User approved successfully';
        break;
      case 'suspend':
        if (role === 'customer') {
          // For customers, we might use account_status instead of verification_status
          updateData.account_status = 'suspended';
        } else {
          updateData.verification_status = 'suspended';
        }
        successMessage = 'User suspended successfully';
        break;
      case 'activate':
        if (role === 'customer') {
          updateData.account_status = 'active';
        } else {
          updateData.verification_status = 'verified';
        }
        successMessage = 'User activated successfully';
        break;
      case 'desuspend':
        if (role === 'customer') {
          updateData.account_status = 'active';
        } else {
          updateData.verification_status = 'verified';
        }
        successMessage = 'User desuspended successfully';
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update the user's status in the appropriate table
    const { error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error("Error updating user status:", error);
      return NextResponse.json({ error: error.message || "Failed to update user status" }, { status: 500 });
    }

    return NextResponse.json({ message: successMessage });

  } catch (error) {
    console.error("Error processing user action:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}