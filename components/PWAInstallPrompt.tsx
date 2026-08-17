'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Flame, Share, PlusSquare } from 'lucide-react';

export function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Do not display on admin panel routes
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // 2. Check if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // 3. Check if user previously dismissed prompt (expire after 7 days)
    const dismissedTimestamp = localStorage.getItem('tawakal_pwa_dismissed_at');
    if (dismissedTimestamp) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTimestamp, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // 4. Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/Edg/.test(ua);

    if (isIOSDevice && isSafari) {
      setIsIOS(true);
      // Small delay before showing prompt on iOS
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // 5. Handle standard beforeinstallprompt (Android / Chrome / Edge / Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [pathname]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted install prompt');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem('tawakal_pwa_dismissed_at', Date.now().toString());
  };

  if (!showPrompt || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#1A1815]/95 backdrop-blur-xl border border-[#C69A45]/40 rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-[#F4EBDD] relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-[#9F9589] hover:text-[#F4EBDD] p-1 rounded-lg hover:bg-[#24201C] transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-12 h-12 rounded-xl bg-[#11100E] border border-[#C83B22]/50 p-1 flex-shrink-0 flex items-center justify-center shadow-lg">
            <img src="/logo.png" alt="Tawakal BBQ" className="w-full h-full object-contain rounded-lg" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bebas text-lg tracking-wider text-[#F4EBDD]">
                INSTALL <span className="text-[#C83B22]">TAWAKAL BBQ</span> APP
              </span>
            </div>
            <p className="font-sans text-xs text-[#9F9589] leading-snug">
              Get fast ordering, live tracking & instant updates right from your home screen.
            </p>
          </div>
        </div>

        {/* iOS Guide Expanded Instructions */}
        {showIOSGuide ? (
          <div className="mt-3 pt-3 border-t border-[#24201C] text-xs font-sans text-[#D2C7B8] space-y-2">
            <p className="font-semibold text-[#C69A45] flex items-center gap-1.5">
              <span>To install on iPhone / iPad:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#9F9589]">
              <li className="flex items-center gap-1.5">
                <span>1. Tap the Share button</span> <Share className="w-3.5 h-3.5 text-[#C69A45] inline" />
              </li>
              <li className="flex items-center gap-1.5">
                <span>2. Scroll down & select </span> <strong className="text-[#F4EBDD]">"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 text-[#C83B22] inline" />
              </li>
              <li>3. Confirm by tapping "Add"</li>
            </ol>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-1.5 mt-1 text-center font-sans text-[11px] text-[#9F9589] hover:text-[#F4EBDD] underline"
            >
              Got it
            </button>
          </div>
        ) : (
          <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-[#24201C]/60">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(200,59,34,0.35)]"
            >
              <Download className="w-4 h-4" />
              <span>INSTALL NOW</span>
            </button>
            <button
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-xl bg-[#24201C] hover:bg-[#2A2520] text-[#9F9589] hover:text-[#F4EBDD] font-sans text-xs font-medium transition-colors"
            >
              NOT NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
