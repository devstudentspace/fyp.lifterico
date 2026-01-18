"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, LayoutDashboard } from "lucide-react";
import { DocumentUpload } from "@/components/document-upload";
import Link from "next/link";

interface ProfileFormProps {
  user: any;
  role: string;
}

export function ProfileForm({ user, role }: ProfileFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // General Profile State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Documents State
  const [documents, setDocuments] = useState<any[]>([]);

  // Role Specific State
  const [smeData, setSmeData] = useState({ business_name: "", business_address: "", industry_type: "" });
  const [logisticsData, setLogisticsData] = useState({ company_name: "", registration_number: "", fleet_size: 0 });
  const [riderData, setRiderData] = useState({ vehicle_type: "", license_plate: "" });

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        
        // Fetch base profile
        const { data: profile, error: pError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (pError) throw pError;

        setFullName(profile.full_name || "");
        setPhoneNumber(profile.phone_number || "");

        // Fetch role specific data
        if (role === 'sme') {
          const { data } = await supabase.from("sme_profiles").select("*").eq("id", user.id).single();
          if (data) {
            setSmeData({ 
              business_name: data.business_name || "", 
              business_address: data.business_address || "", 
              industry_type: data.industry_type || "" 
            });
            setDocuments(data.documents || []);
          }
        } else if (role === 'logistics') {
          const { data } = await supabase.from("logistics_profiles").select("*").eq("id", user.id).single();
          if (data) {
            setLogisticsData({ 
              company_name: data.company_name || "", 
              registration_number: data.registration_number || "", 
              fleet_size: data.fleet_size || 0 
            });
            setDocuments(data.documents || []);
          }
        } else if (role === 'rider') {
          const { data } = await supabase.from("rider_profiles").select("*").eq("id", user.id).single();
          if (data) {
            setRiderData({ 
              vehicle_type: data.vehicle_type || "", 
              license_plate: data.license_plate || "" 
            });
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [user, role, supabase]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    try {
      // 1. Update Base Profile
      const { error: pError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (pError) throw pError;

      // 2. Update Role Profile
      let rError = null;
      if (role === 'sme') {
        const { error } = await supabase.from("sme_profiles").update(smeData).eq("id", user.id);
        rError = error;
      } else if (role === 'logistics') {
        const { error } = await supabase.from("logistics_profiles").update(logisticsData).eq("id", user.id);
        rError = error;
      } else if (role === 'rider') {
        const { error } = await supabase.from("rider_profiles").update(riderData).eq("id", user.id);
        rError = error;
      }

      if (rError) throw rError;

      setMessage({ type: 'success', text: "Profile updated successfully!" });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Failed to update profile" });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your basic contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled className="bg-muted" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="08012345678" />
          </div>
        </CardContent>
      </Card>

      {role === 'sme' && (
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>Tell us about your business.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="bizName">Business Name</Label>
              <Input id="bizName" value={smeData.business_name} onChange={(e) => setSmeData({...smeData, business_name: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bizAddr">Business Address</Label>
              <Input id="bizAddr" value={smeData.business_address} onChange={(e) => setSmeData({...smeData, business_address: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry Type</Label>
              <Input id="industry" value={smeData.industry_type} onChange={(e) => setSmeData({...smeData, industry_type: e.target.value})} placeholder="e.g. Fashion, Electronics" />
            </div>
            
            <div className="pt-4 border-t">
              <Label className="mb-2 block">Verification Documents</Label>
              <DocumentUpload 
                userId={user.id} 
                role={role} 
                currentDocuments={documents} 
                onUploadComplete={setDocuments} 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {role === 'logistics' && (
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Information about your logistics firm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="compName">Company Name</Label>
              <Input id="compName" value={logisticsData.company_name} onChange={(e) => setLogisticsData({...logisticsData, company_name: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="regNum">Registration Number (RC)</Label>
              <Input id="regNum" value={logisticsData.registration_number} onChange={(e) => setLogisticsData({...logisticsData, registration_number: e.target.value})} />
            </div>

            <div className="pt-4 border-t">
              <Label className="mb-2 block">Company Registration (CAC)</Label>
              <DocumentUpload 
                userId={user.id} 
                role={role} 
                currentDocuments={documents} 
                onUploadComplete={setDocuments} 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {role === 'rider' && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Information about your delivery vehicle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="vType">Vehicle Type</Label>
              <Input id="vType" value={riderData.vehicle_type} onChange={(e) => setRiderData({...riderData, vehicle_type: e.target.value})} placeholder="e.g. Motorcycle, Van" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lPlate">License Plate</Label>
              <Input id="lPlate" value={riderData.license_plate} onChange={(e) => setRiderData({...riderData, license_plate: e.target.value})} />
            </div>
          </CardContent>
        </Card>
      )}

      {message && (
        <div className={`p-4 rounded-lg flex flex-col gap-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
          {message.type === 'success' && (
            <Button asChild variant="outline" className="w-full bg-white border-green-200 text-green-700 hover:bg-green-100">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
              </Link>
            </Button>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={updating}>
        {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Save Changes"}
      </Button>
    </form>
  );
}
