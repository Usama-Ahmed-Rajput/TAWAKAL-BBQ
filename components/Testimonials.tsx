'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Flame } from 'lucide-react';
import { TESTIMONIALS } from '@/data/testimonials';
import { SectionHeading } from './ui/SectionHeading';

export const Testimonials: React.FC = () => {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#111111] border-b border-[#191919] overflow-hidden">
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
              className="group relative p-6 bg-[#191919] border border-[#FF6A00]/20 hover:border-[#FF6A00]/70 transition-all duration-300 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div>
                {/* Quote Icon & Rating Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[#FF9D32] fill-[#FF9D32]"
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#FF6A00]/30 group-hover:text-[#FF6A00]/80 transition-colors" />
                </div>

                {/* Quote Text */}
                <p className="text-sm text-[#F5F1EA]/90 font-light italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author & Favorite Dish */}
              <div className="pt-4 border-t border-[#070707] flex flex-col gap-1">
                <span className="font-serif font-bold text-base text-[#F5F1EA] group-hover:text-[#FF9D32] transition-colors">
                  {t.author}
                </span>
                <div className="flex items-center justify-between text-[11px] text-[#A7A7A7]">
                  <span>{t.role}</span>
                  <span className="text-[#FF6A00] font-medium flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {t.favoriteDish}
                  </span>
                </div>
                {t.sourceNotice && (
                  <span className="mt-2 text-[9px] uppercase tracking-widest text-[#A7A7A7]/50 block">
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
