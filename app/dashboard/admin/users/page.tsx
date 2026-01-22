import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Truck, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

export default function UsersHubPage() {
  const sections = [
    {
      title: "Riders",
      description: "Manage delivery riders",
      icon: Users,
      href: "/dashboard/admin/users/riders",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Customers",
      description: "Manage customer accounts",
      icon: User,
      href: "/dashboard/admin/users/customers",
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "SMEs",
      description: "Manage small businesses",
      icon: ShoppingBag,
      href: "/dashboard/admin/users/smes",
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      title: "Logistics",
      description: "Manage logistics companies",
      icon: Truck,
      href: "/dashboard/admin/users/logistics",
      color: "text-orange-500",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Select a user type to manage accounts.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Link key={section.title} href={section.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                <div className={`p-2 rounded-full ${section.bgColor}`}>
                  <section.icon className={`h-4 w-4 ${section.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
