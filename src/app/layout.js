import { Inter } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Bolt } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexus Electronics",
  description: "Modern E-Commerce Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Bolt className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">Nexus<span className="text-primary">Electronics</span></span>
            </Link>
            
            <div className="hidden md:flex gap-6 items-center font-medium">
              <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</Link>
              <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/cart" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                </Link>
              </Button>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-muted/20">
          {children}
        </main>
        <footer className="border-t py-6 md:py-0 bg-background">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Nexus Electronics. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
