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
  Cpu,
  Zap,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col md:flex-row gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 p-6 flex items-center justify-center">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover rounded-xl drop-shadow-2xl"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all p-1 bg-zinc-900 ${
                    selectedImage === idx
                      ? 'border-amber-500 scale-105'
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2 font-mono">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {product.category}
                </span>

                {product.stockQuantity < 10 ? (
                  <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    SCARCITY: {product.stockQuantity} UNITS LEFT
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    DEPLOYMENT READY ({product.stockQuantity} UNITS)
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase font-mono">
                {product.title}
              </h2>

              {/* Rating & SKU */}
              <div className="flex items-center space-x-3 mt-2 font-mono text-xs text-zinc-400">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  <span className="font-bold text-white">{product.rating}</span>
                </div>
                <span>({product.reviewCount} verified reviews)</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-500">SKU: {product.id}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <span className="text-2xl font-black text-white font-mono">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-zinc-500 line-through font-mono">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Technical Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  TELEMETRY &amp; SPECIFICATIONS
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 bg-zinc-900/80 border border-zinc-800/80 rounded-xl"
                    >
                      <span className="block text-[10px] text-zinc-500 uppercase">{key}</span>
                      <span className="font-bold text-zinc-200 truncate block">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center gap-3">
            {/* Quantity */}
            <div className="flex items-center border border-zinc-800 bg-zinc-900 rounded-xl p-1 font-mono">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white font-bold"
              >
                -
              </button>
              <span className="text-xs font-bold px-3 text-white">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                }
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white font-bold"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] active:scale-98 font-mono tracking-wider"
            >
              <Zap className="w-4 h-4 fill-zinc-950" />
              <span>ENGAGE UNIT • ${(product.price * quantity).toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
