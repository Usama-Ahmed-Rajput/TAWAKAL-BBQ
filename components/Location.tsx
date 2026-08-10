'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, Compass, ExternalLink } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { Button } from './ui/Button';

export const Location: React.FC = () => {
  return (
    <section
      id="location"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070707] border-b border-[#191919] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="VISIT OUR DINING HALL"
          title="FIND TAWAKAL BBQ"
          subtitle="Join us for live charcoal grilling and a warm Pakistani hospitality atmosphere."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Info Details Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 bg-[#111111] border border-[#FF6A00]/25 p-8 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
          >
            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#191919] border border-[#FF6A00]/40 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#FF6A00]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FF9D32] mb-1">
                    LOCATION & ADDRESS
                  </h4>
                  <p className="text-base text-[#F5F1EA] font-medium">
                    [RESTAURANT ADDRESS]
                  </p>
                  <p className="text-xs text-[#A7A7A7] mt-1 font-light">
                    Main Boulevard, Food Street • Pakistan
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#191919] border border-[#FF6A00]/40 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#FF6A00]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FF9D32] mb-1">
                    PHONE & RESERVATIONS
                  </h4>
                  <p className="text-base text-[#F5F1EA] font-medium">
                    [PHONE NUMBER]
                  </p>
                  <p className="text-xs text-[#A7A7A7] mt-1 font-light">
                    Calls accepted 12:00 PM – 1:00 AM
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#191919] border border-[#FF6A00]/40 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#FF6A00]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FF9D32] mb-1">
                    OPENING HOURS
                  </h4>
                  <p className="text-base text-[#F5F1EA] font-medium">
                    [OPENING HOURS]
                  </p>
                  <p className="text-xs text-[#A7A7A7] mt-1 font-light">
                    Mon - Sun: 5:00 PM – 1:00 AM (Dinner & Midnight)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#191919]">
              <Button
                id="get-directions-btn"
                href="https://maps.google.com"
                target="_blank"
                variant="primary"
                size="md"
                className="w-full"
              >
                <Navigation className="w-4 h-4 mr-2" />
                GET DIRECTIONS
              </Button>
            </div>
          </motion.div>

          {/* Real Interactive Dark-Styled Map Frame */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 relative min-h-[420px] bg-[#111111] border border-[#FF6A00]/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden group"
          >
            {/* Real Interactive Map Iframe with Dark Luxury Filter */}
            <iframe
              title="Tawakal BBQ Location Map"
              src="https://maps.google.com/maps?q=Karachi%20Food%20Street%20Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{
                filter: 'invert(92%) hue-rotate(180deg) contrast(1.2) saturate(0.8)',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full min-h-[420px] border-0"
            />

            {/* Dark vignette border overlay */}
            <div className="absolute inset-0 border border-[#FF6A00]/20 pointer-events-none" />

            {/* Floating Live Badge */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#070707]/90 backdrop-blur-md border border-[#FF6A00]/50 text-xs font-bold uppercase tracking-widest text-[#FF9D32] shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-ping" />
              LIVE LOCATION & DIRECTIONS
            </div>

            {/* Open Google Maps Floating Button */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href="https://maps.google.com/?q=Karachi+Food+Street+Pakistan"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6A00] text-[#070707] font-extrabold text-xs uppercase tracking-widest hover:bg-[#FF9D32] transition-colors shadow-xl"
              >
                OPEN IN MAPS
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
