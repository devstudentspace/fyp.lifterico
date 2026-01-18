"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";

interface VerificationRequest {
  id: string;
  user_id: string;
  name: string;
  role: string;
  status: string;
  documents: any[];
  submitted_at: string;
}

interface VerificationListProps {
  requests: VerificationRequest[];
}

export function VerificationList({ requests: initialRequests }: VerificationListProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [processing, setProcessing] = useState<string | null>(null);
  const supabase = createClient();

  const handleReview = async (id: string, role: string, status: 'verified' | 'rejected') => {
    setProcessing(id);
    try {
      let table = 'sme_profiles';
      if (role === 'logistics') table = 'logistics_profiles';
      if (role === 'rider') table = 'rider_profiles';

      const { error } = await supabase
        .from(table)
        .update({ verification_status: status })
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
      setRequests(prev => prev.filter(req => req.id !== id));

    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setProcessing(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
        <p className="text-muted-foreground">No pending verification requests.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((req) => (
        <Card key={req.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{req.name}</CardTitle>
                <CardDescription className="capitalize">{req.role}</CardDescription>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Submitted Documents:</p>
              {req.documents && req.documents.length > 0 ? (
                <div className="space-y-2">
                  {req.documents.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted rounded border">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{doc.name}</span>
                      </div>
                      {/* In a real app, you'd generate a signed URL here */}
                      <Button variant="ghost" size="icon" className="h-6 w-6" disabled title="View (Mock)">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No documents uploaded.</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Submitted: {new Date(req.submitted_at).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="flex gap-2 pt-4 border-t">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onClick={() => handleReview(req.id, req.role, 'verified')}
              disabled={!!processing}
            >
              {processing === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="mr-2 h-4 w-4" /> Approve</>}
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-red-600 hover:bg-red-50 border-red-200"
              onClick={() => handleReview(req.id, req.role, 'rejected')}
              disabled={!!processing}
            >
              <XCircle className="mr-2 h-4 w-4" /> Reject
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
