import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function UserDetails() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch profile to get the definitive role from the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || user.user_metadata.role;
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === "sme") {
    redirect("/dashboard/sme");
  } else if (normalizedRole === "logistics") {
    redirect("/dashboard/logistics");
  } else if (normalizedRole === "rider") {
    redirect("/dashboard/rider");
  } else if (normalizedRole === "admin") {
    redirect("/dashboard/admin");
  } else if (normalizedRole === "customer") {
    redirect("/dashboard/customer");
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-primary/10 text-primary p-4 rounded-lg border border-primary/20">
        <h3 className="font-semibold mb-1">Authenticated User</h3>
        <p className="text-xl capitalize">{role || "User"}</p>
        <p className="text-sm opacity-75">{user.user_metadata.full_name || user.email}</p>
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start w-full">
        <h2 className="font-bold text-2xl mb-4">Redirecting to your dashboard...</h2>
        <Suspense>
          <UserDetails />
        </Suspense>
      </div>
    </div>
  );
}
