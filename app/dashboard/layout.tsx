import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { Copyright } from "@/components/copyright";
import { RoleSidebar } from "@/components/role-sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const role = user.user_metadata?.role || "customer";

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background/60 backdrop-blur-xl md:flex fixed inset-y-0 z-50">
         <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
               Lifterico
            </Link>
         </div>
         <div className="flex-1 overflow-y-auto">
            <RoleSidebar role={role} className="px-2" />
         </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64 transition-all duration-300 min-h-screen">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
           <MobileSidebar />
           
           <div className="md:hidden font-bold text-lg tracking-tight ml-2">
              Lifterico
           </div>

           <div className="w-full flex-1">
             {/* Search or Breadcrumbs */}
           </div>
           
           <div className="flex items-center gap-4">
              <ThemeSwitcher />
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
           </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
           <div className="container max-w-7xl mx-auto">
             {children}
           </div>
        </main>

        <footer className="border-t bg-background/50 py-6 mt-auto">
           <div className="container flex flex-col items-center justify-between gap-4 md:h-10 md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center text-xs leading-loose text-muted-foreground md:text-left">
                  <Copyright />
               </div>
               <div className="sm:hidden">
                  <ThemeSwitcher />
               </div>
           </div>
        </footer>
      </div>
    </div>
  );
}