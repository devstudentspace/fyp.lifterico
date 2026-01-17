import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Phone, MessageSquare, Truck, CheckCircle2 } from "lucide-react";

export default function CustomerDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Deliveries</h1>
        <p className="text-muted-foreground">Track and manage your incoming packages.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" /> Active Tracking
        </h2>
        
        <Card className="border-primary/50 overflow-hidden">
            <div className="bg-primary/5 p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                        <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Order #LIF-9920</p>
                        <p className="text-xs text-muted-foreground">From: Yakubu Electronics</p>
                    </div>
                </div>
                <Badge>In Transit</Badge>
            </div>
            <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="relative pl-6 border-l-2 border-primary/30 space-y-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background"></div>
                                <p className="text-sm font-bold">Picked Up</p>
                                <p className="text-xs text-muted-foreground">11:30 AM - Sabon Gari Market</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary animate-pulse border-4 border-background"></div>
                                <p className="text-sm font-bold text-primary">On the way to you</p>
                                <p className="text-xs text-muted-foreground">Estimated arrival: 12:15 PM</p>
                            </div>
                            <div className="relative opacity-50">
                                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-muted border-4 border-background"></div>
                                <p className="text-sm font-bold">Delivered</p>
                                <p className="text-xs text-muted-foreground">Pending drop-off</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="font-bold text-xs">AB</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Aliyu Babangida</p>
                                    <p className="text-xs text-muted-foreground">Your Rider</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="outline" className="rounded-full">
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline" className="rounded-full">
                                    <MessageSquare className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-muted rounded-xl aspect-square md:aspect-auto flex flex-col items-center justify-center p-6 text-center border">
                        <MapPin className="h-12 w-12 text-primary/40 mb-2" />
                        <p className="text-sm font-medium">Live Map View</p>
                        <p className="text-xs text-muted-foreground mb-4">Rider is currently near BUK Road</p>
                        <Button className="w-full">Track on Map</Button>
                    </div>
                </div>
            </CardContent>
            <div className="bg-muted/30 p-4 border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-xs font-medium">Secure Delivery: You will need to provide OTP to the rider</p>
                </div>
                <div className="bg-background border rounded px-3 py-1 font-mono text-lg tracking-widest font-bold">
                    4021
                </div>
            </div>
        </Card>

        <div className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Recent History</h2>
            <div className="space-y-3">
                {[
                    { id: "#LIF-9811", from: "Kano Textiles", date: "Yesterday", status: "Delivered" },
                    { id: "#LIF-9750", from: "Mama Put Express", date: "Jan 15, 2026", status: "Delivered" },
                ].map((order, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-bold">{order.id}</p>
                                <p className="text-xs text-muted-foreground">{order.from}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge variant="secondary" className="mb-1">{order.status}</Badge>
                            <p className="text-[10px] text-muted-foreground">{order.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}