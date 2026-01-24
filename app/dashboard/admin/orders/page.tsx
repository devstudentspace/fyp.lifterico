import { AdminOrderList } from "@/components/admin/admin-order-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Orders</h1>
          <p className="text-muted-foreground">Monitor all delivery activities across the platform.</p>
        </div>
      </div>

      <AdminOrderList />
    </div>
  );
}
