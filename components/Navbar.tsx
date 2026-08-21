'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Menu as MenuIcon, X, ShoppingBag } from 'lucide-react';
import { Button } from './ui/Button';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onOrderClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOrderClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { totalItemsCount, openDrawer } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'MENU', href: '/menu' },
    { name: 'DEALS', href: '/deals' },
    { name: 'TRACK ORDER', href: '/track-order' },
    { name: 'LOCATION', href: '/location' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
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
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
            id="nav-logo"
          >
            <img
              src="/logo.png"
              alt="Tawakal BBQ & Restaurant"
              className="w-10 h-10 object-contain rounded-full border border-[#C83B22]/40 p-0.5 group-hover:border-[#C83B22] transition-all shadow-[0_0_15px_rgba(200,59,34,0.3)] bg-[#11100E]"
            />
            <div className="flex flex-col">
              <span className="font-bebas text-2xl sm:text-3xl tracking-widest text-[#F4EBDD] group-hover:text-[#D96A2B] transition-colors leading-none">
                TAWAKAL <span className="text-[#C83B22]">BBQ</span>
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#B8B0A5] font-medium pt-0.5">
                Authentic Fire Grilled
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                mounted &&
                (pathname === link.href ||
                  (link.href !== '/' && pathname?.startsWith(link.href)));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-sans text-xs tracking-[0.18em] font-medium transition-colors duration-200 relative py-1 group ${
                    isActive ? 'text-[#C83B22]' : 'text-[#F4EBDD]/85 hover:text-[#C83B22]'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#C83B22] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={openDrawer}
              className="relative py-2 px-3.5 rounded-lg border border-[#C69A45]/40 bg-[#1A1815] text-[#F4EBDD] hover:border-[#C69A45] hover:bg-[#24201C] transition-all flex items-center gap-2 font-bebas text-base tracking-wider"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#C69A45]" />
              <span>CART</span>
              <span className="w-5 h-5 rounded-full bg-[#C83B22] text-white text-[11px] font-sans font-bold flex items-center justify-center">
                {totalItemsCount}
              </span>
            </button>

            <Button
              id="nav-order-btn"
              size="sm"
              onClick={onOrderClick ? onOrderClick : openDrawer}
              variant="primary"
            >
              ORDER NOW
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Cart Button */}
            <button
              onClick={openDrawer}
              className="p-2 rounded-lg bg-[#1A1815] border border-[#C69A45]/40 text-[#F4EBDD] relative"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#C69A45]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C83B22] text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F4EBDD] hover:text-[#C83B22] focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7 text-[#C83B22]" />
              ) : (
                <MenuIcon className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#11100E]/98 backdrop-blur-xl md:hidden pt-24 px-6 pb-10 flex flex-col justify-between border-b border-[#C83B22]/30"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bebas text-3xl tracking-widest text-[#F4EBDD] hover:text-[#C83B22] border-b border-[#1A1815] pb-3 transition-colors flex items-center justify-between min-h-[44px]"
                >
                  <span>{link.name}</span>
                  <span className="text-[#C83B22] text-xl">→</span>
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-[#1A1815]">
              <Button
                id="mobile-nav-order-btn"
                size="lg"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDrawer();
                }}
                className="w-full"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                ORDER NOW ({totalItemsCount})
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
