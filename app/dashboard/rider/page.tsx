import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation, DollarSign, Clock, CheckCircle, Camera, Key, Loader2, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calculateProfileCompletion } from "@/lib/profile-utils";
import { ProfileCompletionGate } from "@/components/profile-completion-gate";
import { VerificationGate } from "@/components/verification-gate";
import { RiderStatusToggle } from "./rider-status-toggle";
import { RiderInviteAlert } from "@/components/rider/rider-invite-alert";
import { Suspense } from "react";

async function RiderContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  
  // Fetch rider profile with logistics company info if exists
  const { data: riderProfile } = await supabase
    .from("rider_profiles")
    .select("*, logistics_profiles(company_name)")
    .eq("id", user.id)
    .single();

  const completionPercentage = calculateProfileCompletion('rider', profile, riderProfile);

  if (completionPercentage < 70) {
    return <ProfileCompletionGate percentage={completionPercentage} />;
  }

  // Verification Gate
  if (riderProfile?.verification_status !== 'verified') {
    return <VerificationGate 
      status={riderProfile?.verification_status || 'unverified'} 
      reason={riderProfile?.rejection_reason}
    />;
  }

  const isOnline = riderProfile?.current_status === 'online';
  // @ts-ignore - Supabase types join handling
  const companyName = riderProfile?.logistics_profiles?.company_name;

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-20">
      
      <RiderInviteAlert />

      <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
        <div>
           <h1 className="text-xl font-bold">{profile?.full_name || "Rider"}</h1>
           <div className="flex flex-col gap-1 mt-1">
             <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{riderProfile?.vehicle_type || "No vehicle"} • {riderProfile?.license_plate || "No plate"}</p>
                <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
             </div>
             {companyName ? (
                <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <Building2 className="h-3 w-3" />
                    <span>{companyName}</span>
                </div>
             ) : (
                <Badge variant="outline" className="w-fit text-[10px] h-5">Independent</Badge>
             )}
           </div>
        </div>
        <div className="flex items-center gap-2">
            <RiderStatusToggle initialStatus={isOnline} />
        </div>
      </div>

      {isOnline && (
         <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <Badge className="bg-primary">Current Order</Badge>
                    <span className="text-sm font-bold">₦1,500</span>
                </div>
                <CardTitle className="text-lg">Food Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                          <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Pickup</p>
                          <p className="font-semibold">Chicken Republic, Zoo Road</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                          <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Dropoff</p>
                          <p className="font-semibold">Bayero University, New Site</p>
                      </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <p className="font-bold text-xs uppercase text-muted-foreground">Proof of Delivery Required</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <Camera className="h-4 w-4" /> Photo
                    </Button>
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <Key className="h-4 w-4" /> Enter OTP
                    </Button>
                  </div>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button className="w-full h-12 text-lg font-bold">Complete Delivery</Button>
            </CardFooter>
         </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <DollarSign className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="text-2xl font-bold">₦12,500</h3>
                <p className="text-xs text-muted-foreground">Earned Today</p>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="text-2xl font-bold">5</h3>
                <p className="text-xs text-muted-foreground">Completed Jobs</p>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Today's History</h3>
        {[
            { id: "ORD-8821", time: "2:30 PM", amount: "₦2,000", status: "Completed" },
            { id: "ORD-8815", time: "1:15 PM", amount: "₦1,200", status: "Completed" },
            { id: "ORD-8790", time: "11:45 AM", amount: "₦3,500", status: "Completed" },
        ].map((job, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-full">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">Delivery #{job.id}</p>
                        <p className="text-xs text-muted-foreground">{job.time}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-sm">{job.amount}</p>
                    <p className="text-[10px] text-green-600 font-medium">{job.status}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default function RiderDashboard() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <RiderContent />
    </Suspense>
  );
}