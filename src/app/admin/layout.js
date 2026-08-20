import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <AdminNav />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
        
      </div>
    </div>
  );
}
