'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  PackageCheck,
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductDetailModal } from '@/components/product/ProductDetailModal';
import { INITIAL_PRODUCTS } from '@/lib/data/catalog';
import { Product } from '@/lib/types';

export default function StorefrontPage() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', name: 'All Gear' },
    { id: 'audio', name: 'Audio' },
    { id: 'wearables', name: 'Wearables' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'accessories', name: 'Accessories' },
  ];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          Object.values(p.specs).some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStock = inStockOnly ? p.stockQuantity > 0 : true;

        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured maintains curated order
      });
  }, [products, selectedCategory, searchQuery, sortBy, inStockOnly]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Headless E-Commerce 2026 Edition
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Precision Gear for{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              High-Performance
            </span>{' '}
            Minds.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Experience sub-second headless shopping with instant client-side cart updates,
            real-time stock reservations, and automated parcel tracking.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#catalog"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center gap-2 group"
            >
              Shop Catalog
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              href="/track"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
            >
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              Track Package
            </Link>

            <Link
              href="/admin"
              className="px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white font-medium text-sm border border-slate-800 transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Fulfillment Admin
            </Link>
          </div>

          {/* Quick Value Badges */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Free Express Shipping</p>
                <p className="text-[11px] text-slate-400">Orders over $200</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">2-Year Warranty</p>
                <p className="text-[11px] text-slate-400">100% Genuine Hardware</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">30-Day Free Returns</p>
                <p className="text-[11px] text-slate-400">Zero hassle guarantee</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instant Dispatch</p>
                <p className="text-[11px] text-slate-400">Dispatches in &lt; 24h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Search & Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search, Sort, and In-Stock */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="appearance-none bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2 pr-8 text-xs sm:text-sm font-medium text-slate-300 outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* In-stock toggle */}
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              In Stock Only
            </label>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <p>
            Showing <span className="font-semibold text-white">{filteredProducts.length}</span> items
            {selectedCategory !== 'all' && (
              <span> in <span className="text-indigo-400 capitalize">{selectedCategory}</span></span>
            )}
            {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
          </p>
          <p className="text-slate-500">
            Promo code <span className="text-indigo-400 font-mono font-bold">SAVE15</span> available at checkout
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/80">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No products found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              We couldn&apos;t find any items matching your filters or search term. Try resetting your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
}
