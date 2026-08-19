import { getSession } from "@/lib/auth";
import { getDbConnection } from "@/lib/db";
import { redirect } from "next/navigation";
import { PackageOpen, User } from "lucide-react";

async function getCustomerOrders(customerId) {
  try {
    const pool = await getDbConnection();
    const [orders] = await pool.execute(`
      SELECT o.order_id, o.total_amount, o.status, o.order_date
      FROM \`Order\` o
      WHERE o.customer_id = ?
      ORDER BY o.order_date DESC
    `, [customerId]);
    return orders;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }
}

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const orders = await getCustomerOrders(session.customer_id);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Account</h1>
          <p className="text-muted-foreground">Welcome back, {session.first_name}!</p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <PackageOpen className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Order History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 text-foreground font-medium">#{order.order_id}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium text-right">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">
                    <PackageOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>You haven't placed any orders yet.</p>
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
