'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Plus, Check } from 'lucide-react';
import { MenuItemType } from '@/data/menu';
import { useCart } from '@/context/CartContext';

interface MenuItemProps {
  item: MenuItemType;
  onOrder?: (itemName: string) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const numericPrice = typeof item.rawPrice === 'number'
      ? item.rawPrice
      : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 350;

    addItem({
      id: String(item.id),
      name: item.name,
      price: numericPrice,
      image: item.image,
      description: item.description,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="food-card group relative flex flex-col justify-between"
    >
      <div>
        {/* Dish Image Header */}
        <div className="relative w-full overflow-hidden bg-[#11100E] border-b border-[var(--color-border)]">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="food-card-image filter brightness-95 contrast-105"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-black/40 pointer-events-none" />

          {/* Badges Overlaid on Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <div className="flex flex-wrap items-center gap-1.5">
              {item.isPopular && (
                <span className="badge bg-[var(--color-primary)] text-[var(--color-white)]">
                  POPULAR
                </span>
              )}
              {item.isChefSpecial && (
                <span className="badge border border-[var(--color-gold)]/60 text-[var(--color-gold)] bg-[var(--color-bg)]/90 backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-[var(--color-gold)] mr-1" />
                  CHEF SPECIAL
                </span>
              )}
            </div>

            {/* Spicy Level Indicator */}
            {item.spicyLevel && (
              <div className="px-2 py-1 bg-[var(--color-bg)]/85 backdrop-blur-md border border-white/10 rounded-md flex items-center gap-0.5 shadow">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < item.spicyLevel!
                        ? 'text-[var(--color-orange)] fill-[var(--color-orange)]'
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
            <h4 className="font-serif text-2xl font-normal text-[var(--color-text)] group-hover:text-[var(--color-orange)] transition-colors leading-tight">
              {item.name}
            </h4>
            {item.urduName && (
              <span className="font-urdu text-base text-[var(--color-text-secondary)] shrink-0 pt-0.5">
                {item.urduName}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] font-normal leading-relaxed mb-4 line-clamp-2">
            {item.description}
          </p>

          {/* Item Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="p-5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between mt-auto bg-[#1A1714]">
        <span className="font-sans text-xl sm:text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-orange)] transition-colors">
          {item.price}
        </span>
        <button
          onClick={handleAddToCart}
          className={`px-4 py-2 rounded-xl font-sans text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
            added
              ? 'bg-[#4CAF50] text-white'
              : 'bg-[#C83B22] hover:bg-[#D94A2D] text-white'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>ADDED</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>ADD TO CART</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
