'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`flex flex-col ${
        isCenter ? 'items-center text-center' : 'items-start text-left'
      } ${className}`}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 bg-[#191919] border border-[#FF6A00]/30 text-[#FF9D32] text-xs font-semibold uppercase tracking-[0.25em]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
          {eyebrow}
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-[#F5F1EA] uppercase leading-tight"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-[#A7A7A7] max-w-2xl font-light leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`h-0.5 w-24 mt-6 bg-gradient-to-r ${
          isCenter
            ? 'from-transparent via-[#FF6A00] to-transparent origin-center'
            : 'from-[#FF6A00] via-[#FF9D32] to-transparent origin-left'
        }`}
      />
    </div>
  );
};
