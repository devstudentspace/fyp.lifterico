import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Package, AlertCircle, TrendingUp, Activity, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CompactVerificationList } from "@/components/admin/compact-verification-list";
import { Suspense } from "react";
import { QuickLinks } from "@/components/dashboard/quick-links";

async function getPendingVerifications() {
  const supabase = await createClient();
  const requests = [];

  // Fetch pending SMEs
  const { data: smes } = await supabase
    .from('sme_profiles')
    .select('id, business_name, documents, created_at')
    .eq('verification_status', 'pending');
  
  if (smes) {
    requests.push(...smes.map(s => ({
      id: s.id,
      user_id: s.id,
      name: s.business_name || "Unknown SME",
      role: 'sme',
      status: 'pending',
      documents: s.documents || [],
      submitted_at: s.created_at
    })));
  }

  // Fetch pending Logistics
  const { data: logistics } = await supabase
    .from('logistics_profiles')
    .select('id, company_name, documents, created_at')
    .eq('verification_status', 'pending');

  if (logistics) {
    requests.push(...logistics.map(l => ({
      id: l.id,
      user_id: l.id,
      name: l.company_name || "Unknown Company",
      role: 'logistics',
      status: 'pending',
      documents: l.documents || [],
      submitted_at: l.created_at
    })));
  }

  return requests;
}

async function getRecentRegistrations() {
  const supabase = await createClient();
  
  // Fetch recent profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (!profiles) return [];

  const registrations = await Promise.all(profiles.map(async (p) => {
    let status = 'Active'; // Default for customer
    let name = p.full_name || "Unknown User";

    if (p.role === 'sme') {
      const { data } = await supabase.from('sme_profiles').select('verification_status, business_name').eq('id', p.id).single();
      if (data) {
        status = data.verification_status || 'unverified';
        name = data.business_name || name;
      }
    } else if (p.role === 'logistics') {
      const { data } = await supabase.from('logistics_profiles').select('verification_status, company_name').eq('id', p.id).single();
      if (data) {
        status = data.verification_status || 'unverified';
        name = data.company_name || name;
      }
    } else if (p.role === 'rider') {
      const { data } = await supabase.from('rider_profiles').select('verification_status').eq('id', p.id).single();
      if (data) {
        status = data.verification_status || 'unverified';
      }
    }

    return {
      id: p.id,
      name,
      role: p.role,
      date: timeAgo(p.created_at),
      status: capitalize(status)
    };
  }));

  return registrations;
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getStatusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === 'verified' || s === 'active') return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
  if (s === 'pending') return "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200";
  if (s === 'rejected' || s === 'unverified') return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
  return "";
}

async function AdminContent() {
  const pendingRequests = await getPendingVerifications();
  const recentRegistrations = await getRecentRegistrations();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground">System performance and user management.</p>
        </div>
      </div>

      <QuickLinks role="admin" />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 since last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Disputes</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
             <CardTitle>Business Verification Requests</CardTitle>
          </CardHeader>
          <CardContent>
             <CompactVerificationList requests={pendingRequests} />
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">{user.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-xs text-muted-foreground whitespace-nowrap">{user.date}</span>
                       <Badge variant="outline" className={getStatusBadgeClass(user.status)}>
                          {user.status}
                       </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent registrations.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {[
                 { action: "New dispute raised by Order #1234", time: "10m ago", icon: AlertCircle },
                 { action: "Payout batch #45 processed", time: "1h ago", icon: Activity },
                 { action: "Server maintenance completed", time: "3h ago", icon: Activity },
               ].map((item, i) => (
                 <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <AdminContent />
    </Suspense>
  );
}