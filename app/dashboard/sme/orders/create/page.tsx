import { CreateOrderForm } from "@/components/sme/create-order-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateOrderPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/sme">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
          <p className="text-muted-foreground">Fill in the details to request a delivery.</p>
        </div>
      </div>

      <CreateOrderForm />
    </div>
  );
}
