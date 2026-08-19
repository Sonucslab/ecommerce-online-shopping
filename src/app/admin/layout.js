import Link from "next/link";
import { LayoutDashboard, Package, Users, Settings } from "lucide-react";

export default function AdminLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-foreground"
            >
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              Overview
            </Link>
            
            <Link 
              href="/admin/products" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-foreground"
            >
              <Package className="h-5 w-5 text-muted-foreground" />
              Products
            </Link>

            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-muted-foreground cursor-not-allowed opacity-50"
            >
              <Users className="h-5 w-5" />
              Customers
            </Link>

            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors text-muted-foreground cursor-not-allowed opacity-50"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
        
      </div>
    </div>
  );
}
