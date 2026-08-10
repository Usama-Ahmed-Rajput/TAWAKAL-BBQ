'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, ShoppingBag, Calendar, CheckCircle2, Phone } from 'lucide-react';
import { Button } from './ui/Button';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialItem,
}) => {
  const [activeTab, setActiveTab] = useState<'order' | 'reserve'>('order');
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setGuestName('');
    setPhone('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070707]/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#111111] border border-[#FF6A00]/50 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#A7A7A7] hover:text-[#FF6A00] transition-colors p-2"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#191919] border border-[#FF6A00]/40 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#FF6A00]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-wider text-[#F5F1EA] uppercase">
                    TAWAKAL BBQ
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-[#FF9D32]">
                    WHERE FIRE MEETS FLAVOR
                  </p>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex border-b border-[#191919] mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('order')}
                  className={`flex-1 py-3 text-xs font-serif font-bold tracking-widest uppercase flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                    activeTab === 'order'
                      ? 'border-[#FF6A00] text-[#FF6A00]'
                      : 'border-transparent text-[#A7A7A7] hover:text-[#F5F1EA]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  ORDER ONLINE
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('reserve')}
                  className={`flex-1 py-3 text-xs font-serif font-bold tracking-widest uppercase flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                    activeTab === 'reserve'
                      ? 'border-[#FF6A00] text-[#FF6A00]'
                      : 'border-transparent text-[#A7A7A7] hover:text-[#F5F1EA]'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  TABLE RESERVATION
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {initialItem && (
                  <div className="p-3 bg-[#191919] border border-[#FF6A00]/30 text-xs text-[#F5F1EA]">
                    Selected Item: <span className="font-bold text-[#FF9D32]">{initialItem}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A7A7A7] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#070707] border border-[#FF6A00]/30 text-sm text-[#F5F1EA] px-4 py-3 rounded-none focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A7A7A7] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="[PHONE NUMBER]"
                    className="w-full bg-[#070707] border border-[#FF6A00]/30 text-sm text-[#F5F1EA] px-4 py-3 rounded-none focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>

                {activeTab === 'reserve' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A7A7A7] mb-1">
                        Guests
                      </label>
                      <select className="w-full bg-[#070707] border border-[#FF6A00]/30 text-sm text-[#F5F1EA] px-4 py-3 rounded-none focus:outline-none focus:border-[#FF6A00]">
                        <option>2 Guests</option>
                        <option>4 Guests</option>
                        <option>6 Guests</option>
                        <option>8+ Large Family Platter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A7A7A7] mb-1">
                        Preferred Time
                      </label>
                      <select className="w-full bg-[#070707] border border-[#FF6A00]/30 text-sm text-[#F5F1EA] px-4 py-3 rounded-none focus:outline-none focus:border-[#FF6A00]">
                        <option>7:00 PM</option>
                        <option>8:30 PM</option>
                        <option>10:00 PM</option>
                        <option>11:30 PM (Midnight)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    {activeTab === 'order' ? 'CONFIRM ORDER REQUEST' : 'CONFIRM RESERVATION'}
                  </Button>
                </div>

                <p className="text-[10px] text-center text-[#A7A7A7] uppercase tracking-wider">
                  Configurable Order/Reservation Action ([ORDERING URL] / [RESERVATION URL])
                </p>
              </form>
            </>
          ) : (
            /* Submission Confirmation Screen */
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#FF6A00]/10 border-2 border-[#FF6A00] flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#FF6A00]" />
              </div>

              <h3 className="font-serif text-3xl font-bold tracking-wider text-[#F5F1EA] uppercase mb-2">
                REQUEST RECEIVED
              </h3>

              <p className="text-sm text-[#A7A7A7] font-light max-w-sm mb-6">
                Thank you <span className="text-[#FF9D32] font-semibold">{guestName}</span>. Our dining floor manager will contact you at <span className="text-[#F5F1EA]">{phone}</span> shortly to confirm your {activeTab === 'order' ? 'order' : 'table reservation'}.
              </p>

              <Button onClick={handleReset} variant="secondary" size="md">
                CLOSE
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
