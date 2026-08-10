'use client';

import React from 'react';
import { Flame, MapPin, Phone, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#11100E] text-[#B8B0A5] pt-20 pb-10 border-t border-[#F4EBDD]/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#F4EBDD]/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#hero" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#1A1815] border border-[#C83B22]/40 flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#C83B22]" />
              </div>
              <span className="font-bebas text-3xl font-normal tracking-widest text-[#F4EBDD]">
                TAWAKAL <span className="text-[#C83B22]">BBQ</span>
              </span>
            </a>

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
                <a href="#hero" className="hover:text-[#C83B22] transition-colors">
                  HOME
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#C83B22] transition-colors">
                  ABOUT HERITAGE
                </a>
              </li>
              <li>
                <a href="#from-fire" className="hover:text-[#C83B22] transition-colors">
                  FIRE TO FLAVOR
                </a>
              </li>
              <li>
                <a href="#signatures" className="hover:text-[#C83B22] transition-colors">
                  SIGNATURE DISHES
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#C83B22] transition-colors">
                  FULL MENU
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#C83B22] transition-colors">
                  LOCATION & HOURS
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#F4EBDD]">
              CONTACT & HOURS
            </h4>
            <div className="space-y-3 font-sans text-xs text-[#B8B0A5]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C83B22] shrink-0 mt-0.5" />
                <span>Main Boulevard, Food Street, Karachi</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C83B22] shrink-0" />
                <a href="tel:+923001234567" className="hover:text-[#C83B22] transition-colors">+92 300 1234567</a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C83B22] shrink-0 mt-0.5" />
                <span>5:00 PM – 1:00 AM (Mon - Sun)</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#F4EBDD]">
              FOLLOW THE FLAME
            </h4>
            <p className="font-sans text-xs font-normal text-[#B8B0A5]">
              Connect with us for behind-the-scenes grill action & special seasonal menus.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg bg-[#1A1815] border border-[#F4EBDD]/15 hover:border-[#C83B22] flex items-center justify-center text-[#F4EBDD] hover:text-[#C83B22] transition-colors"
              >
                {/* Real Instagram SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-lg bg-[#1A1815] border border-[#F4EBDD]/15 hover:border-[#C83B22] flex items-center justify-center text-[#F4EBDD] hover:text-[#C83B22] transition-colors"
              >
                {/* Real Facebook SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-lg bg-[#1A1815] border border-[#F4EBDD]/15 hover:border-[#C83B22] flex items-center justify-center text-[#F4EBDD] hover:text-[#C83B22] transition-colors"
              >
                {/* Real TikTok SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.32 1.53-1.32 2.53-.02.83.35 1.65.97 2.19.82.72 2.01.91 3.01.5.86-.33 1.54-1.07 1.79-1.97.16-.54.21-1.1.2-1.67.01-5.26.01-10.53.01-15.79z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-xs text-[#B8B0A5]/70 gap-4">
          <p>© {new Date().getFullYear()} TAWAKAL BBQ. All rights reserved.</p>
          <p className="tracking-wider uppercase">
            Authentic Fire-Grilled Pakistani BBQ Digital Experience
          </p>
        </div>
      </div>
    </footer>
  );
};
