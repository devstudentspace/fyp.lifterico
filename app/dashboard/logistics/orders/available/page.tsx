import { AvailableOrdersList } from "@/components/logistics/available-orders-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AvailableOrdersPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/logistics">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Orders</h1>
          <p className="text-muted-foreground">Browse and accept delivery requests from SMEs.</p>
        </div>
      </div>

      <AvailableOrdersList />
    </div>
  );
}
