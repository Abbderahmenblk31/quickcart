import React from 'react';
import { Zap, ShieldCheck, RotateCcw, Truck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950 mt-auto transition-colors duration-200">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Complimentary Delivery</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Free express courier delivery on all orders over $200.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Official 2-Year Warranty</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">100% authentic hardware guaranteed directly by manufacturers.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">30-Day Free Returns</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Zero hassle returns and instant full refunds.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center text-xs">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">QuickCart Pro Storefront</span>
          <span>&bull;</span>
          <span>Developer Portfolio Showcase</span>
        </div>
        <div>
          <span>Next.js 16 &bull; TypeScript &bull; Tailwind CSS v4 &bull; Dual Day/Night Engine</span>
        </div>
      </div>
    </footer>
  );
}
