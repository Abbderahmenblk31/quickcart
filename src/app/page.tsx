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
  PackageCheck,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductDetailModal } from '@/components/product/ProductDetailModal';
import { INITIAL_PRODUCTS } from '@/lib/data/catalog';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { sound } from '@/lib/audio/sound-fx';

export default function StorefrontPage() {
  const { addToCart } = useCart();
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Hero flagship showcase
  const flagshipProduct = products[0]; // AuraWave Pro ANC
  const [flagshipAdded, setFlagshipAdded] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'audio', name: 'Audio & Acoustics' },
    { id: 'wearables', name: 'Wearables & Health' },
    { id: 'electronics', name: 'Computers & Power' },
    { id: 'accessories', name: 'Desk Accessories' },
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
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, inStockOnly]);

  const handleFlagshipAdd = () => {
    sound.playEngage();
    addToCart(flagshipProduct, 1);
    setFlagshipAdded(true);
    setTimeout(() => setFlagshipAdded(false), 2000);
  };

  const handleCategorySelect = (id: string) => {
    sound.playClick(800);
    setSelectedCategory(id);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* 1. LUXURY EDITORIAL HERO BANNER                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/80 via-slate-50 to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Precision Hardware Collection 2026
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Engineered for Clarity.{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  Built for Precision.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Discover next-generation personal audio, titanium smartwatches, and desktop essentials. Delivered with complimentary express shipping on all orders over $200.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalog"
                  onClick={() => sound.playClick(750)}
                  className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/track"
                  onClick={() => sound.playClick(750)}
                  className="px-6 py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-2"
                >
                  <PackageCheck className="w-4 h-4 text-blue-500" />
                  Track Existing Order
                </Link>
              </div>

              {/* Guarantees Row */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Free express shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">2-Year global warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">30-day hassle-free returns</span>
                </div>
              </div>
            </div>

            {/* Right Hero Product Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 luxury-shadow border border-slate-200/80 dark:border-slate-800 relative overflow-hidden group">
                <div className="relative aspect-square max-h-72 mx-auto mb-6 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl">
                  <img
                    src={flagshipProduct.images[0]}
                    alt={flagshipProduct.title}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900 text-white dark:bg-blue-600 text-[10px] font-bold uppercase tracking-wider">
                    Editor&apos;s Pick
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                      {flagshipProduct.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{flagshipProduct.rating} / 5.0</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {flagshipProduct.title}
                  </h3>

                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ${flagshipProduct.price.toFixed(2)}
                    </span>
                    {flagshipProduct.comparePrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ${flagshipProduct.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick(750);
                      setActiveModalProduct(flagshipProduct);
                    }}
                    className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors text-center"
                  >
                    View Specs
                  </button>

                  <button
                    onClick={handleFlagshipAdd}
                    className={`flex-1 py-3 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                      flagshipAdded
                        ? 'bg-emerald-600 text-white scale-105'
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white'
                    }`}
                  >
                    {flagshipAdded ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Quick Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORY PILLS & SEARCH CONTROLS                                       */}
      {/* ========================================================================= */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
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
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  sound.playClick(600);
                  setSortBy(e.target.value as any);
                }}
                aria-label="Sort products by"
                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-full px-4 py-2.5 pr-8 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer shadow-sm"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* In-stock toggle */}
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  sound.playClick(650);
                  setInStockOnly(e.target.checked);
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              In Stock Only
            </label>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-medium">
          <p>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredProducts.length}</strong> items
            {selectedCategory !== 'all' && (
              <span> in <strong className="capitalize text-blue-600 dark:text-blue-400">{selectedCategory}</strong></span>
            )}
            {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
          </p>
          <p className="hidden sm:inline">
            Coupon code <strong className="text-blue-600 dark:text-blue-400 font-mono">SAVE15</strong> gives 15% discount
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
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 luxury-shadow">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              No matching products found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              We couldn&apos;t find any hardware matching your filter criteria. Try resetting your search.
            </p>
            <button
              onClick={() => {
                sound.playClick(800);
                setSelectedCategory('all');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="px-5 py-2.5 rounded-full bg-slate-900 text-white dark:bg-blue-600 font-bold text-xs shadow"
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
