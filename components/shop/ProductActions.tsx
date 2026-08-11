"use client";

import { useState } from "react";
import { Product } from "@/types";
import { ShoppingBag, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cartStore";
import { useRouter } from "next/navigation";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(state => state.addToCart);
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  return (
    <div className="mb-10 space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-full bg-white h-14">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 h-full text-gray-500 hover:text-black transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-4 h-full text-gray-500 hover:text-black transition-colors"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 bg-white border-2 border-black text-black px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed h-14"
        >
          <ShoppingBag size={20} />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="flex-1 bg-black border-2 border-black text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed h-14"
        >
          <CreditCard size={20} />
          Buy Now
        </button>
      </div>
      {product.stock > 0 ? (
        <p className="text-sm text-green-600 font-medium">In stock ({product.stock} available)</p>
      ) : (
        <p className="text-sm text-red-600 font-medium">Currently out of stock</p>
      )}
    </div>
  );
}
