import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Truck, PackageOpen, Camera, Laptop, Smartphone, Headphones, Watch } from "lucide-react";
import { getDbConnection } from "@/lib/db";

async function getProductsByCategories() {
  try {
    const pool = await getDbConnection();
    
    // We want to feature specific categories
    const categoriesToFeature = [
      { id: 1, name: 'Laptops', icon: Laptop, color: 'from-blue-500 to-cyan-500' },
      { id: 2, name: 'Smartphones', icon: Smartphone, color: 'from-purple-500 to-pink-500' },
      { id: 8, name: 'Cameras', icon: Camera, color: 'from-amber-500 to-orange-500' },
      { id: 5, name: 'Audio', icon: Headphones, color: 'from-emerald-500 to-teal-500' }
    ];

    const categoryData = [];

    for (const cat of categoriesToFeature) {
      const [products] = await pool.execute(
        `SELECT * FROM Product WHERE category_id = ? ORDER BY product_id DESC LIMIT 4`,
        [cat.id]
      );
      
      if (products.length > 0) {
        categoryData.push({
          ...cat,
          products
        });
      }
    }
    
    return categoryData;
  } catch (error) {
    console.error("Error fetching featured products:", error?.message || "Database connection failed");
    return [];
  }
}

export default async function Home() {
  const categorySections = await getProductsByCategories();

  return (
    <div className="flex flex-col gap-16 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-background pt-24 pb-32 px-4 text-center border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto max-w-5xl space-y-8 relative z-10">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            New Arrivals Just Landed
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
            Next-Gen Tech, <br />
            <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Delivered Today.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Discover the latest electronics, smartphones, and accessories. Premium quality with unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" className="rounded-full h-14 px-8 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" asChild>
              <Link href="/products">
                Shop All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg bg-background/50 backdrop-blur-sm" asChild>
              <Link href="/categories">View Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="text-center pb-2">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Experience unparalleled speed and performance with our latest tech.
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="text-center pb-2">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-7 w-7 text-indigo-500" />
              </div>
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Your transactions are protected with military-grade encryption.
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="text-center pb-2">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-7 w-7 text-emerald-500" />
              </div>
              <CardTitle>Free Shipping</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Get free standard shipping on all orders over $99 anywhere.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dynamic Category Sections */}
      {categorySections.length === 0 ? (
        <section className="container mx-auto px-4">
          <div className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed">
            <PackageOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Make sure you have imported the database schema and sample data.</p>
          </div>
        </section>
      ) : (
        <div className="space-y-24">
          {categorySections.map((section, index) => {
            const Icon = section.icon;
            const isEven = index % 2 === 0;
            
            return (
              <section key={section.id} className="relative">
                {/* Decorative background element */}
                <div className={`absolute top-0 w-full h-full -z-10 ${isEven ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-transparent via-${section.color.split(' ')[0].replace('from-', '')}/5 to-transparent opacity-50`} />
                
                <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold tracking-tight">{section.name}</h2>
                        <p className="text-muted-foreground mt-1">Top picks in {section.name.toLowerCase()}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-full group" asChild>
                      <Link href={`/categories/${section.id}`}>
                        Explore Category <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {section.products.map((product) => (
                      <Card key={product.product_id} className="flex flex-col group border-transparent hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm">
                        <Link href={`/products/${product.product_id}`} className="flex-1">
                          <div className="h-56 bg-white dark:bg-zinc-900/50 flex items-center justify-center p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out relative z-20 mix-blend-multiply dark:mix-blend-normal" />
                            ) : (
                              <div className="h-full w-full bg-muted/50 flex items-center justify-center rounded-lg">
                                <span className="text-muted-foreground text-sm font-medium">No Image</span>
                              </div>
                            )}
                          </div>
                          <CardHeader className="pt-5 px-5 pb-0">
                            <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                            <CardDescription className="text-foreground font-black text-xl mt-2 tracking-tight">${Number(product.price).toFixed(2)}</CardDescription>
                          </CardHeader>
                        </Link>
                        <CardFooter className="p-5 mt-auto">
                          <AddToCartButton product={product} stockQty={product.stock_quantity} className="w-full rounded-full" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
