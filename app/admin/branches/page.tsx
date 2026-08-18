'use client';

import { useState, useEffect } from 'react';
import { Plus, Store, Edit3, Trash2, Power, MapPin, Phone, Flame, X, AlertTriangle } from 'lucide-react';

interface Branch {
  id: string;
  slug: string;
  name: string;
  address: string;
  locationReference?: string;
  phone: string;
  whatsapp?: string;
  mapUrl?: string;
  isActive: boolean;
  openingHours: string;
}

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Delete Confirmation Modal State
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    locationReference: '',
    phone: '',
    whatsapp: '',
    mapUrl: '',
    openingHours: '12:00 PM - 01:00 AM',
    isActive: true,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchBranches = () => {
    setLoading(true);
    fetch('/api/admin/branches')
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/admin/login';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setBranches(data.branches || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        id: branch.id,
        name: branch.name,
        address: branch.address,
        locationReference: branch.locationReference || '',
        phone: branch.phone,
        whatsapp: branch.whatsapp || '',
        mapUrl: branch.mapUrl || '',
        openingHours: branch.openingHours,
        isActive: branch.isActive,
      });
    } else {
      setEditingBranch(null);
      setFormData({
        id: '',
        name: '',
        address: '',
        locationReference: '',
        phone: '',
        whatsapp: '',
        mapUrl: '',
        openingHours: '12:00 PM - 01:00 AM',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingBranch ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/branches', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save branch');

      showNotification('success', data.message || 'Branch saved successfully.');
      setIsModalOpen(false);
      fetchBranches();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleToggleActive = async (branch: Branch) => {
    try {
      const res = await fetch('/api/admin/branches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...branch, isActive: !branch.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update branch status');

      showNotification('success', `${branch.name} is now ${!branch.isActive ? 'Active' : 'Inactive'}.`);
      fetchBranches();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingBranch) return;
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/branches?id=${deletingBranch.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete branch');
        return;
      }

      showNotification('success', 'Branch permanently deleted.');
      setDeletingBranch(null);
      fetchBranches();
    } catch (err: any) {
      setDeleteError(err.message);
    }
  };

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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18110e] p-6 rounded-2xl border border-amber-900/40 shadow-xl">
        <div>
          <h2 className="font-bebas text-3xl tracking-wider text-amber-100">
            RESTAURANT BRANCHES MANAGEMENT
          </h2>
          <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
            Configure Akhtar Colony branch details, address, phone lines & operating status.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 px-5 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Branch</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-amber-400 flex items-center justify-center">
          <Flame className="w-6 h-6 animate-spin mr-2" />
          <span>Loading branch details...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/40 flex items-center justify-center text-amber-400">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bebas text-2xl tracking-wide text-amber-100">
                        {branch.name}
                      </h3>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          branch.isActive
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : 'bg-red-950/80 text-red-300 border-red-800'
                        }`}
                      >
                        {branch.isActive ? 'Active Branch' : 'Inactive Branch'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(branch)}
                      title={branch.isActive ? 'Deactivate Branch' : 'Activate Branch'}
                      className={`p-2 rounded-lg border transition-colors ${
                        branch.isActive
                          ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/60'
                          : 'bg-red-950/60 border-red-800/60 text-red-400 hover:bg-red-900/60'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenModal(branch)}
                      title="Edit Branch"
                      className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 hover:bg-amber-800/40"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setDeletingBranch(branch);
                        setDeleteError(null);
                      }}
                      title="Delete Branch"
                      className="p-2 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900/60"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-amber-200/80 pt-2 border-t border-amber-900/30">
                  <div>
                    <span className="text-amber-500 font-bold block uppercase text-[10px]">Written Postal Address</span>
                    <span className="text-amber-100">{branch.address}</span>
                  </div>

                  {branch.locationReference && (
                    <div>
                      <span className="text-amber-500 font-bold block uppercase text-[10px]">Map Reference</span>
                      <span className="text-amber-300/80">{branch.locationReference}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-amber-500 font-bold block uppercase text-[10px]">Phone Line</span>
                      <span className="text-amber-200">{branch.phone}</span>
                    </div>
                    <div>
                      <span className="text-amber-500 font-bold block uppercase text-[10px]">Hours</span>
                      <span className="text-amber-200">{branch.openingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18110e] border border-amber-900/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
              <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
                {editingBranch ? 'EDIT BRANCH' : 'ADD NEW BRANCH'}
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
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="e.g. Tawakal Restaurant — Main Branch"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Complete Postal Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="Main Road, Sector C, Akhtar Colony, Karachi, Pakistan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Map Reference / Plus Code
                </label>
                <input
                  type="text"
                  value={formData.locationReference}
                  onChange={(e) => setFormData({ ...formData, locationReference: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="e.g. R3QF+WGH, Akhtar Colony Main Rd..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="+92 343 1265090"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                    placeholder="+92 348 5650906"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-2.5 text-xs text-amber-100"
                  placeholder="12:00 PM - 01:00 AM"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="branchActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-amber-900 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="branchActive" className="text-xs font-semibold text-amber-200 cursor-pointer">
                  Is Branch Active & Accepting Orders
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
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBranch && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18110e] border border-red-900/60 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3 text-red-500 pb-3 border-b border-amber-900/30">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
                DELETE BRANCH CONFIRMATION
              </h3>
            </div>

            <p className="text-xs text-amber-200/90 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-amber-100">{deletingBranch.name}</strong>?
            </p>

            {deleteError && (
              <div className="p-3 bg-red-950/90 border border-red-800 rounded-xl text-xs text-red-300 leading-relaxed">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-amber-900/30">
              <button
                type="button"
                onClick={() => {
                  setDeletingBranch(null);
                  setDeleteError(null);
                }}
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
