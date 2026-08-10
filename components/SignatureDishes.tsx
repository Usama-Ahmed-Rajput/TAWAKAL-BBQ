'use client';

import React from 'react';
import { SIGNATURE_DISHES } from '@/data/dishes';
import { SectionHeading } from './ui/SectionHeading';
import { DishCard } from './ui/DishCard';

interface SignatureDishesProps {
  onOrderDish?: (dishName: string) => void;
}

export const SignatureDishes: React.FC<SignatureDishesProps> = ({ onOrderDish }) => {
  return (
    <section
      id="signatures"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#11100E] border-b border-[#F4EBDD]/10 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#C83B22]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="SIGNATURE DISHES"
          title="THE SIGNATURES"
          subtitle="Fire-grilled favorites crafted over live wood coals."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIGNATURE_DISHES.map((dish) => (
            <DishCard key={dish.id} dish={dish} onOrder={onOrderDish} />
          ))}
        </div>
      </div>
    </section>
  );
};
