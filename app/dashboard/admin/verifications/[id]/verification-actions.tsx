"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

interface VerificationActionsProps {
  id: string;
  role: string;
}

export function VerificationActions({ id, role }: VerificationActionsProps) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [showReasonInput, setShowReasonInput] = useState<'reject' | 'reupload' | null>(null);
  const [reason, setReason] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleAction = async (explicitAction?: 'verified' | 'reject' | 'reupload') => {
    const action = explicitAction || showReasonInput;
    if (!action) return;
    
    setProcessing(action);

    try {
      let table = 'sme_profiles';
      if (role === 'logistics') table = 'logistics_profiles';
      if (role === 'rider') table = 'rider_profiles';

      const status = action === 'verified' ? 'verified' : 
                     action === 'reject' ? 'rejected' : 'unverified';

      const updateData: any = { verification_status: status };
      
      // Only add rejection_reason if it's a rejection or re-upload request
      if (action !== 'verified') {
        updateData.rejection_reason = reason;
      }

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      router.push('/dashboard/admin');
      router.refresh();

    } catch (error) {
      console.error("Failed to update status:", error);
      setProcessing(null);
      setShowReasonInput(null);
    }
  };

  if (showReasonInput) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-background">
        <div className="space-y-2">
          <Label htmlFor="reason">
            {showReasonInput === 'reject' ? 'Reason for Rejection' : 'Reason for Re-upload Request'}
          </Label>
          <textarea
            id="reason"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={showReasonInput === 'reject' ? "e.g., Business details do not match documents..." : "e.g., ID card image is blurry..."}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setShowReasonInput(null)} disabled={!!processing}>
            Cancel
          </Button>
          <Button 
            variant={showReasonInput === 'reject' ? "destructive" : "secondary"}
            onClick={() => handleAction()}
            disabled={!reason.trim() || !!processing}
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Confirm {showReasonInput === 'reject' ? 'Rejection' : 'Request'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button 
        className="w-full bg-green-600 hover:bg-green-700" 
        onClick={() => handleAction('verified')}
        disabled={!!processing}
      >
        {processing === 'verified' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="mr-2 h-4 w-4" /> Approve Verification</>}
      </Button>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
          onClick={() => setShowReasonInput('reupload')}
          disabled={!!processing}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Request Re-upload
        </Button>

        <Button 
          variant="outline" 
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => setShowReasonInput('reject')}
          disabled={!!processing}
        >
          <XCircle className="mr-2 h-4 w-4" /> Reject Business
        </Button>
      </div>
    </div>
  );
}
