import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="bg-black text-white p-1.5 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">ShopSphere</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Premium e-commerce platform delivering high quality products with exceptional customer experience.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm tracking-wider uppercase">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-gray-500 hover:text-black text-sm transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="text-gray-500 hover:text-black text-sm transition-colors">Categories</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">New Arrivals</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Featured</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm tracking-wider uppercase">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm tracking-wider uppercase">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>Designed for excellence.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
