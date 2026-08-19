'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, Clock, Users, Check, Flame, MessageSquare } from 'lucide-react';

export function PublicReservationClient() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '2',
    date: '',
    time: '19:00',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C69A45]/10 border border-[#C69A45]/30 text-[#C69A45] font-sans text-xs uppercase font-bold tracking-widest mb-4">
            <Flame className="w-4 h-4 text-[#C83B22]" />
            Dine-In & Event Booking
          </div>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-widest text-[#F4EBDD] uppercase leading-none">
            RESERVE A <span className="text-[#C69A45]">DINING TABLE</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#9F9589] max-w-xl mx-auto mt-3">
            Book your family table or party reservation at Tawakal BBQ & Restaurant for live charcoal dining.
          </p>
        </div>

        <div className="bg-[#1A1815] border border-[#24201C] rounded-3xl p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="font-bebas text-3xl text-[#F4EBDD] tracking-wider">
                RESERVATION REQUEST RECEIVED!
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#9F9589] max-w-md mx-auto leading-relaxed">
                Thank you <strong className="text-[#F4EBDD]">{formData.name}</strong>. Our reservation manager will contact you shortly on <strong className="text-[#C69A45]">{formData.phone}</strong> to confirm your table for {formData.guests} guests on {formData.date}.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-xl bg-[#24201C] text-[#F4EBDD] font-sans text-xs uppercase font-bold tracking-wider hover:bg-[#2A2520] transition-colors"
                >
                  Make Another Reservation
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1.5 uppercase">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Hammad Khan"
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1.5 uppercase">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 343 1265090"
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1.5 uppercase flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#C69A45]" />
                    <span>Number of Guests *</span>
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  >
                    <option value="2">2 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="6">6 Guests (Family Table)</option>
                    <option value="8">8 Guests (Large Group)</option>
                    <option value="12">12+ Guests (Party Hall)</option>
                  </select>
                </div>

                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1.5 uppercase flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#C69A45]" />
                    <span>Reservation Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1.5 uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#C69A45]" />
                    <span>Preferred Time *</span>
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  >
                    <option value="13:00">01:00 PM (Lunch)</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="19:00">07:00 PM (Dinner)</option>
                    <option value="21:00">09:00 PM (Peak Dinner)</option>
                    <option value="23:00">11:00 PM (Late BBQ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1.5 uppercase">
                  Special Notes / Seating Preference
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Family hall seating required, birthday celebration, high chair..."
                  className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs uppercase font-bold tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                CONFIRM TABLE RESERVATION
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
