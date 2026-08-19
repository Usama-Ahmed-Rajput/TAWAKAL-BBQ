'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Plus, Minus, Check } from 'lucide-react';
import { DishItem } from '@/data/dishes';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface DishCardProps {
  dish: DishItem;
  onOrder?: (dishName: string) => void;
  cardHrefOverride?: string;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onOrder, cardHrefOverride }) => {
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Extract price number from string e.g. "Rs. 350" -> 350
  const numericPrice = parseInt(dish.price.replace(/[^0-9]/g, ''), 10) || 350;
  const slug = dish.slug || (dish.id && !dish.id.startsWith('dish-') ? dish.id : dish.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  const qtyInCart = getItemQuantity(slug, 'ITEM');
  const targetHref = cardHrefOverride || `/menu/${slug}`;

  const handleAddToCart = () => {
    addItem({
      id: slug,
      name: dish.name,
      price: numericPrice,
      image: dish.image,
      description: dish.description,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="food-card group relative flex flex-col justify-between"
    >
      {/* Subtle Flame Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/0 to-transparent group-hover:via-[var(--color-primary)] transition-all duration-500 z-20" />

      <div>
        {/* Dish Image Header Container */}
        <Link href={targetHref} className="relative block w-full overflow-hidden bg-[#11100E] border-b border-[var(--color-border)]">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="food-card-image filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-black/40 pointer-events-none" />

          {/* Badge & Heat Level Overlaid on Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="badge border border-[var(--color-gold)]/30 text-[var(--color-gold)] bg-[var(--color-bg)]/90 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[var(--color-gold)] mr-1" />
              {dish.badge || 'CHEF SPECIAL'}
            </span>

            <div className="flex items-center gap-1 bg-[var(--color-bg)]/90 backdrop-blur-md px-2.5 py-1 border border-white/10 rounded-md shadow">
              <Flame
                className={`w-3.5 h-3.5 ${
                  dish.heatLevel === 'Fire Hot'
                    ? 'text-[var(--color-primary)] fill-[var(--color-primary)]'
                    : dish.heatLevel === 'Medium'
                    ? 'text-[var(--color-orange)] fill-[var(--color-orange)]/60'
                    : 'text-[var(--color-text-muted)]'
                }`}
              />
              <span className="font-sans text-[10px] font-bold tracking-wider text-[var(--color-text)] uppercase">
                {dish.heatLevel}
              </span>
            </div>
          </div>
        </Link>

        {/* Content Details */}
        <div className="p-6">
          {/* Dish Titles */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between gap-2">
              <Link href={targetHref}>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[var(--color-text)] group-hover:text-[var(--color-orange)] transition-colors leading-tight">
                  {dish.name}
                </h3>
              </Link>
              {dish.urduName && (
                <span className="font-urdu text-base text-[var(--color-text-secondary)] shrink-0">
                  {dish.urduName}
                </span>
              )}
            </div>
            <p className="font-sans text-[11px] uppercase tracking-wider text-[var(--color-primary)] font-bold mt-1">
              {dish.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] font-normal leading-relaxed group-hover:text-[var(--color-text-secondary)] transition-colors line-clamp-2">
            {dish.description}
          </p>
        </div>
      </div>

      {/* Footer / Price & Add to Cart */}
      <div className="p-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between mt-auto bg-[#1A1714]">
        <div className="flex flex-col">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
            PRICE
          </span>
          <span className="font-sans text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-orange)] transition-colors">
            {dish.price}
          </span>
        </div>

        {qtyInCart > 0 ? (
          <div className="flex items-center border border-[var(--color-gold)]/40 rounded-xl bg-[#11100E] overflow-hidden">
            <button
              onClick={() => updateQuantity(`item-${slug}`, -1)}
              className="p-2 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 font-sans text-xs font-bold text-[#F4EBDD]">
              {qtyInCart}
            </span>
            <button
              onClick={() => updateQuantity(`item-${slug}`, 1)}
              className="p-2 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              isAdded
                ? 'bg-[#4CAF50] text-white'
                : 'bg-[#C83B22] hover:bg-[#D94A2D] text-white'
            }`}
          >
            {isAdded ? (
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
        )}
      </div>
    </motion.div>
  );
};
