'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  CheckCircle2,
  Truck,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Order } from '@/lib/types';

function TrackContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');

  const [searchCode, setSearchCode] = useState(urlId || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      const resData = await res.json();

      if (!res.ok || !resData.success || !resData.data) {
        throw new Error(resData.error || 'No shipment found with this ID or Tracking Code.');
      }

      setOrder(resData.data);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || 'Unable to find tracking details. Please verify your number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      setSearchCode(urlId);
      fetchOrder(urlId);
    }
  }, [urlId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchCode);
  };

  const copyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status mapping to step index
  const statusSteps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Payment confirmed & inventory reserved' },
    { key: 'PROCESSING', label: 'Processing', desc: 'Inspected and packaged at warehouse' },
    { key: 'SHIPPED', label: 'Dispatched', desc: 'In transit with Express Carrier' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Delivered safely to destination' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'DELIVERED':
        return 3;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Tracker Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Truck className="w-3.5 h-3.5" />
          Real-Time Logistics Telemetry
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Track Your Delivery
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
          Enter your Order ID (e.g. <span className="font-mono text-white">QC-1092</span>) or carrier tracking number to monitor dispatch progress in real-time.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Enter Order ID (QC-1092) or Tracking (QC-TRK-771092)..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full pl-12 pr-32 py-3.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-white text-sm outline-none font-mono transition-all shadow-xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              'Track'
            )}
          </button>
        </div>

        {/* Quick Demo Pre-fill Pills */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Try demo IDs:</span>
          <button
            type="button"
            onClick={() => {
              setSearchCode('QC-1093');
              fetchOrder('QC-1093');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 hover:text-indigo-300 font-mono transition-colors"
          >
            QC-1093 (Shipped)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchCode('QC-1092');
              fetchOrder('QC-1092');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 hover:text-indigo-300 font-mono transition-colors"
          >
            QC-1092 (Delivered)
          </button>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Active Order Details Card */}
      {order && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in duration-200">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Order #{order.id}</h2>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                    order.status === 'DELIVERED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : order.status === 'SHIPPED'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : order.status === 'PROCESSING'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : order.status === 'CANCELLED'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                {order.trackingNumber}
              </span>
              <button
                onClick={() => copyTracking(order.trackingNumber)}
                className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy Tracking Number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          {order.status !== 'CANCELLED' ? (
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-6">
                Delivery Progression
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {statusSteps.map((step, idx) => {
                  const isPassed = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={step.key}
                      className={`relative flex flex-col p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-600/10'
                          : isPassed
                          ? 'bg-slate-950/60 border-slate-800'
                          : 'bg-slate-950/30 border-slate-800/40 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                            isPassed
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 animate-pulse">
                            In Progress
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">{step.label}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              This order has been cancelled and refunded.
            </div>
          )}

          {/* Shipment metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60">
              <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                Recipient
              </span>
              <p className="text-xs font-bold text-white">{order.customerName}</p>
              <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60">
              <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                Shipping Destination
              </span>
              <p className="text-xs font-bold text-white truncate">{order.shippingAddress.street}</p>
              <p className="text-[11px] text-slate-400">
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60">
              <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                Estimated Delivery
              </span>
              <p className="text-xs font-bold text-indigo-400">{order.estimatedDelivery}</p>
              <p className="text-[11px] text-slate-400">Via DHL Express Global</p>
            </div>
          </div>

          {/* Package items breakdown */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
              Shipment Contents ({order.items.length} items)
            </h3>
            <div className="divide-y divide-slate-800/60">
              {order.items.map((item) => (
                <div key={item.productId} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800"
                    />
                    <div>
                      <h5 className="text-xs font-semibold text-white">{item.title}</h5>
                      <span className="text-[11px] text-slate-400">
                        Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Order Value:</span>
              <span className="text-base font-extrabold font-mono text-indigo-400">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
          </div>
        }
      >
        <TrackContent />
      </Suspense>
    </div>
  );
}
