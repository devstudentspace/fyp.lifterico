import { SmeOrderList } from "@/components/sme/order-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SmeHistoryPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/sme/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">View your past completed and cancelled orders.</p>
        </div>
      </div>

      <SmeOrderList type="history" />
    </div>
  );
}
