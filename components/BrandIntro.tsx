'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, Award } from 'lucide-react';
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
      desc: 'Daily freshly sourced meat marinates 24-hours in stone-ground Pakistani spices.',
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
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#1A1815] border-y border-[#F4EBDD]/10 overflow-hidden"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#C83B22]/10 via-[#D96A2B]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="OUR HERITAGE"
          title="BUILT AROUND FIRE"
          subtitle="Authentic flavor begins with real fire."
        />

        {/* Short Statement in DM Serif Display & Inter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 text-center max-w-3xl mx-auto space-y-4"
        >
          <p className="font-food text-2xl sm:text-3xl text-[#F4EBDD] font-normal leading-snug">
            “TRADITION + FIRE + FLAVOR”
          </p>

          <p className="font-sans text-sm sm:text-base text-[#B8B0A5] font-normal leading-relaxed">
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
                transition={{ duration: 0.6, delay: 0.15 * idx }}
                className="group relative p-8 bg-[#11100E] border border-[#F4EBDD]/10 hover:border-[#C83B22]/60 transition-all duration-300 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:-translate-y-1.5"
              >
                {/* Glow border line on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C83B22]/0 to-transparent group-hover:via-[#C83B22] transition-all duration-500 rounded-t-xl" />

                <div className="w-14 h-14 rounded-lg bg-[#1A1815] border border-[#C69A45]/30 flex items-center justify-center mb-6 group-hover:border-[#C83B22] transition-colors">
                  <Icon className="w-7 h-7 text-[#C69A45] group-hover:text-[#C83B22] group-hover:scale-110 transition-all" />
                </div>

                <h3 className="font-food text-xl font-normal text-[#F4EBDD] mb-3 group-hover:text-[#D96A2B] transition-colors">
                  {item.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#B8B0A5] font-normal leading-relaxed">
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
