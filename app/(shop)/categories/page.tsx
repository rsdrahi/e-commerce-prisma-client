import Link from "next/link";
import { api } from "@/lib/api";
import { Category, ApiResponse } from "@/types";
import { ArrowRight } from "lucide-react";

export const revalidate = 60;

async function getCategories() {
  try {
    const res: ApiResponse<Category[]> = await api("/categories");
    return res.success ? res.data : [];
  } catch (error) {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Shop by Category</h1>
          <p className="text-lg text-gray-500">
            Explore our diverse collections tailored for your lifestyle. Find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-500 border border-gray-100 flex flex-col items-center justify-center p-12 aspect-[4/3]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <h2 className="text-2xl font-bold text-gray-900 relative z-10 mb-2 group-hover:scale-110 transition-transform duration-500">
                {category.name}
              </h2>
              
              <div className="flex items-center gap-2 text-amber-600 font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 relative z-10 mt-4">
                Explore Collection <ArrowRight size={16} />
              </div>
            </Link>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 text-lg">No categories available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
