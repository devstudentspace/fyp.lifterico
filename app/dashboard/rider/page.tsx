import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation, DollarSign, Clock, CheckCircle, Camera, Key, Loader2, Building2, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { calculateProfileCompletion } from "@/lib/profile-utils";
import { ProfileCompletionGate } from "@/components/profile-completion-gate";
import { VerificationGate } from "@/components/verification-gate";
import { RiderStatusToggle } from "./rider-status-toggle";
import { RiderInviteAlert } from "@/components/rider/rider-invite-alert";
import { Suspense } from "react";
import { QuickLinks } from "@/components/dashboard/quick-links";

async function RiderContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  
  const { data: riderProfile } = await supabase
    .from("rider_profiles")
    .select("*, logistics_profiles(company_name)")
    .eq("id", user.id)
    .single();

  const completionPercentage = calculateProfileCompletion('rider', profile, riderProfile);

  if (completionPercentage < 70) {
    return <ProfileCompletionGate percentage={completionPercentage} />;
  }

  if (riderProfile?.verification_status !== 'verified') {
    return <VerificationGate 
      status={riderProfile?.verification_status || 'unverified'} 
      reason={riderProfile?.rejection_reason}
    />;
  }

  const isOnline = riderProfile?.current_status === 'online';
  // @ts-ignore
  const companyName = riderProfile?.logistics_profiles?.company_name;

  // --- Real Data Fetching ---
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  
  // 1. Today's Completed Jobs
  const { data: todaysJobs } = await supabase
    .from('orders')
    .select('id, order_number, delivery_fee, updated_at')
    .eq('rider_id', user.id)
    .eq('status', 'delivered')
    .gte('updated_at', startOfDay.toISOString());

  const earnedToday = todaysJobs?.reduce((sum, o) => sum + (o.delivery_fee || 0), 0) || 0;
  const jobsCount = todaysJobs?.length || 0;

  // 2. Current Active Order (if any)
  const { data: activeOrder } = await supabase
    .from('orders')
    .select('*')
    .eq('rider_id', user.id)
    .in('status', ['assigned', 'accepted', 'picked_up', 'in_transit'])
    .order('created_at', { ascending: false })
    .single();

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-20">
      
      <RiderInviteAlert />

      <QuickLinks role="rider" />

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

      {isOnline && activeOrder && (
         <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <Badge className="bg-primary">Current Order</Badge>
                    <span className="text-sm font-bold">₦{activeOrder.delivery_fee?.toLocaleString()}</span>
                </div>
                <CardTitle className="text-lg">{activeOrder.package_description}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                          <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Pickup</p>
                          <p className="font-semibold line-clamp-1">{activeOrder.pickup_address}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-2">
                      <Navigation className="h-4 w-4 text-red-600 mt-0.5" />
                      <div>
                          <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Dropoff</p>
                          <p className="font-semibold line-clamp-1">{activeOrder.delivery_address}</p>
                      </div>
                  </div>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button className="w-full h-12 text-lg font-bold" asChild>
                    <Link href="/dashboard/rider/deliveries">Manage Delivery</Link>
                </Button>
            </CardFooter>
         </Card>
      )}

      {isOnline && !activeOrder && (
          <div className="text-center py-8 border-2 border-dashed rounded-xl text-muted-foreground animate-pulse">
              <p>Waiting for orders...</p>
          </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/rider/earnings">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <DollarSign className="h-6 w-6 text-green-600 mb-2" />
                    <h3 className="text-2xl font-bold">₦{earnedToday.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground">Earned Today</p>
                </CardContent>
            </Card>
        </Link>
        <Link href="/dashboard/rider/deliveries">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <CheckCircle className="h-6 w-6 text-blue-600 mb-2" />
                    <h3 className="text-2xl font-bold">{jobsCount}</h3>
                    <p className="text-xs text-muted-foreground">Completed Jobs</p>
                </CardContent>
            </Card>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Today's History</h3>
            <Link href="/dashboard/rider/deliveries" className="text-xs text-blue-600 flex items-center">
                View All <ChevronRight className="h-3 w-3" />
            </Link>
        </div>
        
        {todaysJobs && todaysJobs.length > 0 ? (
            todaysJobs.map((job, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded-full">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium text-sm font-mono">{job.order_number}</p>
                            <p className="text-xs text-muted-foreground">{new Date(job.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-sm">₦{job.delivery_fee?.toLocaleString()}</p>
                        <p className="text-[10px] text-green-600 font-medium">Completed</p>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No jobs completed today.</p>
        )}
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