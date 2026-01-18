"use client";

import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface RiderStatusToggleProps {
  initialStatus: boolean;
}

export function RiderStatusToggle({ initialStatus }: RiderStatusToggleProps) {
  const [isOnline, setIsOnline] = useState(initialStatus);
  const supabase = createClient();

  const toggleStatus = async (checked: boolean) => {
    setIsOnline(checked);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("rider_profiles").update({ current_status: checked ? 'online' : 'offline' }).eq("id", user.id);
    }
  };

  return (
    <>
      <span className={`text-sm font-medium ${isOnline ? "text-green-600" : "text-muted-foreground"}`}>
        {isOnline ? "Online" : "Offline"}
      </span>
      <Switch checked={isOnline} onCheckedChange={toggleStatus} />
    </>
  );
}
