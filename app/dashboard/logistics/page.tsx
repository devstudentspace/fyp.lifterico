export default function LogisticsDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Logistics Dashboard</h1>
      <p>Manage your fleet and assignments.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-semibold mb-2">Fleet Status</h2>
          <p className="text-sm text-muted-foreground">Overview of your riders</p>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-semibold mb-2">New Requests</h2>
          <p className="text-sm text-muted-foreground">Incoming delivery jobs</p>
        </div>
      </div>
    </div>
  );
}
