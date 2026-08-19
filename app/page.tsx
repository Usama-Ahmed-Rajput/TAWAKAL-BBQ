'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { BrandIntro } from '@/components/BrandIntro';
import { FireToFlavor } from '@/components/FireToFlavor';
import { SignatureDishes } from '@/components/SignatureDishes';
import { SpiceCustomizer } from '@/components/SpiceCustomizer';
import { HomeDeals } from '@/components/HomeDeals';
import { SignaturePlatter } from '@/components/SignaturePlatter';
import { Menu } from '@/components/Menu';
import { RestaurantInterior } from '@/components/RestaurantInterior';
import { Testimonials } from '@/components/Testimonials';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { OrderModal } from '@/components/OrderModal';

export default function HomePage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedDishForOrder, setSelectedDishForOrder] = useState<string | undefined>();

  const handleOpenOrder = (dishName?: string) => {
    setSelectedDishForOrder(dishName);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderModalOpen(false);
    setSelectedDishForOrder(undefined);
  };

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA] selection:bg-[#FF6A00] selection:text-black">
      {/* Sticky Top Navigation */}
      <Navbar onOrderClick={() => handleOpenOrder()} />

      {/* Main Experience Journey */}
      <main>
        {/* 1. Hero Section with Scroll Scrubbed Video */}
        <Hero onOrderClick={() => handleOpenOrder()} />

        {/* 2. Brand Introduction Story */}
        <BrandIntro />

        {/* 3. Signature Dishes Grid (3 Featured Dishes + See More) */}
        <SignatureDishes onOrderDish={(dish) => handleOpenOrder(dish)} limit={3} />

        {/* 4. From Fire To Flavor Scroll Controlled Stages Video */}
        <FireToFlavor />

        {/* 5. Spice Customizer */}
        <SpiceCustomizer />

        {/* 6. Featured Deals Section (3 Deals + See More) */}
        <HomeDeals />

        {/* 7. Signature Platter Video Section */}
        <SignaturePlatter />

        {/* 8. Interactive Restaurant Menu */}
        <Menu />

        {/* 9. Restaurant Interior Atmosphere Video */}
        <RestaurantInterior />

        {/* 10. Guest Testimonials */}
        <Testimonials />

        {/* 11. Final Dramatic CTA */}
        <FinalCTA
          onOrderClick={() => handleOpenOrder()}
          onReserveClick={() => handleOpenOrder()}
        />
      </main>

      {/* 12. Footer */}
      <Footer />

      {/* Order / Table Reservation Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrder}
        initialItem={selectedDishForOrder}
      />
    </div>
  );
}
