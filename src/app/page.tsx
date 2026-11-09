'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Zap,
  Radio,
  Cpu,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  Star,
  CheckCircle2,
  Crosshair,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductDetailModal } from '@/components/product/ProductDetailModal';
import { INITIAL_PRODUCTS } from '@/lib/data/catalog';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';

export default function StorefrontPage() {
  const { addToCart } = useCart();
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Hero flagship showcase state
  const flagshipProduct = products[0]; // AuraWave Pro ANC
  const [flagshipAdded, setFlagshipAdded] = useState(false);
  const [flagshipImageIdx, setFlagshipImageIdx] = useState(0);

  const categories = [
    { id: 'all', name: 'ALL_UNITS', code: '00' },
    { id: 'audio', name: 'AUDIO_ACOUSTICS', code: '01' },
    { id: 'wearables', name: 'WEARABLE_BIO', code: '02' },
    { id: 'electronics', name: 'CORE_COMPUTING', code: '03' },
    { id: 'accessories', name: 'TACTICAL_ACC', code: '04' },
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
    addToCart(flagshipProduct, 1);
    setFlagshipAdded(true);
    setTimeout(() => setFlagshipAdded(false), 2000);
  };

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col pb-20">
      {/* ========================================================================= */}
      {/* 1. HERO BENTO SHOWCASE (Industrial Kinetic Showcase)                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Stage Left (Col 8): Flagship Hardware Rig */}
          <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between group">
            {/* Subtle Blueprint Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50" />
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header info strip */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Crosshair className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                  FLAGSHIP_SPECIMEN // 01
                </span>
                <span className="font-mono text-[10px] text-zinc-500">
                  REF: {flagshipProduct.id}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-zinc-500">GLOBAL RATING:</span>
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  {flagshipProduct.rating} / 5.0
                </div>
              </div>
            </div>

            {/* Middle: Title & Image Stage */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
              <div className="md:col-span-6 space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none uppercase font-mono">
                  {flagshipProduct.title}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md">
                  {flagshipProduct.description}
                </p>

                {/* Live Spec Telemetry Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs">
                    <span className="text-[10px] text-zinc-500 block uppercase">Driver Unit</span>
                    <span className="font-bold text-zinc-200">40mm Beryllium</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs">
                    <span className="text-[10px] text-zinc-500 block uppercase">Battery Reserve</span>
                    <span className="font-bold text-amber-400">45H Continuous</span>
                  </div>
                </div>
              </div>

              {/* Hardware Render Container */}
              <div className="md:col-span-6 relative aspect-square max-h-80 mx-auto w-full flex items-center justify-center p-4">
                <img
                  src={flagshipProduct.images[flagshipImageIdx] || flagshipProduct.images[0]}
                  alt={flagshipProduct.title}
                  className="w-full h-full object-cover rounded-2xl drop-shadow-[0_20px_40px_rgba(249,115,22,0.15)] group-hover:scale-105 transition-transform duration-500"
                />

                {/* Thumbnail angle switcher */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-zinc-950/80 px-2.5 py-1.5 rounded-full border border-zinc-800 backdrop-blur-md">
                  {flagshipProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFlagshipImageIdx(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        flagshipImageIdx === idx ? 'bg-amber-500 scale-125' : 'bg-zinc-700 hover:bg-zinc-500'
                      }`}
                      title={`Perspective ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="relative z-10 pt-6 mt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-black text-white">
                  ${flagshipProduct.price.toFixed(2)}
                </span>
                {flagshipProduct.comparePrice && (
                  <span className="font-mono text-sm text-zinc-500 line-through">
                    ${flagshipProduct.comparePrice.toFixed(2)}
                  </span>
                )}
                <span className="font-mono text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  FREE EXPRESS SHIPPING
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveModalProduct(flagshipProduct)}
                  className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs font-bold border border-zinc-800 transition-colors"
                >
                  FULL_SPECS
                </button>

                <button
                  onClick={handleFlagshipAdd}
                  className={`px-6 py-3 rounded-xl font-mono text-xs font-black transition-all flex items-center gap-2 shadow-xl ${
                    flagshipAdded
                      ? 'bg-emerald-500 text-zinc-950 scale-105'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-orange-500/20 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {flagshipAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      <span>RESERVED TO PAYLOAD</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-zinc-950" />
                      <span>ORDER NOW • INSTANT DISPATCH</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Bento Modules Stack (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Module 1: Logistics Telemetry Dashboard */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    LOGISTICS RADAR
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">GATEWAY 2.6</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-400">Depot Throughput:</span>
                  <span className="font-bold text-white">99.8% on-time</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-400">Packaging Protocol:</span>
                  <span className="font-bold text-amber-400">Anti-Static Sealed</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-400">Carrier Partner:</span>
                  <span className="font-bold text-cyan-400">DHL Express Direct</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <Link
                  href="/track"
                  className="font-mono text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>LAUNCH TRACKER &rarr;</span>
                </Link>
                <Link
                  href="/admin"
                  className="font-mono text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  DEPOT_SYS
                </Link>
              </div>
            </div>

            {/* Module 2: Secondary Hardware Spotlight */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl flex items-center gap-4 relative overflow-hidden group">
              <img
                src={products[2].images[0]} // Titanium Smartwatch
                alt={products[2].title}
                className="w-20 h-20 rounded-2xl object-cover bg-zinc-900 border border-zinc-800 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[9px] uppercase font-bold text-amber-400 block mb-0.5">
                  SPOTLIGHT // 03
                </span>
                <h4 className="text-xs font-bold text-white truncate font-mono">
                  {products[2].title}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-sm font-bold text-white">
                    ${products[2].price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => setActiveModalProduct(products[2])}
                    className="font-mono text-[10px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
                  >
                    INSPECT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TACTICAL FILTER & CONTROL MATRIX                                       */}
      {/* ========================================================================= */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Segment Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-orange-500/20'
                      : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800'
                  }`}
                >
                  <span className="text-[10px] opacity-60">[{cat.code}]</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64 font-mono">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="FILTER_QUERY (e.g. 40mm)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-500 outline-none transition-all"
                />
              </div>

              {/* Sort Selector */}
              <div className="relative font-mono">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Order sort mode"
                  className="appearance-none bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-zinc-300 outline-none cursor-pointer"
                >
                  <option value="featured">SORT: CURATED</option>
                  <option value="price-asc">PRICE: ASCENDING</option>
                  <option value="price-desc">PRICE: DESCENDING</option>
                  <option value="rating">TOP_RATED</option>
                </select>
                <SlidersHorizontal className="w-3 h-3 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Stock Filter Checkbox */}
              <label className="flex items-center gap-2 font-mono text-xs text-zinc-400 cursor-pointer select-none bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400 bg-zinc-950"
                />
                IN_STOCK
              </label>
            </div>
          </div>

          {/* Results Metadata strip */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
            <span>
              CATALOG_COUNT: <strong className="text-zinc-200">{filteredProducts.length}</strong> ACTIVE_SKUS
            </span>
            <span className="hidden sm:inline">
              PROMO_APPLIED: <strong className="text-amber-400">SAVE15</strong> (15% OFF AT CHECKOUT)
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRODUCT CATALOG GRID                                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
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
          <div className="text-center py-20 bg-zinc-950/60 rounded-3xl border border-zinc-800">
            <Terminal className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <h3 className="font-mono text-base font-bold text-white mb-1">
              NULL_SEARCH_RESULTS
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
              No hardware units matched your exact query parameter. Reset filters to restore default inventory.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-mono font-bold text-xs shadow-md"
            >
              RESTORE_ALL_FILTERS
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
