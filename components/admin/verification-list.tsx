"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

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

export function VerificationList({ requests }: VerificationListProps) {
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
                  {req.documents.slice(0, 3).map((doc: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm p-2 bg-muted rounded border overflow-hidden">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate">{doc.name}</span>
                    </div>
                  ))}
                  {req.documents.length > 3 && (
                    <p className="text-xs text-muted-foreground pl-1">
                      +{req.documents.length - 3} more
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No documents uploaded.</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Submitted: {new Date(req.submitted_at).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="pt-4 border-t">
            <Button asChild className="w-full">
              <Link href={`/dashboard/admin/verifications/${req.id}?role=${req.role}`}>
                Review Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
