import { LogisticsOrderList } from "@/components/logistics/order-list";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LogisticsOrdersPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/logistics">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Active Deliveries</h1>
            <p className="text-muted-foreground">Manage orders you have accepted.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/logistics/orders/history">
              View History
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/logistics/orders/available">
              <Search className="mr-2 h-4 w-4" /> Find More Orders
            </Link>
          </Button>
        </div>
      </div>

      <LogisticsOrderList />
    </div>
  );
}
