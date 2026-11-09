'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { Order, OrderStatus, Product, StoreMetrics } from '@/lib/types';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<StoreMetrics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

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
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const resData = await res.json();
      if (resData.success && metrics) {
        setMetrics({
          ...metrics,
          recentOrders: metrics.recentOrders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          ),
        });
        setFeedbackMsg(`Order #${orderId} status changed to ${newStatus}`);
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = metrics?.recentOrders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Storefront
              </Link>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Control Plane
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Fulfillment &amp; Inventory Admin
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Open Live Store
            </Link>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-semibold animate-in fade-in duration-150">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Executive KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Revenue */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Gross Revenue</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              ${metrics ? metrics.totalRevenue.toFixed(2) : '0.00'}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span>Paid transactions verified</span>
            </p>
          </div>

          {/* Total Orders */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Orders</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {metrics ? metrics.totalOrders : 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Live customer orders</p>
          </div>

          {/* Active Products */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Active SKUs</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {metrics ? metrics.activeProducts : 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Catalog items listed</p>
          </div>

          {/* Low Stock Alerts */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Low Stock Alerts</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-amber-400">
              {metrics ? metrics.lowStockCount : 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Items below 10 units</p>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Order Fulfillment ({metrics?.recentOrders.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Inventory Management ({products.length})
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter orders by status"
                className="bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500"
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Order ID &amp; Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-white">{order.id}</div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-medium text-white">{order.customerName}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">
                            {order.customerEmail}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} units
                          </span>
                        </td>

                        <td className="py-4 px-4 font-mono font-bold text-indigo-400">
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
                            className={`rounded-xl px-2.5 py-1 text-xs font-semibold border outline-none cursor-pointer ${
                              order.status === 'DELIVERED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : order.status === 'SHIPPED'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : order.status === 'PROCESSING'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : order.status === 'CANCELLED'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                            }`}
                          >
                            <option value="PLACED" className="bg-slate-900 text-white">PLACED</option>
                            <option value="PROCESSING" className="bg-slate-900 text-white">PROCESSING</option>
                            <option value="SHIPPED" className="bg-slate-900 text-white">SHIPPED</option>
                            <option value="DELIVERED" className="bg-slate-900 text-white">DELIVERED</option>
                            <option value="CANCELLED" className="bg-slate-900 text-white">CANCELLED</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/track?id=${order.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-400 text-xs font-medium border border-slate-800 transition-colors"
                          >
                            <span>Live Track</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No orders match this status filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory Stock Table */}
        {activeTab === 'inventory' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Unit Price</th>
                    <th className="py-3.5 px-4">In Stock Units</th>
                    <th className="py-3.5 px-4">Stock Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800"
                        />
                        <div>
                          <div className="font-semibold text-white">{p.title}</div>
                          <div className="font-mono text-[10px] text-slate-500">{p.id}</div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize text-slate-300">{p.category}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ${p.price.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        {p.stockQuantity}
                      </td>

                      <td className="py-3.5 px-4">
                        {p.stockQuantity <= 0 ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-semibold text-[10px] uppercase">
                            Out of Stock
                          </span>
                        ) : p.stockQuantity < 10 ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold text-[10px] uppercase">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px] uppercase">
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
    </div>
  );
}
