'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Menu as MenuIcon, X, ShoppingBag } from 'lucide-react';
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
            ? 'bg-[#11100E]/95 backdrop-blur-md border-b border-[#F4EBDD]/10 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-gradient-to-b from-[#11100E] via-[#11100E]/80 to-transparent py-5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group cursor-pointer"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-full bg-[#1A1815] border border-[#C83B22]/40 flex items-center justify-center group-hover:border-[#C83B22] transition-colors duration-300 shadow-[0_0_15px_rgba(200,59,34,0.2)]">
              <Flame className="w-5 h-5 text-[#C83B22] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bebas text-2xl sm:text-3xl tracking-widest text-[#F4EBDD] group-hover:text-[#D96A2B] transition-colors leading-none">
                TAWAKAL <span className="text-[#C83B22]">BBQ</span>
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#B8B0A5] font-medium pt-0.5">
                Authentic Fire Grilled
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-sans text-xs tracking-[0.18em] font-medium text-[#F4EBDD]/85 hover:text-[#C83B22] transition-colors duration-200 relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C83B22] group-hover:w-full transition-all duration-300" />
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
            className="md:hidden p-2 text-[#F4EBDD] hover:text-[#C83B22] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 text-[#C83B22]" />
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
            className="fixed inset-0 z-40 bg-[#11100E]/98 backdrop-blur-xl md:hidden pt-24 px-6 pb-10 flex flex-col justify-between border-b border-[#C83B22]/30"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bebas text-3xl tracking-widest text-[#F4EBDD] hover:text-[#C83B22] border-b border-[#1A1815] pb-3 transition-colors flex items-center justify-between min-h-[44px]"
                >
                  <span>{link.name}</span>
                  <span className="text-[#C83B22] text-xl">→</span>
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-[#1A1815]">
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

              <div className="font-sans text-center text-xs text-[#B8B0A5] tracking-wider uppercase pt-2 font-medium">
                Where Fire Meets Flavor • Authentic BBQ Daily
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
