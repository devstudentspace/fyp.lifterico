"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PlusCircle, 
  Users, 
  Search, 
  Settings, 
  FileText, 
  ShieldCheck, 
  Bike, 
  DollarSign, 
  HelpCircle,
  Truck
} from "lucide-react";

interface QuickLinksProps {
  role: 'admin' | 'sme' | 'logistics' | 'rider' | 'customer';
}

export function QuickLinks({ role }: QuickLinksProps) {
  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { href: "/dashboard/admin/verifications", label: "Verify Businesses", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-100" },
          { href: "/dashboard/admin/users", label: "Manage Users", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
          { href: "/dashboard/settings", label: "System Settings", icon: Settings, color: "text-gray-500", bg: "bg-gray-100" },
        ];
      case 'sme':
        return [
          { href: "/dashboard/sme/orders/create", label: "Create Order", icon: PlusCircle, color: "text-green-600", bg: "bg-green-100" },
          { href: "/dashboard/sme/orders", label: "Track Orders", icon: Search, color: "text-purple-600", bg: "bg-purple-100" },
          { href: "/dashboard/settings", label: "Update Profile", icon: Settings, color: "text-gray-600", bg: "bg-gray-100" },
        ];
      case 'logistics':
        return [
          { href: "/dashboard/logistics/orders/available", label: "Find Orders", icon: Search, color: "text-blue-600", bg: "bg-blue-100" },
          { href: "/dashboard/logistics/fleet", label: "Manage Fleet", icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
          { href: "/dashboard/logistics/orders", label: "Active Deliveries", icon: Truck, color: "text-green-600", bg: "bg-green-100" },
        ];
      case 'rider':
        return [
          { href: "/dashboard/rider/deliveries", label: "My Jobs", icon: Bike, color: "text-blue-600", bg: "bg-blue-100" },
          { href: "/dashboard/rider/earnings", label: "Earnings", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
          { href: "/dashboard/settings", label: "Settings", icon: Settings, color: "text-gray-600", bg: "bg-gray-100" },
        ];
      default:
        return [
          { href: "/dashboard/customer", label: "My Dashboard", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
        ];
    }
  };

  const links = getLinks();

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {links.map((link) => (
        <Link key={link.label} href={link.href} className="group">
          <Card className="hover:shadow-md transition-all duration-200 border-muted hover:border-primary/20 cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className={`p-2.5 rounded-full transition-transform group-hover:scale-110 ${link.bg}`}>
                <link.icon className={`h-5 w-5 ${link.color}`} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {link.label}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
