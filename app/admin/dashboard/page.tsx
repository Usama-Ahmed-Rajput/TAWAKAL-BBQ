'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  DollarSign,
  Utensils,
  Plus,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/admin/login';
          return null;
        }
        return res.json();
      })
      .then((resData) => {
        if (!resData) return;
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-amber-400">
        <Flame className="w-8 h-8 animate-spin" />
        <span className="ml-3 font-medium text-sm">Loading Live Dashboard...</span>
      </div>
    );
  }

  const summary = data?.summary || {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    avgOrderValue: 0,
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#1c130f] via-[#241712] to-[#1c130f] p-6 rounded-2xl border border-amber-900/40 shadow-xl">
        <div>
          <h2 className="font-bebas text-3xl tracking-wider text-amber-100">
            DASHBOARD OVERVIEW & LIVE REPORTING
          </h2>
          <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
            Real-time analytics and restaurant performance metrics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/menu"
            className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Link>
          <Link
            href="/admin/deals"
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-amber-950/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Deal</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#18110e] border border-amber-900/40 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/70">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-bebas text-4xl text-amber-100 tracking-wide">
              Rs. {summary.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>Real DB Aggregated Revenue</span>
            </p>
          </div>
        </div>

        <div className="bg-[#18110e] border border-amber-900/40 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/70">
              Total Orders
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-bebas text-4xl text-amber-100 tracking-wide">
              {summary.totalOrders}
            </h3>
            <p className="text-[11px] text-amber-400/80 font-medium flex items-center mt-1">
              <span>{summary.completedOrders || 0} Delivered</span>
            </p>
          </div>
        </div>

        <div className="bg-[#18110e] border border-amber-900/40 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/70">
              Pending Orders
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-bebas text-4xl text-amber-400 tracking-wide">
              {summary.pendingOrders}
            </h3>
            <p className="text-[11px] text-amber-400/80 font-medium flex items-center mt-1">
              <span>Requires Kitchen Action</span>
            </p>
          </div>
        </div>

        <div className="bg-[#18110e] border border-amber-900/40 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/70">
              Avg Order Value
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-bebas text-4xl text-amber-100 tracking-wide">
              Rs. {summary.avgOrderValue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-amber-400/80 font-medium flex items-center mt-1">
              <span>Per Transaction Average</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-900/30">
            <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
              RECENT LIVE ORDERS
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!data?.recentOrders || data.recentOrders.length === 0 ? (
            <div className="text-center py-12 text-amber-300/40 text-sm">
              No recent orders found in database yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#120c09] border border-amber-900/30 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center font-bebas text-amber-400 text-sm">
                      #{order.orderNumber.slice(-4)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-amber-100">
                        {order.customerName}
                      </h4>
                      <p className="text-xs text-amber-400/60">
                        {order.customerPhone} • {order.orderItems.length} items
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bebas text-lg text-amber-400">
                      Rs. {order.totalAmount}
                    </span>
                    <div className="mt-0.5">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Selling Dishes */}
        <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl">
          <div className="mb-6 pb-4 border-b border-amber-900/30">
            <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
              TOP POPULAR DISHES
            </h3>
            <p className="text-xs text-amber-400/60 font-serif italic">
              Based on live customer selections
            </p>
          </div>

          {!data?.topSellingItems || data.topSellingItems.length === 0 ? (
            <div className="text-center py-12 text-amber-300/40 text-sm">
              Menu item statistics will appear as orders are processed.
            </div>
          ) : (
            <div className="space-y-4">
              {data.topSellingItems.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#120c09] border border-amber-900/20"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-medium text-sm text-amber-200">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-amber-950 px-2.5 py-1 rounded text-amber-400 border border-amber-800/40">
                    {item.totalQuantity} sold
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
