'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ShoppingBag, Utensils, Calendar } from 'lucide-react';
import { Button } from './ui/Button';
import dynamic from 'next/dynamic';

const BBQScene = dynamic(() => import('./3d/BBQScene'), { ssr: false });

interface FinalCTAProps {
  onOrderClick?: () => void;
  onReserveClick?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onOrderClick,
  onReserveClick,
}) => {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-b border-[#191919] overflow-hidden flex items-center justify-center min-h-[500px]">
      {/* Dynamic 3D Ember Layer */}
      <BBQScene emberCount={60} />

      {/* Dramatic Fire Radial Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[#FF6A00]/20 via-[#8F1D12]/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 film-grain pointer-events-none" />

      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 rounded-full bg-[#191919] border border-[#FF6A00]/60 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,106,0,0.4)]"
        >
          <Flame className="w-8 h-8 text-[#FF6A00] animate-pulse" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-widest text-[#F5F1EA] uppercase leading-tight fire-text-glow"
        >
          YOUR TABLE IS WAITING
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 text-xl sm:text-2xl font-serif tracking-[0.25em] text-[#FF9D32] uppercase"
        >
          WHERE FIRE MEETS FLAVOR
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 text-base text-[#A7A7A7] font-light max-w-xl"
        >
          Experience the fire. Taste the difference. Reserve your dining experience or order live charcoal specialties directly to your doorstep.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          <Button
            id="final-order-btn"
            onClick={onOrderClick}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            ORDER NOW
          </Button>

          <Button
            id="final-reserve-btn"
            onClick={onReserveClick}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Calendar className="w-5 h-5 mr-2 text-[#FF6A00]" />
            RESERVE A TABLE
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
