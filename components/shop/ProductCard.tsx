"use client";

import Link from "next/link";
import { Product } from "@/types";
import { ShoppingBag, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const placeholderImg = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80";
  const imgSrc = product.imageUrl || placeholderImg;

  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          ${product.price.toFixed(2)}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 font-medium tracking-wider uppercase mb-1">
          {product.category?.name || "Category"}
        </div>
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
          {product.description || "No description available."}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-medium text-gray-700">4.5</span>
            <span className="text-xs text-gray-400 ml-1">(12)</span>
          </div>
          <button 
            className="flex items-center justify-center bg-black text-white p-2 rounded-full hover:bg-gray-800 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic will go here
            }}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
