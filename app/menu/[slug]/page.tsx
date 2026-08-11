'use client';

import React, { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Flame, Plus, Minus, Check, ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';
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
  isAvailable?: boolean;
  isPopular?: boolean;
  category?: { name: string };
}

const AVAILABLE_ADDONS = [
  { name: 'Extra Cheese Slice', price: 60 },
  { name: 'Extra Mayo Dip', price: 50 },
  { name: 'Extra Mint Raita', price: 50 },
  { name: 'Extra Puri Paratha', price: 60 },
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [isAdded, setIsAdded] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/menu/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data.item);
        } else {
          // Fallback: fetch menu list and find item by slug
          const menuRes = await fetch('/api/menu');
          const menuData = await menuRes.json();
          const found = menuData.items?.find((i: MenuItem) => i.slug === slug);
          if (found) setItem(found);
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const calculateTotalPrice = () => {
    if (!item) return 0;
    const addonsTotal = AVAILABLE_ADDONS.filter((a) => selectedAddons[a.name]).reduce(
      (sum, a) => sum + a.price,
      0
    );
    return (item.price + addonsTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (!item) return;
    const addonsList = AVAILABLE_ADDONS.filter((a) => selectedAddons[a.name]);

    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.shortDescription || item.description,
        addons: addonsList,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      <main className="pt-32 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-sans text-[#9F9589] hover:text-[#C69A45] transition-colors uppercase font-bold tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO MENU</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#9F9589]">
            <Flame className="w-10 h-10 text-[#C83B22] animate-bounce mx-auto mb-3" />
            <p>Loading dish details...</p>
          </div>
        ) : !item ? (
          <div className="py-20 text-center text-[#9F9589] bg-[#1A1815] rounded-2xl border border-[#24201C]">
            <h1 className="font-serif text-2xl text-[#F4EBDD] mb-2">Dish Not Found</h1>
            <p className="text-xs mb-6">We couldn't find the requested menu item.</p>
            <Link
              href="/menu"
              className="inline-flex px-6 py-3 rounded-xl bg-[#C83B22] text-white font-sans text-xs uppercase font-bold tracking-wider"
            >
              BROWSE ALL DISHES
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#1A1815] border border-[#24201C] rounded-3xl p-6 sm:p-10 shadow-2xl">
            {/* Image Section */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#11100E] border border-[#24201C]">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.urduName && (
                <div className="absolute top-4 right-4 bg-[#11100E]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-urdu text-[#C69A45]">
                  {item.urduName}
                </div>
              )}
              {item.isPopular && (
                <div className="absolute top-4 left-4 bg-[#C83B22] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-lg">
                  MUST TRY
                </div>
              )}
            </div>

            {/* Content & Ordering Section */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                {item.category && (
                  <span className="font-bebas text-lg text-[#C69A45] tracking-widest block uppercase">
                    {item.category.name}
                  </span>
                )}
                <h1 className="font-bebas text-4xl sm:text-5xl tracking-wider text-[#F4EBDD] mt-1">
                  {item.name}
                </h1>
                <p className="font-sans text-sm text-[#9F9589] mt-3 leading-relaxed">
                  {item.description || item.shortDescription}
                </p>

                <div className="mt-6 flex items-baseline gap-3 border-y border-[#24201C] py-4">
                  <span className="font-bebas text-4xl text-[#C69A45]">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  <span className="font-sans text-xs text-[#9F9589]">Per Portion</span>
                </div>

                {/* Add-ons Selector */}
                <div className="mt-6 space-y-3">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#C69A45] block">
                    CUSTOMIZE / EXTRAS & ADD-ONS:
                  </span>
                  <div className="space-y-2">
                    {AVAILABLE_ADDONS.map((addon) => {
                      const isChecked = !!selectedAddons[addon.name];
                      return (
                        <label
                          key={addon.name}
                          onClick={() => toggleAddon(addon.name)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#C69A45]/15 border-[#C69A45] text-[#F4EBDD]'
                              : 'bg-[#11100E] border-[#24201C] text-[#9F9589] hover:border-[#9F9589]'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-sans">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="rounded border-[#24201C] text-[#C69A45] focus:ring-0"
                            />
                            <span>{addon.name}</span>
                          </div>
                          <span className="font-bebas text-base text-[#C69A45]">
                            + Rs. {addon.price}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart Controls */}
              <div className="space-y-4 pt-4 border-t border-[#24201C]">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-[#9F9589] uppercase">Quantity:</span>
                  <div className="flex items-center border border-[#24201C] rounded-xl bg-[#11100E] overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-3 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bebas text-xl font-bold text-[#F4EBDD]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-3 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-sans text-[#9F9589]">
                  <span>Total Amount:</span>
                  <span className="font-bebas text-3xl text-[#C69A45]">
                    Rs. {calculateTotalPrice().toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-sans text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 ${
                    isAdded
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-[#C83B22] hover:bg-[#D94A2D] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>ADDED TO CART</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>ADD TO CART — RS. {calculateTotalPrice().toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
