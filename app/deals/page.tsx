'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Flame, ShieldCheck, Plus, Minus, Check, AlertCircle } from 'lucide-react';

interface Deal {
  id: string;
  dealNumber?: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  itemsSummary?: string;
  originalPrice: number;
  dealPrice: number;
  image: string;
  verificationRequired?: boolean;
}

export default function PublicDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedDealIds, setAddedDealIds] = useState<Record<string, boolean>>({});
  const { addDeal, getItemQuantity, updateQuantity } = useCart();

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();
        if (data.deals) {
          setDeals(data.deals);
        }
      } catch (e) {
        console.error('Failed to load deals', e);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  const handleAddDeal = (deal: Deal) => {
    if (deal.verificationRequired) return;
    addDeal({
      id: deal.id,
      dealNumber: deal.dealNumber,
      title: deal.title,
      price: deal.dealPrice,
      image: deal.image,
      itemsSummary: deal.itemsSummary || deal.shortDescription,
    });

    setAddedDealIds((prev) => ({ ...prev, [deal.id]: true }));
    setTimeout(() => {
      setAddedDealIds((prev) => ({ ...prev, [deal.id]: false }));
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-[#11100E] via-[#1A1815] to-[#070707] border-b border-[#24201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C69A45]/10 border border-[#C69A45]/30 text-[#C69A45] font-sans text-xs uppercase font-bold tracking-widest mb-4">
            <Flame className="w-4 h-4 text-[#C83B22]" />
            Exclusive Tawakal Combos
          </div>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-widest text-[#F4EBDD] uppercase leading-none">
            PREMIUM <span className="text-[#C69A45]">DEALS & COMBOS</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#9F9589] max-w-2xl mx-auto mt-3">
            Handcrafted BBQ & fast food combinations. 1 Compulsory Raita included with every single deal.
          </p>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="py-20 text-center text-[#9F9589]">
            <Flame className="w-10 h-10 text-[#C83B22] animate-bounce mx-auto mb-3" />
            <p>Loading authoritative deals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => {
              const isAdded = addedDealIds[deal.id];
              const qtyInCart = getItemQuantity(deal.id, 'DEAL');

              return (
                <div
                  key={deal.id}
                  className="bg-[#1A1815] border border-[#C69A45]/30 hover:border-[#C69A45] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative"
                >
                  {/* Deal Header Banner */}
                  <div>
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#11100E]">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1815] via-transparent to-transparent" />
                      
                      {deal.dealNumber && (
                        <div className="absolute top-3 left-3 bg-[#C69A45] text-[#11100E] font-bebas text-lg tracking-widest px-3 py-0.5 rounded-lg shadow-md font-bold">
                          {deal.dealNumber}
                        </div>
                      )}

                      {deal.verificationRequired && (
                        <div className="absolute top-3 right-3 bg-[#C83B22] text-white font-sans text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                          <AlertCircle className="w-3 h-3" />
                          <span>PRICE VERIFICATION REQUIRED</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-sans font-bold text-xl text-[#F4EBDD] group-hover:text-[#C69A45] transition-colors">
                          {deal.title}
                        </h3>
                      </div>

                      {/* Included Items List */}
                      <div className="mt-4 p-3.5 rounded-xl bg-[#11100E] border border-[#24201C]">
                        <span className="font-sans text-[10px] uppercase tracking-wider text-[#C69A45] font-bold block mb-1.5">
                          INCLUDED IN THIS DEAL:
                        </span>
                        <p className="font-sans text-xs text-[#F4EBDD] leading-relaxed">
                          {deal.itemsSummary || deal.description}
                        </p>
                      </div>

                      {/* Compulsory Raita Notice */}
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#C69A45] bg-[#C69A45]/10 px-3 py-1.5 rounded-lg border border-[#C69A45]/20">
                        <ShieldCheck className="w-4 h-4 text-[#C69A45] shrink-0" />
                        <span className="font-medium">1 Raita is compulsory with every deal</span>
                      </div>
                    </div>
                  </div>

                  {/* Deal Footer & Action */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-[#24201C] mt-2 pt-4">
                    <div>
                      <span className="font-sans text-[10px] text-[#9F9589] block uppercase">Deal Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bebas text-3xl text-[#C69A45] leading-none">
                          Rs. {deal.dealPrice.toLocaleString()}
                        </span>
                        {deal.originalPrice > deal.dealPrice && (
                          <span className="font-sans text-xs text-[#9F9589] line-through">
                            Rs. {deal.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {deal.verificationRequired ? (
                      <button
                        disabled
                        className="px-4 py-2.5 rounded-xl bg-[#24201C] text-[#9F9589] font-sans text-xs uppercase font-bold tracking-wider cursor-not-allowed border border-[#24201C]"
                      >
                        UNAVAILABLE
                      </button>
                    ) : qtyInCart > 0 ? (
                      <div className="flex items-center border border-[#C69A45]/40 rounded-xl bg-[#11100E] overflow-hidden">
                        <button
                          onClick={() => updateQuantity(`deal-${deal.id}`, -1)}
                          className="p-2 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-sans text-xs font-bold text-[#F4EBDD]">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => updateQuantity(`deal-${deal.id}`, 1)}
                          className="p-2 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddDeal(deal)}
                        className={`px-5 py-2.5 rounded-xl font-sans text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer ${
                          isAdded
                            ? 'bg-[#4CAF50] text-white'
                            : 'bg-[#C83B22] hover:bg-[#D94A2D] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>DEAL ADDED</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>ADD DEAL TO CART</span>
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
