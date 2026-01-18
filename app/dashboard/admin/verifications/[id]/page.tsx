import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, ExternalLink, Calendar, MapPin, Phone, User, Building } from "lucide-react";
import { VerificationActions } from "./verification-actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role: string }>;
}

export default async function VerificationDetailPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params;
  const { role } = searchParams;

  const supabase = await createClient();
  let data: any = null;
  let tableName = '';

  if (role === 'sme') {
    tableName = 'sme_profiles';
  } else if (role === 'logistics') {
    tableName = 'logistics_profiles';
  } else if (role === 'rider') {
    tableName = 'rider_profiles';
  } else {
    // Fallback: try to guess or return 404
    // For now, let's just return 404 if role is missing/invalid
    return notFound();
  }

  const { data: profile, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();

  if (error || !profile) {
    console.error("Error fetching profile:", error);
    return notFound();
  }

  data = profile;

  // Helper to safely get display name
  const displayName = data.business_name || data.company_name || data.full_name || "Unknown User";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Verification Request</h1>
          <p className="text-muted-foreground">Review submitted documents and details.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{displayName}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span className="capitalize">{role}</span>
                    <span>•</span>
                    <span className="text-xs">ID: {id}</span>
                  </CardDescription>
                </div>
                <Badge variant={data.verification_status === 'pending' ? 'outline' : 'default'} 
                       className={data.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}>
                  {data.verification_status || 'Pending'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{data.full_name || "N/A"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{data.phone_number || "N/A"}</span>
                  </div>
                </div>
                {data.business_address && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{data.business_address}</span>
                    </div>
                  </div>
                )}
                {data.registration_number && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{data.registration_number}</span>
                    </div>
                  </div>
                )}
                 {data.industry_type && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{data.industry_type}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(data.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
              <CardDescription>
                Review the documents provided by the applicant.
              </CardDescription>
            </CardHeader>
            <CardContent>
               {data.documents && data.documents.length > 0 ? (
                <div className="space-y-3">
                  {data.documents.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-background rounded border">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="grid gap-0.5">
                          <span className="font-medium text-sm truncate">{doc.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(doc.size / 1024).toFixed(0)} KB • {doc.type?.split('/')[1]?.toUpperCase() || 'FILE'}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                         <a href="#" target="_blank" rel="noopener noreferrer" className="pointer-events-none opacity-50">
                           <ExternalLink className="h-3 w-3" />
                           View
                         </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  No documents uploaded.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
             <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Make a decision on this application.</CardDescription>
             </CardHeader>
             <CardContent>
                <VerificationActions id={id} role={role} />
             </CardContent>
          </Card>

          <Card className="bg-muted/30">
             <CardHeader>
                <CardTitle className="text-sm">Review Guidelines</CardTitle>
             </CardHeader>
             <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Verify the business name matches the registration documents.</p>
                <p>• Ensure documents are clear and readable.</p>
                <p>• Check if the address is valid.</p>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
