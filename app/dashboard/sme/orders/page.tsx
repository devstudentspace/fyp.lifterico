import { SmeOrderList } from "@/components/sme/order-list";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SmeOrdersPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/sme">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your delivery requests.</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/sme/orders/create">
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Link>
        </Button>
      </div>

      <SmeOrderList />
    </div>
  );
}
