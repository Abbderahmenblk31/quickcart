'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Zap, Truck, ShieldCheck, BarChart3 } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export function StoreHeader() {
  const { totalItems, subtotal, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      {/* Free Shipping Alert Bar */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-indigo-900/60 border-b border-indigo-500/20 py-1.5 px-4 text-center text-xs text-indigo-200 flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5 text-indigo-400" />
        <span>
          Free Express Shipping on all orders over <strong>$200</strong> • Use code{' '}
          <strong className="text-white font-mono bg-indigo-500/30 px-1.5 py-0.5 rounded border border-indigo-400/30">
            SAVE15
          </strong>{' '}
          for 15% off!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              QuickCart
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Headless
              </span>
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">
            Storefront
          </Link>
          <Link href="/track" className="hover:text-white transition-colors flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            <span>Track Order</span>
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Store Admin</span>
          </Link>
        </nav>

        {/* Cart Trigger Pill */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-slate-950 animate-pulse">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden sm:inline">
              ${subtotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
