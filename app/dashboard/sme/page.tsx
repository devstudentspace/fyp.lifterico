import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Clock, Plus, ArrowRight, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calculateProfileCompletion } from "@/lib/profile-utils";
import { ProfileCompletionGate } from "@/components/profile-completion-gate";
import { VerificationGate } from "@/components/verification-gate";
import { Suspense } from "react";
import { QuickLinks } from "@/components/dashboard/quick-links";

async function SmeContent() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: smeProfile } = await supabase.from("sme_profiles").select("*").eq("id", user.id).single();

  const completionPercentage = calculateProfileCompletion('sme', profile, smeProfile);

  if (completionPercentage < 70) {
    return <ProfileCompletionGate percentage={completionPercentage} />;
  }

  if (smeProfile?.verification_status !== 'verified') {
    return <VerificationGate 
      status={smeProfile?.verification_status || 'unverified'} 
      reason={smeProfile?.rejection_reason}
    />;
  }

  const businessName = smeProfile?.business_name || "My Business";
  const fullName = profile?.full_name || user.email;

  // --- Real Data Fetching ---
  const { count: activeCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('sme_id', user.id)
    .in('status', ['accepted', 'assigned', 'picked_up', 'in_transit']);

  const { count: completedCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('sme_id', user.id)
    .eq('status', 'delivered');

  const { data: completedOrders } = await supabase
    .from('orders')
    .select('delivery_fee')
    .eq('sme_id', user.id)
    .eq('status', 'delivered');
  
  const totalSpend = completedOrders?.reduce((sum, o) => sum + (o.delivery_fee || 0), 0) || 0;

  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, package_description, delivery_address, created_at, estimated_duration_mins,
      rider:rider_id(id, profiles(full_name)),
      logistics:business_id(id, company_name)
    `)
    .eq('sme_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{businessName}</h1>
          <p className="text-muted-foreground">Welcome back, {fullName}. Manage your shipments here.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sme/orders/create">
            <Plus className="mr-2 h-4 w-4" /> Create New Order
          </Link>
        </Button>
      </div>

      <QuickLinks role="sme" />

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount || 0}</div>
            <p className="text-xs text-muted-foreground">In transit or assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount || 0}</div>
            <p className="text-xs text-muted-foreground">Lifetime total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <Badge variant="secondary" className="rounded-full">Lifetime</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Delivery fees paid</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Real-time status of your recent shipments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(!recentOrders || recentOrders.length === 0) ? (
                <p className="text-muted-foreground text-sm text-center py-8">No recent orders found.</p>
              ) : (
                recentOrders.map((order, i) => {
                  // Determine who is handling it
                  // @ts-ignore
                  const handlerName = order.rider?.profiles?.full_name || order.logistics?.company_name || "Pending Assignment";
                  
                  return (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex gap-4">
                        <div className="bg-primary/10 p-3 rounded-full h-fit">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{order.order_number}</h4>
                            <Badge variant={order.status === "delivered" ? "secondary" : "default"}>
                                {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mt-1">{order.package_description}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" /> {order.delivery_address}
                          </div>
                        </div>
                      </div>
                      <div className="text-right min-w-[120px]">
                        <p className="text-sm font-medium">{handlerName}</p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <Button variant="link" className="w-full mt-4" asChild>
              <Link href="/dashboard/sme/orders">
                View All Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription className="text-primary-foreground/80">Support for your deliveries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">Contact our support team if you have issues with a rider or delivery.</p>
            <Button variant="secondary" className="w-full text-foreground">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SmeDashboard() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <SmeContent />
    </Suspense>
  );
}