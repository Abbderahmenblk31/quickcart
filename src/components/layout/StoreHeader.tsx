'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Zap,
  Sun,
  Moon,
  Truck,
  PackageCheck,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { sound } from '@/lib/audio/sound-fx';

export function StoreHeader() {
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();

  const handleToggleTheme = () => {
    sound.playClick(900);
    toggleTheme();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      {/* Top Free Shipping & Coupon Bar */}
      <div className="bg-slate-900 text-white dark:bg-slate-950 dark:border-b dark:border-slate-800/80 py-2 px-4 text-center text-xs flex items-center justify-between max-w-7xl mx-auto font-medium">
        <div className="flex items-center gap-2 text-slate-300">
          <Truck className="w-3.5 h-3.5 text-blue-400" />
          <span>Complimentary Express Delivery on orders over <strong>$200</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-400">
            Spring Offer: Use code{' '}
            <strong className="text-white bg-blue-600/30 px-1.5 py-0.5 rounded text-[11px] font-mono border border-blue-400/40">
              SAVE15
            </strong>{' '}
            for 15% off
          </span>

          {/* Theme Switcher ☀️ / 🌙 */}
          <button
            onClick={handleToggleTheme}
            aria-label="Toggle Day / Night mode"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer border border-slate-700"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3 h-3 text-blue-300" />
                <span className="text-[11px] font-semibold">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-amber-400" />
                <span className="text-[11px] font-semibold">Day Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => sound.playClick(800)}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                QuickCart
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                PRO
              </span>
            </div>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link
            href="/"
            onClick={() => sound.playClick(700)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Storefront
          </Link>

          <Link
            href="/track"
            onClick={() => sound.playClick(750)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <PackageCheck className="w-4 h-4 text-blue-500" />
            <span>Track Delivery</span>
          </Link>

          <Link
            href="/admin"
            onClick={() => sound.playClick(850)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Admin Console</span>
          </Link>
        </nav>

        {/* Right Actions: Bag Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick(1000);
              setIsCartOpen(true);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="w-5 h-5 rounded-full bg-white text-slate-900 dark:bg-slate-950 dark:text-blue-400 text-[10px] font-extrabold flex items-center justify-center">
              {totalItems}
            </span>
            <span className="font-semibold text-slate-300 dark:text-blue-100 hidden sm:inline pl-1 border-l border-slate-700 dark:border-blue-400/40">
              ${subtotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
