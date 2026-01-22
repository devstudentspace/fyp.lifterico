"use client";

import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { SmeSidebar } from "@/components/sidebar/sme-sidebar";
import { LogisticsSidebar } from "@/components/sidebar/logistics-sidebar";
import { RiderSidebar } from "@/components/sidebar/rider-sidebar";
import { Globe, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface RoleSidebarProps {
  role: string;
  className?: string;
}

export function RoleSidebar({ role, className }: RoleSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full w-full", className)}>
      <div className="flex-1 space-y-6 py-6 overflow-y-auto px-4 scrollbar-none">
        {/* Role Specific Navigation */}
        <div className="space-y-2">
          <h3 className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
            Menu
          </h3>
          {role === 'admin' && <AdminSidebar />}
          {role === 'sme' && <SmeSidebar />}
          {role === 'logistics' && <LogisticsSidebar />}
          {role === 'rider' && <RiderSidebar />}
          {role === 'customer' && (
             <Link
                href="/dashboard/customer"
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  pathname === "/dashboard/customer" 
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                </div>
              </Link>
          )}
        </div>
      </div>
      
      <div className="p-4 mt-auto">
         <div className="bg-primary/10 dark:bg-primary/5 rounded-2xl p-4 border border-primary/10 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 h-12 w-12 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
            <div className="flex items-center gap-2 mb-2 relative z-10">
               <div className="p-1.5 bg-primary/20 rounded-lg">
                  <Globe className="h-3.5 w-3.5 text-primary" />
               </div>
               <span className="text-xs font-bold tracking-tight">Lifterico Net</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed relative z-10 font-medium">
               Real-time tracking enabled.
            </p>
         </div>
      </div>
    </div>
  );
}
