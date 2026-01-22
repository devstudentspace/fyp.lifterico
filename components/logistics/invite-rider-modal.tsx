"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Mail, Plus } from "lucide-react";

// If useToast doesn't exist, I'll fallback to local state for success/error
// Checking if components/ui/use-toast.tsx exists? The list earlier didn't show it.
// I'll stick to local state message for simplicity.

export function InviteRiderModal({ onInviteSent }: { onInviteSent: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/logistics/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send invite");

      setMessage({ type: 'success', text: "Invite sent successfully!" });
      setEmail("");
      onInviteSent();
      setTimeout(() => setOpen(false), 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Rider
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Rider</DialogTitle>
          <DialogDescription>
            Send an email invitation to a rider to join your fleet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Rider Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="rider@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {message && (
            <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Mail className="mr-2 h-4 w-4" /> Send Invite</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
