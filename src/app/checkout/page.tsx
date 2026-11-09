'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Tag,
  AlertCircle,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { sound } from '@/lib/audio/sound-fx';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    discountCode,
    applyDiscountCode,
    clearCart,
  } = useCart();

  // Form states
  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay' | 'cod'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const success = applyDiscountCode(promoInput);
    if (success) {
      sound.playEngage();
      setPromoSuccess('15% discount applied successfully!');
      setPromoInput('');
    } else {
      sound.playClick(400);
      setPromoError('Invalid coupon code. Try SAVE15 for 15% off.');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    // Basic Validation
    if (!shipping.fullName || !shipping.email || !shipping.street || !shipping.city) {
      setCheckoutError('Please fill in all required shipping address fields.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        setCheckoutError('Please enter your card number, expiration, and CVC.');
        return;
      }
    }

    setIsSubmitting(true);
    sound.playClick(850);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: shipping.fullName,
          customerEmail: shipping.email,
          customerPhone: shipping.phone || '+1 555 000 0000',
          shippingAddress: {
            street: shipping.street,
            city: shipping.city,
            zipCode: shipping.zipCode || '10001',
            country: shipping.country,
          },
          items: cart.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          paymentMethod: paymentMethod === 'card' ? 'CARD' : paymentMethod === 'apple-pay' ? 'APPLE_PAY' : 'COD',
          discountCode: discountCode || undefined,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to process checkout. Please try again.');
      }

      const createdOrder = resData.data;

      // Clear cart
      sound.playEngage();
      clearCart();

      // Navigate to success page
      router.push(`/checkout/success?orderId=${createdOrder.id}`);
    } catch (err: any) {
      setCheckoutError(err.message || 'An unexpected error occurred during checkout.');
      setIsSubmitting(false);
    }
  };

  // If cart is empty
  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center luxury-shadow">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your Bag is Empty</h2>
          <p className="text-slate-500 text-sm mb-6">
            Explore our curated hardware collection to add items before checking out.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-sm shadow-md"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storefront
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          256-bit TLS Encrypted &bull; Instant Inventory Reservation
        </p>
      </div>

      {/* Global Error Banner */}
      {checkoutError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{checkoutError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Forms (7 cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 flex flex-col gap-6">
          {/* Step 1: Shipping Details */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 luxury-shadow">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={shipping.fullName}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={shipping.email}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={shipping.phone}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="123 Innovation Boulevard"
                  value={shipping.street}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="San Francisco"
                  value={shipping.city}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="94103"
                  value={shipping.zipCode}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Country
                </label>
                <select
                  name="country"
                  value={shipping.country}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none transition-all"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Other">Other / International</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 luxury-shadow">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Payment Method</h2>
            </div>

            {/* Payment selector tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple-pay')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  paymentMethod === 'apple-pay'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Smartphone className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                <span className="text-xs">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs">Pay on Arrival</span>
              </button>
            </div>

            {/* Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                      Expiration
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                      CVC Code
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 text-slate-900 dark:text-white text-sm outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order &amp; Securing Inventory...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Complete Purchase &bull; ${grandTotal.toFixed(2)}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 luxury-shadow sticky top-24">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-slate-500">{cart.length} items</span>
            </h2>

            {/* Items List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto custom-scrollbar pr-1 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="SAVE15"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white uppercase outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[11px] text-red-500 mt-1.5">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5">{promoSuccess}</p>
              )}
              {discountCode && (
                <div className="mt-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {discountCode} (15% Off)
                  </span>
                </div>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Shipping</span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">Free</span>
                ) : (
                  <span className="font-bold text-slate-900 dark:text-white">${shippingFee.toFixed(2)}</span>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-base font-extrabold text-slate-900 dark:text-white">
                <span>Total Due</span>
                <span className="text-xl text-blue-600 dark:text-blue-400">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
