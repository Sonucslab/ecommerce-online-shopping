"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, Settings } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "#", label: "Customers", icon: Users, disabled: true },
    { href: "#", label: "Settings", icon: Settings, disabled: true },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 md:sticky md:top-24 md:h-[calc(100vh-8rem)]">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          if (item.disabled) {
            return (
              <div 
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </div>
            );
          }
          
          return (
            <Link 
              key={item.label}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted/50 text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
