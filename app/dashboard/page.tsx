import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
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

  const role = user.user_metadata.role;
  let profileData = null;

  if (role === "sme") {
    const { data } = await supabase
      .from("sme_profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profileData = data;
  } else if (role === "logistics") {
    const { data } = await supabase
      .from("logistics_profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profileData = data;
  } else if (role === "rider") {
    const { data } = await supabase
      .from("rider_profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profileData = data;
  }

  if (role === "sme") {
    redirect("/dashboard/sme");
  } else if (role === "logistics") {
    redirect("/dashboard/logistics");
  } else if (role === "rider") {
    redirect("/dashboard/rider");
  } else if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "customer") {
    redirect("/dashboard/customer");
  }

  // Fallback content (should rarely be reached if roles are correct)
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-primary/10 text-primary p-4 rounded-lg border border-primary/20">
        <h3 className="font-semibold mb-1">Current Role</h3>
        <p className="text-xl capitalize">{role || "User"}</p>
        <p className="text-sm opacity-75">{user.user_metadata.full_name}</p>
      </div>

      {profileData && (
        <div className="bg-secondary/10 text-secondary-foreground p-4 rounded-lg border border-secondary/20">
          <h3 className="font-semibold mb-2 capitalize">{role} Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(profileData).map(([key, value]) => {
              if (key === "id" || key === "created_at" || key === "updated_at")
                return null;
              return (
                <div key={key} className="flex flex-col">
                  <span className="opacity-70 capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium">
                    {value ? String(value) : "N/A"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Raw User Data</h3>
        <pre className="text-xs font-mono p-3 rounded border max-h-64 overflow-auto bg-muted/50">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start w-full">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <Suspense>
          <UserDetails />
        </Suspense>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
