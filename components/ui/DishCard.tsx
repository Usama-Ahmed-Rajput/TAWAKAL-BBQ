'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { DishItem } from '@/data/dishes';
import { Button } from './Button';

interface DishCardProps {
  dish: DishItem;
  onOrder?: (dishName: string) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onOrder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col justify-between bg-[#191919] border border-[#FF6A00]/20 hover:border-[#FF6A00]/70 rounded-none transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_rgba(255,106,0,0.25)] overflow-hidden"
    >
      {/* Top Subtle Flame Border Highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF6A00]/0 to-transparent group-hover:via-[#FF6A00] transition-all duration-500 z-20" />

      <div>
        {/* Dish Image Header Container */}
        <div className="relative h-52 w-full overflow-hidden bg-[#070707] border-b border-[#FF6A00]/20">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95 contrast-105"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-transparent to-black/50 pointer-events-none" />

          {/* Badge & Heat Level Overlaid on Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#070707]/90 backdrop-blur-md border border-[#FF6A00]/40 text-[10px] font-extrabold tracking-widest text-[#FF9D32] uppercase shadow-md">
              <Sparkles className="w-3 h-3 text-[#FF6A00]" />
              {dish.badge || 'Chef Favorite'}
            </span>

            <div className="flex items-center gap-1 bg-[#070707]/90 backdrop-blur-md px-2.5 py-1 border border-white/10 shadow-md">
              <Flame
                className={`w-3.5 h-3.5 ${
                  dish.heatLevel === 'Fire Hot'
                    ? 'text-[#FF6A00] fill-[#FF6A00]'
                    : dish.heatLevel === 'Medium'
                    ? 'text-[#FF9D32] fill-[#FF9D32]/50'
                    : 'text-[#A7A7A7]'
                }`}
              />
              <span className="text-[10px] font-bold tracking-wider text-[#F5F1EA] uppercase">
                {dish.heatLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6">
          {/* Dish Titles */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-serif text-2xl font-bold tracking-wider text-[#F5F1EA] group-hover:text-[#FF9D32] transition-colors leading-tight">
                {dish.name}
              </h3>
              {dish.urduName && (
                <span className="text-sm font-serif text-[#FF6A00]/80 tracking-widest shrink-0">
                  {dish.urduName}
                </span>
              )}
            </div>
            <p className="text-[11px] uppercase tracking-widest text-[#FF6A00] font-semibold mt-1">
              {dish.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#A7A7A7] font-light leading-relaxed group-hover:text-[#F5F1EA]/90 transition-colors">
            {dish.description}
          </p>
        </div>
      </div>

      {/* Footer / Price & Order */}
      <div className="p-6 pt-4 border-t border-[#070707] flex items-center justify-between mt-auto bg-[#141414]">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest text-[#A7A7A7]">
            PRICE
          </span>
          <span className="font-serif text-2xl font-extrabold text-[#F5F1EA] group-hover:text-[#FF9D32] transition-colors">
            {dish.price}
          </span>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => onOrder?.(dish.name)}
          className="text-xs group-hover:bg-[#FF6A00] group-hover:text-[#070707] group-hover:border-[#FF6A00] transition-colors px-5 py-2 font-bold"
        >
          ORDER NOW
        </Button>
      </div>
    </motion.div>
  );
};
