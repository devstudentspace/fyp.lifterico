export default function SmeDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Business Dashboard</h1>
      <p>Manage your orders and track deliveries.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-semibold mb-2">Create Order</h2>
          <p className="text-sm text-muted-foreground">Start a new delivery request</p>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-semibold mb-2">Active Orders</h2>
          <p className="text-sm text-muted-foreground">Track ongoing deliveries</p>
        </div>
      </div>
    </div>
  );
}
