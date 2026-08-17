'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check initial status
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (isOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-[#C83B22] text-white px-4 py-2 text-center shadow-lg animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-sans text-xs font-semibold tracking-wider">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>YOU ARE CURRENTLY OFFLINE. Online connection is required to place orders or make reservations.</span>
        </div>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-[#4CAF50] text-white px-4 py-2 text-center shadow-lg animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-sans text-xs font-semibold tracking-wider">
          <Wifi className="w-4 h-4" />
          <span>CONNECTION RESTORED. You are back online!</span>
        </div>
      </div>
    );
  }

  return null;
}
