import { DeliveryList } from "@/components/rider/delivery-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyDeliveriesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/rider">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Deliveries</h1>
          <p className="text-muted-foreground">Manage your active jobs and view history.</p>
        </div>
      </div>

      <DeliveryList />
    </div>
  );
}
