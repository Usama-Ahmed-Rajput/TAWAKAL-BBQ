'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Flame, Filter } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS, MenuItemType } from '@/data/menu';
import { SectionHeading } from './ui/SectionHeading';
import { MenuItem } from './ui/MenuItem';

interface MenuProps {
  onOrderDish?: (dishName: string) => void;
}

export const Menu: React.FC<MenuProps> = ({ onOrderDish }) => {
  const [activeCategory, setActiveCategory] = useState<string>('bbq');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="menu"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#111111] border-b border-[#191919]"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="TASTE THE SELECTION"
          title="OUR INTERACTIVE MENU"
          subtitle="Explore live charcoal delicacies, signature skewers, and fresh oven-baked breads."
        />

        {/* Category Segmented Tabs & Search Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#191919]">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 font-serif text-xs font-bold tracking-widest uppercase transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#FF6A00] text-[#070707] shadow-[0_0_15px_rgba(255,106,0,0.4)]'
                      : 'bg-[#191919] text-[#A7A7A7] hover:text-[#F5F1EA] hover:bg-[#252525] border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
            <input
              type="text"
              placeholder="Search dishes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070707] border border-[#FF6A00]/30 text-xs text-[#F5F1EA] pl-10 pr-4 py-2.5 rounded-none focus:outline-none focus:border-[#FF6A00] placeholder:text-[#A7A7A7]/60"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} onOrder={onOrderDish} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-[#A7A7A7]">
                <Flame className="w-10 h-10 text-[#FF6A00] mx-auto mb-3 opacity-40 animate-pulse" />
                <p className="text-lg font-serif">No menu items match your query.</p>
                <button
                  onClick={() => {
                    setActiveCategory('bbq');
                    setSearchQuery('');
                  }}
                  className="mt-4 text-xs font-semibold text-[#FF6A00] uppercase tracking-wider underline cursor-pointer"
                >
                  Reset Menu Filter
                </button>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
