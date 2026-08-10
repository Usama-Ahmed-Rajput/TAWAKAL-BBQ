'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Flame, Utensils, Award, Users } from 'lucide-react';
import { Button } from './ui/Button';

export const SignaturePlatter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  // Play when visible, pause when outside viewport
  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      id="platter"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070707] border-b border-[#191919] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Video Container */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-video lg:aspect-[4/3] bg-[#191919] border border-[#FF6A00]/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden group"
        >
          <video
            ref={videoRef}
            src="/videos/signature-platter.mp4"
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 border border-[#FF6A00]/20 pointer-events-none" />

          {/* Floating Badge */}
          <div className="absolute bottom-6 left-6 z-10 inline-flex items-center gap-2 px-4 py-2 bg-[#070707]/90 backdrop-blur-md border border-[#FF6A00]/50 text-xs font-bold uppercase tracking-widest text-[#FF9D32]">
            <Flame className="w-4 h-4 text-[#FF6A00]" />
            SIGNATURE ROYAL PLATTER
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#191919] border border-[#FF6A00]/30 text-[#FF9D32] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            <Award className="w-3.5 h-3.5 text-[#FF6A00]" />
            THE CROWN JEWEL
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-[#F5F1EA] uppercase leading-tight">
            THE TAWAKAL SIGNATURE
          </h2>

          <p className="mt-4 text-xl sm:text-2xl font-serif tracking-widest text-[#FF6A00] font-medium">
            "One table. Every favorite."
          </p>

          <p className="mt-6 text-base sm:text-lg text-[#A7A7A7] font-light leading-relaxed">
            Crafted for royal feasts and family gatherings. The Tawakal Signature Platter combines juicy seekh kebabs, creamy malai boti, fiery beef boti, char-grilled chicken tikka, hot tandoori naan, crisp salads and signature house chutneys on one massive sizzling iron tray.
          </p>

          {/* Platter quick stats */}
          <div className="mt-8 grid grid-cols-2 gap-6 w-full py-6 border-y border-[#191919]">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#FF6A00]" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#A7A7A7]">SERVES</span>
                <span className="font-serif font-bold text-lg text-[#F5F1EA]">3 to 5 Guests</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Utensils className="w-6 h-6 text-[#FF9D32]" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#A7A7A7]">VARIETIES</span>
                <span className="font-serif font-bold text-lg text-[#F5F1EA]">6 Meats & Breads</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button href="#menu" variant="primary" size="lg" id="platter-view-menu-btn">
              <Utensils className="w-5 h-5 mr-2" />
              VIEW FULL MENU
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
