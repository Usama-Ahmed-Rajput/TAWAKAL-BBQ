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
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#11100E] border-b border-[#F4EBDD]/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Video Container */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-video lg:aspect-[4/3] bg-[#1A1815] border border-[#C83B22]/40 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group"
        >
          <video
            ref={videoRef}
            src="/videos/signature-platter.mp4"
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 border border-[#C83B22]/20 pointer-events-none rounded-xl" />

          {/* Floating Badge */}
          <div className="absolute bottom-6 left-6 z-10 inline-flex items-center gap-2 px-4 py-2 bg-[#11100E]/90 backdrop-blur-md border border-[#C69A45]/50 font-sans text-xs font-bold uppercase tracking-widest text-[#C69A45] rounded shadow-lg">
            <Flame className="w-4 h-4 text-[#C83B22]" />
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#1A1815] border border-[#C69A45]/30 text-[#C69A45] font-sans text-xs font-bold uppercase tracking-[0.2em] mb-4 rounded">
            <Award className="w-3.5 h-3.5 text-[#C69A45]" />
            THE CROWN JEWEL
          </div>

          <h2 className="font-bebas text-4xl sm:text-6xl lg:text-7xl font-normal tracking-widest text-[#F4EBDD] uppercase leading-none">
            THE TAWAKAL SIGNATURE
          </h2>

          <p className="mt-3 text-xl sm:text-2xl font-food text-[#D96A2B] font-normal">
            “One table. Every favorite.”
          </p>

          <p className="mt-5 font-sans text-sm sm:text-base text-[#B8B0A5] font-normal leading-relaxed">
            Crafted for royal feasts and family gatherings. The Tawakal Signature Platter combines juicy seekh kebabs, creamy malai boti, fiery beef boti, char-grilled chicken tikka, hot tandoori naan, crisp salads and signature house chutneys on one massive sizzling iron tray.
          </p>

          {/* Platter quick stats */}
          <div className="mt-8 grid grid-cols-2 gap-6 w-full py-6 border-y border-[#1A1815]">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#C83B22]" />
              <div>
                <span className="block font-sans text-[10px] uppercase tracking-wider text-[#B8B0A5] font-semibold">SERVES</span>
                <span className="font-sans font-bold text-lg text-[#F4EBDD]">3 to 5 Guests</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Utensils className="w-6 h-6 text-[#D96A2B]" />
              <div>
                <span className="block font-sans text-[10px] uppercase tracking-wider text-[#B8B0A5] font-semibold">VARIETIES</span>
                <span className="font-sans font-bold text-lg text-[#F4EBDD]">6 Meats & Breads</span>
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
