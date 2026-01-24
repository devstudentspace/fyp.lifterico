"use client";

import { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Package, Clock, Phone, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function CustomerDeliveryList() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        
        if (activeTab === 'active') {
             setOrders(data.filter(o => !['delivered', 'cancelled', 'failed'].includes(o.status)));
        } else {
             setOrders(data.filter(o => ['delivered', 'cancelled', 'failed'].includes(o.status)));
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
       <div className="flex gap-2 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'active' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Active Orders
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'history' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          History
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/50">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No {activeTab} orders</h3>
              <p className="text-muted-foreground text-center max-w-sm mt-2">
                {activeTab === 'active' 
                    ? "You don't have any incoming deliveries at the moment." 
                    : "No past delivery history found."}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className={`h-1 w-full ${activeTab === 'active' ? 'bg-primary' : 'bg-muted'}`} />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">{order.order_number}</span>
                        <Badge variant={order.status === 'delivered' ? 'secondary' : 'default'}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {order.package_size.toUpperCase()} Package
                        <span className="text-muted-foreground text-sm font-normal">- {order.package_description}</span>
                      </h3>
                      {order.rider_id && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                              <Truck className="h-3 w-3" /> Rider Assigned
                          </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 text-sm items-center">
                       <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3 w-3 text-green-600" /> Pickup
                        </div>
                        <p className="font-medium max-w-[200px] truncate">{order.pickup_address}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3 w-3 text-red-600" /> Dropoff
                        </div>
                        <p className="font-medium max-w-[200px] truncate">{order.delivery_address}</p>
                      </div>
                      
                      {order.status === 'in_transit' && (
                          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                              Arriving Soon
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
