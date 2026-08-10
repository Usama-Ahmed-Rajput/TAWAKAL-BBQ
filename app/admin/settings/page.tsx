'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Flame, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    restaurant_name: 'Tawakal BBQ',
    phone: '+92 300 1234567',
    email: 'info@tawakalbbq.com',
    whatsapp: '+923001234567',
    address: 'Main Charcoal Street, BBQ Hub, Karachi',
    delivery_fee: '150',
    min_order_amount: '500',
    ordering_enabled: 'true',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings && Object.keys(data.settings).length > 0) {
          setSettings((prev: any) => ({ ...prev, ...data.settings }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setMessage('Restaurant configuration saved successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-amber-400 flex items-center justify-center">
        <Flame className="w-6 h-6 animate-spin mr-2" />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-amber-50 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18110e] p-6 rounded-2xl border border-amber-900/40 shadow-xl">
        <div>
          <h2 className="font-bebas text-3xl tracking-wider text-amber-100">
            RESTAURANT SETTINGS & CONFIGURATION
          </h2>
          <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
            Configure contact information, delivery parameters, and store controls.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-amber-300/80 mb-1">
              Restaurant Brand Name
            </label>
            <input
              type="text"
              value={settings.restaurant_name || ''}
              onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
              className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-300/80 mb-1">
              Official Phone Number
            </label>
            <input
              type="text"
              value={settings.phone || ''}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-300/80 mb-1">
              Customer Care Email
            </label>
            <input
              type="email"
              value={settings.email || ''}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-300/80 mb-1">
              WhatsApp Order Line
            </label>
            <input
              type="text"
              value={settings.whatsapp || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-amber-900/30 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-amber-300/80 mb-1">
              Default Delivery Fee (Rs.)
            </label>
            <input
              type="number"
              value={settings.delivery_fee || '150'}
              onChange={(e) => setSettings({ ...settings, delivery_fee: e.target.value })}
              className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-300/80 mb-1">
              Minimum Order Amount (Rs.)
            </label>
            <input
              type="number"
              value={settings.min_order_amount || '500'}
              onChange={(e) => setSettings({ ...settings, min_order_amount: e.target.value })}
              className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-300/80 mb-1">
            Physical Outlet Address
          </label>
          <textarea
            rows={2}
            value={settings.address || ''}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100"
          />
        </div>

        <div className="pt-4 border-t border-amber-900/30 flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
