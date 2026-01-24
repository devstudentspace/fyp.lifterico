"use client";

import { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Package, Clock, Truck, Plus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface SmeOrderListProps {
  type?: 'active' | 'history';
}

export function SmeOrderList({ type = 'active' }: SmeOrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('public:orders:sme')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [type]); // Re-fetch/re-filter if type changes

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        if (type === 'active') {
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
        <h3 className="text-lg font-medium">No {type === 'active' ? 'Active' : 'Past'} Orders</h3>
        <p className="text-muted-foreground text-center max-w-sm mt-2 mb-4">
          {type === 'active' 
            ? "You don't have any active delivery orders." 
            : "You haven't completed any deliveries yet."}
        </p>
        {type === 'active' && (
            <Button asChild>
            <Link href="/dashboard/sme/orders/create">
                <Plus className="mr-2 h-4 w-4" /> Create First Order
            </Link>
            </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover:bg-accent/5 transition-colors">
          <CardContent className="p-6">
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
                    {order.status === 'accepted' ? 'Accepted by Logistics' : 
                     order.status === 'assigned' ? 'Rider Assigned' :
                     order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {order.status === 'accepted' && (
                      <span className="text-[10px] text-muted-foreground animate-pulse">
                          (Awaiting Rider Assignment)
                      </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {order.package_size.toUpperCase()} Package
                  <span className="text-muted-foreground text-sm font-normal">- {order.package_description}</span>
                </h3>

                {order.rider && (
                  <div className="mt-2 p-3 bg-muted/40 rounded-md border border-border/50">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                           <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                           <p className="text-sm font-medium">{order.rider.profiles?.full_name || "Unknown Rider"}</p>
                           <p className="text-xs text-muted-foreground">{order.rider.vehicle_type} • {order.rider.license_plate}</p>
                        </div>
                        {order.rider.profiles?.phone_number && (
                           <Button size="sm" variant="outline" className="ml-auto h-8 gap-2" asChild>
                              <a href={`tel:${order.rider.profiles.phone_number}`}>
                                 <Phone className="h-3 w-3" /> Call
                              </a>
                           </Button>
                        )}
                     </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 text-sm">
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
                <div className="space-y-1 text-right">
                  <div className="flex items-center justify-end gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" /> Created
                  </div>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
