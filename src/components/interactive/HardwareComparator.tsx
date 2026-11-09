'use client';

import React, { useState } from 'react';
import { X, Sliders, Cpu, Activity, Zap, Check, ArrowRightLeft } from 'lucide-react';
import { Product } from '@/lib/types';
import { sound } from '@/lib/audio/sound-fx';

interface HardwareComparatorProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export function HardwareComparator({ products, isOpen, onClose }: HardwareComparatorProps) {
  const [selectedA, setSelectedA] = useState<Product>(products[0]);
  const [selectedB, setSelectedB] = useState<Product>(products[1] || products[0]);

  if (!isOpen) return null;

  const handleSelectA = (id: string) => {
    sound.playClick(900);
    const p = products.find((item) => item.id === id);
    if (p) setSelectedA(p);
  };

  const handleSelectB = (id: string) => {
    sound.playClick(900);
    const p = products.find((item) => item.id === id);
    if (p) setSelectedB(p);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Technical Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <span>LAB_BENCHMARK // HARDWARE_DIFF</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  REAL-TIME_TELEMETRY
                </span>
              </h3>
              <p className="text-[11px] font-mono text-zinc-500">
                Direct side-by-side component analysis &amp; acoustic benchmark
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick(600);
              onClose();
            }}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar flex-1 pr-1">
          {/* Unit A Column */}
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                [SPECIMEN_ALPHA]
              </span>
              <span className="font-mono text-xs font-bold text-white">${selectedA.price}</span>
            </div>

            <select
              value={selectedA.id}
              onChange={(e) => handleSelectA(e.target.value)}
              aria-label="Select Specimen Alpha"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-950">
                  {p.title}
                </option>
              ))}
            </select>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 p-3 flex items-center justify-center">
              <img
                src={selectedA.images[0]}
                alt={selectedA.title}
                className="max-h-full object-contain"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <span className="font-mono text-[10px] text-zinc-500 uppercase block">
                Technical Specifications:
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {Object.entries(selectedA.specs || {}).map(([k, v]) => (
                  <div key={k} className="flex justify-between p-2 rounded bg-zinc-950 border border-zinc-900">
                    <span className="text-zinc-500">{k}:</span>
                    <span className="font-bold text-zinc-200">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unit B Column */}
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                [SPECIMEN_BETA]
              </span>
              <span className="font-mono text-xs font-bold text-white">${selectedB.price}</span>
            </div>

            <select
              value={selectedB.id}
              onChange={(e) => handleSelectB(e.target.value)}
              aria-label="Select Specimen Beta"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-cyan-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-950">
                  {p.title}
                </option>
              ))}
            </select>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 p-3 flex items-center justify-center">
              <img
                src={selectedB.images[0]}
                alt={selectedB.title}
                className="max-h-full object-contain"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <span className="font-mono text-[10px] text-zinc-500 uppercase block">
                Technical Specifications:
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {Object.entries(selectedB.specs || {}).map(([k, v]) => (
                  <div key={k} className="flex justify-between p-2 rounded bg-zinc-950 border border-zinc-900">
                    <span className="text-zinc-500">{k}:</span>
                    <span className="font-bold text-zinc-200">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
          <span className="text-zinc-500">
            DIFF RATIO: {Math.round((selectedA.price / selectedB.price) * 100)}%
          </span>
          <button
            onClick={() => {
              sound.playClick(600);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition-colors"
          >
            DISMISS_LAB_BENCH
          </button>
        </div>
      </div>
    </div>
  );
}
