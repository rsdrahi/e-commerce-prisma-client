import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { Product, Category, ApiResponse } from "@/types";
import { ProductCard } from "@/components/shop/ProductCard";

export const revalidate = 60; // Revalidate every minute

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

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Elevate Your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Everyday Style.
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover our curated collection of premium products designed for modern life. Exceptional quality meets minimal aesthetics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="bg-white text-black px-8 py-3.5 rounded-full font-medium text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group"
              >
                Shop Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/categories"
                className="border border-white/20 px-8 py-3.5 rounded-full font-medium text-lg hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Browse Categories
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="aspect-4/3 sm:aspect-video lg:aspect-square relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070"
                alt="Premium Shopping"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 p-3 rounded-full text-amber-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Shopping</h3>
                <p className="text-sm text-gray-500">Safe and encrypted payments</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                <p className="text-sm text-gray-500">Free shipping on orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-full text-green-600">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                <p className="text-sm text-gray-500">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Categories</h2>
              <p className="text-gray-500">Explore our wide range of collections</p>
            </div>
            <Link href="/categories" className="text-amber-600 font-medium hover:text-amber-700 hidden sm:flex items-center gap-1 group">
              View All
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.name}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all aspect-square sm:aspect-[4/3] flex items-center justify-center border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-white relative z-20 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
            {categories.length === 0 && (
              <p className="text-gray-500 col-span-full">No categories found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-500">Top picks for you</p>
            </div>
            <Link href="/products" className="text-amber-600 font-medium hover:text-amber-700 hidden sm:flex items-center gap-1 group">
              View All
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {featuredProducts.length === 0 && (
              <p className="text-gray-500 col-span-full">No products found.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
