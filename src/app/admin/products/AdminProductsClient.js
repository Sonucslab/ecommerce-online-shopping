"use client";

import { useState } from "react";
import { Package, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFormModal } from "@/components/ProductFormModal";
import { useRouter } from "next/navigation";

export function AdminProductsClient({ initialProducts, categories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const router = useRouter();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting product.");
    }
  };

  const handleSave = () => {
    // Refresh the server data
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
        <Button className="flex items-center gap-2" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">All Products ({initialProducts.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium text-right">Price</th>
                <th className="px-6 py-3 font-medium text-center">Stock</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialProducts.map((product) => (
                <tr key={product.product_id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground">#{product.product_id}</td>
                  <td className="px-6 py-4 text-foreground font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {product.category_name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium text-right">
                    ${parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.stock_quantity > 20 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : product.stock_quantity > 0
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEditProduct(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteProduct(product.product_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {initialProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        product={editingProduct} 
        categories={categories}
      />
    </>
  );
}
