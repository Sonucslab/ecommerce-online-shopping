import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Zap, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Dummy Product 1 */}
          <Card className="flex flex-col group">
            <Link href="/products/1" className="flex-1">
            <div className="h-48 bg-white dark:bg-zinc-900 flex items-center justify-center p-6 rounded-t-xl overflow-hidden">
               <img src="https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg" alt="Monitor" className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <CardHeader className="pt-4 px-4 pb-0">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">Samsung 49-Inch CHG90</CardTitle>
              <CardDescription className="text-primary font-bold text-lg mt-1">$999.99</CardDescription>
            </CardHeader>
            </Link>
            <CardFooter className="p-4 mt-auto">
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
          
           {/* Dummy Product 2 */}
          <Card className="flex flex-col group">
            <Link href="/products/2" className="flex-1">
            <div className="h-48 bg-white dark:bg-zinc-900 flex items-center justify-center p-6 rounded-t-xl overflow-hidden">
               <img src="https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg" alt="Monitor" className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <CardHeader className="pt-4 px-4 pb-0">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">Acer SB220Q 21.5"</CardTitle>
              <CardDescription className="text-primary font-bold text-lg mt-1">$599.00</CardDescription>
            </CardHeader>
            </Link>
            <CardFooter className="p-4 mt-auto">
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>

           {/* Dummy Product 3 */}
          <Card className="flex flex-col group">
            <Link href="/products/3" className="flex-1">
            <div className="h-48 bg-white dark:bg-zinc-900 flex items-center justify-center p-6 rounded-t-xl overflow-hidden">
               <img src="https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg" alt="Drive" className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <CardHeader className="pt-4 px-4 pb-0">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">WD 2TB Elements SSD</CardTitle>
              <CardDescription className="text-primary font-bold text-lg mt-1">$64.00</CardDescription>
            </CardHeader>
            </Link>
            <CardFooter className="p-4 mt-auto">
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>

           {/* Dummy Product 4 */}
          <Card className="flex flex-col group">
            <Link href="/products/4" className="flex-1">
            <div className="h-48 bg-white dark:bg-zinc-900 flex items-center justify-center p-6 rounded-t-xl overflow-hidden">
               <img src="https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg" alt="SSD" className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <CardHeader className="pt-4 px-4 pb-0">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">SanDisk SSD PLUS 1TB</CardTitle>
              <CardDescription className="text-primary font-bold text-lg mt-1">$109.00</CardDescription>
            </CardHeader>
            </Link>
            <CardFooter className="p-4 mt-auto">
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
