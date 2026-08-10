'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Menu as MenuIcon, X, Phone, ShoppingBag } from 'lucide-react';
import { Button } from './ui/Button';

interface NavbarProps {
  onOrderClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOrderClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'ABOUT', href: '#about' },
    { name: 'EXPERIENCE', href: '#from-fire' },
    { name: 'SIGNATURES', href: '#signatures' },
    { name: 'MENU', href: '#menu' },
    { name: 'LOCATION', href: '#location' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#070707]/95 backdrop-blur-md border-b border-[#FF6A00]/30 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.9)]'
            : 'bg-gradient-to-b from-[#070707] via-[#070707]/70 to-transparent py-5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group cursor-pointer"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-full bg-[#191919] border border-[#FF6A00]/40 flex items-center justify-center group-hover:border-[#FF6A00] transition-colors duration-300 shadow-[0_0_15px_rgba(255,106,0,0.2)]">
              <Flame className="w-5 h-5 text-[#FF6A00] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#F5F1EA] group-hover:text-[#FF9D32] transition-colors">
                TAWAKAL <span className="text-[#FF6A00]">BBQ</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#A7A7A7] -mt-1 font-light">
                Authentic Fire Grilled
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs tracking-[0.2em] font-semibold text-[#F5F1EA]/80 hover:text-[#FF6A00] transition-colors duration-200 relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6A00] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              id="nav-order-btn"
              size="sm"
              onClick={onOrderClick}
              variant="primary"
            >
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              ORDER NOW
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F5F1EA] hover:text-[#FF6A00] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 text-[#FF6A00]" />
            ) : (
              <MenuIcon className="w-7 h-7" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#070707]/98 backdrop-blur-xl md:hidden pt-24 px-6 pb-10 flex flex-col justify-between border-b border-[#FF6A00]/30"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-serif font-semibold tracking-widest text-[#F5F1EA] hover:text-[#FF6A00] border-b border-[#191919] pb-3 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-[#FF6A00] text-sm">→</span>
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-[#191919]">
              <Button
                id="mobile-nav-order-btn"
                size="lg"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOrderClick?.();
                }}
                className="w-full"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                ORDER NOW
              </Button>

              <div className="text-center text-xs text-[#A7A7A7] tracking-wider uppercase pt-2">
                Where Fire Meets Flavor • Live BBQ Daily
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
