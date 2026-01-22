import { FleetList } from "@/components/logistics/fleet-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FleetPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/logistics">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Fleet</h1>
          <p className="text-muted-foreground">Manage your riders and invitations.</p>
        </div>
      </div>

      <FleetList />
    </div>
  );
}
