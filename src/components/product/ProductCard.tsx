'use client';

import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { sound } from '@/lib/audio/sound-fx';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const discountPct = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playEngage();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleImageSwitch = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick(900);
    setActiveImageIndex(idx);
  };

  const firstSpecs = Object.entries(product.specs || {}).slice(0, 2);

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden luxury-shadow hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Presentation */}
      <div>
        <div
          onClick={() => {
            sound.playClick(750);
            onViewDetails(product);
          }}
          className="relative w-full aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950/60 cursor-pointer p-6 flex items-center justify-center"
        >
          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
              {product.category}
            </span>
            {discountPct && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                Save {discountPct}%
              </span>
            )}
          </div>

          {/* Stock Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${
                product.stockQuantity < 10 ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              {product.stockQuantity} in stock
            </span>
          </div>

          {/* Image Variant Selector Dots */}
          {product.images.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleImageSwitch(idx, e)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeImageIndex === idx
                      ? 'bg-slate-900 dark:bg-blue-400 w-4'
                      : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {product.rating}
            </span>
            <span className="text-xs text-slate-400">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => {
              sound.playClick(750);
              onViewDetails(product);
            }}
            className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer tracking-tight"
          >
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs strip */}
          {firstSpecs.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {firstSpecs.map(([label, val]) => (
                <span
                  key={label}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <strong className="text-slate-500 dark:text-slate-400">{label}:</strong> {val}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Pricing & Add Action */}
      <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Price
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-slate-400 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          className={`px-4 py-2.5 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
            isAdded
              ? 'bg-emerald-600 text-white scale-105'
              : 'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white hover:scale-[1.02] active:scale-95'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
