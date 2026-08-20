"use client";

const CART_KEY = 'nexus_shop_cart';

export function getCart() {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CART_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
}

export function saveCart(cart) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('cartUpdated'));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.product_id === product.product_id);

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    // We store necessary product info in local storage so the cart page doesn't need to fetch
    cart.push({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: quantity
    });
  }
  saveCart(cart);
}

export function updateQuantity(productId, quantity) {
  let cart = getCart();
  const index = cart.findIndex(item => item.product_id === productId);
  
  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    saveCart(cart);
  }
}

export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.product_id !== productId);
  saveCart(cart);
}

export function clearCart() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('cartUpdated'));
  }
}
