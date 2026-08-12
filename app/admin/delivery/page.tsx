'use client';

import { useState, useEffect } from 'react';
import { Plus, MapPin, Edit3, Trash2, X, Flame, Check, AlertTriangle, Building } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
}

interface DeliveryArea {
  id: string;
  name: string;
  branchId?: string;
  branch?: Branch;
  deliveryFee: number;
  minOrder: number;
  estimatedTime: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminDeliveryPage() {
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<DeliveryArea | null>(null);

  const [deletingArea, setDeletingArea] = useState<DeliveryArea | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    branchId: '',
    deliveryFee: '150',
    minOrder: '300',
    estimatedTime: '30-45 mins',
    isActive: true,
    sortOrder: '0',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchAreasAndBranches = async () => {
    setLoading(true);
    try {
      const [areasRes, branchesRes] = await Promise.all([
        fetch('/api/admin/delivery-areas'),
        fetch('/api/admin/branches'),
      ]);

      if (areasRes.status === 401 || branchesRes.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      const areasData = await areasRes.json();
      const branchesData = await branchesRes.json();

      setAreas(areasData.areas || []);
      setBranches(branchesData.branches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreasAndBranches();
  }, []);

  const handleOpenModal = (area?: DeliveryArea) => {
    if (area) {
      setEditingArea(area);
      setFormData({
        id: area.id,
        name: area.name,
        branchId: area.branchId || '',
        deliveryFee: area.deliveryFee.toString(),
        minOrder: area.minOrder.toString(),
        estimatedTime: area.estimatedTime,
        isActive: area.isActive,
        sortOrder: area.sortOrder.toString(),
      });
    } else {
      setEditingArea(null);
      setFormData({
        id: '',
        name: '',
        branchId: branches[0]?.id || '',
        deliveryFee: '150',
        minOrder: '300',
        estimatedTime: '30-45 mins',
        isActive: true,
        sortOrder: '0',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingArea ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/delivery-areas', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save delivery area');

      showNotification('success', data.message || 'Delivery area saved successfully.');
      setIsModalOpen(false);
      fetchAreasAndBranches();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingArea) return;
    try {
      const res = await fetch(`/api/admin/delivery-areas?id=${deletingArea.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete delivery area');

      showNotification('success', 'Delivery area deleted successfully.');
      setDeletingArea(null);
      fetchAreasAndBranches();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  return (
    <div className="space-y-8 text-amber-50">
      {/* Notification Toast */}
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18110e] p-6 rounded-2xl border border-amber-900/40 shadow-xl">
        <div>
          <h2 className="font-bebas text-3xl tracking-wider text-amber-100">
            DELIVERY AREAS & FEES MANAGEMENT
          </h2>
          <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
            Configure delivery zones, assigned branch, delivery fees, minimum order amounts, and estimated delivery times.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 px-5 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Delivery Area</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-amber-400 flex items-center justify-center">
          <Flame className="w-6 h-6 animate-spin mr-2" />
          <span>Loading delivery areas...</span>
        </div>
      ) : areas.length === 0 ? (
        <div className="bg-[#18110e] border border-amber-900/30 rounded-2xl p-12 text-center text-amber-300/50">
          No delivery areas configured. Add your first delivery area.
        </div>
      ) : (
        <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-amber-900/40 bg-[#120c09] text-amber-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4">Area Name</th>
                <th className="p-4">Assigned Branch</th>
                <th className="p-4">Delivery Fee</th>
                <th className="p-4">Min. Order</th>
                <th className="p-4">Est. Delivery Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/20">
              {areas.map((area) => (
                <tr key={area.id} className="hover:bg-amber-950/20 transition-colors">
                  <td className="p-4 font-bold text-amber-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>{area.name}</span>
                  </td>
                  <td className="p-4 text-amber-300/90 font-medium">
                    {area.branch?.name || 'All Branches'}
                  </td>
                  <td className="p-4 font-bebas text-lg text-amber-400">
                    Rs. {area.deliveryFee}
                  </td>
                  <td className="p-4 text-amber-200/80">
                    Rs. {area.minOrder}
                  </td>
                  <td className="p-4 text-amber-300">
                    {area.estimatedTime}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        area.isActive
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-red-950/80 text-red-300 border-red-800'
                      }`}
                    >
                      {area.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(area)}
                      className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 hover:bg-amber-800/40 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingArea(area)}
                      className="p-2 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900/60 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18110e] border border-amber-900/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
              <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
                {editingArea ? 'EDIT DELIVERY AREA' : 'ADD DELIVERY AREA'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-amber-400 hover:text-amber-200 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Area Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="e.g. Akhtar Colony (Sector A, B, C)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Assigned Restaurant Branch
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                >
                  <option value="">-- All Branches --</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Delivery Fee (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Minimum Order (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Estimated Delivery Time
                </label>
                <input
                  type="text"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="e.g. 30-45 mins"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-amber-900 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-amber-200 cursor-pointer">
                  Is Delivery Active in this Area
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-amber-900/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-amber-900/40 text-xs font-semibold text-amber-300/80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-950/40 cursor-pointer"
                >
                  Save Delivery Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingArea && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18110e] border border-red-900/60 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3 text-red-500 pb-3 border-b border-amber-900/30">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
                DELETE DELIVERY AREA
              </h3>
            </div>

            <p className="text-xs text-amber-200/90 leading-relaxed">
              Are you sure you want to delete delivery area{' '}
              <strong className="text-amber-100">{deletingArea.name}</strong>?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-amber-900/30">
              <button
                type="button"
                onClick={() => setDeletingArea(null)}
                className="px-4 py-2.5 rounded-xl border border-amber-900/40 text-xs font-semibold text-amber-300/80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-red-950/50 cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
