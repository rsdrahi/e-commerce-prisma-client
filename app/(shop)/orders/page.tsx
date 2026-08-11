"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { user, isAuthenticated, init } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    // Basic auth check
    if (!isAuthenticated && !localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        if (!user) return;
        const res = await api(`/orders/user/${user.id}`);
        if (res.success) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="text-amber-500" size={20} />;
      case "CONFIRMED": return <CheckCircle className="text-blue-500" size={20} />;
      case "SHIPPED": return <Truck className="text-purple-500" size={20} />;
      case "DELIVERED": return <CheckCircle className="text-green-500" size={20} />;
      case "CANCELED": return <XCircle className="text-red-500" size={20} />;
      default: return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-700 border-amber-200";
      case "CONFIRMED": return "bg-blue-50 text-blue-700 border-blue-200";
      case "SHIPPED": return "bg-purple-50 text-purple-700 border-purple-200";
      case "DELIVERED": return "bg-green-50 text-green-700 border-green-200";
      case "CANCELED": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link href="/products" className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-gray-200 transition-colors">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="font-medium text-gray-900 font-mono text-sm">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date Placed</p>
                    <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Order Items</h4>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          <img 
                            src={item.product?.imageUrl || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80`} 
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product?.name || "Unknown Product"}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    {(!order.items || order.items.length === 0) && (
                      <p className="text-sm text-gray-500">No items found for this order.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
