"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { api } from "@/lib/api";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to checkout");
      router.push("/login?redirect=/cart");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);

    try {
      const payload = {
        total: getTotal(),
        userId: user.id,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      const res = await api("/orders", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.success) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/orders");
      } else {
        toast.error(res.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("An error occurred during checkout");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-md w-full">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center w-full bg-black text-white px-6 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start border border-gray-100">
                <div className="w-32 h-32 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <img
                    src={item.product.imageUrl || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80`}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between h-full min-h-[128px] w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/products/${item.product.id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{item.product.category?.name}</p>
                    </div>
                    <p className="font-bold text-lg text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-end mt-6 sm:mt-0">
                    <div className="flex items-center border border-gray-200 rounded-full bg-white h-10">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="px-3 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                        className="px-3 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-black text-white py-4 px-6 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  "Processing..."
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
              
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  You will be asked to log in before checking out.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
