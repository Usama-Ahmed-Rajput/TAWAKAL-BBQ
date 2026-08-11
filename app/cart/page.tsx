'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingBag, Plus, Minus, Trash2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function PublicCartPage() {
  const {
    cart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItemsCount,
    subtotal,
    deliveryFee,
    totalPrice,
  } = useCart();

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-[#24201C] pb-6 mb-8">
          <div>
            <h1 className="font-bebas text-4xl sm:text-6xl tracking-widest text-[#F4EBDD] uppercase leading-none">
              YOUR SHOPPING <span className="text-[#C69A45]">CART</span>
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#9F9589] mt-1">
              Review your Tawakal Bar B.Q items & deals before proceeding to checkout.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-[#9F9589] hover:text-[#C83B22] transition-colors flex items-center gap-1 font-sans"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center text-[#9F9589] bg-[#1A1815] border border-[#24201C] rounded-2xl max-w-2xl mx-auto">
            <ShoppingBag className="w-16 h-16 text-[#24201C] mx-auto mb-4 stroke-1" />
            <h2 className="font-serif text-2xl text-[#F4EBDD] mb-2">Your cart is empty</h2>
            <p className="font-sans text-xs text-[#9F9589] max-w-md mx-auto mb-6">
              You haven't added any items to your order yet. Browse our signature BBQ, deals and rolls.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C83B22] text-white font-sans text-xs uppercase font-bold tracking-wider hover:bg-[#D94A2D] transition-colors shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BROWSE OUR MENU</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Table / Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#1A1815] border border-[#24201C] hover:border-[#C69A45]/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover border border-[#24201C] shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-sans font-bold text-base text-[#F4EBDD]">
                        {item.name}
                      </h3>
                      {item.itemsSummary && (
                        <p className="font-sans text-xs text-[#9F9589] mt-0.5 max-w-md">
                          {item.itemsSummary}
                        </p>
                      )}
                      {item.includesCompulsoryRaita && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-[#C69A45] font-medium bg-[#C69A45]/10 px-2.5 py-0.5 rounded border border-[#C69A45]/20">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C69A45]" />
                          <span>1 Compulsory Raita Included</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#24201C]">
                    <div className="flex items-center border border-[#24201C] rounded-xl bg-[#11100E] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 text-sm font-bold text-[#F4EBDD]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 text-[#9F9589] hover:text-white hover:bg-[#24201C] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-sans text-[10px] text-[#9F9589] block uppercase">Subtotal</span>
                      <span className="font-bebas text-2xl text-[#C69A45]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[#9F9589] hover:text-[#C83B22] transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 text-xs font-sans text-[#C69A45] hover:underline uppercase font-bold tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>CONTINUE SHOPPING</span>
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl bg-[#1A1815] border border-[#C69A45]/30 space-y-5 sticky top-28 shadow-2xl">
                <h3 className="font-bebas text-2xl tracking-widest text-[#F4EBDD] border-b border-[#24201C] pb-3">
                  ORDER SUMMARY
                </h3>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-[#9F9589]">
                    <span>Items Count</span>
                    <span className="text-[#F4EBDD] font-medium">{totalItemsCount} items</span>
                  </div>
                  <div className="flex justify-between text-[#9F9589]">
                    <span>Items Subtotal</span>
                    <span className="text-[#F4EBDD] font-medium">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#9F9589]">
                    <span>Delivery Fee</span>
                    <span className="text-[#F4EBDD] font-medium">Rs. {deliveryFee.toLocaleString()}</span>
                  </div>

                  <div className="pt-3 border-t border-[#24201C] flex justify-between items-baseline">
                    <span className="font-bold text-sm text-[#F4EBDD]">TOTAL AMOUNT</span>
                    <span className="font-bebas text-3xl text-[#C69A45]">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[11px] text-[#9F9589] text-center">
                  Cash on Delivery & Pickup supported. Pre-formatted WhatsApp order status generated upon submission.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
