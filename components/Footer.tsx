'use client';

import React from 'react';
import { Flame, MapPin, Phone, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#11100E] text-[#B8B0A5] pt-20 pb-10 border-t border-[#F4EBDD]/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#F4EBDD]/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Tawakal BBQ & Restaurant Logo"
                className="w-10 h-10 object-contain rounded-full border border-[#C83B22]/40 bg-[#11100E] p-0.5"
              />
              <span className="font-bebas text-3xl font-normal tracking-widest text-[#F4EBDD]">
                TAWAKAL <span className="text-[#C83B22]">BBQ</span>
              </span>
            </Link>

            <p className="font-sans text-xs sm:text-sm font-normal leading-relaxed max-w-sm text-[#B8B0A5]">
              Authentic Pakistani BBQ grilled over natural live charcoal. Crafted with heritage marinades, premium cuts, and uncompromised passion for flavor.
            </p>

            <div className="pt-2 font-sans text-xs uppercase tracking-[0.2em] font-bold text-[#C69A45]">
              WHERE FIRE MEETS FLAVOR
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#F4EBDD]">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 font-sans text-xs tracking-wider">
              <li>
                <Link href="/" className="hover:text-[#C83B22] transition-colors">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#C83B22] transition-colors">
                  FULL MENU
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-[#C83B22] transition-colors">
                  SPECIAL DEALS
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-[#C83B22] transition-colors">
                  LOCATION & MAP
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C83B22] transition-colors">
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C83B22] transition-colors">
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>

          {/* Address & Contact Details */}
          <div className="space-y-4 lg:col-span-2">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#F4EBDD]">
              RESTAURANT ADDRESS & PHONE
            </h4>
            <div className="space-y-3 font-sans text-xs text-[#B8B0A5]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C69A45] shrink-0 mt-0.5" />
                <span>
                  <strong>Written Address:</strong> Plot No 358, Street 5, Sector B, Main Road Akhter Colony, Opposite Saddique Medical Store, Karachi, Pakistan
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C83B22] shrink-0 mt-0.5" />
                <span>
                  <strong>Map Reference:</strong> R3QF+WGH, Akhtar Colony Main Rd, Sector C Akhtar Colony, Karachi, Pakistan
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-[#C83B22] shrink-0" />
                <span>+92 343 1265090 / +92 348 5650906</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <span>Complaints & Suggestions: +92 348 9225866</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C69A45] shrink-0" />
                <span>12:00 PM – 01:00 AM Daily</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Plot%20No.%20358,%20Street%205,%20Sector%20B,%20Main%20Road%20Akhter%20Colony,%20Opposite%20Saddique%20Medical%20Store,%20Karachi,%20Pakistan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs uppercase font-bold tracking-wider shadow-md transition-colors"
              >
                <span>GET DIRECTIONS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-xs text-[#B8B0A5]/70 gap-4">
          <p>© {new Date().getFullYear()} TAWAKAL RESTAURANT. All rights reserved.</p>
          <p className="tracking-wider uppercase">
            Authentic Fire-Grilled Pakistani BBQ Platform
          </p>
        </div>
      </div>
    </footer>
  );
};
