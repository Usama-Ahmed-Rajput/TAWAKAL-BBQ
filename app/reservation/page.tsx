'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Flame, Calendar, Clock, Users, CheckCircle2 } from 'lucide-react';

export default function PublicReservationPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [specialRequest, setSpecialRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [offlineError, setOfflineError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && !navigator.onLine) {
      setOfflineError('You are currently offline. Please reconnect to the internet to request a reservation.');
      return;
    }
    setOfflineError('');
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C83B22]/10 border border-[#C83B22]/30 text-[#C83B22] font-sans text-xs uppercase font-bold tracking-widest mb-4">
            <Flame className="w-4 h-4" />
            Reserve Your Dining Experience
          </div>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-widest text-[#F4EBDD] uppercase leading-none">
            TABLE <span className="text-[#C69A45]">RESERVATION</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#9F9589] max-w-xl mx-auto mt-2">
            Reserve a table at Tawakal Restaurant for authentic charcoal grilled BBQ with family & friends.
          </p>
        </div>

        {submitted ? (
          <div className="p-10 rounded-3xl bg-[#1A1815] border border-[#C69A45]/40 text-center max-w-lg mx-auto space-y-4 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-[#4CAF50] mx-auto" />
            <h2 className="font-serif text-3xl text-[#F4EBDD]">Reservation Requested!</h2>
            <p className="font-sans text-xs text-[#9F9589] leading-relaxed">
              Thank you, <strong className="text-[#F4EBDD]">{name}</strong>. Your table reservation request for{' '}
              <strong className="text-[#C69A45]">{guests} guests</strong> on <strong className="text-[#C69A45]">{date} at {time}</strong> has been received. Our team will contact you shortly on {phone} to confirm.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-xl bg-[#C83B22] text-white font-sans text-xs font-bold uppercase tracking-wider mt-4"
            >
              Book Another Table
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#1A1815] border border-[#24201C] shadow-2xl space-y-6">
            {offlineError && (
              <div className="p-4 rounded-xl bg-[#C83B22]/10 border border-[#C83B22]/40 text-[#C83B22] text-xs font-sans font-semibold">
                {offlineError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farhan Zaidi"
                  className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                />
              </div>

              <div>
                <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                  PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 343 1265090"
                  className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                  DATE *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                />
              </div>

              <div>
                <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                  TIME *
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                />
              </div>

              <div>
                <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                  GUESTS *
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                >
                  <option value="2">2 Persons</option>
                  <option value="4">4 Persons</option>
                  <option value="6">6 Persons</option>
                  <option value="8">8 Persons</option>
                  <option value="12">12+ Persons Family</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                SPECIAL REQUEST / FAMILY HALL
              </label>
              <textarea
                rows={3}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="Mention if family hall seating or birthday arrangement required..."
                className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs uppercase font-bold tracking-wider shadow-lg transition-all"
            >
              CONFIRM RESERVATION REQUEST
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
