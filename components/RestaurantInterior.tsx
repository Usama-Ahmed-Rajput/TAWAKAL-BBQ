'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Flame, ShieldCheck, Sparkles, ChefHat } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';

export const RestaurantInterior: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { amount: 0.25 });

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  const features = [
    {
      icon: Flame,
      title: 'AUTHENTIC FLAVOR',
      desc: 'Heritage recipes steeped in raw smoke and coarse ground spices.',
    },
    {
      icon: Sparkles,
      title: 'REAL CHARCOAL',
      desc: '100% natural wood charcoal giving distinct rustic char texture.',
    },
    {
      icon: ShieldCheck,
      title: 'FRESH INGREDIENTS',
      desc: 'Halal certified, daily sourced premium meats never frozen.',
    },
    {
      icon: ChefHat,
      title: 'MADE TO ORDER',
      desc: 'Every skewer cooked fresh over roaring open flames upon ordering.',
    },
  ];

  return (
    <section
      ref={containerRef}
      id="experience"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#11100E] border-b border-[#F4EBDD]/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="ATMOSPHERE & DINING"
          title="MORE THAN BBQ"
          subtitle="Come for the BBQ. Stay for the experience."
        />

        {/* Video Window Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-14 relative w-full aspect-video sm:aspect-auto sm:h-[450px] md:h-[500px] bg-[#1A1815] border border-[#C83B22]/30 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          <video
            ref={videoRef}
            src="/videos/restaurant-interior.mp4"
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center opacity-90"
          />

          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-transparent to-[#11100E]/70 pointer-events-none" />

          {/* Overlay Tagline */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-6 pointer-events-none">
            <span className="font-sans text-xs uppercase tracking-[0.25em] font-bold text-[#C69A45] mb-2">
              LUXURY PAKISTANI AMBIANCE
            </span>
            <h3 className="font-bebas text-3xl sm:text-5xl md:text-6xl font-normal tracking-widest text-[#F4EBDD] max-w-2xl leading-none fire-text-glow">
              AN UNFORGETTABLE FEAST FOR THE SENSES
            </h3>
          </div>
        </motion.div>

        {/* 4 Feature Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * idx }}
                className="group p-6 bg-[#1A1815] border border-[#F4EBDD]/10 hover:border-[#C83B22]/60 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#11100E] border border-[#C69A45]/30 flex items-center justify-center mb-5 group-hover:border-[#C83B22] transition-colors">
                    <Icon className="w-6 h-6 text-[#C69A45] group-hover:text-[#C83B22] group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-food text-lg font-normal text-[#F4EBDD] group-hover:text-[#D96A2B] transition-colors mb-2">
                    {feat.title}
                  </h4>
                  <p className="font-sans text-xs text-[#B8B0A5] font-normal leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
