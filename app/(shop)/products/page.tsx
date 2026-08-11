import { api } from "@/lib/api";
import { Product, Category, ApiResponse } from "@/types";
import { ProductCard } from "@/components/shop/ProductCard";

export const revalidate = 60;

async function getProducts() {
  try {
    const res: ApiResponse<Product[]> = await api("/products");
    return res.success ? res.data : [];
  } catch (error) {
    return [];
  }
}

async function getCategories() {
  try {
    const res: ApiResponse<Category[]> = await api("/categories");
    return res.success ? res.data : [];
  } catch (error) {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const allProducts = await getProducts();
  const categories = await getCategories();

  // Filter products by category name
  let products = allProducts;
  if (params.category) {
    products = products.filter((p) => p.category?.name === params.category);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search))
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">All Products</h1>
          <p className="mt-2 text-lg text-gray-500">
            Browse our complete collection of premium items.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/products"
                    className={`block text-sm ${
                      !params.category ? "text-amber-600 font-medium" : "text-gray-500 hover:text-black"
                    }`}
                  >
                    All Categories
                  </a>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`/products?category=${encodeURIComponent(c.name)}`}
                      className={`block text-sm ${
                        params.category === c.name
                          ? "text-amber-600 font-medium"
                          : "text-gray-500 hover:text-black"
                      }`}
                    >
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                  <p className="text-gray-500">Try adjusting your category or search filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
