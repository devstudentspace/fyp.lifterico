"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

export function EarningsChart({ data }: { data: { date: string, amount: number }[] }) {
  const maxAmount = Math.max(...data.map(d => d.amount), 100); // Avoid div by zero

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" /> Weekly Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end justify-between gap-2 pt-4">
            {data.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                    <div 
                        className="w-full bg-primary/20 rounded-t-sm relative transition-all duration-500 group-hover:bg-primary/40"
                        style={{ height: `${(day.amount / maxAmount) * 100}%` }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] py-1 px-2 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border">
                            ₦{day.amount.toLocaleString()}
                        </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">{day.date}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
