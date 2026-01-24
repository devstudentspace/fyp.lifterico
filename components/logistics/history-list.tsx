"use client";

import { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Clock, Truck, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogisticsHistoryList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const myOrders = data.filter(o => o.business_id === user.id);
          // Filter for Completed Orders only
          setOrders(myOrders.filter(o => ['delivered', 'cancelled', 'failed'].includes(o.status)));
        }
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/50">
        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No History Found</h3>
        <p className="text-muted-foreground text-center max-w-sm mt-2">
          You haven't completed any deliveries yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="opacity-80 hover:opacity-100 transition-opacity">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{order.order_number}</span>
                  <Badge variant={order.status === 'delivered' ? 'default' : 'destructive'}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {order.package_size.toUpperCase()} Package
                </h3>
                <p className="text-sm text-muted-foreground">
                    Fee: ₦{order.delivery_fee?.toLocaleString()}
                </p>
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
                    <MapPin className="h-3 w-3 text-red-600" /> Delivery
                  </div>
                  <p className="font-medium max-w-[200px] truncate">{order.delivery_address}</p>
                </div>
                
                <div className="space-y-1 text-right min-w-[120px]">
                  <div className="flex items-center justify-end gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Completed
                  </div>
                  <p className="font-medium">{new Date(order.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
