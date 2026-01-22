"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Building2, Check, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function RiderInviteAlert() {
  const [invites, setInvites] = useState<any[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchInvites();
  }, []);

  async function fetchInvites() {
    try {
      const res = await fetch('/api/rider/invites');
      if (res.ok) {
        setInvites(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAction(inviteId: string, action: 'accept' | 'reject') {
    setProcessing(inviteId);
    try {
      const res = await fetch('/api/rider/invites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId, action }),
      });
      
      if (res.ok) {
        if (action === 'accept') {
            // Force reload to update dashboard state
            window.location.reload(); 
        } else {
            fetchInvites();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  }

  if (invites.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {invites.map((invite) => (
        <Alert key={invite.id} className="border-blue-200 bg-blue-50">
          <Building2 className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Fleet Invitation</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
            <div>
              <span className="font-semibold">{invite.logistics_profiles?.company_name}</span> has invited you to join their fleet.
              <p className="text-xs text-muted-foreground mt-1">
                {invite.logistics_profiles?.city}, {invite.logistics_profiles?.state}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white hover:bg-red-50 hover:text-red-600 border-red-200"
                onClick={() => handleAction(invite.id, 'reject')}
                disabled={!!processing}
              >
                <X className="h-4 w-4 mr-1" /> Decline
              </Button>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleAction(invite.id, 'accept')}
                disabled={!!processing}
              >
                {processing === invite.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-1" /> Accept & Join</>}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
