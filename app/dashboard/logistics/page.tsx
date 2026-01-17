import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wallet, TrendingUp, Bike, MapPin, CheckCircle } from "lucide-react";

export default function LogisticsDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logistics Overview</h1>
          <p className="text-muted-foreground">Fleet management and performance metrics.</p>
        </div>
        <Button variant="outline">Manage Fleet</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Riders</CardTitle>
            <Bike className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/12</div>
            <div className="flex items-center gap-2 mt-1">
               <span className="h-2 w-2 rounded-full bg-green-500"></span>
               <p className="text-xs text-muted-foreground">Online now</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦150,000</div>
            <p className="text-[10px] text-muted-foreground">After 15% platform commission: ₦127,500</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Successful drops</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Registered riders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Real-time location and status of your riders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Ibrahim Sani", bike: "KNO-123-AB", status: "On Delivery", loc: "Tarauni, Kano", verified: true },
                { name: "Musa Lawal", bike: "KNO-445-XY", status: "Idle", loc: "Nasarawa, Kano", verified: true },
                { name: "Emeka Obi", bike: "KNO-789-ZZ", status: "On Delivery", loc: "Fagge, Kano", verified: false },
                { name: "John Doe", bike: "KNO-555-CC", status: "Offline", loc: "Unknown", verified: true },
                { name: "Aliyu Gombe", bike: "KNO-999-AA", status: "On Delivery", loc: "Gwale, Kano", verified: true },
              ].map((rider, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center relative">
                        <span className="font-bold text-xs">{rider.name.charAt(0)}</span>
                        {rider.verified && (
                          <div className="absolute -right-1 -bottom-1 bg-primary text-[8px] text-white rounded-full p-0.5">
                            <CheckCircle className="h-2 w-2" />
                          </div>
                        )}
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{rider.name}</h4>
                          {!rider.verified && <Badge variant="destructive" className="text-[8px] h-3 px-1">Unverified</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{rider.bike}</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={rider.status === "On Delivery" ? "default" : rider.status === "Offline" ? "secondary" : "outline"}>
                        {rider.status}
                    </Badge>
                    {rider.status !== "Offline" && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {rider.loc}
                        </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                        <span className="font-bold">75%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[75%]"></div>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}