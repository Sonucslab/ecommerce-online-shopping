'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { getCart, clearCart } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Read cart from localStorage
    const items = getCart();
    setCartItems(items);
    if (items.length > 0) {
      const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
      setCartTotal(total);
    }
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          payment_method: 'credit_card',
          cart_items: cartItems 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(data.error || 'Checkout failed');
      }

      setSuccess(true);
      clearCart(); // Clear localStorage cart after successful order
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="h-24 w-24 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-4">Order Placed Successfully!</h1>
        <p className="text-lg text-muted-foreground mb-8">Thank you for your purchase. Your order is being processed.</p>
        <Button onClick={() => router.push('/products')} size="lg">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <CreditCard className="mr-2" /> Payment Details
          </h2>
          
          <form onSubmit={handleCheckout} className="space-y-6">
            {error && <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" required placeholder="John Doe" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" required placeholder="0000 0000 0000 0000" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" required placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" required placeholder="123" />
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <div className="flex justify-between items-center mb-6 text-xl font-bold">
                <span>Total Amount:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <Button type="submit" className="w-full text-lg py-6" disabled={loading || cartTotal === 0}>
                {loading ? 'Processing Transaction...' : 'Confirm & Pay'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
