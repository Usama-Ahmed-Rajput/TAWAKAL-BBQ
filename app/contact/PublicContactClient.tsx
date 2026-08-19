'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Location } from '@/components/Location';
import { MapPin, Phone, MessageSquare, ExternalLink, Clock, Check } from 'lucide-react';

export function PublicContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const addressString = 'Plot No. 358, Street 5, Sector B, Main Road Akhter Colony, Opposite Saddique Medical Store, Karachi, Pakistan';
  const encodedAddress = encodeURIComponent(addressString);
  const directionsUrl = `https://maps.google.com/?q=${encodedAddress}`;

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      <main className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-widest text-[#F4EBDD] uppercase leading-none">
            CONTACT <span className="text-[#C69A45]">TAWAKAL RESTAURANT</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#9F9589] max-w-xl mx-auto mt-2">
            Get in touch for takeaway orders, home delivery, party bookings, or customer feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information Card */}
          <div className="p-8 rounded-3xl bg-[#1A1815] border border-[#C69A45]/30 space-y-6 shadow-2xl">
            <h2 className="font-bebas text-3xl tracking-wider text-[#F4EBDD] border-b border-[#24201C] pb-3">
              RESTAURANT DETAILS
            </h2>

            <div className="space-y-5 font-sans text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C69A45] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F4EBDD] block uppercase tracking-wider text-[10px] mb-1">
                    EXACT RESTAURANT ADDRESS
                  </span>
                  <p className="text-[#9F9589] leading-relaxed">
                    Plot No. 358, Street 5, Sector B, Main Road Akhter Colony, Opposite Saddique Medical Store, Karachi, Pakistan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#24201C]">
                <Phone className="w-5 h-5 text-[#C83B22] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F4EBDD] block uppercase tracking-wider text-[10px] mb-1">
                    ORDER & RESERVATION PHONE NUMBERS
                  </span>
                  <div className="space-y-1 font-mono text-sm">
                    <a href="tel:+923431265090" className="block text-[#F4EBDD] hover:text-[#C83B22] transition-colors">
                      +92-343-1265090
                    </a>
                    <a href="tel:+923485650906" className="block text-[#F4EBDD] hover:text-[#C83B22] transition-colors">
                      +92-348-5650906
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#24201C]">
                <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F4EBDD] block uppercase tracking-wider text-[10px] mb-1">
                    INSTANT WHATSAPP ORDER LINE
                  </span>
                  <a
                    href="https://wa.me/923485650906"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#25D366] font-mono font-bold hover:underline"
                  >
                    <span>+92 348 5650906</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#24201C]">
                <Clock className="w-5 h-5 text-[#C69A45] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F4EBDD] block uppercase tracking-wider text-[10px] mb-1">
                    OPENING HOURS
                  </span>
                  <p className="text-[#9F9589]">Monday – Sunday: 12:00 PM – 01:00 AM</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>GET DIRECTIONS ON GOOGLE MAPS</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="p-8 rounded-3xl bg-[#1A1815] border border-[#24201C] space-y-4 shadow-2xl">
            <h2 className="font-bebas text-3xl tracking-wider text-[#F4EBDD] border-b border-[#24201C] pb-3">
              SEND US A MESSAGE
            </h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-sm">Message Sent Successfully!</p>
                <p className="text-emerald-300/80 font-normal">
                  Thank you for reaching out to Tawakal BBQ. Our team will respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">YOUR NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Ahmed"
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 343 1265090"
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">MESSAGE / FEEDBACK *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your suggestions or inquiry..."
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#24201C] hover:bg-[#2A2520] text-[#F4EBDD] font-sans text-xs uppercase font-bold tracking-wider border border-[#C69A45]/30 transition-colors cursor-pointer"
                >
                  SUBMIT MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* FIND TAWAKAL BBQ Location Section */}
      <Location />

      <Footer />
    </div>
  );
}
