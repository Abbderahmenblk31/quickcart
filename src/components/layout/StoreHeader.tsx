'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Zap, Truck, ShieldCheck, Terminal, Compass, Layers, Activity } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export function StoreHeader() {
  const { totalItems, subtotal, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 pb-2 backdrop-blur-md">
      {/* Micro Telemetry Dispatch Ticker */}
      <div className="max-w-7xl mx-auto mb-2.5 flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-800/80 rounded-xl px-3 sm:px-4 py-1.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-300 font-semibold tracking-wide">SYSTEM: ACTIVE</span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-400">DISPATCH LEAD: &lt; 24H</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-medium">
            ORDERS &gt; $200 SHIP FREE
          </span>
          <span className="text-zinc-600">|</span>
          <span>CODE: <strong className="text-white bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">SAVE15</strong> (-15%)</span>
        </div>
      </div>

      {/* Floating Tactical Island */}
      <div className="max-w-7xl mx-auto bg-zinc-950/90 border border-zinc-800/90 rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xl backdrop-blur-xl">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-all">
            <Zap className="w-5 h-5 text-zinc-950 fill-zinc-950" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-mono">
                QUICKCART
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                EDITION//26
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
              HEADLESS HARDWARE DEPOT
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-mono">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900/80 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>[01/CATALOG]</span>
          </Link>

          <Link
            href="/track"
            className="px-3.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900/80 transition-all flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>[02/TELEMETRY]</span>
          </Link>

          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900/80 transition-all flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>[03/DEPOT_ADMIN]</span>
          </Link>
        </nav>

        {/* Right Tactical Action: Cart Trigger Pill */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer font-mono"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline font-mono">PAYLOAD</span>
            <span className="w-5 h-5 rounded-full bg-zinc-950 text-amber-400 text-[10px] font-extrabold flex items-center justify-center">
              {totalItems}
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-zinc-900 border-l border-zinc-900/40 pl-2">
              ${subtotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
