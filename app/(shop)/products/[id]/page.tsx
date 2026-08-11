import { api } from "@/lib/api";
import { Product, ApiResponse } from "@/types";
import { Star, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/shop/ProductActions";
import { ReviewSection } from "@/components/shop/ReviewSection";

export const revalidate = 60;

async function getProduct(id: string) {
  try {
    const res: ApiResponse<Product> = await api(`/products/${id}`);
    return res.success ? res.data : null;
  } catch (error) {
    return null;
  }
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const placeholderImg = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80`;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
              <img
                src={product.imageUrl || placeholderImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:border-black transition-colors">
                  <img
                    src={product.imageUrl || placeholderImg}
                    alt={`${product.name} thumbnail ${i}`}
                    className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6 border-b border-gray-100 pb-6">
              <div className="text-sm font-medium tracking-wider uppercase text-amber-600 mb-2">
                {product.category?.name || "Category"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-medium text-amber-700">4.8 (120 reviews)</span>
                </div>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
              <p>{product.description || "No description provided."}</p>
            </div>

            <ProductActions product={product} />

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-8 mt-auto">
              <div className="flex items-start gap-3">
                <Truck className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Free Shipping</h4>
                  <p className="text-xs text-gray-500">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Easy Returns</h4>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Secure Payment</h4>
                  <p className="text-xs text-gray-500">Your data is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
}
