'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Phone, Mail, Clock, Flame } from 'lucide-react';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = () => {
    setLoading(true);
    fetch('/api/reservations')
      .then((res) => res.json())
      .then((data) => {
        setReservations(data.reservations || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="space-y-8 text-amber-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18110e] p-6 rounded-2xl border border-amber-900/40 shadow-xl">
        <div>
          <h2 className="font-bebas text-3xl tracking-wider text-amber-100">
            TABLE RESERVATIONS
          </h2>
          <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
            Manage customer table bookings, guest counts and dining areas.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-amber-400 flex items-center justify-center">
          <Flame className="w-6 h-6 animate-spin mr-2" />
          <span>Fetching reservations...</span>
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-[#18110e] border border-amber-900/30 rounded-2xl p-12 text-center text-amber-300/50">
          No table reservations submitted yet.
        </div>
      ) : (
        <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-amber-900/40 bg-[#120c09] text-amber-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Requests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/20">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-amber-950/20 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-amber-100">{res.name}</div>
                      <div className="text-[11px] text-amber-400/60">{res.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-amber-200">{res.date}</div>
                      <div className="text-[11px] text-amber-400/60">{res.time}</div>
                    </td>
                    <td className="p-4 font-bebas text-lg text-amber-400">
                      {res.guests} Guests
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-800">
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4 text-amber-200/60 text-[11px]">
                      {res.specialRequest || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
