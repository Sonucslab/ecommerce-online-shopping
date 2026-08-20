import { getDbConnection } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminProductsClient } from "./AdminProductsClient";

async function getProducts() {
  try {
    const pool = await getDbConnection();
    const [products] = await pool.execute(`
      SELECT p.product_id, p.name, p.price, p.stock_quantity, p.description, p.image_url, c.category_id, c.name as category_name
      FROM Product p
      LEFT JOIN Category c ON p.category_id = c.category_id
      ORDER BY p.product_id DESC
    `);
    return products;
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const pool = await getDbConnection();
    const [categories] = await pool.execute(`SELECT category_id, name FROM Category ORDER BY name ASC`);
    return categories;
  } catch (error) {
    return [];
  }
}

export default async function AdminProductsPage() {
  const session = await getSession();
  
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div>
      <AdminProductsClient initialProducts={products} categories={categories} />
    </div>
  );
}
