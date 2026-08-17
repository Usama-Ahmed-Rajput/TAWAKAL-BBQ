'use client';

import React from 'react';
import { WifiOff, RefreshCw, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OfflineFallbackPage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#11100E] text-[#F4EBDD] flex flex-col justify-between selection:bg-[#C83B22] selection:text-white">
      {/* Header Bar */}
      <header className="border-b border-[#F4EBDD]/10 py-5 px-6 bg-[#11100E]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Tawakal BBQ Logo"
              className="w-10 h-10 object-contain rounded-full border border-[#C83B22]/40 p-0.5"
            />
            <div className="flex flex-col">
              <span className="font-bebas text-2xl tracking-widest text-[#F4EBDD]">
                TAWAKAL <span className="text-[#C83B22]">BBQ</span>
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#B8B0A5]">
                Authentic Fire Grilled
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto space-y-6 bg-[#1A1815] border border-[#24201C] p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Fire Glow Effect */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C83B22]/15 blur-3xl rounded-full pointer-events-none" />

          <div className="w-20 h-20 rounded-2xl bg-[#11100E] border border-[#C83B22]/40 text-[#C83B22] mx-auto flex items-center justify-center shadow-inner">
            <WifiOff className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#C69A45]">
              NO INTERNET CONNECTION
            </span>
            <h1 className="font-bebas text-4xl sm:text-5xl tracking-wider text-[#F4EBDD]">
              YOU ARE <span className="text-[#C83B22]">OFFLINE</span>
            </h1>
            <p className="font-sans text-xs text-[#9F9589] leading-relaxed">
              We couldn't connect to Tawakal BBQ servers. Please check your Wi-Fi or mobile data connection and try again.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#11100E] border border-[#24201C] text-xs font-sans text-[#D2C7B8] flex items-center gap-3 text-left">
            <ShoppingBag className="w-5 h-5 text-[#C69A45] flex-shrink-0" />
            <div>
              <span className="font-bold block text-[#F4EBDD]">Your cart is safe!</span>
              <span className="text-[11px] text-[#9F9589]">Items added to your cart are saved locally on your device.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleReload}
              className="w-full py-3.5 px-6 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RETRY CONNECTION</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F4EBDD]/10 py-4 px-6 text-center text-xs font-sans text-[#9F9589]">
        Tawakal Bar B.Q & Restaurant • Where Fire Meets Flavor
      </footer>
    </div>
  );
}
