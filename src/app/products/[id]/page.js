import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDbConnection } from "@/lib/db";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";

async function getProduct(id) {
  try {
    const pool = await getDbConnection();
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM Product p 
       LEFT JOIN Category c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [id]
    );
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 flex items-center justify-center min-h-[400px] md:min-h-[600px] border">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="max-w-full max-h-[500px] object-contain hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center">
              <Package className="h-16 w-16 mb-4 opacity-50" />
              <span>No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit mb-4">{product.category_name || 'Uncategorized'}</Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {product.name}
          </h1>
          
          <div className="text-3xl font-extrabold text-primary mb-6">
            ${Number(product.price).toFixed(2)}
          </div>
          
          <div className="prose prose-zinc dark:prose-invert mb-8 max-w-none text-muted-foreground">
            <p>{product.description}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-sm">
              <Package className="mr-3 h-5 w-5 text-primary" />
              <span className={product.stock_qty > 0 ? "text-green-600 dark:text-green-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
                {product.stock_qty > 0 ? `${product.stock_qty} in stock` : 'Out of stock'}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Truck className="mr-3 h-5 w-5 text-primary" />
              Free shipping on orders over $99
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ShieldCheck className="mr-3 h-5 w-5 text-primary" />
              1 Year Extended Warranty
            </div>
          </div>

          <div className="mt-auto pt-8 border-t flex flex-col sm:flex-row gap-4">
            <AddToCartButton productId={product.product_id} stockQty={product.stock_quantity} />
          </div>
        </div>
      </div>
    </div>
  );
}
