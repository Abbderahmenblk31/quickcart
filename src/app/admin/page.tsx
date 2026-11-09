'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Truck,
  Clock,
  ArrowLeft,
  Search,
  Filter,
  LogOut,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { Order, OrderStatus, Product, StoreMetrics } from '@/lib/types';
import { sound } from '@/lib/audio/sound-fx';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<StoreMetrics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/products'),
      ]);

      const statsData = await statsRes.json();
      const prodsData = await prodsRes.json();

      if (statsData.success) {
        setMetrics(statsData.data);
      }
      if (prodsData.success) {
        setProducts(prodsData.data);
      }
    } catch (err) {
      console.error('Failed to load admin telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    sound.playClick(900);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const resData = await res.json();
      if (resData.success && metrics) {
        sound.playEngage();
        setMetrics({
          ...metrics,
          recentOrders: metrics.recentOrders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          ),
        });
        setFeedbackMsg(`Order #${orderId} state transitioned to ${newStatus}`);
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = async () => {
    sound.playClick(500);
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error', err);
      setIsLoggingOut(false);
    }
  };

  const filteredOrders = metrics?.recentOrders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Security Operator Pill Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase">
                  OPERATOR // CHIEF_LOGISTICS_OFFICER
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                  AUTHENTICATED
                </span>
              </div>
              <span className="text-[11px] text-zinc-500">
                BADGE: QC-SEC-9901 &bull; IP: 127.0.0.1 (SECURE TLS)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => sound.playClick(700)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              [RETURN_STOREFRONT]
            </Link>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? 'TERMINATING...' : 'LOGOUT'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Title Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 font-mono text-xs text-amber-500">
              <Terminal className="w-3.5 h-3.5" />
              <span>CONTROL_PLANE // OPERATIONS_CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight">
              DEPOT FULFILLMENT &amp; TELEMETRY
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick(800);
                fetchData();
              }}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>REFRESH_TELEMETRY</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 font-mono text-xs font-bold animate-in fade-in duration-150">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Executive KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl font-mono">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold">Gross Revenue</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">
              ${metrics ? metrics.totalRevenue.toFixed(2) : '0.00'}
            </div>
            <p className="text-[10px] text-emerald-400 mt-1">Paid transactions verified</p>
          </div>

          {/* Total Orders */}
          <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl font-mono">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold">Total Orders</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">
              {metrics ? metrics.totalOrders : 0}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">Recorded payloads</p>
          </div>

          {/* Active Products */}
          <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl font-mono">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold">Catalog SKUs</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">
              {metrics ? metrics.activeProducts : 0}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">Active items listed</p>
          </div>

          {/* Low Stock Alerts */}
          <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl font-mono">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold">Scarcity Warning</span>
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-orange-400">
              {metrics ? metrics.lowStockCount : 0}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">Units below 10 remaining</p>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick(750);
                setActiveTab('orders');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              ORDER_FULFILLMENT ({metrics?.recentOrders.length || 0})
            </button>
            <button
              onClick={() => {
                sound.playClick(750);
                setActiveTab('inventory');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              INVENTORY_RADAR ({products.length})
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500">FILTER_STATUS:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  sound.playClick(650);
                  setStatusFilter(e.target.value);
                }}
                aria-label="Filter orders by fulfillment status"
                className="bg-zinc-900 border border-zinc-800 text-xs rounded-xl px-3 py-1.5 text-white outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="PLACED">PLACED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Orders Fulfillment Table */}
        {activeTab === 'orders' && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl shadow-xl overflow-hidden font-mono text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-4">Order ID &amp; Timestamp</th>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Payload Units</th>
                    <th className="py-3.5 px-4">Charged Total</th>
                    <th className="py-3.5 px-4">State Transition</th>
                    <th className="py-3.5 px-4 text-right">Telemetry Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{order.id}</div>
                          <div className="text-[11px] text-zinc-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{order.customerName}</div>
                          <div className="text-[11px] text-zinc-400 truncate max-w-xs">
                            {order.customerEmail}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} units
                          </span>
                        </td>

                        <td className="py-4 px-4 font-black text-amber-400">
                          ${order.totalAmount.toFixed(2)}
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={order.status}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as OrderStatus)
                            }
                            aria-label={`Update status for order ${order.id}`}
                            className={`rounded-xl px-2.5 py-1 text-xs font-bold border outline-none cursor-pointer ${
                              order.status === 'DELIVERED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : order.status === 'SHIPPED'
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                : order.status === 'PROCESSING'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : order.status === 'CANCELLED'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                            }`}
                          >
                            <option value="PLACED" className="bg-zinc-950 text-white">PLACED</option>
                            <option value="PROCESSING" className="bg-zinc-950 text-white">PROCESSING</option>
                            <option value="SHIPPED" className="bg-zinc-950 text-white">SHIPPED</option>
                            <option value="DELIVERED" className="bg-zinc-950 text-white">DELIVERED</option>
                            <option value="CANCELLED" className="bg-zinc-950 text-white">CANCELLED</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/track?id=${order.id}`}
                            target="_blank"
                            onClick={() => sound.playClick(900)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-xs font-bold border border-zinc-800 transition-colors"
                          >
                            <span>LIVE_TRACK</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500">
                        NO ORDERS IN THIS STATUS BIN.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory Radar */}
        {activeTab === 'inventory' && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl shadow-xl overflow-hidden font-mono text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-4">Hardware SKU</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">MSRP Price</th>
                    <th className="py-3.5 px-4">Remaining Units</th>
                    <th className="py-3.5 px-4">Stock Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-10 h-10 rounded-xl object-cover bg-zinc-900 border border-zinc-800"
                        />
                        <div>
                          <div className="font-bold text-white">{p.title}</div>
                          <div className="text-[10px] text-zinc-500">{p.id}</div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="uppercase text-zinc-300">{p.category}</span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-white">
                        ${p.price.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 font-black text-amber-400">
                        {p.stockQuantity}
                      </td>

                      <td className="py-3.5 px-4">
                        {p.stockQuantity <= 0 ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-[10px] uppercase">
                            DEPLETED
                          </span>
                        ) : p.stockQuantity < 10 ? (
                          <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 font-bold text-[10px] uppercase">
                            LOW_RESERVE
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] uppercase">
                            NOMINAL
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
