"use client";

import { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Package, Clock, Phone, Truck, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminOrderList() {
  const [filter, setFilter] = useState<'all' | 'active' | 'history'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchOrders();
  }, [filter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        let data: Order[] = await res.json();
        
        if (filter === 'active') {
             data = data.filter(o => !['delivered', 'cancelled', 'failed'].includes(o.status));
        } else if (filter === 'history') {
             data = data.filter(o => ['delivered', 'cancelled', 'failed'].includes(o.status));
        }
        setOrders(data);
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
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'all' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'active' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('history')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'history' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
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
              <h3 className="text-lg font-medium">No Orders Found</h3>
              <p className="text-muted-foreground text-center max-w-sm mt-2">
                There are no orders matching this filter.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">{order.order_number}</span>
                        <Badge variant="outline" className={
                          order.status === 'pending' ? "border-orange-500 text-orange-600" : 
                          order.status === 'accepted' ? "border-purple-500 text-purple-600" : 
                          order.status === 'assigned' ? "border-blue-500 text-blue-600" : 
                          order.status === 'in_transit' ? "border-green-500 text-green-600" : 
                          order.status === 'delivered' ? "border-emerald-500 text-emerald-600" : ""
                        }>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {order.package_size.toUpperCase()} Package
                        <span className="text-muted-foreground text-sm font-normal">- {order.package_description}</span>
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>ID: {order.id.slice(0, 8)}...</span>
                          <span>Created: {new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
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
