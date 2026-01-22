import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wallet, TrendingUp, Bike, MapPin, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { calculateProfileCompletion } from "@/lib/profile-utils";
import { ProfileCompletionGate } from "@/components/profile-completion-gate";
import { VerificationGate } from "@/components/verification-gate";
import { Suspense } from "react";
import { QuickLinks } from "@/components/dashboard/quick-links";

async function LogisticsContent() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: logisticsProfile } = await supabase.from("logistics_profiles").select("*").eq("id", user.id).single();

  const completionPercentage = calculateProfileCompletion('logistics', profile, logisticsProfile);

  if (completionPercentage < 70) {
    return <ProfileCompletionGate percentage={completionPercentage} />;
  }

  // Verification Gate
  if (logisticsProfile?.verification_status !== 'verified') {
    return <VerificationGate 
      status={logisticsProfile?.verification_status || 'unverified'} 
      reason={logisticsProfile?.rejection_reason}
    />;
  }

  const companyName = logisticsProfile?.company_name || "Logistics Company";

  // --- Real Data Fetching ---
  
  // 1. Fleet Stats
  const { data: fleet } = await supabase
    .from('rider_profiles')
    .select('id, current_status, vehicle_type, license_plate, verification_status, profiles(full_name)')
    .eq('logistics_id', user.id);

  const fleetSize = fleet?.length || 0;
  const activeRiders = fleet?.filter(r => r.current_status !== 'offline').length || 0;

  // 2. Today's Stats
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const startIso = startOfDay.toISOString();

  const { data: todaysOrders } = await supabase
    .from('orders')
    .select('delivery_fee')
    .eq('business_id', user.id)
    .eq('status', 'delivered')
    .gte('updated_at', startIso);

  const deliveriesToday = todaysOrders?.length || 0;
  const rawRevenue = todaysOrders?.reduce((sum, o) => sum + (o.delivery_fee || 0), 0) || 0;
  const netRevenue = rawRevenue * 0.85; // 15% commission deduction

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{companyName}</h1>
          <p className="text-muted-foreground">Fleet management for {profile?.full_name || user.email}.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/logistics/orders/available">
              Find Orders
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/logistics/fleet">
              Manage Fleet
            </Link>
          </Button>
        </div>
      </div>

      <QuickLinks role="logistics" />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Riders</CardTitle>
            <Bike className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRiders}/{fleetSize}</div>
            <div className="flex items-center gap-2 mt-1">
               <span className={`h-2 w-2 rounded-full ${activeRiders > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
               <p className="text-xs text-muted-foreground">{activeRiders > 0 ? "Riders online now" : "No riders online"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{rawRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground">Net (85%): ₦{netRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveriesToday}</div>
            <p className="text-xs text-muted-foreground">Successful drops</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetSize}</div>
            <p className="text-xs text-muted-foreground">Registered riders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Real-time status of your riders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(!fleet || fleet.length === 0) ? (
                <p className="text-center text-muted-foreground py-8">No riders in fleet.</p>
              ) : (
                fleet.map((rider, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center relative">
                          <span className="font-bold text-xs">{rider.profiles?.[0]?.full_name?.charAt(0) || "R"}</span>
                          {rider.verification_status === 'verified' && (
                            <div className="absolute -right-1 -bottom-1 bg-primary text-[8px] text-white rounded-full p-0.5">
                              <CheckCircle className="h-2 w-2" />
                            </div>
                          )}
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{rider.profiles?.[0]?.full_name || "Unknown"}</h4>
                            {rider.verification_status !== 'verified' && <Badge variant="destructive" className="text-[8px] h-3 px-1">Unverified</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{rider.license_plate} • {rider.vehicle_type}</p>
                       </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={rider.current_status === "online" ? "default" : rider.current_status === "busy" ? "secondary" : "outline"}>
                          {rider.current_status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
            {fleet && fleet.length > 5 && (
                <Button variant="link" className="w-full mt-2" asChild>
                    <Link href="/dashboard/logistics/fleet">View All Riders <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>On-Time Delivery Rate</span>
                        <span className="font-bold">94%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[94%]"></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Customer Rating</span>
                        <span className="font-bold">4.8/5.0</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[96%]"></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Fleet Utilization</span>
                        <span className="font-bold">{fleetSize > 0 ? Math.round((activeRiders/fleetSize)*100) : 0}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${fleetSize > 0 ? (activeRiders/fleetSize)*100 : 0}%` }}></div>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LogisticsDashboard() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <LogisticsContent />
    </Suspense>
  );
}