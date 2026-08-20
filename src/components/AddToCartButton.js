"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";

export function AddToCartButton({ product, stockQty, className }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = () => {
    if (!product) return;
    
    setLoading(true);
    try {
      addToCart(product, 1);
      // Optional: Add a toast notification here
      router.push('/cart');
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      size="lg" 
      className={className || "flex-1 text-lg h-14"} 
      disabled={stockQty <= 0 || loading}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 h-5 w-5" /> 
      {loading ? 'Adding...' : (stockQty > 0 ? 'Add to Cart' : 'Out of Stock')}
    </Button>
  );
}
