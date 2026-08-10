'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';

export const BrandIntro: React.FC = () => {
  const highlights = [
    {
      icon: Flame,
      title: '100% Real Wood Charcoal',
      desc: 'No artificial gas or electric grates. Raw heat scorching natural wood coals.',
    },
    {
      icon: ShieldCheck,
      title: 'Hand-Selected Cuts',
      desc: 'Daily freshly sourced meat marinates 24-hours in stone-ground Punjabi spices.',
    },
    {
      icon: Award,
      title: 'Heritage Master Recipes',
      desc: 'Secret marinade formulas passed down through master Ustad cooks.',
    },
  ];

  return (
    <section
      id="about"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#111111] border-y border-[#191919] overflow-hidden"
    >
      {/* Background Subtle Ember Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#FF6A00]/10 via-[#8F1D12]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="OUR HERITAGE"
          title="BUILT AROUND FIRE"
          subtitle="Authentic flavor begins with real fire."
        />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-center max-w-3xl mx-auto text-base sm:text-lg text-[#F5F1EA]/80 font-light leading-relaxed tracking-wide"
        >
          <p>
            Tawakal BBQ brings authentic fire-grilled flavors into a modern dining experience, prepared with carefully selected ingredients, rich marinades and the unmistakable character of live fire.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.2 * idx }}
                className="group relative p-8 bg-[#191919] border border-[#FF6A00]/15 hover:border-[#FF6A00]/60 transition-all duration-500 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-2"
              >
                {/* Glow border line on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF6A00]/0 to-transparent group-hover:via-[#FF6A00] transition-all duration-500" />

                <div className="w-14 h-14 rounded-none bg-[#070707] border border-[#FF6A00]/30 flex items-center justify-center mb-6 group-hover:border-[#FF6A00] transition-colors">
                  <Icon className="w-7 h-7 text-[#FF6A00] group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="font-serif text-xl font-bold tracking-wider text-[#F5F1EA] mb-3 group-hover:text-[#FF9D32] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#A7A7A7] font-light leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
