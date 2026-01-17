import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Package, AlertCircle, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground">System performance and user management.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦1.2M</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Fast Logistics Ltd.", role: "Logistics", date: "2 mins ago", status: "Verified" },
                { name: "Yakubu Electronics", role: "SME", date: "15 mins ago", status: "Pending" },
                { name: "John Musa", role: "Rider", date: "1 hour ago", status: "Unverified" },
                { name: "Amina Yusuf", role: "Customer", date: "2 hours ago", status: "Active" },
                { name: "Kano Textiles", role: "SME", date: "5 hours ago", status: "Verified" },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.role}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-xs text-muted-foreground">{user.date}</span>
                     <Badge variant={user.status === "Verified" || user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                     </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>SME Upgrade Requests</CardTitle>
            <p className="text-xs text-muted-foreground">SMEs requesting Logistics tier.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {[
                 { name: "Sani & Sons", orders: 62, age: "5 months", docs: "Uploaded" },
                 { name: "Kano Gizmos", orders: 48, age: "3 months", docs: "Pending" },
               ].map((req, i) => (
                 <div key={i} className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/30">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">{req.name}</span>
                      <Badge variant={req.orders >= 50 ? "default" : "secondary"}>{req.orders} Orders</Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Age: {req.age}</span>
                      <span>Docs: {req.docs}</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Button size="sm" className="w-full h-7 text-[10px]" disabled={req.orders < 50}>Approve</Button>
                      <Button size="sm" variant="outline" className="w-full h-7 text-[10px]">Review</Button>
                    </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4">
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