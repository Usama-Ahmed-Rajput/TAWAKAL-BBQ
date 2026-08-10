'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Flame } from 'lucide-react';
import { TESTIMONIALS } from '@/data/testimonials';
import { SectionHeading } from './ui/SectionHeading';

export const Testimonials: React.FC = () => {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#11100E] border-b border-[#F4EBDD]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="GUEST EXPERIENCES"
          title="WHAT OUR GUESTS SAY"
          subtitle="Real impressions from meat lovers and grill enthusiasts."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * idx }}
              className="group relative p-6 bg-[#1A1815] border border-[#F4EBDD]/10 hover:border-[#C83B22]/60 transition-all duration-300 rounded-xl flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[#C69A45] fill-[#C69A45]"
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#C83B22]/30 group-hover:text-[#C83B22]/80 transition-colors" />
                </div>

                {/* Quote Text */}
                <p className="font-sans text-xs sm:text-sm text-[#F4EBDD]/90 font-normal leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author & Favorite Dish */}
              <div className="pt-4 border-t border-[#11100E] flex flex-col gap-1">
                <span className="font-sans font-semibold text-base text-[#F4EBDD] group-hover:text-[#D96A2B] transition-colors">
                  {t.author}
                </span>
                <div className="flex items-center justify-between font-sans text-[11px] text-[#B8B0A5]">
                  <span>{t.role}</span>
                  <span className="text-[#C83B22] font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#C83B22]" />
                    {t.favoriteDish}
                  </span>
                </div>
                {t.sourceNotice && (
                  <span className="mt-2 font-sans text-[9px] uppercase tracking-widest text-[#B8B0A5]/50 block">
                    • {t.sourceNotice}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
