"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Bike, DollarSign, Settings, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export function RiderSidebar() {
  const pathname = usePathname();

  const routes = [
    { href: "/dashboard/rider", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/rider/deliveries", label: "My Deliveries", icon: Bike },
    { href: "/dashboard/rider/earnings", label: "Earnings", icon: DollarSign },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/help", label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div className="space-y-1">
      {routes.map((route) => {
        const isActive = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
                <route.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{route.label}</span>
            </div>
            {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" 
                />
            )}
          </Link>
        );
      })}
    </div>
  );
}
