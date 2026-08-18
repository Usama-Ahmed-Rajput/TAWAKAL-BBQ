'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Truck, Store, ArrowRight, ShieldCheck, MapPin, Tag } from 'lucide-react';
import { launchCustomerWhatsApp } from '@/lib/whatsapp-link';

interface Branch {
  id: string;
  slug: string;
  name: string;
  address: string;
  locationReference?: string;
  phone: string;
  openingHours: string;
}

interface DeliveryArea {
  id: string;
  name: string;
  deliveryFee: number;
  minOrder: number;
  estimatedTime: string;
}

export default function PublicCheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  
  const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [selectedSector, setSelectedSector] = useState('Sector A');
  const [houseFlatNo, setHouseFlatNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Load active branches
  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch('/api/branches');
        const data = await res.json();
        if (data.branches && data.branches.length > 0) {
          setBranches(data.branches);
          setSelectedBranchId(data.branches[0].id);
        }
      } catch (err) {
        console.error('Failed to load branches', err);
      }
    }
    loadBranches();
  }, []);

  // 2. Load delivery areas whenever selectedBranchId changes
  useEffect(() => {
    async function loadAreas() {
      if (!selectedBranchId) return;
      try {
        const res = await fetch(`/api/delivery-areas?branchId=${selectedBranchId}`);
        const data = await res.json();
        if (data.areas) {
          setDeliveryAreas(data.areas);
          if (data.areas.length > 0) {
            setSelectedAreaId(data.areas[0].id);
          } else {
            setSelectedAreaId('');
          }
        }
      } catch (err) {
        console.error('Failed to load delivery areas', err);
      }
    }
    loadAreas();
  }, [selectedBranchId]);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);
  const currentArea = deliveryAreas.find((a) => a.id === selectedAreaId);
  const currentDeliveryFee = orderType === 'DELIVERY' ? (currentArea ? currentArea.deliveryFee : 150) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + currentDeliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    if (couponCode.toUpperCase() === 'TAWAKAL10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setCouponMessage(`✓ 10% Discount Applied (- Rs. ${disc})`);
    } else {
      setCouponMessage('❌ Invalid or expired coupon code');
      setDiscountAmount(0);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && !navigator.onLine) {
      setError('You are currently offline. Please reconnect to the internet to place your order.');
      return;
    }

    if (!customerName || !customerPhone) {
      setError('Please fill in your name and phone number.');
      return;
    }

    let fullAddress = `Self Pickup at ${selectedBranch?.name || 'Tawakal Restaurant'}`;
    if (orderType === 'DELIVERY') {
      const areaName = currentArea ? currentArea.name.replace(/\s*\([^)]*\)/g, '').trim() : 'Akhtar Colony';
      const sectorVal = selectedSector || 'Sector A';

      const addressParts = [
        `Area: ${areaName}`,
        `Sector: ${sectorVal}`,
        houseFlatNo ? `House/Flat: ${houseFlatNo}` : '',
        landmark ? `Landmark: ${landmark}` : '',
        streetAddress ? `Street: ${streetAddress}` : '',
        'City: Karachi',
        'Country: Pakistan',
      ].filter(Boolean);

      fullAddress = addressParts.join(' | ');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: selectedBranchId,
          customerName,
          customerPhone,
          whatsapp: whatsapp || customerPhone,
          orderType,
          deliveryAddress: fullAddress,
          deliveryArea: currentArea ? currentArea.name.replace(/\s*\([^)]*\)/g, '').trim() : 'Akhtar Colony',
          sector: selectedSector || 'Sector A',
          houseFlatNo: houseFlatNo || '',
          landmark: landmark || '',
          streetAddress: streetAddress || '',
          deliveryNotes,
          items: cart,
          couponCode: discountAmount > 0 ? couponCode : undefined,
          discountAmount,
          deliveryFee: currentDeliveryFee,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ? `${data.error || 'Failed to place order'}: ${data.details}` : (data.error || 'Failed to place order.'));
      }

      const orderPayload = data.order
        ? {
            ...data.order,
            area: currentArea ? currentArea.name.replace(/\s*\([^)]*\)/g, '').trim() : 'Akhtar Colony',
            sector: selectedSector || 'Sector A',
            houseFlatNo: houseFlatNo || undefined,
            landmark: landmark || undefined,
          }
        : {
            orderNumber: data.orderNumber,
            customerName,
            customerPhone,
            orderType,
            deliveryAddress: fullAddress,
            area: currentArea ? currentArea.name.replace(/\s*\([^)]*\)/g, '').trim() : 'Akhtar Colony',
            sector: selectedSector || 'Sector A',
            houseFlatNo: houseFlatNo || undefined,
            landmark: landmark || undefined,
            subtotal,
            deliveryFee: currentDeliveryFee,
            totalAmount: grandTotal,
            paymentMethod: 'CASH_ON_DELIVERY',
            orderItems: cart.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
            createdAt: new Date().toISOString(),
          };

      clearCart();

      // Launch WhatsApp click-to-chat with pre-filled message after DB order creation (Fail-safe)
      try {
        launchCustomerWhatsApp(orderPayload);
      } catch (waErr) {
        console.error('WhatsApp launch error:', waErr);
      }

      router.push(`/order/${data.orderNumber}?autoWa=1`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
        <Navbar />
        <div className="pt-40 pb-20 text-center max-w-lg mx-auto px-4">
          <ShoppingBag className="w-16 h-16 text-[#24201C] mx-auto mb-4 stroke-1" />
          <h1 className="font-serif text-3xl text-[#F4EBDD] mb-2">Your cart is empty</h1>
          <p className="text-xs text-[#9F9589] mb-6">
            Please add dishes or deals to your cart before proceeding to checkout.
          </p>
          <a
            href="/menu"
            className="inline-flex px-6 py-3 rounded-xl bg-[#C83B22] text-white font-sans text-xs uppercase font-bold tracking-wider"
          >
            BROWSE MENU
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#24201C] pb-6 mb-8">
          <h1 className="font-bebas text-4xl sm:text-6xl tracking-widest text-[#F4EBDD] uppercase leading-none">
            CHECKOUT & <span className="text-[#C69A45]">PLACE ORDER</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#9F9589] mt-1">
            Select your preferred Tawakal Restaurant branch and enter your delivery address.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[#C83B22]/10 border border-[#C83B22]/40 text-[#C83B22] text-xs font-sans font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Select Branch */}
            <div className="p-6 rounded-2xl bg-[#1A1815] border border-[#24201C] space-y-4">
              <h3 className="font-bebas text-2xl tracking-wider text-[#F4EBDD]">
                1. SELECT RESTAURANT BRANCH
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branches.map((b) => {
                  const isSelected = selectedBranchId === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBranchId(b.id)}
                      className={`p-4 rounded-xl border flex flex-col items-start justify-between text-left transition-all ${
                        isSelected
                          ? 'bg-[#C69A45]/15 border-[#C69A45] text-[#F4EBDD]'
                          : 'bg-[#11100E] border-[#24201C] text-[#9F9589] hover:border-[#9F9589]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Store className={`w-5 h-5 ${isSelected ? 'text-[#C69A45]' : 'text-[#9F9589]'}`} />
                        <span className="font-sans text-xs uppercase font-bold tracking-wider text-[#F4EBDD]">
                          {b.name}
                        </span>
                      </div>
                      <span className="font-sans text-[11px] text-[#9F9589] line-clamp-2">
                        {b.address}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Order Type */}
            <div className="p-6 rounded-2xl bg-[#1A1815] border border-[#24201C] space-y-4">
              <h3 className="font-bebas text-2xl tracking-wider text-[#F4EBDD]">
                2. SELECT FULFILLMENT MODE
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    orderType === 'DELIVERY'
                      ? 'bg-[#C83B22]/15 border-[#C83B22] text-[#F4EBDD]'
                      : 'bg-[#11100E] border-[#24201C] text-[#9F9589] hover:border-[#9F9589]'
                  }`}
                >
                  <Truck className={`w-6 h-6 ${orderType === 'DELIVERY' ? 'text-[#C83B22]' : 'text-[#9F9589]'}`} />
                  <span className="font-sans text-xs uppercase font-bold tracking-wider">
                    HOME DELIVERY
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    orderType === 'PICKUP'
                      ? 'bg-[#C69A45]/15 border-[#C69A45] text-[#F4EBDD]'
                      : 'bg-[#11100E] border-[#24201C] text-[#9F9589] hover:border-[#9F9589]'
                  }`}
                >
                  <Store className={`w-6 h-6 ${orderType === 'PICKUP' ? 'text-[#C69A45]' : 'text-[#9F9589]'}`} />
                  <span className="font-sans text-xs uppercase font-bold tracking-wider">
                    SELF PICKUP
                  </span>
                </button>
              </div>

              {orderType === 'PICKUP' && selectedBranch && (
                <div className="p-4 rounded-xl bg-[#11100E] border border-[#C69A45]/30 text-xs text-[#9F9589] space-y-1">
                  <span className="text-[#C69A45] font-bold block uppercase tracking-wider">
                    PICKUP LOCATION ({selectedBranch.name}):
                  </span>
                  <p className="text-[#F4EBDD]">{selectedBranch.address}</p>
                  <p className="text-[11px] text-[#C69A45]">Hours: {selectedBranch.openingHours} • Phone: {selectedBranch.phone}</p>
                </div>
              )}
            </div>

            {/* Section 3: Contact Information */}
            <div className="p-6 rounded-2xl bg-[#1A1815] border border-[#24201C] space-y-4">
              <h3 className="font-bebas text-2xl tracking-wider text-[#F4EBDD]">
                3. CONTACT INFORMATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+92 343 1265090"
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                  WHATSAPP NUMBER (OPTIONAL)
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Same as phone number"
                  className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                />
              </div>
            </div>

            {/* Section 4: Delivery Address (Shown when Delivery is active) */}
            {orderType === 'DELIVERY' && (
              <div className="p-6 rounded-2xl bg-[#1A1815] border border-[#24201C] space-y-4">
                <h3 className="font-bebas text-2xl tracking-wider text-[#F4EBDD]">
                  4. DELIVERY AREA & ADDRESS
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-[#C69A45] block mb-1 uppercase tracking-wider">
                      DELIVERY AREA *
                    </label>

                    {deliveryAreas.length === 0 ? (
                      <div className="p-4 rounded-xl bg-[#11100E] border border-[#C83B22]/30 text-xs text-[#9F9589]">
                        Delivery areas are currently being configured for this branch. Please choose Pickup or contact the restaurant directly.
                      </div>
                    ) : (
                      <select
                        value={selectedAreaId}
                        onChange={(e) => setSelectedAreaId(e.target.value)}
                        className="w-full bg-[#11100E] border border-[#C69A45]/40 rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                      >
                        {deliveryAreas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name.replace(/\s*\([^)]*\)/g, '').trim()} — Fee: Rs. {area.deliveryFee} (Est. {area.estimatedTime})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="font-sans text-xs font-semibold text-[#C69A45] block mb-1 uppercase tracking-wider">
                      SECTOR *
                    </label>
                    <select
                      value={selectedSector}
                      onChange={(e) => setSelectedSector(e.target.value)}
                      className="w-full bg-[#11100E] border border-[#C69A45]/40 rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                    >
                      <option value="Sector A">Sector A</option>
                      <option value="Sector B">Sector B</option>
                      <option value="Sector C">Sector C</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                      HOUSE / FLAT NO. *
                    </label>
                    <input
                      type="text"
                      required
                      value={houseFlatNo}
                      onChange={(e) => setHouseFlatNo(e.target.value)}
                      placeholder="e.g. 9178"
                      className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                      LANDMARK / NEARBY PLACE
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Jasyugsavgw / Near Mosque"
                      className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                    STREET / ROAD ADDRESS (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Street 5, Main Rd"
                    className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                  />
                </div>
              </div>
            )}

            {/* Section 5: Notes & Coupon */}
            <div className="p-6 rounded-2xl bg-[#1A1815] border border-[#24201C] space-y-4">
              <h3 className="font-bebas text-2xl tracking-wider text-[#F4EBDD]">
                5. ORDER NOTES & COUPON CODE
              </h3>

              <div>
                <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                  SPECIAL INSTRUCTIONS / NOTES
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Make BBQ extra spicy, call before arrival..."
                  className="w-full bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] focus:outline-none focus:border-[#C69A45]"
                />
              </div>

              <div>
                <label className="font-sans text-xs font-semibold text-[#9F9589] block mb-1">
                  DISCOUNT COUPON CODE
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. TAWAKAL10)"
                    className="flex-1 bg-[#11100E] border border-[#24201C] rounded-xl px-4 py-3 text-sm text-[#F4EBDD] uppercase tracking-wider focus:outline-none focus:border-[#C69A45]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-5 py-3 rounded-xl bg-[#24201C] hover:bg-[#2A2520] text-[#C69A45] font-sans text-xs uppercase font-bold tracking-wider border border-[#C69A45]/30 transition-colors"
                  >
                    APPLY
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-xs font-sans mt-1.5 font-medium text-[#C69A45]">
                    {couponMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-[#1A1815] border border-[#C69A45]/30 space-y-4 sticky top-28 shadow-2xl">
              <h3 className="font-bebas text-2xl tracking-widest text-[#F4EBDD] border-b border-[#24201C] pb-3">
                ORDER SUMMARY
              </h3>

              {selectedBranch && (
                <div className="text-xs text-[#C69A45] bg-[#C69A45]/10 p-2.5 rounded-lg border border-[#C69A45]/20">
                  <span className="font-bold block">Selected Branch:</span>
                  <span className="text-[#F4EBDD]">{selectedBranch.name}</span>
                </div>
              )}

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 border-b border-[#24201C] pb-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#F4EBDD]">{item.name}</span>
                      <span className="text-[#9F9589] ml-1">× {item.quantity}</span>
                      {item.includesCompulsoryRaita && (
                        <span className="block text-[10px] text-[#C69A45]">✓ Compulsory Raita</span>
                      )}
                    </div>
                    <span className="font-bebas text-base text-[#C69A45]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between text-[#9F9589]">
                  <span>Items Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#4CAF50]">
                    <span>Discount</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#9F9589]">
                  <span>Delivery Fee ({orderType === 'DELIVERY' ? currentArea?.name || 'Area' : 'Pickup'})</span>
                  <span>Rs. {currentDeliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#F4EBDD] pt-2 border-t border-[#24201C]">
                  <span>TOTAL DUE (COD)</span>
                  <span className="font-bebas text-3xl text-[#C69A45]">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#C83B22] hover:bg-[#D94A2D] text-white font-sans text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>PLACING ORDER...</span>
                ) : (
                  <>
                    <span>PLACE ORDER (CASH ON DELIVERY)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-[#11100E] border border-[#24201C] text-[11px] text-[#9F9589] text-center">
                ✓ Cash on Delivery & Self Pickup supported. Pre-formatted WhatsApp order confirmation link provided immediately after placement.
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
