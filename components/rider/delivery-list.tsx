"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Package, Clock, Phone, Navigation } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DeliveryList() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('orders')
        .select('*')
        .eq('rider_id', user.id)
        .order('created_at', { ascending: false });

      if (activeTab === 'active') {
        query = query.in('status', ['assigned', 'accepted', 'picked_up', 'in_transit']);
      } else {
        query = query.eq('status', 'delivered');
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, newStatus: string) {
    try {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        fetchOrders(); // Refresh
    } catch (e) {
        console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'active' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Active Jobs
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'completed' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No {activeTab} deliveries found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className={`h-1 w-full ${activeTab === 'active' ? 'bg-blue-500' : 'bg-green-500'}`} />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono">{order.order_number}</Badge>
                        <Badge className={activeTab === 'active' ? "bg-blue-600" : "bg-green-600"}>
                            {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <div className="h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-100" />
                                <div className="h-10 w-0.5 bg-border mx-auto my-1" />
                                <div className="h-2 w-2 rounded-full bg-red-500 ring-4 ring-red-100" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase">Pickup</p>
                                    <p className="text-sm font-medium">{order.pickup_address}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-[10px] h-5">{order.pickup_contact_name}</Badge>
                                        <a href={`tel:${order.pickup_contact_phone}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                                            <Phone className="h-3 w-3" /> Call
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase">Dropoff</p>
                                    <p className="text-sm font-medium">{order.delivery_address}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-[10px] h-5">{order.delivery_contact_name}</Badge>
                                        <a href={`tel:${order.delivery_contact_phone}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                                            <Phone className="h-3 w-3" /> Call
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                        <div>
                            <p className="text-xs text-muted-foreground">Earnings</p>
                            <p className="text-2xl font-bold">₦{order.delivery_fee.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">{order.package_description} ({order.package_size})</p>
                        </div>

                        {activeTab === 'active' && (
                            <div className="space-y-2">
                                {order.status === 'assigned' && (
                                    <Button className="w-full" onClick={() => updateStatus(order.id, 'picked_up')}>
                                        <Package className="mr-2 h-4 w-4" /> Confirm Pickup
                                    </Button>
                                )}
                                {order.status === 'picked_up' && (
                                    <Button className="w-full" onClick={() => updateStatus(order.id, 'in_transit')}>
                                        <Navigation className="mr-2 h-4 w-4" /> Start Journey
                                    </Button>
                                )}
                                {order.status === 'in_transit' && (
                                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => updateStatus(order.id, 'delivered')}>
                                        <Package className="mr-2 h-4 w-4" /> Complete Delivery
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
