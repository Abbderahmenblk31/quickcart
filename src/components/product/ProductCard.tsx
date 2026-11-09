'use client';

import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCart();

  const discountPct = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div className="group relative bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col">
      {/* Product Image Container */}
      <div
        onClick={() => onViewDetails(product)}
        className="relative w-full aspect-square overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800">
            {product.category}
          </span>
          {discountPct && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              Save {discountPct}%
            </span>
          )}
        </div>

        {/* Quick View Overlay Pill */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold border border-slate-700 shadow-xl">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            Quick View
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-200">{product.rating}</span>
            <span className="text-[11px] text-slate-500">({product.reviewCount})</span>
          </div>

          <h3
            onClick={() => onViewDetails(product)}
            className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base font-extrabold text-white font-mono">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-slate-500 line-through font-mono">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            title="Add to cart"
            className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 transition-all hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
