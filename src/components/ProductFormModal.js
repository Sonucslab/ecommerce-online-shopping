"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProductFormModal({ isOpen, onClose, onSave, product = null, categories = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    image_url: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock_quantity: product.stock_quantity || "",
        category_id: product.category_id || "",
        image_url: product.image_url || ""
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category_id: "",
        image_url: ""
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = product ? `/api/admin/products/${product.product_id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      onSave(); // Refresh data
      onClose(); // Close modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
          
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" required value={formData.name} onChange={handleChange} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea 
              id="description" 
              value={formData.description} 
              onChange={handleChange}
              className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" step="0.01" required value={formData.price} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input id="stock_quantity" type="number" required value={formData.stock_quantity} onChange={handleChange} className="mt-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="category_id">Category</Label>
            <select 
              id="category_id"
              value={formData.category_id} 
              onChange={handleChange}
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&>option]:bg-background [&>option]:text-foreground"
            >
              <option value="">Select a category...</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" type="url" value={formData.image_url} onChange={handleChange} className="mt-1" placeholder="https://..." />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
