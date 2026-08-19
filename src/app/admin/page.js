import { getDbConnection } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key");

async function getAdminStats() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "admin") return null;

    const pool = await getDbConnection();
    
    // Total Sales
    const [[{ total_sales }]] = await pool.execute(`SELECT SUM(total_amount) as total_sales FROM \`Order\``);
    
    // Total Orders
    const [[{ total_orders }]] = await pool.execute(`SELECT COUNT(*) as total_orders FROM \`Order\``);
    
    // Total Products
    const [[{ total_products }]] = await pool.execute(`SELECT COUNT(*) as total_products FROM Product`);
    
    // Recent Orders
    const [recent_orders] = await pool.execute(`
      SELECT o.order_id, o.total_amount, o.status, o.order_date, c.first_name, c.last_name
      FROM \`Order\` o
      JOIN Customer c ON o.customer_id = c.customer_id
      ORDER BY o.order_date DESC
      LIMIT 5
    `);

    return {
      totalSales: parseFloat(total_sales || 0).toFixed(2),
      totalOrders: total_orders || 0,
      totalProducts: total_products || 0,
      recentOrders: recent_orders
    };
  } catch (err) {
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  if (!stats) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard Overview</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-xl shadow-sm p-6 border">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-primary">${stats.totalSales}</p>
        </div>
        <div className="bg-card rounded-xl shadow-sm p-6 border">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
        </div>
        <div className="bg-card rounded-xl shadow-sm p-6 border">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.recentOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 text-foreground font-medium">#{order.order_id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.first_name} {order.last_name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
