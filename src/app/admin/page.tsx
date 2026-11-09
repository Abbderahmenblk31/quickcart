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
  LogOut,
  ShieldCheck,
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
        setFeedbackMsg(`Order #${orderId} status updated to ${newStatus}`);
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Operator Header Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 luxury-shadow text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                Chief Logistics Officer
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold">
                Authenticated
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Badge: QC-SEC-9901 &bull; 256-bit TLS Session
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => sound.playClick(700)}
            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
          >
            Storefront
          </Link>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-red-200 dark:border-red-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Dashboard Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fulfillment &amp; Inventory Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time control over warehouse inventory, order dispatches, and store revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick(800);
              fetchData();
            }}
            disabled={loading}
            className="px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert Toast */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-3 text-emerald-700 dark:text-emerald-400 text-xs font-bold animate-in fade-in duration-150">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 luxury-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            ${metrics ? metrics.totalRevenue.toFixed(2) : '0.00'}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Verified paid orders</p>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 luxury-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {metrics ? metrics.totalOrders : 0}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Customer purchases</p>
        </div>

        {/* Active Products */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 luxury-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Catalog SKUs</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {metrics ? metrics.activeProducts : 0}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Listed inventory items</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 luxury-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Warning</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {metrics ? metrics.lowStockCount : 0}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Items under 10 units</p>
        </div>
      </div>

      {/* Tab Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick(750);
              setActiveTab('orders');
            }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white dark:bg-blue-600 shadow'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Order Fulfillment ({metrics?.recentOrders.length || 0})
          </button>
          <button
            onClick={() => {
              sound.playClick(750);
              setActiveTab('inventory');
            }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white dark:bg-blue-600 shadow'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Inventory Stock ({products.length})
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Status Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                sound.playClick(650);
                setStatusFilter(e.target.value);
              }}
              aria-label="Filter orders by fulfillment status"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-full px-3.5 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 cursor-pointer shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Orders Fulfillment Table */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl luxury-shadow overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-5">Order ID &amp; Date</th>
                  <th className="py-3.5 px-5">Customer</th>
                  <th className="py-3.5 px-5">Items</th>
                  <th className="py-3.5 px-5">Total</th>
                  <th className="py-3.5 px-5">Fulfillment Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white font-mono">{order.id}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {order.customerEmail}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} units
                        </span>
                      </td>

                      <td className="py-4 px-5 font-black text-slate-900 dark:text-white font-mono">
                        ${order.totalAmount.toFixed(2)}
                      </td>

                      <td className="py-4 px-5">
                        <select
                          value={order.status}
                          disabled={updatingOrderId === order.id}
                          onChange={(e) =>
                            handleUpdateStatus(order.id, e.target.value as OrderStatus)
                          }
                          aria-label={`Update status for order ${order.id}`}
                          className={`rounded-full px-3 py-1 text-xs font-bold border outline-none cursor-pointer ${
                            order.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                              : order.status === 'SHIPPED'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                              : order.status === 'PROCESSING'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                              : order.status === 'CANCELLED'
                              ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/30'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <option value="PLACED">Placed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/track?id=${order.id}`}
                          target="_blank"
                          onClick={() => sound.playClick(900)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                        >
                          <span>Track</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No orders found matching this filter.
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl luxury-shadow overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-5">Product Details</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Unit Price</th>
                  <th className="py-3.5 px-5">Stock Level</th>
                  <th className="py-3.5 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{p.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="capitalize text-slate-600 dark:text-slate-400 font-medium">{p.category}</span>
                    </td>

                    <td className="py-3.5 px-5 font-black text-slate-900 dark:text-white font-mono">
                      ${p.price.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-5 font-black font-mono">
                      {p.stockQuantity}
                    </td>

                    <td className="py-3.5 px-5">
                      {p.stockQuantity <= 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 font-bold text-[10px] uppercase">
                          Out of Stock
                        </span>
                      ) : p.stockQuantity < 10 ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 font-bold text-[10px] uppercase">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold text-[10px] uppercase">
                          Healthy
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
  );
}
