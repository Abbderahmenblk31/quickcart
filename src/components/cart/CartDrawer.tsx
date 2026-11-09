'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    discountCode,
    discountAmount,
    applyDiscountCode,
    grandTotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyDiscountCode(promoInput);
    if (!ok) {
      setPromoError('Invalid coupon code. Try SAVE15 for 15% off.');
      setTimeout(() => setPromoError(null), 3000);
    } else {
      setPromoError(null);
      setPromoInput('');
    }
  };

  const progressToFreeShipping = Math.min(100, (subtotal / 200) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800/90 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                PAYLOAD MANIFEST
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800">
                {cart.length}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-zinc-900/60 border-b border-zinc-800/80 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400 mb-1.5 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {subtotal >= 200 ? (
                  <span className="text-emerald-400 font-bold">EXPRESS SHIPPING: UNLOCKED</span>
                ) : (
                  <span>ADD ${(200 - subtotal).toFixed(2)} FOR FREE SHIPPING</span>
                )}
              </span>
              <span>{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5 custom-scrollbar">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-3.5 p-3.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate font-mono">
                    {item.product.title}
                  </h4>
                  <span className="font-mono text-xs font-black text-amber-400 block mt-0.5">
                    ${item.product.price.toFixed(2)}
                  </span>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold px-2 text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-white font-mono">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.5] text-zinc-700" />
                <h4 className="font-mono text-sm font-bold text-white mb-1">
                  PAYLOAD IS EMPTY
                </h4>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Inspect the hardware catalog and engage units to populate this dispatch container.
                </p>
              </div>
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5 font-mono">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="COUPON (SAVE15)"
                    className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 uppercase font-mono outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-xl transition-colors"
                  >
                    APPLY
                  </button>
                </div>
                {promoError && (
                  <span className="text-[11px] text-red-400 block">{promoError}</span>
                )}
                {discountCode && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    COUPON [{discountCode}] VERIFIED (-15%)
                  </span>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs font-mono text-zinc-400 border-t border-zinc-900 pt-3">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>DISPATCH LOGISTICS</span>
                  <span className="font-bold text-white">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold uppercase">FREE</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>DISCOUNT APPLIED</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-white pt-2.5 border-t border-zinc-800">
                  <span>TOTAL ESTIMATE</span>
                  <span className="text-lg text-amber-400 font-mono">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] active:scale-98 font-mono tracking-wider"
              >
                <span>PROCEED TO ENCRYPTED CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
