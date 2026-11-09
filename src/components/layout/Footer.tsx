import React from 'react';
import { Zap, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 mt-auto">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-center space-x-3.5 justify-center sm:justify-start">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Global Express Fulfillment</h4>
            <p className="text-[11px] text-slate-400">Zero-lag dispatch with end-to-end tracking.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3.5 justify-center sm:justify-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">256-Bit Encrypted Checkout</h4>
            <p className="text-[11px] text-slate-400">Idempotent payment security with Stripe.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3.5 justify-center sm:justify-start">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">30-Day Hassle-Free Returns</h4>
            <p className="text-[11px] text-slate-400">100% money-back satisfaction guarantee.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>QuickCart Headless Store • Project #3 in Developer Portfolio</span>
        </div>
        <div>
          <span>Next.js 15 • TypeScript Strict • Tailwind CSS • Headless Commerce</span>
        </div>
      </div>
    </footer>
  );
}
