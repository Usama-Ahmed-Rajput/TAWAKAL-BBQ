'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MapPin, Phone, MessageSquare, Clock, ExternalLink, Store } from 'lucide-react';

interface Branch {
  id: string;
  slug: string;
  name: string;
  address: string;
  locationReference?: string;
  phone: string;
  whatsapp?: string;
  mapUrl?: string;
  openingHours: string;
}

export default function PublicLocationPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((data) => {
        setBranches(data.branches || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F1EA]">
      <Navbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#24201C] pb-6 mb-12 text-center max-w-3xl mx-auto">
          <span className="font-sans text-xs uppercase font-bold tracking-widest text-[#C69A45] mb-2 block">
            VISIT OUR LOCATIONS
          </span>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-widest text-[#F4EBDD] uppercase leading-none">
            RESTAURANT <span className="text-[#C83B22]">BRANCHES</span>
          </h1>
          <p className="font-serif italic text-sm text-[#9F9589] mt-3">
            Tawakal Bar B.Q & Restaurant serves authentic live charcoal BBQ across Karachi from our main branch in Akhtar Colony.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#C69A45] font-sans text-sm">
            Loading restaurant branches...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {branches.map((b) => (
              <div
                key={b.id}
                className="bg-[#1A1815] border border-[#24201C] rounded-3xl p-8 shadow-2xl space-y-6 flex flex-col justify-between hover:border-[#C69A45]/40 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[#24201C] pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#C83B22]/15 border border-[#C83B22]/40 flex items-center justify-center text-[#C83B22]">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bebas text-3xl tracking-wider text-[#F4EBDD]">
                        {b.name}
                      </h2>
                      <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C69A45]">
                        Live Charcoal BBQ & Dining
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 font-sans text-xs text-[#9F9589]">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#C69A45] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#F4EBDD] block uppercase tracking-wider text-[10px]">
                          Written Address
                        </span>
                        <p className="text-[#F4EBDD]/90">{b.address}</p>
                      </div>
                    </div>

                    {b.locationReference && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#C83B22] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#C83B22] block uppercase tracking-wider text-[10px]">
                            Map Reference / Plus Code
                          </span>
                          <p className="text-[#9F9589] font-mono text-[11px]">{b.locationReference}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#C69A45] shrink-0" />
                      <div>
                        <span className="font-bold text-[#F4EBDD] block uppercase tracking-wider text-[10px]">
                          Direct Phone Orders
                        </span>
                        <p className="text-[#F4EBDD] font-mono">{b.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#C69A45] shrink-0" />
                      <div>
                        <span className="font-bold text-[#F4EBDD] block uppercase tracking-wider text-[10px]">
                          Opening Hours
                        </span>
                        <p className="text-[#F4EBDD]">{b.openingHours}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#24201C] flex flex-wrap gap-3">
                  <a
                    href={b.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(b.name + ' Karachi')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 rounded-xl bg-[#C69A45] hover:bg-[#D4A953] text-[#070707] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>GET DIRECTIONS</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://wa.me/${(b.whatsapp || b.phone).replace(/[^00-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-[#11100E] border border-[#24201C] hover:border-[#25D366] text-[#25D366] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WHATSAPP</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
