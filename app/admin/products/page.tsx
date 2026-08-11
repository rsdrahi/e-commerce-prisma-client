"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product, Category } from "@/types";
import { toast } from "sonner";
import { Edit2, Trash2, Plus, X } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api("/products"),
        api("/categories")
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    };

    try {
      if (editingId) {
        const res = await api(`/products/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        if (res.success) {
          toast.success("Product updated");
          setIsModalOpen(false);
          fetchData();
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await api("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.success) {
          toast.success("Product created");
          setIsModalOpen(false);
          fetchData();
        } else {
          toast.error(res.message);
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await api(`/products/${id}`, { method: "DELETE" });
      if (res.success) {
        toast.success("Product deleted");
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({ 
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock: product.stock.toString(),
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || "",
      });
    } else {
      setEditingId(null);
      setFormData({ 
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        imageUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">Products Management</h3>
        <button
          onClick={() => openModal()}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=60"}
                      alt={product.name}
                      className="w-10 h-10 bg-gray-100 rounded-lg object-cover"
                    />
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{product.category?.name || "N/A"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openModal(product)} className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {submitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
