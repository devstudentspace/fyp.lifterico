"use client";

import { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Package, Clock, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AvailableOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders(); // Refetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptOrder(orderId: string) {
    setAcceptingId(orderId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('orders')
        .update({ 
          business_id: user.id, 
          status: 'accepted' 
        })
        .eq('id', orderId);

      if (error) throw error;
      
      // Optimistic update or wait for realtime
      fetchOrders();
    } catch (error) {
      console.error("Failed to accept order", error);
    } finally {
      setAcceptingId(null);
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
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Orders Available</h3>
        <p className="text-muted-foreground text-center max-w-sm mt-2">
          There are currently no pending orders from SMEs. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <Card key={order.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Badge variant={order.status === 'pending' ? 'secondary' : 'default'} className="mb-2">
                {order.status.toUpperCase()}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">{order.order_number}</span>
            </div>
            <CardTitle className="text-lg">
              {order.package_size.charAt(0).toUpperCase() + order.package_size.slice(1)} Package
            </CardTitle>
            <CardDescription className="line-clamp-1">
              {order.package_description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 space-y-4 text-sm">
            <div className="grid gap-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium block text-xs text-muted-foreground">Pickup</span>
                  <span className="line-clamp-2">{order.pickup_address}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium block text-xs text-muted-foreground">Dropoff</span>
                  <span className="line-clamp-2">{order.delivery_address}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">ASAP</span>
              </div>
              <div className="ml-auto font-medium text-foreground">
                ₦{order.delivery_fee?.toLocaleString() ?? "N/A"}
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            {order.status === 'pending' ? (
              <Button 
                className="w-full" 
                onClick={() => handleAcceptOrder(order.id)}
                disabled={!!acceptingId}
              >
                {acceptingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accept Order"}
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                <Truck className="w-4 h-4 mr-2" /> Assigned
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
