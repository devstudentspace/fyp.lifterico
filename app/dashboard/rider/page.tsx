export default function RiderDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Rider Dashboard</h1>
      <p>View your assigned deliveries.</p>
      <div className="p-4 border rounded-lg bg-card">
        <h2 className="font-semibold mb-2">Current Status</h2>
        <p className="text-sm text-muted-foreground">You are currently: <span className="font-bold">Offline</span></p>
      </div>
    </div>
  );
}
