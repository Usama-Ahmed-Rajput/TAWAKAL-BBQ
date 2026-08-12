'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Clock, CheckCircle, Truck, XCircle, Eye, Phone, MapPin, Flame } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchOrders = () => {
    setLoading(true);
    fetch(`/api/orders?status=${activeTab}&search=${encodeURIComponent(search)}`)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/admin/login';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error('Failed to load orders list');
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to update order status');
      }

      toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      fetchOrders();
      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderNumber === orderId)) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (err: any) {
      console.error('[STATUS UPDATE ERROR]:', err);
      toast.error(err.message || 'Unable to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
      case 'CONFIRMED':
        return 'bg-blue-950/80 text-blue-400 border-blue-800';
      case 'PREPARING':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800';
      case 'DELIVERED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'CANCELLED':
        return 'bg-red-950/80 text-red-300 border-red-800';
      default:
        return 'bg-zinc-900 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-8 text-amber-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18110e] p-6 rounded-2xl border border-amber-900/40 shadow-xl">
        <div>
          <h2 className="font-bebas text-3xl tracking-wider text-amber-100">
            ORDER MANAGEMENT & FULFILLMENT
          </h2>
          <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
            Process customer orders, update kitchen preparation status and delivery tracking.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                activeTab === status
                  ? 'bg-amber-600 text-amber-950 font-bold shadow-md'
                  : 'bg-[#18110e] text-amber-300/70 border border-amber-900/40 hover:text-amber-100'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-52 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
          <input
            type="text"
            placeholder="Search order # or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            className="w-full bg-[#18110e] border border-amber-900/40 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold tracking-wider text-amber-100 placeholder:text-amber-500/50 focus:outline-none focus:border-[#C83B22] focus:ring-1 focus:ring-[#C83B22]"
          />
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 text-center text-amber-400 flex items-center justify-center">
          <Flame className="w-6 h-6 animate-spin mr-2" />
          <span>Fetching live orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#18110e] border border-amber-900/30 rounded-2xl p-12 text-center text-amber-300/50">
          No orders found under this status filter.
        </div>
      ) : (
        <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-amber-900/40 bg-[#120c09] text-amber-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/20">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-950/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-300">
                      {order.orderNumber}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-amber-100">{order.customerName}</div>
                      <div className="text-[11px] text-amber-400/60">{order.customerPhone}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-amber-950 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-amber-400 border border-amber-800/40">
                        {order.orderType}
                      </span>
                    </td>
                    <td className="p-4 font-bebas text-lg text-amber-400">
                      Rs. {order.totalAmount}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-amber-200/60 text-[11px]">
                      {new Date(order.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <select
                          disabled={updating}
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="bg-[#0d0907] border border-amber-900/50 rounded-lg text-[10px] p-1.5 text-amber-200 focus:outline-none"
                        >
                          {STATUSES.filter((s) => s !== 'ALL').map((s) => (
                            <option key={s} value={s}>
                              {s.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 hover:bg-amber-800/40"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18110e] border border-amber-900/50 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  ORDER DETAILS
                </span>
                <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-amber-400 hover:text-amber-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#120c09] p-4 rounded-xl border border-amber-900/30">
                <div>
                  <span className="text-amber-400/60 uppercase text-[10px] font-bold block mb-1">
                    Customer Info
                  </span>
                  <div className="font-semibold text-amber-100">{selectedOrder.customerName}</div>
                  <div className="text-amber-300">{selectedOrder.customerPhone}</div>
                  {selectedOrder.customerEmail && (
                    <div className="text-amber-200/60">{selectedOrder.customerEmail}</div>
                  )}
                </div>
                <div>
                  <span className="text-amber-400/60 uppercase text-[10px] font-bold block mb-1">
                    Fulfillment Info
                  </span>
                  <div className="font-semibold text-amber-100">{selectedOrder.orderType}</div>
                  {selectedOrder.deliveryAddress && (
                    <div className="text-amber-300/80 mt-1 line-clamp-2">
                      <MapPin className="w-3 h-3 inline mr-1 text-amber-500" />
                      {selectedOrder.deliveryAddress}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className="text-amber-400/60 uppercase text-[10px] font-bold block mb-2">
                  Items Ordered
                </span>
                <div className="space-y-2 border-t border-amber-900/30 pt-2">
                  {selectedOrder.orderItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-1.5 border-b border-amber-900/20"
                    >
                      <div>
                        <span className="font-semibold text-amber-100">{item.name}</span>
                        {item.variantName && (
                          <span className="text-amber-400/60 ml-2">({item.variantName})</span>
                        )}
                        <span className="text-amber-400/50 block text-[10px]">
                          Qty: {item.quantity} × Rs. {item.price}
                        </span>
                      </div>
                      <span className="font-bebas text-base text-amber-400">
                        Rs. {item.quantity * item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#120c09] p-4 rounded-xl space-y-1.5 border border-amber-900/30">
                <div className="flex justify-between text-amber-300/80">
                  <span>Subtotal</span>
                  <span>Rs. {selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({selectedOrder.couponCode})</span>
                    <span>- Rs. {selectedOrder.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-amber-300/80">
                  <span>Delivery Fee</span>
                  <span>Rs. {selectedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bebas text-xl text-amber-400 pt-2 border-t border-amber-900/30">
                  <span>Grand Total</span>
                  <span>Rs. {selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
