"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddToCartButton({ productId, stockQty, className }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1, customer_id: 1 })
      });
      
      if (res.ok) {
        // We could show a toast here
        router.push('/cart');
      }
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
