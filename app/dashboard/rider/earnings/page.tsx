import { EarningsChart } from "@/components/rider/earnings-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet, CreditCard, Download } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EarningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch earnings data (last 7 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);

  const { data: orders } = await supabase
    .from('orders')
    .select('delivery_fee, updated_at')
    .eq('rider_id', user.id)
    .eq('status', 'delivered')
    .gte('updated_at', startDate.toISOString());

  // Aggregate by day
  const dailyEarnings = new Map<string, number>();
  // Initialize last 7 days with 0
  for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + d);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      dailyEarnings.set(dayName, 0);
  }

  let totalEarnings = 0;
  orders?.forEach(order => {
      const date = new Date(order.updated_at);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const amount = order.delivery_fee || 0;
      
      if (dailyEarnings.has(dayName)) {
          dailyEarnings.set(dayName, (dailyEarnings.get(dayName) || 0) + amount);
      }
      totalEarnings += amount;
  });

  const chartData = Array.from(dailyEarnings).map(([date, amount]) => ({ date, amount }));

  // Mock balance for now (or fetch from wallet table if exists)
  const availableBalance = totalEarnings * 0.4; // Simulating some withdrawals

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/rider">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground">Track your income and payouts.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-primary-foreground/80 text-sm font-medium">Total Earned (7 Days)</p>
                        <h2 className="text-3xl font-bold mt-2">₦{totalEarnings.toLocaleString()}</h2>
                    </div>
                    <div className="p-2 bg-primary-foreground/10 rounded-full">
                        <Wallet className="h-6 w-6" />
                    </div>
                </div>
                <div className="mt-6 flex gap-2">
                    <Button variant="secondary" className="w-full text-primary font-bold">
                        <CreditCard className="mr-2 h-4 w-4" /> Withdraw
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₦{availableBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Ready for payout</p>
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground flex justify-between">
                    <span>Next Payout</span>
                    <span>Tue, Oct 24</span>
                </div>
            </CardContent>
        </Card>
      </div>

      <EarningsChart data={chartData} />

      <Card>
        <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {orders?.slice(0, 5).map((o, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <ArrowLeft className="h-4 w-4 text-green-600 rotate-45" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Delivery Payout</p>
                                <p className="text-xs text-muted-foreground">{new Date(o.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className="font-bold text-green-600">+₦{o.delivery_fee?.toLocaleString()}</span>
                    </div>
                ))}
                {(!orders || orders.length === 0) && <p className="text-muted-foreground text-sm text-center">No recent transactions.</p>}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
