'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Check, X, Flame, AlertTriangle } from 'lucide-react';

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    urduName: '',
    categoryId: '',
    price: '',
    compareAtPrice: '',
    image: '',
    shortDescription: '',
    description: '',
    isFeatured: false,
    isPopular: false,
    isAvailable: true,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchMenu = () => {
    setLoading(true);
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        urduName: item.urduName || '',
        categoryId: item.categoryId,
        price: item.price.toString(),
        compareAtPrice: item.compareAtPrice ? item.compareAtPrice.toString() : '',
        image: item.image,
        shortDescription: item.shortDescription || '',
        description: item.description || '',
        isFeatured: item.isFeatured,
        isPopular: item.isPopular,
        isAvailable: item.isAvailable,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        urduName: '',
        categoryId: categories[0]?.id || '',
        price: '',
        compareAtPrice: '',
        image: '',
        shortDescription: '',
        description: '',
        isFeatured: false,
        isPopular: false,
        isAvailable: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save menu item');

      showNotification('success', editingItem ? 'Menu item updated successfully.' : 'New menu item added successfully.');
      setIsModalOpen(false);
      fetchMenu();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleToggleAvailable = async (item: any) => {
    try {
      await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      showNotification('success', `${item.name} availability updated.`);
      fetchMenu();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (item: any) => {
    try {
      await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !item.isFeatured }),
      });
      showNotification('success', `${item.name} featured status updated.`);
      fetchMenu();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    try {
      const res = await fetch(`/api/menu/${deletingItem.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      showNotification('success', 'Menu item deleted successfully.');
      setDeletingItem(null);
      fetchMenu();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const filteredItems = items.filter((item: any) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.categoryId === selectedCategory ||
      (item.category && (item.category.slug === selectedCategory || item.category.id === selectedCategory));
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.urduName && item.urduName.includes(search));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 text-amber-50">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl border font-sans text-xs font-bold shadow-2xl flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
              : 'bg-red-950/90 text-red-300 border-red-700'
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18110e] p-6 rounded-2xl border border-amber-900/40 shadow-xl">
        <div>
          <h2 className="font-bebas text-3xl tracking-wider text-amber-100">
            MENU MANAGEMENT CMS
          </h2>
          <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
            Add, update prices, change availability and organize dishes by category.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 px-5 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-amber-950 shadow-md font-bold'
                : 'bg-[#18110e] text-amber-300/70 border border-amber-900/40 hover:text-amber-100'
            }`}
          >
            All Categories ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id || i.category?.slug === cat.slug).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-amber-600 text-amber-950 shadow-md font-bold'
                    : 'bg-[#18110e] text-amber-300/70 border border-amber-900/40 hover:text-amber-100'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
          <input
            type="text"
            placeholder="Search dish by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18110e] border border-amber-900/40 rounded-xl py-2 pl-10 pr-4 text-xs text-amber-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="py-20 text-center text-amber-400 flex items-center justify-center">
          <Flame className="w-6 h-6 animate-spin mr-2" />
          <span>Loading menu catalog...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[#18110e] border border-amber-900/30 rounded-2xl p-12 text-center text-amber-300/50">
          No menu items matching your selection.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#18110e] border border-amber-900/40 rounded-2xl overflow-hidden shadow-lg group hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-black/40">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18110e] via-transparent to-black/30" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-amber-950/80 backdrop-blur border border-amber-800/60 text-amber-300 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                      {item.category?.name || 'Unassigned'}
                    </span>
                    {item.isFeatured && (
                      <span className="bg-red-950/80 backdrop-blur border border-red-800/60 text-red-300 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bebas text-2xl tracking-wide text-amber-100">
                        {item.name}
                      </h3>
                      {item.urduName && (
                        <span className="font-urdu text-sm text-amber-400 block -mt-1">
                          {item.urduName}
                        </span>
                      )}
                    </div>
                    <span className="font-bebas text-2xl text-amber-400">
                      Rs. {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/60 line-clamp-2 mt-2 font-serif italic">
                    {item.description || item.shortDescription || 'Authentic Tawakal BBQ item.'}
                  </p>
                </div>
              </div>

              {/* Card Footer Controls */}
              <div className="p-4 border-t border-amber-900/30 bg-[#120c09] flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs">
                  <button
                    onClick={() => handleToggleAvailable(item)}
                    className={`px-3 py-1 rounded-full font-bold text-[11px] border transition-all cursor-pointer ${
                      item.isAvailable
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                        : 'bg-red-950/60 border-red-800 text-red-300'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`px-3 py-1 rounded-full font-bold text-[11px] border transition-all cursor-pointer ${
                      item.isFeatured
                        ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                        : 'bg-zinc-900/60 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {item.isFeatured ? '★ Featured' : '☆ Standard'}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 hover:bg-amber-800/40 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-2 rounded-lg bg-red-950/60 border border-red-800/40 text-red-300 hover:bg-red-900/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18110e] border border-amber-900/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
              <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
                {editingItem ? 'EDIT MENU ITEM' : 'ADD NEW MENU ITEM'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-amber-400 hover:text-amber-200 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Dish Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="e.g. Chicken Botti Plate"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Urdu Name
                  </label>
                  <input
                    type="text"
                    value={formData.urduName}
                    onChange={(e) => setFormData({ ...formData, urduName: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100 font-urdu"
                    placeholder="چکن بوٹی پلیٹ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="520"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Image URL *
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
                  Description / Portion Detail
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="e.g. 16 Pieces of Botti marinated in heritage charcoal spices..."
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded border-amber-900 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>Is Available</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-semibold text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-amber-900 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>Is Featured</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-amber-900/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-amber-900/40 text-xs font-semibold text-amber-300/80 hover:bg-amber-950/50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-950/40 cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18110e] border border-red-900/60 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3 text-red-500 pb-3 border-b border-amber-900/30">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
                DELETE MENU ITEM
              </h3>
            </div>

            <p className="text-xs text-amber-200/90 leading-relaxed">
              Are you sure you want to delete <strong className="text-amber-100">{deletingItem.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-amber-900/30">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2.5 rounded-xl border border-amber-900/40 text-xs font-semibold text-amber-300/80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-red-950/50 cursor-pointer"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
