"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { Edit2 } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api("/orders");
      if (res.success) setOrders(res.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await api(`/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">Orders Management</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Products</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{order.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{order.user?.name || order.userId}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    {order.items?.map(item => (
                      <span key={item.id}>
                        {item.quantity}x {item.product?.name || 'Unknown'}
                      </span>
                    ))}
                    {(!order.items || order.items.length === 0) && (
                      <span className="text-gray-400 italic">No items</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 
                      order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' : 
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELED">CANCELED</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
