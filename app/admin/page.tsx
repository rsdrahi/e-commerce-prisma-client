"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Users, Package, ShoppingCart, Grid, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    categories: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
          api("/users"),
          api("/products"),
          api("/orders"),
          api("/categories"),
        ]);

        const totalRevenue = ordersRes.success 
          ? ordersRes.data.reduce((acc: number, order: any) => acc + (order.total || 0), 0) 
          : 0;

        setStats({
          users: usersRes.success ? usersRes.data.length : 0,
          products: productsRes.success ? productsRes.data.length : 0,
          orders: ordersRes.success ? ordersRes.data.length : 0,
          categories: categoriesRes.success ? categoriesRes.data.length : 0,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: <TrendingUp size={24} className="text-emerald-500" />, bg: "bg-emerald-50" },
    { title: "Total Orders", value: stats.orders, icon: <ShoppingCart size={24} className="text-blue-500" />, bg: "bg-blue-50" },
    { title: "Total Products", value: stats.products, icon: <Package size={24} className="text-amber-500" />, bg: "bg-amber-50" },
    { title: "Total Users", value: stats.users, icon: <Users size={24} className="text-purple-500" />, bg: "bg-purple-50" },
  ];

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Analytics coming soon...
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/products" className="p-4 rounded-xl border border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-700 hover:text-amber-700">
              <Package size={24} />
              <span className="font-medium">Manage Products</span>
            </a>
            <a href="/admin/orders" className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-700 hover:text-blue-700">
              <ShoppingCart size={24} />
              <span className="font-medium">View Orders</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
