'use client';

import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col md:flex-row gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-indigo-500 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {product.category}
                </span>

                {product.stockQuantity < 10 ? (
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Only {product.stockQuantity} remaining!
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    In Stock & Ready to Ship
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white leading-snug">{product.title}</h2>

              {/* Rating */}
              <div className="flex items-center space-x-2 mt-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xs font-bold text-slate-200">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2.5 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-2xl font-extrabold text-white font-mono">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-slate-500 line-through font-mono">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Technical Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2 bg-slate-950 border border-slate-800/80 rounded-lg"
                    >
                      <span className="block text-[10px] text-slate-500">{key}</span>
                      <span className="font-semibold text-slate-200 truncate block">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-6 mt-6 border-t border-slate-800 flex items-center gap-3">
            {/* Quantity */}
            <div className="flex items-center border border-slate-800 bg-slate-950 rounded-xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white"
              >
                -
              </button>
              <span className="text-xs font-bold font-mono px-3 text-white">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                }
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add {quantity} to Cart • ${(product.price * quantity).toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
