'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Flame } from 'lucide-react';
import { MENU_CATEGORIES as FALLBACK_CATEGORIES, MENU_ITEMS as FALLBACK_ITEMS } from '@/data/menu';
import { SectionHeading } from './ui/SectionHeading';
import { MenuItem } from './ui/MenuItem';

interface MenuProps {
  onOrderDish?: (dishName: string, dishId?: string, price?: number) => void;
}

export const Menu: React.FC<MenuProps> = ({ onOrderDish }) => {
  const [activeCategory, setActiveCategory] = useState<string>('signature-bbq');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<any[]>(FALLBACK_CATEGORIES as any);
  const [menuItems, setMenuItems] = useState<any[]>(FALLBACK_ITEMS);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          const fetchedCats = data.categories.map((c: any) => ({
            id: c.slug,
            label: c.name,
          }));
          setCategories(fetchedCats);

          // Ensure active category matches available categories
          const exists = fetchedCats.some((cat: any) => cat.id === activeCategory);
          if (!exists) {
            const defaultCat = fetchedCats.find((c: any) => c.id === 'signature-bbq')?.id || fetchedCats[0].id;
            setActiveCategory(defaultCat);
          }
        }
        if (data.items && data.items.length > 0) {
          setMenuItems(
            data.items.map((i: any) => ({
              id: i.id,
              name: i.name,
              urduName: i.urduName,
              description: i.description || i.shortDescription,
              price: `Rs. ${i.price}`,
              rawPrice: i.price,
              category: i.category?.slug || 'signature-bbq',
              image: i.image,
              isPopular: i.isPopular,
              isChefSpecial: i.isFeatured,
              tags: i.isFeatured ? ['Best Seller', 'Live Fire'] : ['Fresh Charcoal'],
            }))
          );
        }
      })
      .catch((err) => {
        console.log('Using static menu fallback:', err);
      });
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' ||
      item.category === activeCategory ||
      (typeof item.category === 'object' && item.category?.slug === activeCategory);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="menu"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#11100E] border-b border-[#F4EBDD]/10"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="OUR MENU"
          title="AUTHENTIC FIRE-SEARED SELECTION"
          subtitle="Explore live charcoal delicacies, signature skewers, and fresh oven-baked breads."
        />

        {/* Category Segmented Tabs & Search Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-start gap-4 sm:gap-6 pb-6 border-b border-[#F4EBDD]/10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none shrink-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer rounded-md ${
                    isActive
                      ? 'bg-[#C83B22] text-[#F4EBDD] shadow-[0_4px_15px_rgba(200,59,34,0.35)]'
                      : 'bg-[#1A1815] text-[#B8B0A5] hover:text-[#F4EBDD] hover:bg-[#24211D] border border-[#F4EBDD]/10'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-72 md:ml-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B0A5]" />
            <input
              type="text"
              placeholder="Search dishes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1815] border border-[#F4EBDD]/15 text-xs text-[#F4EBDD] pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#C83B22] placeholder:text-[#B8B0A5]/60 font-sans"
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
                <MenuItem
                  key={item.id}
                  item={item}
                  onOrder={() => onOrderDish && onOrderDish(item.name, item.id, item.rawPrice)}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-[#B8B0A5]">
                <Flame className="w-10 h-10 text-[#C83B22] mx-auto mb-3 opacity-50 animate-pulse" />
                <p className="font-food text-xl text-[#F4EBDD]">No menu items match your query.</p>
                <button
                  onClick={() => {
                    setActiveCategory(categories[0]?.id || 'signature-bbq');
                    setSearchQuery('');
                  }}
                  className="mt-4 font-sans text-xs font-bold text-[#C83B22] uppercase tracking-wider underline cursor-pointer"
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
