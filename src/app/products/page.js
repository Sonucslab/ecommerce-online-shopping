import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, Filter, PackageOpen } from "lucide-react";
import Link from "next/link";
import { getDbConnection } from "@/lib/db";
import { AddToCartButton } from "@/components/AddToCartButton";

async function getProductsAndCategories(categoryId) {
  try {
    const pool = await getDbConnection();
    let query = `
      SELECT p.*, c.name as category_name 
      FROM Product p 
      LEFT JOIN Category c ON p.category_id = c.category_id
    `;
    const params = [];
    
    if (categoryId) {
      query += ` WHERE p.category_id = ?`;
      params.push(categoryId);
    }
    
    query += ` ORDER BY p.product_id DESC`;
    
    const [products] = await pool.execute(query, params);
    const [categories] = await pool.execute('SELECT * FROM Category ORDER BY name ASC');
    
    return { products, categories };
  } catch (error) {
    console.error("Error fetching products and categories:", error);
    return { products: [], categories: [] };
  }
}

export default async function ProductsPage({ searchParams }) {
  const { category } = await searchParams;
  const { products, categories } = await getProductsAndCategories(category);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" /> Filters
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products" className="hover:text-primary">All Products</Link></li>
                {categories.map(cat => (
                  <li key={cat.category_id}>
                    <Link href={`/products?category=${cat.category_id}`} className="hover:text-primary">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <span className="text-muted-foreground text-sm">{products.length} results</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-muted/50 rounded-lg border border-dashed">
            <PackageOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium">No Products Found</h3>
            <p className="text-muted-foreground">Make sure you have imported the database schema and sample data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.product_id} className="flex flex-col group">
                <Link href={`/products/${product.product_id}`} className="flex-1">
                  <div className="h-48 bg-white dark:bg-zinc-900 flex items-center justify-center p-6 rounded-t-xl overflow-hidden relative">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pt-4 px-4 pb-0">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.category_name || 'Uncategorized'}</span>
                    <CardTitle className="text-lg line-clamp-1 mt-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                    <CardDescription className="text-primary font-bold text-lg mt-1">${Number(product.price).toFixed(2)}</CardDescription>
                  </CardHeader>
                </Link>
                <CardFooter className="p-4 mt-auto">
                  <AddToCartButton productId={product.product_id} stockQty={product.stock_quantity} className="w-full h-10 text-sm" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
