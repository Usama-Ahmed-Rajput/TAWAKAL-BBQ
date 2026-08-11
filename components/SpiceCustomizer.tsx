'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';

type HeatLevel = 'MILD' | 'MEDIUM' | 'FIRE HOT';

interface HeatOption {
  id: HeatLevel;
  label: string;
  urdu: string;
  tagline: string;
  description: string;
  spiceMeter: number; // out of 100
  accentColor: string;
  recommended: string[];
}

export const SpiceCustomizer: React.FC = () => {
  const [selectedHeat, setSelectedHeat] = useState<HeatLevel>('MEDIUM');

  const heatOptions: Record<HeatLevel, HeatOption> = {
    MILD: {
      id: 'MILD',
      label: 'MILD',
      urdu: 'کم مرچ',
      tagline: 'Balanced and flavorful.',
      description:
        'Smooth, fragrant marinades using cream, white pepper, cardamom, and gentle coriander. Ideal for guests who prefer low chili heat with maximum rich taste.',
      spiceMeter: 30,
      accentColor: '#C69A45',
      recommended: ['Reshmi Malai Boti', 'Creamy Malai Feast Platter', 'Tandoori Garlic Naan'],
    },
    MEDIUM: {
      id: 'MEDIUM',
      label: 'MEDIUM',
      urdu: 'درمیانی مرچ',
      tagline: 'A little extra kick.',
      description:
        'The signature Tawakal house heat balance. Red chili flakes, cumin, black pepper, and garlic charred over coals for authentic street-style BBQ flavor.',
      spiceMeter: 65,
      accentColor: '#D96A2B',
      recommended: ['Tawakal Special Chicken Tikka', 'Smokey Seekh Kebab', 'Royal BBQ Platter'],
    },
    'FIRE HOT': {
      id: 'FIRE HOT',
      label: 'FIRE HOT',
      urdu: 'تیز فائر مرچ',
      tagline: 'For serious heat lovers.',
      description:
        'Seared with roasted whole crushed red chilies, fiery ginger pulp, mustard oil, and black peppercorns. Prepared for true heat aficionados.',
      spiceMeter: 95,
      accentColor: '#C83B22',
      recommended: ['Fire Beef Boti', 'Stuffed Chili Kebabs', 'Sizzling Fire & Flame Combo'],
    },
  };

  const currentOption = heatOptions[selectedHeat];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#11100E] border-b border-[#F4EBDD]/10 overflow-hidden">
      {/* Background glow shift based on selected heat */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 opacity-20"
        style={{ backgroundColor: currentOption.accentColor }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="CUSTOMIZE YOUR EXPERIENCE"
          title="CHOOSE YOUR HEAT"
          subtitle="Every palate is unique. Select your preferred flame spice level."
        />

        {/* Heat Selector Tabs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          {(['MILD', 'MEDIUM', 'FIRE HOT'] as HeatLevel[]).map((level) => {
            const isActive = selectedHeat === level;
            const item = heatOptions[level];
            return (
              <button
                key={level}
                onClick={() => setSelectedHeat(level)}
                className={`relative flex-1 w-full py-4 px-6 font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 border flex items-center justify-center gap-3 cursor-pointer rounded-lg ${
                  isActive
                    ? 'bg-[#1A1815] text-[#F4EBDD] shadow-lg'
                    : 'bg-[#11100E] text-[#B8B0A5] border-[#F4EBDD]/10 hover:border-[#C83B22]/40 hover:text-[#F4EBDD]'
                }`}
                style={{
                  borderColor: isActive ? item.accentColor : undefined,
                }}
              >
                {/* Active Indicator Top Line */}
                {isActive && (
                  <motion.div
                    layoutId="heatActiveTab"
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                    style={{ backgroundColor: item.accentColor }}
                  />
                )}

                <Flame
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'scale-110' : 'opacity-40'
                  }`}
                  style={{ color: isActive ? item.accentColor : undefined }}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Heat Details Card */}
        <div className="mt-10 bg-[#1A1815] border border-[#F4EBDD]/15 p-8 sm:p-12 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#11100E] pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-[#11100E] rounded"
                  style={{ backgroundColor: currentOption.accentColor }}
                >
                  {currentOption.label}
                </span>
                <span className="font-urdu text-sm text-[#C69A45]">
                  {currentOption.urdu}
                </span>
              </div>
              <h3 className="font-food text-2xl sm:text-3xl font-normal text-[#F4EBDD]">
                &quot;{currentOption.tagline}&quot;
              </h3>
            </div>

            {/* Heat Meter Progress Bar */}
            <div className="w-full md:w-64 bg-[#11100E] p-4 border border-[#F4EBDD]/10 rounded-lg flex flex-col gap-2">
              <div className="flex justify-between font-sans text-xs tracking-wider uppercase">
                <span className="text-[#B8B0A5]">HEAT INTENSITY</span>
                <span
                  className="font-bold"
                  style={{ color: currentOption.accentColor }}
                >
                  {currentOption.spiceMeter}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#1A1815] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentOption.spiceMeter}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: currentOption.accentColor }}
                />
              </div>
            </div>
          </div>

          <p className="mt-6 font-sans text-sm sm:text-base text-[#B8B0A5] font-normal leading-relaxed">
            {currentOption.description}
          </p>

          {/* Recommended Dishes */}
          <div className="mt-8 pt-6 border-t border-[#11100E]">
            <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-[#C69A45] block mb-3">
              RECOMMENDED PAIRINGS AT THIS HEAT LEVEL:
            </span>
            <div className="flex flex-wrap gap-3">
              {currentOption.recommended.map((dishName) => (
                <span
                  key={dishName}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#11100E] border border-[#F4EBDD]/10 text-xs text-[#F4EBDD] font-sans font-normal tracking-wide rounded-md"
                >
                  <CheckCircle2
                    className="w-3.5 h-3.5"
                    style={{ color: currentOption.accentColor }}
                  />
                  {dishName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
