'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, ShoppingBag, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: string;
  initialItemId?: string;
  initialPrice?: number;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialItem,
  initialItemId,
  initialPrice,
}) => {
  const [activeTab, setActiveTab] = useState<'order' | 'reserve'>('order');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState<any>(null);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reservation State
  const [guests, setGuests] = useState('4');
  const [resDate, setResDate] = useState(new Date().toISOString().slice(0, 10));
  const [resTime, setResTime] = useState('08:00 PM');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'order') {
        const payload = {
          customerName: guestName,
          customerPhone: phone,
          customerEmail: email || undefined,
          deliveryAddress: deliveryAddress || 'Dine-in / Pickup Counter',
          deliveryNotes,
          orderType: deliveryAddress ? 'DELIVERY' : 'PICKUP',
          paymentMethod: 'CASH_ON_DELIVERY',
          couponCode: couponCode || undefined,
          items: [
            {
              productId: initialItemId || undefined,
              menuItemId: initialItemId || undefined,
              name: initialItem || 'Tawakal BBQ Special',
              price: initialPrice || 350,
              quantity,
            },
          ],
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to place order');

        setOrderResult(data.order);
        setSubmitted(true);
      } else {
        // Reservation
        const payload = {
          name: guestName,
          phone,
          email: email || undefined,
          date: resDate,
          time: resTime,
          guests: Number(guests),
          specialRequests: deliveryNotes || undefined,
        };

        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to reserve table');

        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError('');
    setGuestName('');
    setPhone('');
    setDeliveryAddress('');
    setCouponCode('');
    setOrderResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11100E]/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#11100E] border border-[#F4EBDD]/15 p-6 sm:p-8 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#B8B0A5] hover:text-[#C83B22] transition-colors p-2 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#1A1815] border border-[#C69A45]/30 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#C83B22]" />
                </div>
                <div>
                  <h3 className="font-bebas text-3xl font-normal tracking-widest text-[#F4EBDD] uppercase leading-none">
                    TAWAKAL BBQ
                  </h3>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#C69A45] font-bold">
                    LIVE PERSISTENT ORDERING SYSTEM
                  </p>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex border-b border-[#1A1815] mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('order')}
                  className={`flex-1 py-3 font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'order'
                      ? 'border-[#C83B22] text-[#C83B22]'
                      : 'border-transparent text-[#B8B0A5] hover:text-[#F4EBDD]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  ORDER ONLINE
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('reserve')}
                  className={`flex-1 py-3 font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'reserve'
                      ? 'border-[#C83B22] text-[#C83B22]'
                      : 'border-transparent text-[#B8B0A5] hover:text-[#F4EBDD]'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  TABLE RESERVATION
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-lg text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {initialItem && (
                  <div className="p-3 bg-[#1A1815] border border-[#C83B22]/30 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-sans text-[10px] text-[#B8B0A5] uppercase tracking-wider block">
                        Selected Dish
                      </span>
                      <span className="font-bold text-sm text-[#F4EBDD]">{initialItem}</span>
                    </div>
                    {initialPrice && (
                      <span className="font-bebas text-xl text-[#C69A45]">
                        Rs. {initialPrice * quantity}
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#B8B0A5] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Farhan Ahmed"
                      className="w-full bg-[#1A1815] border border-[#F4EBDD]/15 font-sans text-xs text-[#F4EBDD] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C83B22]"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#B8B0A5] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-[#1A1815] border border-[#F4EBDD]/15 font-sans text-xs text-[#F4EBDD] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C83B22]"
                    />
                  </div>
                </div>

                {activeTab === 'order' && (
                  <>
                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#B8B0A5] mb-1">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="House #, Street name, Area (Leave blank for Takeaway)"
                        className="w-full bg-[#1A1815] border border-[#F4EBDD]/15 font-sans text-xs text-[#F4EBDD] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C83B22]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#B8B0A5] mb-1">
                          Promo / Coupon Code
                        </label>
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="e.g. WELCOME10"
                          className="w-full bg-[#1A1815] border border-[#F4EBDD]/15 font-sans text-xs text-[#F4EBDD] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C83B22]"
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#B8B0A5] mb-1">
                          Quantity
                        </label>
                        <select
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="w-full bg-[#1A1815] border border-[#F4EBDD]/15 font-sans text-xs text-[#F4EBDD] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C83B22]"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                            <option key={n} value={n}>
                              {n} Serving{n > 1 ? 's' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'reserve' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#B8B0A5] mb-1">
                        Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full bg-[#1A1815] border border-[#F4EBDD]/15 font-sans text-xs text-[#F4EBDD] px-2 py-2.5 rounded-lg focus:outline-none focus:border-[#C83B22]"
                      >
                        <option value="2">2 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="6">6 Guests</option>
                        <option value="8">8+ Family</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#B8B0A5] mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={resDate}
                        onChange={(e) => setResDate(e.target.value)}
                        className="w-full bg-[#1A1815] border border-[#F4EBDD]/15 font-sans text-xs text-[#F4EBDD] px-2 py-2 rounded-lg focus:outline-none focus:border-[#C83B22]"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#B8B0A5] mb-1">
                        Time
                      </label>
                      <select
                        value={resTime}
                        onChange={(e) => setResTime(e.target.value)}
                        className="w-full bg-[#1A1815] border border-[#F4EBDD]/15 font-sans text-xs text-[#F4EBDD] px-2 py-2.5 rounded-lg focus:outline-none focus:border-[#C83B22]"
                      >
                        <option value="07:00 PM">7:00 PM</option>
                        <option value="08:30 PM">8:30 PM</option>
                        <option value="10:00 PM">10:00 PM</option>
                        <option value="11:30 PM">11:30 PM</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center space-x-2"
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? 'PROCESSING...'
                        : activeTab === 'order'
                        ? 'SUBMIT PERSISTENT ORDER'
                        : 'CONFIRM TABLE RESERVATION'}
                    </span>
                  </Button>
                </div>
              </form>
            </>
          ) : (
            /* Submission Confirmation Screen */
            <div className="py-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#C83B22]/15 border-2 border-[#C83B22] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#C83B22]" />
              </div>

              <h3 className="font-bebas text-4xl font-normal tracking-widest text-[#F4EBDD] uppercase mb-1">
                {activeTab === 'order' ? 'ORDER PLACED LIVE!' : 'RESERVATION CONFIRMED!'}
              </h3>

              {orderResult && (
                <div className="my-4 p-4 bg-[#1A1815] border border-[#C69A45]/30 rounded-xl w-full text-left font-sans text-xs text-[#F4EBDD] space-y-1.5">
                  <div className="flex justify-between border-b border-[#F4EBDD]/10 pb-2 mb-2">
                    <span className="text-[#B8B0A5]">Tracking Number:</span>
                    <span className="font-mono font-bold text-[#C69A45]">{orderResult.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B8B0A5]">Subtotal:</span>
                    <span>Rs. {orderResult.subtotal}</span>
                  </div>
                  {orderResult.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Applied:</span>
                      <span>- Rs. {orderResult.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#B8B0A5]">Delivery Fee:</span>
                    <span>Rs. {orderResult.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-bebas text-xl text-[#C83B22] pt-2 border-t border-[#F4EBDD]/10">
                    <span>Server Calculated Total:</span>
                    <span>Rs. {orderResult.totalAmount}</span>
                  </div>
                </div>
              )}

              <p className="font-sans text-xs text-[#B8B0A5] font-normal max-w-sm mb-6 leading-relaxed">
                Thank you <span className="text-[#D96A2B] font-semibold">{guestName}</span>. Your order record has been persisted in the Tawakal BBQ engine database. Our team will prepare your charcoal feast immediately.
              </p>

              <Button onClick={handleReset} variant="secondary" size="md">
                CLOSE WINDOW
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
