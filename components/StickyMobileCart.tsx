'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export const StickyMobileCart: React.FC = () => {
  const { totalItemsCount, totalPrice, openDrawer } = useCart();

  if (totalItemsCount === 0) return null;

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="bg-[#1A1815]/95 backdrop-blur-md border border-[#C69A45]/40 rounded-2xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C83B22] flex items-center justify-center shadow-md">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bebas text-lg tracking-wider text-[#F4EBDD] leading-none">
              {totalItemsCount} {totalItemsCount === 1 ? 'ITEM' : 'ITEMS'}
            </div>
            <div className="font-sans text-xs text-[#C69A45] font-semibold">
              Rs. {totalPrice.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openDrawer}
            className="px-4 py-2.5 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
          >
            <span>VIEW CART</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
