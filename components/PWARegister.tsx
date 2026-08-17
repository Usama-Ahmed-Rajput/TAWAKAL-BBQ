'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PWARegister() {
  const pathname = usePathname();

  useEffect(() => {
    // SECURITY: Do not register service worker if user is on admin routes
    if (pathname?.startsWith('/admin')) {
      return;
    }

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] Service Worker registration failed:', error);
          });
      });
    }
  }, [pathname]);

  return null;
}
