'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Flame, ShieldCheck, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export function PublicAboutClient() {
  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      <main className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C83B22]/10 border border-[#C83B22]/30 text-[#C83B22] font-sans text-xs uppercase font-bold tracking-widest mb-4">
            <Flame className="w-4 h-4" />
            Authentic Pakistani BBQ
          </div>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-widest text-[#F4EBDD] uppercase leading-none">
            ABOUT <span className="text-[#C69A45]">TAWAKAL RESTAURANT</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#9F9589] max-w-2xl mx-auto mt-3">
            Where Fire Meets Flavor. Delivering authentic live charcoal BBQ, crisp paratha rolls, and fast food specialties in Karachi.
          </p>
        </div>

        <div className="space-y-12">
          {/* Main Story Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1A1815] border border-[#24201C] grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-2xl">
            <div className="space-y-4">
              <span className="font-bebas text-2xl text-[#C69A45] tracking-wider block">
                OUR CULINARY PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl text-[#F4EBDD] leading-tight">
                Live Charcoal Grilling & Fresh Ingredients
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#9F9589] leading-relaxed">
                At Tawakal Restaurant, every dish is prepared with dedication. From slow-marinated chicken tikkas and tender seekh kebabs to our signature malai botis and crispy rolls, we grill over live embers to ensure authentic smokey flavor in every bite.
              </p>
              <div className="pt-2">
                <Link
                  href="/menu"
                  className="inline-flex px-6 py-3 rounded-xl bg-[#C83B22] text-white font-sans text-xs uppercase font-bold tracking-wider hover:bg-[#D94A2D] transition-colors"
                >
                  EXPLORE OUR MENU
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-video sm:aspect-square bg-[#11100E] border border-[#24201C]">
              <img
                src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80"
                alt="Live Charcoal BBQ Grilling at Tawakal Restaurant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Location & Details Card */}
          <div className="p-8 rounded-3xl bg-[#1A1815] border border-[#C69A45]/30 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-2 p-4">
              <MapPin className="w-8 h-8 text-[#C69A45] mx-auto" />
              <h3 className="font-bebas text-xl text-[#F4EBDD]">LOCATION</h3>
              <p className="font-sans text-xs text-[#9F9589]">
                R3QF+WGH, Akhtar Colony Main Rd, Sector C Akhtar Colony, Karachi, Pakistan
              </p>
            </div>

            <div className="space-y-2 p-4 border-y sm:border-y-0 sm:border-x border-[#24201C]">
              <Phone className="w-8 h-8 text-[#C83B22] mx-auto" />
              <h3 className="font-bebas text-xl text-[#F4EBDD]">PHONE ORDERS</h3>
              <p className="font-sans text-xs text-[#9F9589]">
                +92 343 1265090<br />+92 348 5650906
              </p>
            </div>

            <div className="space-y-2 p-4">
              <ShieldCheck className="w-8 h-8 text-[#4CAF50] mx-auto" />
              <h3 className="font-bebas text-xl text-[#F4EBDD]">COMPLAINTS & FEEDBACK</h3>
              <p className="font-sans text-xs text-[#9F9589]">
                +92 348 9225866
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
