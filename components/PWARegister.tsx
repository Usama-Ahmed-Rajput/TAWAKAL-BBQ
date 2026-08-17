'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PWARegister() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA DIAGNOSTIC] Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA DIAGNOSTIC] Service Worker registration failed:', error);
        });
    }
  }, [pathname]);

  return null;
}
