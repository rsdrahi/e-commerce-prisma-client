"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { toast } from "sonner";
import { Edit2, Trash2, Plus, X } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api("/categories");
      if (res.success) setCategories(res.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingId) {
        const res = await api(`/categories/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
        if (res.success) {
          toast.success("Category updated");
          setIsModalOpen(false);
          fetchCategories();
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await api("/categories", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        if (res.success) {
          toast.success("Category created");
          setIsModalOpen(false);
          fetchCategories();
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
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const res = await api(`/categories/${id}`, { method: "DELETE" });
      if (res.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData({ name: category.name });
    } else {
      setEditingId(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">Categories Management</h3>
        <button
          onClick={() => openModal()}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{category.id}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(category.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openModal(category)} className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                  placeholder="e.g. Electronics"
                />
              </div>
              <div className="flex justify-end gap-3">
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
                  {submitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
