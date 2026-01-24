import { CustomerDeliveryList } from "@/components/customer/delivery-list";

export default function CustomerDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Deliveries</h1>
        <p className="text-muted-foreground">Track and manage your incoming packages.</p>
      </div>

      <CustomerDeliveryList />
    </div>
  );
}
