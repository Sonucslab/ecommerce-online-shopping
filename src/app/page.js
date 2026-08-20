import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Zap, ShieldCheck, Truck, PackageOpen } from "lucide-react";
import { getDbConnection } from "@/lib/db";

async function getFeaturedProducts() {
  try {
    const pool = await getDbConnection();
    const [rows] = await pool.execute(
      `SELECT * FROM Product ORDER BY product_id DESC LIMIT 8`
    );
    return rows;
  } catch (error) {
    // Only log the message to avoid Next.js crashing when trying to serialize AggregateError
    console.error("Error fetching featured products:", error?.message || "Database connection failed");
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-background py-20 px-4 text-center border-b">
        <div className="container mx-auto max-w-4xl space-y-6">
          <Badge variant="secondary" className="mb-4">New Arrivals Just Landed</Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Next-Gen Tech, <br /> Delivered Today.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the latest electronics, smartphones, and accessories. Premium quality with unbeatable prices.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/products">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/categories">View Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="text-center pb-2">
              <Zap className="h-10 w-10 mx-auto text-primary mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Experience unparalleled speed and performance with our latest processors.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center pb-2">
              <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-2" />
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Your transactions are protected with military-grade encryption.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center pb-2">
              <Truck className="h-10 w-10 mx-auto text-primary mb-2" />
              <CardTitle>Free Shipping</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Get free standard shipping on all orders over $99 anywhere.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground mt-1">Our most popular premium tech.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        
        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg border border-dashed">
             <PackageOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
             <h3 className="text-lg font-medium">No Products Found</h3>
             <p className="text-muted-foreground">Make sure you have imported the database schema and sample data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
                  <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                  <CardDescription className="text-primary font-bold text-lg mt-1">${Number(product.price).toFixed(2)}</CardDescription>
                </CardHeader>
                </Link>
                <CardFooter className="p-4 mt-auto">
                  <AddToCartButton product={product} stockQty={product.stock_quantity} className="w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
