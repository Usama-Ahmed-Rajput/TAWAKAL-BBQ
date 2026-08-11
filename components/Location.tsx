'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, ExternalLink, MessageSquare } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { Button } from './ui/Button';

export const Location: React.FC = () => {
  const addressString = 'Plot No. 358, Street 5, Sector B, Main Road Akhter Colony, Opposite Saddique Medical Store, Karachi, Pakistan';
  const encodedAddress = encodeURIComponent(addressString);
  const directionsUrl = `https://maps.google.com/?q=${encodedAddress}`;
  const mapIframeUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="location"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#11100E] border-b border-[#F4EBDD]/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="VISIT OUR RESTAURANT & DINING HALL"
          title="FIND TAWAKAL BBQ"
          subtitle="Join us for live charcoal grilling and warm Pakistani hospitality."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Info Details Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 bg-[#1A1815] border border-[#F4EBDD]/10 p-8 rounded-2xl flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.7)] space-y-6"
          >
            <div className="space-y-6">
              {/* Restaurant Name */}
              <div className="border-b border-[#F4EBDD]/10 pb-4">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C69A45] block mb-1">
                  OFFICIAL OUTLET
                </span>
                <h3 className="font-bebas text-3xl tracking-wider text-[#F4EBDD]">
                  TAWAKAL BBQ & RESTAURANT
                </h3>
              </div>

              {/* Exact Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#11100E] border border-[#C69A45]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C83B22]" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#C69A45] mb-1">
                    EXACT RESTAURANT ADDRESS
                  </h4>
                  <p className="font-sans text-xs text-[#F4EBDD] font-medium leading-relaxed">
                    Plot No. 358, Street 5, Sector B, Main Road Akhter Colony, Opposite Saddique Medical Store, Karachi, Pakistan.
                  </p>
                </div>
              </div>

              {/* Real Phone Numbers */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#11100E] border border-[#C69A45]/30 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#C83B22]" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#C69A45] mb-1">
                    PHONE ORDERS & RESERVATIONS
                  </h4>
                  <div className="space-y-1 font-mono text-sm">
                    <a
                      href="tel:+923431265090"
                      className="block text-[#F4EBDD] font-semibold hover:text-[#C83B22] transition-colors"
                    >
                      +92-343-1265090
                    </a>
                    <a
                      href="tel:+923485650906"
                      className="block text-[#F4EBDD] font-semibold hover:text-[#C83B22] transition-colors"
                    >
                      +92-348-5650906
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/923485650906"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#25D366]/25 transition-all shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ORDER VIA WHATSAPP (+92 348 5650906)</span>
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 pt-2 border-t border-[#11100E]">
                <div className="w-10 h-10 rounded-lg bg-[#11100E] border border-[#C69A45]/30 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#C69A45]" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#C69A45] mb-1">
                    OPENING HOURS
                  </h4>
                  <p className="font-sans text-sm text-[#F4EBDD] font-medium">
                    12:00 PM – 01:00 AM Daily
                  </p>
                  <p className="font-sans text-xs text-[#B8B0A5] mt-0.5">
                    Lunch, Dinner & Late-Night BBQ
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#11100E]">
              <Button
                id="get-directions-btn"
                href={directionsUrl}
                target="_blank"
                variant="primary"
                size="md"
                className="w-full"
              >
                <Navigation className="w-4 h-4 mr-2" />
                GET DIRECTIONS (GOOGLE MAPS)
              </Button>
            </div>
          </motion.div>

          {/* Real Interactive Map Frame */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 relative min-h-[420px] bg-[#1A1815] border border-[#F4EBDD]/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden group"
          >
            {/* Real Interactive Map Iframe for Akhter Colony */}
            <iframe
              title="Tawakal BBQ & Restaurant Exact Location Map"
              src={mapIframeUrl}
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

            {/* Floating Live Location Badge */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3.5 py-2 bg-[#11100E]/95 backdrop-blur-md border border-[#C69A45]/50 font-sans text-xs font-bold uppercase tracking-widest text-[#C69A45] rounded-xl shadow-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C83B22] animate-ping" />
              <span>AKHTER COLONY OUTLET MAP</span>
            </div>

            {/* Open Google Maps Floating Button */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C83B22] text-[#F4EBDD] font-sans font-bold text-xs uppercase tracking-widest hover:bg-[#D94A2D] transition-colors rounded-xl shadow-2xl"
              >
                <span>OPEN IN GOOGLE MAPS</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
