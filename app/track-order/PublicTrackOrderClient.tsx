'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/context/ToastContext';
import {
  Search,
  Flame,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variantName?: string;
  notes?: string;
}

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: string;
  orderStatus: string;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  deliveryAddress?: string;
  deliveryArea?: string;
  deliveryNotes?: string;
  createdAt: string;
  orderItems: OrderItem[];
}

const STATUS_STAGES = [
  { key: 'PENDING', label: 'ORDER RECEIVED', desc: 'Order placed & awaiting confirmation' },
  { key: 'CONFIRMED', label: 'ORDER CONFIRMED', desc: 'Accepted by kitchen staff' },
  { key: 'PREPARING', label: 'PREPARING BBQ', desc: 'Fire-grilled over live charcoal' },
  { key: 'OUT_FOR_DELIVERY', label: 'OUT FOR DELIVERY', desc: 'Rider is on the way to your location' },
  { key: 'DELIVERED', label: 'COMPLETED', desc: 'Order delivered & fulfilled' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTrackOrder = async (num: string, ph: string) => {
    if (!num.trim() || !ph.trim()) {
      setErrorMsg('Please enter both Order Number and Phone Number.');
      toast.warning('Please enter both Order Number and Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: num.trim(),
          phone: ph.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No matching order found.');
      }

      setOrder(data.order);
      toast.success('Order tracking details retrieved successfully');
    } catch (err: any) {
      setOrder(null);
      setErrorMsg(err.message || 'No order found with the provided details.');
      toast.error(err.message || 'No order found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const paramNum = searchParams.get('orderNumber');
    const paramPhone = searchParams.get('phone');

    if (paramNum) setOrderNumberInput(paramNum);
    if (paramPhone) setPhoneInput(paramPhone);

    if (paramNum && paramPhone) {
      fetchTrackOrder(paramNum, paramPhone);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackOrder(orderNumberInput, phoneInput);
  };

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
      case 'READY':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIndex = order ? getStageIndex(order.orderStatus) : 0;
  const isCancelled = order?.orderStatus === 'CANCELLED';

  const generateWhatsAppLink = () => {
    if (!order) return '#';
    const itemsText = order.orderItems
      .map((i) => `• ${i.name} x${i.quantity} (Rs. ${i.price * i.quantity})`)
      .join('\n');

    const text = `*TAWAKAL RESTAURANT — ORDER TRACKING INQUIRY*
*Order Number:* ${order.orderNumber}
*Customer:* ${order.customerName}
*Status:* ${order.orderStatus}
*Total:* Rs. ${order.totalAmount}

*Items:*
${itemsText}

Hi Tawakal BBQ, I would like an update on my order.`;

    return `https://wa.me/923431265090?text=${encodeURIComponent(text)}`;
  };

  return (
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C83B22]/15 border border-[#C83B22]/30 text-[#C83B22] font-sans text-xs font-bold uppercase tracking-widest mb-4">
          <Flame className="w-4 h-4" />
          <span>Live Order Tracking</span>
        </div>
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wider text-[#F4EBDD]">
          TRACK YOUR ORDER
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#9F9589] max-w-md mx-auto mt-2">
          Enter your Order Number and registered Phone Number to view live preparation & delivery progress.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-[#1A1815] border border-[#24201C] rounded-3xl p-6 sm:p-8 shadow-2xl mb-12">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C69A45] mb-1">
              Order Number
            </label>
            <input
              type="text"
              placeholder="e.g. TWK-56923"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-xs text-[#F4EBDD] font-mono focus:outline-none focus:border-[#C83B22]"
            />
          </div>

          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C69A45] mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="e.g. 03431265090"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-xs text-[#F4EBDD] font-mono focus:outline-none focus:border-[#C83B22]"
            />
          </div>

          <div className="sm:self-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs uppercase font-bold tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Flame className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-[#E53935]/10 border border-[#E53935]/30 text-[#FFEBEE] text-xs font-sans flex items-center gap-2">
            <XCircle className="w-4 h-4 text-[#E53935] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Order Details Display */}
      {order && (
        <div className="space-y-8">
          {/* Order Header Summary */}
          <div className="bg-[#1A1815] border border-[#24201C] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-bebas text-3xl tracking-wider text-[#F4EBDD]">
                  {order.orderNumber}
                </span>
                <span className="bg-[#C83B22]/20 border border-[#C83B22]/40 text-[#C83B22] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {order.orderType}
                </span>
              </div>
              <p className="font-sans text-xs text-[#9F9589] mt-1">
                Placed on{' '}
                {new Date(order.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchTrackOrder(order.orderNumber, order.customerPhone)}
                className="px-4 py-2 rounded-xl bg-[#11100E] border border-[#24201C] text-[#9F9589] hover:text-[#F4EBDD] text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Status</span>
              </button>
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>

          {/* Timeline Status Card */}
          <div className="bg-[#1A1815] border border-[#24201C] rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h3 className="font-bebas text-2xl tracking-wider text-[#C69A45] mb-6">
              ORDER STATUS TIMELINE
            </h3>

            {isCancelled ? (
              <div className="p-6 rounded-2xl bg-[#E53935]/15 border border-[#E53935]/40 text-center space-y-2">
                <XCircle className="w-10 h-10 text-[#E53935] mx-auto" />
                <h4 className="font-bebas text-2xl tracking-wider text-[#FFEBEE]">
                  ORDER CANCELLED
                </h4>
                <p className="font-sans text-xs text-[#FFCDD2] max-w-md mx-auto">
                  This order was cancelled. Please contact our support line at +92 343 1265090 if you have any questions.
                </p>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-2 relative">
                {STATUS_STAGES.map((stage, idx) => {
                  const isDone = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={stage.key} className="flex sm:flex-col items-center gap-4 sm:gap-3 text-left sm:text-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-lg ${
                          isDone
                            ? isCurrent
                              ? 'bg-[#C83B22] text-white border-2 border-[#D94A2D] shadow-[#C83B22]/50 animate-pulse'
                              : 'bg-[#4CAF50] text-white'
                            : 'bg-[#11100E] text-[#9F9589] border border-[#24201C]'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <h4
                          className={`font-sans text-xs font-bold tracking-wider uppercase ${
                            isDone ? 'text-[#F4EBDD]' : 'text-[#9F9589]'
                          }`}
                        >
                          {stage.label}
                        </h4>
                        <p className="font-sans text-[10px] text-[#9F9589] mt-0.5 max-w-[140px] hidden sm:block">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Items & Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ordered Items Table */}
            <div className="md:col-span-2 bg-[#1A1815] border border-[#24201C] rounded-3xl p-6 shadow-2xl">
              <h3 className="font-bebas text-2xl tracking-wider text-[#F4EBDD] mb-4">
                ITEMS ORDERED
              </h3>
              <div className="space-y-3 divide-y divide-[#24201C]">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between">
                    <div>
                      <h4 className="font-sans text-xs font-semibold text-[#F4EBDD]">
                        {item.name}
                      </h4>
                      {item.variantName && (
                        <span className="text-[10px] text-[#C69A45] block">
                          Variant: {item.variantName}
                        </span>
                      )}
                      <span className="text-[10px] text-[#9F9589] block">
                        Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-bebas text-lg text-[#C69A45]">
                      Rs. {(item.quantity * item.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary & Address */}
            <div className="space-y-6">
              {/* Pricing Summary */}
              <div className="bg-[#1A1815] border border-[#24201C] rounded-3xl p-6 shadow-2xl space-y-2.5 text-xs font-sans">
                <h3 className="font-bebas text-2xl tracking-wider text-[#F4EBDD] mb-3">
                  PAYMENT SUMMARY
                </h3>

                <div className="flex justify-between text-[#9F9589]">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal.toLocaleString()}</span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#4CAF50]">
                    <span>Discount</span>
                    <span>- Rs. {order.discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#9F9589]">
                  <span>Delivery Fee</span>
                  <span>Rs. {order.deliveryFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-bebas text-2xl text-[#C69A45] pt-3 border-t border-[#24201C]">
                  <span>Total Amount</span>
                  <span>Rs. {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Delivery Info Card */}
              <div className="bg-[#1A1815] border border-[#24201C] rounded-3xl p-6 shadow-2xl space-y-2 text-xs font-sans">
                <h3 className="font-bebas text-xl tracking-wider text-[#C69A45] mb-2">
                  FULFILLMENT DETAILS
                </h3>

                <div>
                  <span className="text-[10px] text-[#9F9589] font-bold uppercase tracking-wider block">
                    Customer Name:
                  </span>
                  <span className="text-[#F4EBDD] font-semibold">{order.customerName}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#9F9589] font-bold uppercase tracking-wider block mt-2">
                    Address / Location:
                  </span>
                  <span className="text-[#F4EBDD] block">
                    {order.deliveryAddress || 'Pickup at Tawakal BBQ Restaurant'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export function PublicTrackOrderClient() {
  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />
      <Suspense
        fallback={
          <div className="py-32 text-center text-[#9F9589]">
            <Flame className="w-10 h-10 text-[#C83B22] animate-bounce mx-auto mb-3" />
            <p>Loading tracking portal...</p>
          </div>
        }
      >
        <TrackOrderContent />
      </Suspense>
      <Footer />
    </div>
  );
}
