import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, Filter } from "lucide-react";
import Link from "next/link";

// Dummy data for visual presentation
const dummyProducts = [
  { id: 1, name: "Samsung 49-Inch CHG90", price: 999.99, category: "Monitors", image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg" },
  { id: 2, name: "Acer SB220Q 21.5\"", price: 599.00, category: "Monitors", image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg" },
  { id: 3, name: "WD 2TB Elements SSD", price: 64.00, category: "Storage", image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg" },
  { id: 4, name: "SanDisk SSD PLUS 1TB", price: 109.00, category: "Storage", image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg" },
  { id: 5, name: "Logitech MX Master 3", price: 99.99, category: "Accessories", image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg" }, // Reuse for visual
  { id: 6, name: "Keychron K2 Keyboard", price: 79.99, category: "Accessories", image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg" } // Reuse for visual
];

export default function ProductsPage() {
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
                <li><Link href="#" className="hover:text-primary">All Products</Link></li>
                <li><Link href="#" className="hover:text-primary">Monitors</Link></li>
                <li><Link href="#" className="hover:text-primary">Storage</Link></li>
                <li><Link href="#" className="hover:text-primary">Accessories</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <span className="text-muted-foreground text-sm">{dummyProducts.length} results</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dummyProducts.map((product) => (
            <Card key={product.id} className="flex flex-col group">
              <Link href={`/products/${product.id}`} className="flex-1">
                <div className="h-48 bg-white dark:bg-zinc-900 flex items-center justify-center p-6 rounded-t-xl overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
                <CardHeader className="pt-4 px-4 pb-0">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.category}</span>
                  <CardTitle className="text-lg line-clamp-1 mt-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                  <CardDescription className="text-primary font-bold text-lg mt-1">${product.price.toFixed(2)}</CardDescription>
                </CardHeader>
              </Link>
              <CardFooter className="p-4 mt-auto">
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
