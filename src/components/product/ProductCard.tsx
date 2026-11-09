'use client';

import React, { useState, useRef } from 'react';
import { Star, Eye, Cpu, Zap, Activity, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { sound } from '@/lib/audio/sound-fx';
import { TextScramble } from '@/components/ui/TextScramble';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColorway, setSelectedColorway] = useState<'obsidian' | 'titanium' | 'amber'>('obsidian');

  // 3D Tilt Card Physics state
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max 6deg

    setTiltStyle({
      transform: `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.4s ease-out',
    });
  };

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
    sound.playClick(950);
    setActiveImageIndex(idx);
  };

  const firstSpecs = Object.entries(product.specs || {}).slice(0, 2);

  // Dynamic colorway halo filter
  const colorwayHalo =
    selectedColorway === 'amber'
      ? 'from-amber-500/20 via-transparent'
      : selectedColorway === 'titanium'
      ? 'from-cyan-500/20 via-transparent'
      : 'from-orange-500/10 via-transparent';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className="group relative bg-zinc-950/80 border border-zinc-800/90 hover:border-amber-500/70 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/15 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Precision Mechanical Calibration marks */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-zinc-700 pointer-events-none group-hover:border-amber-500 transition-colors" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-zinc-700 pointer-events-none group-hover:border-amber-500 transition-colors" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-zinc-700 pointer-events-none group-hover:border-amber-500 transition-colors" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-zinc-700 pointer-events-none group-hover:border-amber-500 transition-colors" />

      {/* Top Image Stage */}
      <div>
        <div
          onClick={() => {
            sound.playClick(700);
            onViewDetails(product);
          }}
          className="relative w-full aspect-square overflow-hidden bg-zinc-900/60 cursor-pointer p-6 flex items-center justify-center"
        >
          {/* Dynamic Colorway Aura */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${colorwayHalo} to-transparent opacity-80 transition-all duration-500`} />

          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 z-10 drop-shadow-2xl"
          />

          {/* Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start z-20">
            <span className="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-zinc-950/90 text-zinc-300 border border-zinc-800 shadow">
              {product.category}
            </span>
            {discountPct && (
              <span className="font-mono text-[9px] font-extrabold px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-500/40">
                SAVE -{discountPct}%
              </span>
            )}
          </div>

          {/* Stock Telemetry Pulse */}
          <div className="absolute top-3.5 right-3.5 z-20">
            <div className="flex items-center gap-1.5 bg-zinc-950/90 border border-zinc-800 rounded-full px-2 py-0.5 shadow">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  product.stockQuantity < 10 ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  product.stockQuantity < 10 ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
              </span>
              <span className="font-mono text-[9px] text-zinc-400 font-semibold">
                {product.stockQuantity} IN_STOCK
              </span>
            </div>
          </div>

          {/* Image Variant Selector Dots */}
          {product.images.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-zinc-950/80 px-2 py-1 rounded-full border border-zinc-800/80 backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity"
            >
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleImageSwitch(idx, e)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeImageIndex === idx
                      ? 'bg-amber-400 w-4'
                      : 'bg-zinc-600 hover:bg-zinc-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Rating & SKU */}
          <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold text-zinc-200">{product.rating}</span>
              <span className="text-zinc-600">({product.reviewCount})</span>
            </div>
            <span className="text-zinc-500 tracking-wider">SKU: {product.id}</span>
          </div>

          {/* Title with Scramble Effect */}
          <h3
            onClick={() => {
              sound.playClick(700);
              onViewDetails(product);
            }}
            className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer tracking-tight"
          >
            <TextScramble text={product.title} />
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Colorway Switcher Dots */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-900 font-mono text-[10px]">
            <span className="text-zinc-500">CHASSIS_TINT:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick(600);
                  setSelectedColorway('obsidian');
                }}
                className={`w-3.5 h-3.5 rounded-full bg-zinc-900 border ${
                  selectedColorway === 'obsidian' ? 'border-amber-400 scale-125' : 'border-zinc-700'
                }`}
                title="Obsidian Dark"
              />
              <button
                type="button"
                onClick={() => {
                  sound.playClick(750);
                  setSelectedColorway('titanium');
                }}
                className={`w-3.5 h-3.5 rounded-full bg-cyan-900 border ${
                  selectedColorway === 'titanium' ? 'border-cyan-400 scale-125' : 'border-zinc-700'
                }`}
                title="Titanium Frost"
              />
              <button
                type="button"
                onClick={() => {
                  sound.playClick(900);
                  setSelectedColorway('amber');
                }}
                className={`w-3.5 h-3.5 rounded-full bg-amber-600 border ${
                  selectedColorway === 'amber' ? 'border-amber-300 scale-125' : 'border-zinc-700'
                }`}
                title="Amber Kinetic"
              />
            </div>
          </div>

          {/* High-Tech Specs Pill Strip */}
          {firstSpecs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {firstSpecs.map(([label, val]) => (
                <div
                  key={label}
                  className="font-mono text-[10px] px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1"
                >
                  <Cpu className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span className="text-zinc-500">{label}:</span>
                  <span className="font-medium text-zinc-200 truncate max-w-[120px]">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Pricing & Tactical Add Action */}
      <div className="p-4 sm:p-5 pt-0 mt-3 border-t border-zinc-900 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
            Unit Price
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white font-mono tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-zinc-500 line-through font-mono">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
            isAdded
              ? 'bg-emerald-500 text-zinc-950 scale-105'
              : 'bg-zinc-900 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-800 hover:border-amber-400 active:scale-95'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>ENGAGED</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              <span>ENGAGE</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
