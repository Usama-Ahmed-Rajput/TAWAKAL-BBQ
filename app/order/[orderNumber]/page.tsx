'use client';

import React, { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckCircle2, Clock, MessageSquare, ShieldCheck, Flame, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderType: string;
  orderStatus: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderTrackingPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderNumber]);

  const generateWhatsAppLink = () => {
    if (!order) return '#';
    const itemsText = order.orderItems
      .map((item) => `• ${item.name} x${item.quantity} (Rs. ${item.price * item.quantity})`)
      .join('\n');

    const text = `*TAWAKAL RESTAURANT — ONLINE ORDER*
*Order Number:* ${order.orderNumber}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Type:* ${order.orderType}
*Address:* ${order.deliveryAddress}

*Order Items:*
${itemsText}

*Subtotal:* Rs. ${order.subtotal}
*Delivery Fee:* Rs. ${order.deliveryFee}
*TOTAL AMOUNT:* Rs. ${order.totalAmount}

Please confirm my order. Thank you!`;

    return `https://wa.me/923431265090?text=${encodeURIComponent(text)}`;
  };

  const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
  const statusLabels: Record<string, string> = {
    PENDING: 'Order Received',
    CONFIRMED: 'Order Confirmed',
    PREPARING: 'Preparing BBQ',
    READY: order?.orderType === 'DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup',
    COMPLETED: 'Completed',
  };

  const currentStatusIndex = order ? statuses.indexOf(order.orderStatus) : 0;

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center text-[#9F9589]">
            <Flame className="w-10 h-10 text-[#C83B22] animate-bounce mx-auto mb-3" />
            <p>Loading order details...</p>
          </div>
        ) : !order ? (
          <div className="py-20 text-center text-[#9F9589] bg-[#1A1815] rounded-2xl border border-[#24201C]">
            <h1 className="font-serif text-2xl text-[#F4EBDD] mb-2">Order Not Found</h1>
            <p className="text-xs mb-6">We couldn't find an order matching #{orderNumber}.</p>
            <Link
              href="/"
              className="inline-flex px-6 py-3 rounded-xl bg-[#C83B22] text-white font-sans text-xs uppercase font-bold tracking-wider"
            >
              RETURN TO HOME
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Status Card */}
            <div className="p-8 rounded-3xl bg-[#1A1815] border border-[#C69A45]/30 text-center shadow-2xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#4CAF50]/20 border border-[#4CAF50]/40 flex items-center justify-center mx-auto text-[#4CAF50]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="font-sans text-xs uppercase font-bold tracking-widest text-[#C69A45]">
                  ORDER SUCCESSFULLY PLACED
                </span>
                <h1 className="font-bebas text-4xl sm:text-6xl tracking-widest text-[#F4EBDD] mt-1">
                  ORDER #{order.orderNumber}
                </h1>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>ORDER VIA WHATSAPP</span>
                </a>

                <Link
                  href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
                  className="px-6 py-3 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs uppercase font-bold tracking-wider shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>TRACK LIVE STATUS</span>
                </Link>

                <Link
                  href="/menu"
                  className="px-6 py-3 rounded-xl bg-[#24201C] hover:bg-[#2A2520] text-[#F4EBDD] font-sans text-xs uppercase font-bold tracking-wider border border-[#24201C] cursor-pointer"
                >
                  ORDER MORE FOOD
                </Link>
              </div>
            </div>

            {/* Order Progress Timeline */}
            <div className="p-6 rounded-2xl bg-[#1A1815] border border-[#24201C] space-y-6">
              <h2 className="font-bebas text-2xl tracking-wider text-[#F4EBDD] border-b border-[#24201C] pb-3">
                LIVE ORDER STATUS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {statuses.map((st, idx) => {
                  const isDone = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div
                      key={st}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isCurrent
                          ? 'bg-[#C83B22]/20 border-[#C83B22] text-[#F4EBDD]'
                          : isDone
                          ? 'bg-[#11100E] border-[#4CAF50]/50 text-[#F4EBDD]'
                          : 'bg-[#11100E] border-[#24201C] text-[#9F9589]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                          isDone ? 'bg-[#4CAF50] text-white' : 'bg-[#24201C] text-[#9F9589]'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wider">
                        {statusLabels[st]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary Details */}
            <div className="p-6 rounded-2xl bg-[#1A1815] border border-[#24201C] space-y-4">
              <h2 className="font-bebas text-2xl tracking-wider text-[#F4EBDD] border-b border-[#24201C] pb-3">
                ORDER DETAILS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="text-[#9F9589] block uppercase">Customer Name</span>
                  <span className="font-bold text-[#F4EBDD] text-sm">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-[#9F9589] block uppercase">Phone Number</span>
                  <span className="font-bold text-[#F4EBDD] text-sm">{order.customerPhone}</span>
                </div>
                <div>
                  <span className="text-[#9F9589] block uppercase">Order Type</span>
                  <span className="font-bold text-[#C69A45] text-sm">{order.orderType}</span>
                </div>
                <div>
                  <span className="text-[#9F9589] block uppercase">Delivery Address</span>
                  <span className="font-bold text-[#F4EBDD] text-sm">{order.deliveryAddress}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#24201C] space-y-2">
                <span className="font-sans text-xs font-bold text-[#C69A45] uppercase tracking-wider block">
                  ORDERED ITEMS:
                </span>
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs py-1">
                    <span className="text-[#F4EBDD] font-medium">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-bebas text-base text-[#C69A45]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#24201C] flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#F4EBDD]">TOTAL AMOUNT (COD)</span>
                <span className="font-bebas text-3xl text-[#C69A45]">
                  Rs. {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
