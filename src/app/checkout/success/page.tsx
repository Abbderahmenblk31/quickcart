'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
  CreditCard,
  Truck,
  Copy,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '@/lib/types';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setOrder(resData.data);
        }
      })
      .catch((err) => console.error('Failed to load order', err))
      .finally(() => setLoading(false));
  }, [orderId]);

  const copyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          We couldn&apos;t retrieve the details for this order. It may have expired or the ID is incorrect.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/5 animate-in zoom-in-50 duration-200">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Payment Confirmed!</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Thank you for your purchase. We&apos;ve reserved your inventory and dispatched confirmation details to{' '}
          <span className="text-white font-medium">{order.customerEmail}</span>.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Tracking Pill Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              Tracking Number
            </span>
            <span className="font-mono text-base font-bold text-indigo-400">
              {order.trackingNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyTracking(order.trackingNumber)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            <Link
              href={`/track?id=${order.id}`}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
            >
              <Truck className="w-3.5 h-3.5" />
              Live Tracking
            </Link>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Estimated Delivery
            </div>
            <p className="text-sm font-bold text-white">{order.estimatedDelivery}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Destination
            </div>
            <p className="text-sm font-bold text-white truncate">
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <CreditCard className="w-3.5 h-3.5 text-pink-400" />
              Payment Status
            </div>
            <p className="text-sm font-bold text-emerald-400">{order.paymentStatus} &bull; {order.paymentMethod}</p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
            Items in this shipment ({order.items.length})
          </h3>
          <div className="divide-y divide-slate-800/70">
            {order.items.map((item) => (
              <div key={item.productId} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary Row */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Grand Total Charged</span>
          <span className="text-xl font-extrabold font-mono text-indigo-400">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 transition-all text-center"
        >
          Return to Storefront
        </Link>

        <Link
          href={`/track?id=${order.id}`}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 text-center flex items-center justify-center gap-2"
        >
          <span>Track Order #{order.id}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
