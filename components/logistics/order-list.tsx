"use client";

import { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Package, Clock, Truck, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AssignRiderModal } from "./assign-rider-modal";

export function LogisticsOrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('public:orders:logistics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
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
        const data: Order[] = await res.json();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const myOrders = data.filter(o => o.business_id === user.id);
          // Filter for Active Orders only
          setOrders(myOrders.filter(o => ['accepted', 'assigned', 'picked_up', 'in_transit'].includes(o.status)));
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAssignClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setAssignModalOpen(true);
  };

  const handleAssignmentSuccess = () => {
    fetchOrders(); // Refresh list to show updated status/rider
    // Modal closes automatically via its own logic or we can ensure it here
    setAssignModalOpen(false); 
    setSelectedOrderId(null);
  };

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
        <Truck className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Active Deliveries</h3>
        <p className="text-muted-foreground text-center max-w-sm mt-2 mb-4">
          You haven't accepted any orders yet.
        </p>
        <Button asChild>
          <Link href="/dashboard/logistics/orders/available">
            <Plus className="mr-2 h-4 w-4" /> Find Orders
          </Link>
        </Button>
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
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {/* Show if assigned to a rider (if we had rider name in Order type, we'd show it, for now just status) */}
                  {order.rider_id && <Badge variant="outline" className="text-xs">Rider Assigned</Badge>}
                </div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {order.package_size.toUpperCase()} Package
                  <span className="text-muted-foreground text-sm font-normal">- {order.package_description}</span>
                </h3>
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
                
                {/* Action Button: Assign Rider */}
                {(order.status === 'accepted' || (order.status === 'pending' && order.business_id)) && !order.rider_id && (
                  <Button size="sm" onClick={() => handleAssignClick(order.id)}>
                    <UserPlus className="mr-2 h-4 w-4" /> Assign Rider
                  </Button>
                )}
                
                <div className="space-y-1 text-right min-w-[100px]">
                  <div className="flex items-center justify-end gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" /> Updated
                  </div>
                  <p className="font-medium">{new Date(order.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Rider Assignment Modal */}
      {assignModalOpen && selectedOrderId && (
        <AssignRiderModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          orderId={selectedOrderId}
          onAssignmentSuccess={handleAssignmentSuccess}
        />
      )}
    </div>
  );
}
