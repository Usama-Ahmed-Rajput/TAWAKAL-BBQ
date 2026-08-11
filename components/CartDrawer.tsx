'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    totalItemsCount,
    subtotal,
    deliveryFee,
    totalPrice,
  } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          />

          {/* Right Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#11100E] border-l border-[#C69A45]/30 shadow-2xl flex flex-col justify-between text-[#F4EBDD]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#24201C] flex items-center justify-between bg-[#1A1815]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C83B22]/20 border border-[#C83B22]/40 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#C83B22]" />
                </div>
                <div>
                  <h2 className="font-bebas text-2xl tracking-widest text-[#F4EBDD] leading-none">
                    YOUR ORDER <span className="text-[#C69A45]">({totalItemsCount})</span>
                  </h2>
                  <p className="font-sans text-[11px] text-[#9F9589] tracking-wider uppercase">
                    Tawakal Bar B.Q & Restaurant
                  </p>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="p-2 rounded-full text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#9F9589] py-12">
                  <ShoppingBag className="w-16 h-16 text-[#24201C] mb-4 stroke-1" />
                  <p className="font-serif text-xl text-[#F4EBDD] mb-1">Your cart is empty</p>
                  <p className="text-xs max-w-xs mb-6">
                    Add succulent charcoal grilled tikkas, seekh kababs or premium deals to start ordering.
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="px-6 py-2.5 rounded-lg bg-[#C83B22] text-white font-sans text-xs tracking-wider uppercase font-bold hover:bg-[#D94A2D] transition-colors shadow-lg"
                  >
                    EXPLORE MENU
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#1A1815] border border-[#24201C] hover:border-[#C69A45]/30 transition-all flex gap-3 group"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-[#24201C]"
                      />
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-sans font-semibold text-sm text-[#F4EBDD] group-hover:text-[#C69A45] transition-colors">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#9F9589] hover:text-[#C83B22] transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.itemsSummary && (
                          <p className="text-[11px] text-[#9F9589] line-clamp-2 mt-0.5">
                            {item.itemsSummary}
                          </p>
                        )}

                        {item.includesCompulsoryRaita && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#C69A45] font-medium bg-[#C69A45]/10 px-2 py-0.5 rounded border border-[#C69A45]/20 w-fit">
                            <ShieldCheck className="w-3 h-3 text-[#C69A45]" />
                            <span>1 Compulsory Raita Included</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#24201C]/60">
                        <span className="font-sans text-xs text-[#9F9589]">
                          Rs. {item.price.toLocaleString()} × {item.quantity}
                        </span>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-[#24201C] rounded-lg bg-[#11100E] overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-2 py-1 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-[#F4EBDD]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-2 py-1 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-bebas text-base text-[#C69A45]">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Actions */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#24201C] bg-[#1A1815] space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#9F9589]">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#9F9589]">
                    <span>Estimated Delivery Fee</span>
                    <span>Rs. {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#F4EBDD] pt-2 border-t border-[#24201C]">
                    <span>Total Amount</span>
                    <span className="text-[#C69A45] font-bebas text-2xl">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="py-3 px-4 rounded-xl border border-[#24201C] text-center font-sans text-xs uppercase font-bold tracking-wider text-[#F4EBDD] hover:bg-[#24201C] transition-colors flex items-center justify-center gap-1"
                  >
                    VIEW CART
                  </Link>

                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="py-3 px-4 rounded-xl bg-[#C83B22] text-center font-sans text-xs uppercase font-bold tracking-wider text-white hover:bg-[#D94A2D] transition-all shadow-lg flex items-center justify-center gap-1.5 group"
                  >
                    CHECKOUT
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
