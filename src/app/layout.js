import { Inter } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Bolt } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { getSession } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexus Electronics",
  description: "Modern E-Commerce Store",
};

import { ThemeProvider } from "@/components/theme-provider";

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Bolt className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">Nexus<span className="text-primary">Electronics</span></span>
            </Link>
            
            <div className="hidden md:flex gap-8 items-center font-medium text-sm">
              <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">Shop</Link>
              <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">Deals</Link>
            </div>

            <div className="flex items-center gap-2">
              {session ? (
                <>
                  {session.role === 'admin' ? (
                    <Button variant="ghost" asChild className="hidden sm:inline-flex">
                      <Link href="/admin">Admin</Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" asChild className="hidden sm:inline-flex">
                      <Link href="/account">Account</Link>
                    </Button>
                  )}
                  <SignOutButton />
                </>
              ) : (
                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="ml-2">
                <Link href="/cart" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Cart</span>
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <main className="min-h-screen bg-muted/20">
          {children}
        </main>
        <footer className="border-t py-16 bg-background mt-auto">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2">
                  <Bolt className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl tracking-tight">Nexus<span className="text-primary">Electronics</span></span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Your one-stop destination for premium electronics, next-gen tech, and unbeatable prices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                  <li><Link href="/products" className="hover:text-primary transition-colors">Special Deals</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                  <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                  <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
              <p>&copy; {new Date().getFullYear()} Nexus Electronics. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-primary transition-colors">Facebook</Link>
                <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
              </div>
            </div>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
