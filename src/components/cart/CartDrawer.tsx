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
    clearCart,
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base text-white">Your Shopping Cart</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-3.5 p-3 bg-slate-950/70 border border-slate-800 rounded-xl"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">
                    {item.product.title}
                  </h4>
                  <span className="text-xs font-bold text-indigo-400 block mt-0.5">
                    ${item.product.price.toFixed(2)}
                  </span>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center border border-slate-800 bg-slate-900 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 text-slate-400 hover:text-white"
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
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-white font-mono">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.5]" />
                <h4 className="text-sm font-bold text-white mb-1">Your cart is empty</h4>
                <p className="text-xs text-slate-400">
                  Explore our curated high-performance tech products and add items to your cart.
                </p>
              </div>
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (SAVE15)"
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 uppercase font-mono outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <span className="text-[11px] text-red-400 block">{promoError}</span>
                )}
                {discountCode && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Code {discountCode} Applied (-15%)
                  </span>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-slate-500" />
                    Shipping
                  </span>
                  <span className="font-mono text-white">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold uppercase">Free</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount (15%)</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="font-mono text-indigo-400">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
