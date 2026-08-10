'use client';

import { useState, useEffect } from 'react';
import { Plus, Tag, Edit3, Trash2, X, Flame, Check } from 'lucide-react';

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    image: '',
    originalPrice: '',
    dealPrice: '',
    discountType: 'FIXED',
    discountValue: '',
    isActive: true,
    isFeatured: true,
    isHomepageFeatured: true,
    terms: '',
  });

  const fetchDeals = () => {
    setLoading(true);
    fetch('/api/deals?all=true')
      .then((res) => res.json())
      .then((data) => {
        setDeals(data.deals || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleOpenModal = (deal?: any) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({
        title: deal.title,
        shortDescription: deal.shortDescription || '',
        description: deal.description || '',
        image: deal.image,
        originalPrice: deal.originalPrice.toString(),
        dealPrice: deal.dealPrice.toString(),
        discountType: deal.discountType || 'FIXED',
        discountValue: deal.discountValue ? deal.discountValue.toString() : '',
        isActive: deal.isActive,
        isFeatured: deal.isFeatured,
        isHomepageFeatured: deal.isHomepageFeatured,
        terms: deal.terms || '',
      });
    } else {
      setEditingDeal(null);
      setFormData({
        title: '',
        shortDescription: '',
        description: '',
        image: '',
        originalPrice: '',
        dealPrice: '',
        discountType: 'FIXED',
        discountValue: '',
        isActive: true,
        isFeatured: true,
        isHomepageFeatured: true,
        terms: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingDeal ? `/api/deals/${editingDeal.id}` : '/api/deals';
    const method = editingDeal ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save deal');

      setIsModalOpen(false);
      fetchDeals();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (deal: any) => {
    try {
      await fetch(`/api/deals/${deal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !deal.isActive }),
      });
      fetchDeals();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 text-amber-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18110e] p-6 rounded-2xl border border-amber-900/40 shadow-xl">
        <div>
          <h2 className="font-bebas text-3xl tracking-wider text-amber-100">
            PROMOTIONAL DEALS CMS
          </h2>
          <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
            Manage combo packages, discounts and homepage featured deals.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 px-5 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Deal</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-amber-400 flex items-center justify-center">
          <Flame className="w-6 h-6 animate-spin mr-2" />
          <span>Loading deals catalog...</span>
        </div>
      ) : deals.length === 0 ? (
        <div className="bg-[#18110e] border border-amber-900/30 rounded-2xl p-12 text-center text-amber-300/50">
          No promotional deals configured. Create your first family bundle deal.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-[#18110e] border border-amber-900/40 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-amber-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-2/5 h-48 sm:h-auto relative bg-black/40">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18110e] via-transparent to-transparent sm:hidden" />
                </div>
                <div className="sm:w-3/5 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-400 px-2.5 py-0.5 rounded border border-amber-800/40">
                        {deal.discountType === 'PERCENTAGE'
                          ? `${deal.discountValue}% OFF`
                          : `SAVE Rs. ${deal.discountValue}`}
                      </span>
                      <button
                        onClick={() => handleToggleActive(deal)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                          deal.isActive
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : 'bg-red-950/80 text-red-300 border-red-800'
                        }`}
                      >
                        {deal.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <h3 className="font-bebas text-2xl tracking-wide text-amber-100">
                      {deal.title}
                    </h3>
                    <p className="text-xs text-amber-200/60 font-serif italic mt-1 line-clamp-2">
                      {deal.description || deal.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-900/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-400/50 line-through mr-2">
                        Rs. {deal.originalPrice}
                      </span>
                      <span className="font-bebas text-2xl text-amber-400">
                        Rs. {deal.dealPrice}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(deal)}
                        className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 hover:bg-amber-800/40"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18110e] border border-amber-900/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
              <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
                {editingDeal ? 'EDIT DEAL' : 'CREATE PROMOTIONAL DEAL'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-amber-400 hover:text-amber-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Deal Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="e.g. Family Charcoal Feast Combo"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Original Value (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="3500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Offer Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.dealPrice}
                    onChange={(e) => setFormData({ ...formData, dealPrice: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="2799"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="701"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="Includes 1 Chicken Tikka, 4 Seekh Kebabs, 4 Puri Parathas & Cold Drinks..."
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-amber-900 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Is Deal Active</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-semibold text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHomepageFeatured}
                    onChange={(e) => setFormData({ ...formData, isHomepageFeatured: e.target.checked })}
                    className="rounded border-amber-900 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Show on Homepage Banner</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-amber-900/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-amber-900/40 text-xs font-semibold text-amber-300/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-950/40"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
