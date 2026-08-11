"use client";

import Link from "next/link";
import { ShoppingBag, User, LogOut, Menu, X, Shield, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, isAuthenticated, logout, init } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    init();
    setMounted(true);
  }, [init]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
  ];

  if (isAuthenticated && user?.role === 'USER') {
    navLinks.push({ name: "Orders", href: "/orders" });
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-black text-white p-1.5 rounded-lg group-hover:bg-gray-800 transition-colors">
                <ShoppingBag size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">ShopSphere</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    pathname === link.href ? "text-black" : "text-gray-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
              <Link href="/cart" className="relative text-gray-500 hover:text-black transition-colors mr-2">
                <ShoppingCart size={20} />
                {mounted && getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors bg-amber-50 px-2 py-1 rounded-md"
                    >
                      <Shield size={14} />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="text-gray-500 hover:text-black transition-colors"
                    title="Profile"
                  >
                    <User size={20} />
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-black p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? "bg-gray-50 text-black"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="space-y-1">
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-amber-600 hover:bg-amber-50"
                    >
                      <Shield size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-black"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-2 rounded-md text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-2 rounded-md text-base font-medium text-white bg-black hover:bg-gray-800"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
