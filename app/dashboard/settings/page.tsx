import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function SettingsContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const role = user.user_metadata?.role || "customer";

  return <ProfileForm user={user} role={role} />;
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and business information.</p>
      </div>

      <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
