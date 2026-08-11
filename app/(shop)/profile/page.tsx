"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { User, LogOut, Package, Settings, CreditCard } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, init } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem("token")) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600 mb-4">
                {user.name?.charAt(0) || "U"}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{user.email}</p>
              <div className="inline-block bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                {user.role}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <Link href="/profile" className="flex items-center gap-3 px-6 py-4 text-amber-600 font-medium bg-amber-50/50 border-l-2 border-amber-500">
                <User size={18} />
                Profile Settings
              </Link>
              <Link href="/orders" className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors">
                <Package size={18} />
                My Orders
              </Link>
              <button className="w-full flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors text-left">
                <CreditCard size={18} />
                Payment Methods
              </button>
              <button className="w-full flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors text-left">
                <Settings size={18} />
                Preferences
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-50">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="button" className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
