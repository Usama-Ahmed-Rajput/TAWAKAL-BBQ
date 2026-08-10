'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { MenuItemType } from '@/data/menu';
import { Button } from './Button';

interface MenuItemProps {
  item: MenuItemType;
  onOrder?: (itemName: string) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, onOrder }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-[#191919] border border-[#FF6A00]/20 hover:border-[#FF6A00]/70 rounded-none overflow-hidden transition-all duration-500 flex flex-col justify-between shadow-[0_15px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(255,106,0,0.25)]"
    >
      <div>
        {/* Dish Image Header */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#070707] border-b border-[#FF6A00]/20">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95 contrast-105"
          />

          {/* Dark Overlay Gradient for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-transparent to-black/40 pointer-events-none" />

          {/* Top Badges Overlaid on Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <div className="flex flex-wrap items-center gap-1.5">
              {item.isPopular && (
                <span className="px-2.5 py-1 bg-[#FF6A00] text-[#070707] text-[10px] font-extrabold tracking-widest uppercase shadow-md">
                  POPULAR
                </span>
              )}
              {item.isChefSpecial && (
                <span className="px-2.5 py-1 bg-[#070707]/90 backdrop-blur-md border border-[#FF9D32]/60 text-[#FF9D32] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#FF6A00]" />
                  CHEF SPECIAL
                </span>
              )}
            </div>

            {/* Spicy Level Indicator */}
            {item.spicyLevel && (
              <div className="px-2 py-1 bg-[#070707]/80 backdrop-blur-md border border-white/10 flex items-center gap-0.5 shadow-md">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < item.spicyLevel!
                        ? 'text-[#FF6A00] fill-[#FF6A00]'
                        : 'text-[#333333] fill-transparent'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Content Details */}
        <div className="p-5">
          {/* Name & Urdu Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-serif text-xl font-bold tracking-wider text-[#F5F1EA] group-hover:text-[#FF9D32] transition-colors leading-tight">
              {item.name}
            </h4>
            {item.urduName && (
              <span className="text-xs font-serif text-[#FF6A00]/80 shrink-0 font-medium pt-0.5">
                {item.urduName}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#A7A7A7] font-light leading-relaxed mb-4 line-clamp-2">
            {item.description}
          </p>

          {/* Item Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#070707] border border-white/10 text-[#A7A7A7]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="p-5 pt-3 border-t border-[#070707] flex items-center justify-between mt-auto bg-[#141414]">
        <span className="font-serif text-2xl font-extrabold text-[#F5F1EA] group-hover:text-[#FF9D32] transition-colors">
          {item.price}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOrder?.(item.name)}
          className="text-xs py-1.5 px-4 group-hover:bg-[#FF6A00] group-hover:text-black group-hover:border-[#FF6A00]"
        >
          ORDER NOW
        </Button>
      </div>
    </motion.div>
  );
};
