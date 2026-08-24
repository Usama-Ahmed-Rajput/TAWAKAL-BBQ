'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Search, Flame, Plus, Minus, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  urduName?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  image: string;
  categoryId: string;
  isFeatured?: boolean;
  isPopular?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export function PublicMenuClient() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const { addItem, getItemQuantity, updateQuantity } = useCart();

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.categories && data.items) {
          setCategories(data.categories);
          setItems(data.items);
        }
      } catch (err) {
        console.error('Failed to load menu', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.shortDescription || item.description,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const filteredItems = items.filter((item: any) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      item.categoryId === activeCategory ||
      (item.category && item.category.id === activeCategory) ||
      (item.category && item.category.slug === activeCategory);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-[#11100E] to-[#1A1815] border-b border-[#24201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C83B22]/10 border border-[#C83B22]/30 text-[#C83B22] font-sans text-xs uppercase font-bold tracking-widest mb-4">
            <Flame className="w-4 h-4" />
            Live Charcoal Grilled Menu
          </div>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-widest text-[#F4EBDD] uppercase leading-none">
            TAWAKAL <span className="text-[#C69A45]">DIGITAL MENU</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#9F9589] max-w-2xl mx-auto mt-3 font-normal">
            Authentic Pakistani BBQ, yummi juicy crispy rolls, fast food delights & fresh extra side orders cooked to perfection.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food by name, boti, tikka, burger..."
              className="w-full bg-[#11100E] border border-[#C69A45]/30 rounded-xl px-4 py-3.5 pl-11 text-sm text-[#F4EBDD] placeholder-[#9F9589] focus:outline-none focus:border-[#C69A45] transition-colors"
            />
            <Search className="w-5 h-5 text-[#C69A45] absolute left-3.5 top-4" />
          </div>
        </div>
      </section>

      {/* Category Tabs & Menu Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Horizontal Scrolling Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-[#24201C] mb-10">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-5 py-2.5 rounded-xl font-bebas text-lg tracking-wider transition-all whitespace-nowrap ${
              activeCategory === 'ALL'
                ? 'bg-[#C83B22] text-white shadow-lg'
                : 'bg-[#1A1815] text-[#9F9589] hover:text-[#F4EBDD] hover:bg-[#24201C]'
            }`}
          >
            ALL DISHES
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-bebas text-lg tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#C83B22] text-white shadow-lg'
                  : 'bg-[#1A1815] text-[#9F9589] hover:text-[#F4EBDD] hover:bg-[#24201C]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center text-[#9F9589] font-sans">
            <Flame className="w-10 h-10 text-[#C83B22] animate-bounce mx-auto mb-3" />
            <p>Loading authentic Tawakal menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-[#9F9589] font-sans bg-[#1A1815] rounded-2xl border border-[#24201C] p-10 max-w-lg mx-auto">
            <p className="font-serif text-2xl text-[#F4EBDD] mb-2">No dishes found</p>
            <p className="text-xs mb-4">No menu items matching "{searchQuery}".</p>
            <div className="text-xs text-[#C69A45] space-y-1">
              <span className="block font-bold">Suggestions:</span>
              <button onClick={() => setSearchQuery('bbq')} className="underline mr-3 hover:text-white">Try BBQ</button>
              <button onClick={() => setSearchQuery('roll')} className="underline mr-3 hover:text-white">Try Rolls</button>
              <button onClick={() => setSearchQuery('burger')} className="underline hover:text-white">Try Burgers</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isAdded = addedIds[item.id];
              const qtyInCart = getItemQuantity(item.id, 'ITEM');

              return (
                <div
                  key={item.id}
                  className="bg-[#1A1815] border border-[#24201C] hover:border-[#C69A45]/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <Link href={`/menu/${item.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#11100E]">
                      <Image
                        src={item.image}
                        alt={`${item.name} - Tawakal Bar B.Q Karachi`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={500}
                        height={300}
                        onError={(e) => { (e.target as any).src = '/placeholder.png'; }}
                      />
                      {item.urduName && (
                        <div className="absolute top-3 right-3 bg-[#11100E]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-urdu text-[#C69A45]">
                          {item.urduName}
                        </div>
                      )}
                      {item.isPopular && (
                        <div className="absolute top-3 left-3 bg-[#C83B22] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-md">
                          POPULAR
                        </div>
                      )}
                    </Link>

                    <div className="p-5">
                      <Link href={`/menu/${item.slug}`}>
                        <h3 className="font-sans font-bold text-lg text-[#F4EBDD] group-hover:text-[#C69A45] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      {item.description && (
                        <p className="font-sans text-xs text-[#9F9589] mt-1.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-[#24201C]/50 mt-2 pt-4">
                    <div>
                      <span className="font-sans text-[10px] text-[#9F9589] block uppercase">Price</span>
                      <span className="font-bebas text-2xl text-[#C69A45] leading-none">
                        Rs. {item.price.toLocaleString()}
                      </span>
                    </div>

                    {qtyInCart > 0 ? (
                      <div className="flex items-center border border-[#C69A45]/40 rounded-xl bg-[#11100E] overflow-hidden">
                        <button
                          onClick={() => updateQuantity(`item-${item.id}`, -1)}
                          className="p-2 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-sans text-xs font-bold text-[#F4EBDD]">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => updateQuantity(`item-${item.id}`, 1)}
                          className="p-2 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`px-4 py-2.5 rounded-xl font-sans text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                          isAdded
                            ? 'bg-[#4CAF50] text-white'
                            : 'bg-[#C83B22] hover:bg-[#D94A2D] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>ADDED</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>ADD TO CART</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
