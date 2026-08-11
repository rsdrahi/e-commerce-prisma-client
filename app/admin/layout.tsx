"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Grid, Users, ShoppingCart, LogOut, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, init } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    if (user && user.role === "ADMIN") {
      setLoading(false);
    }
  }, [isAuthenticated, user, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Authenticating...</div>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Products", href: "/admin/products", icon: <Package size={20} /> },
    { name: "Categories", href: "/admin/categories", icon: <Grid size={20} /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black text-white flex flex-col min-h-screen sticky top-0">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-amber-500 text-black px-2 rounded">S</span> Admin
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                pathname === item.href
                  ? "bg-amber-500 text-black font-medium"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-colors">
            <ArrowLeft size={20} />
            Back to Shop
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {pathname.split("/").pop() === "admin" ? "Dashboard" : pathname.split("/").pop()}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Admin: {user?.name}
              </span>
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
