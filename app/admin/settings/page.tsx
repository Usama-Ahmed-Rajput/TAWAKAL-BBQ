'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Save,
  Flame,
  Check,
  Shield,
  Lock,
  Key,
  LogOut,
  User,
  AlertCircle,
  Building,
  Bell,
  Sliders,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'restaurant' | 'branches' | 'notifications' | 'security'>('general');

  // General & Restaurant settings
  const [settings, setSettings] = useState<any>({
    restaurant_name: 'Tawakal BBQ',
    phone: '+92 343 1265090',
    email: 'info@tawakalbbq.com',
    whatsapp: '+92 348 5650906',
    address: 'Plot No 358, Street 5, Sector B, Main Road Akhter Colony, Karachi, Pakistan',
    delivery_fee: '150',
    min_order_amount: '300',
    ordering_enabled: 'true',
  });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generalMessage, setGeneralMessage] = useState('');

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, userRes] = await Promise.all([
          fetch('/api/admin/settings'),
          fetch('/api/admin/auth/me'),
        ]);

        const settingsData = await settingsRes.json();
        const userData = await userRes.json();

        if (settingsData.settings && Object.keys(settingsData.settings).length > 0) {
          setSettings((prev: any) => ({ ...prev, ...settingsData.settings }));
        }

        if (userData.authenticated && userData.user) {
          setCurrentUser(userData.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setGeneralMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setGeneralMessage('Restaurant configuration saved successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    // Client-side validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPassError('Password must be at least 8 characters.');
      return;
    }

    if (currentPassword === newPassword) {
      setPassError('New password cannot be the same as your current password.');
      return;
    }

    setPassLoading(true);

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPassSuccess('Password changed successfully. Please log in again.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (err: any) {
      setPassError(err.message || 'An error occurred while changing password.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error', err);
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
    <div className="space-y-8 text-amber-50 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18110e] p-6 rounded-2xl border border-amber-900/40 shadow-xl">
        <div>
          <h2 className="font-bebas text-3xl tracking-wider text-amber-100">
            ADMIN SYSTEM & SECURITY SETTINGS
          </h2>
          <p className="text-xs text-amber-200/60 font-serif italic mt-0.5">
            Manage general configuration, outlet details, delivery parameters, and account security.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-amber-900/40 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'bg-amber-600 text-amber-950 shadow-md'
              : 'bg-[#18110e] text-amber-300/80 hover:text-amber-100 hover:bg-amber-950/40'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>General</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurant')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'restaurant'
              ? 'bg-amber-600 text-amber-950 shadow-md'
              : 'bg-[#18110e] text-amber-300/80 hover:text-amber-100 hover:bg-amber-950/40'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Restaurant</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'branches'
              ? 'bg-amber-600 text-amber-950 shadow-md'
              : 'bg-[#18110e] text-amber-300/80 hover:text-amber-100 hover:bg-amber-950/40'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Branches</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-amber-600 text-amber-950 shadow-md'
              : 'bg-[#18110e] text-amber-300/80 hover:text-amber-100 hover:bg-amber-950/40'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-amber-600 text-amber-950 shadow-md'
              : 'bg-[#18110e] text-amber-300/80 hover:text-amber-100 hover:bg-amber-950/40'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security</span>
        </button>
      </div>

      {/* Tab 1: General & Restaurant */}
      {(activeTab === 'general' || activeTab === 'restaurant') && (
        <div className="space-y-6">
          {generalMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>{generalMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-6">
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
                  value={settings.min_order_amount || '300'}
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
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Branches Link */}
      {activeTab === 'branches' && (
        <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-8 text-center space-y-4">
          <Building className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
            BRANCH MANAGEMENT
          </h3>
          <p className="text-xs text-amber-200/70 max-w-md mx-auto">
            Configure Akhtar Colony and Azam Town branch outlets, addresses, phone numbers, and active status.
          </p>
          <a
            href="/admin/branches"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition-all"
          >
            <span>Go to Branches CMS</span>
          </a>
        </div>
      )}

      {/* Tab 3: Notifications Info */}
      {activeTab === 'notifications' && (
        <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-8 text-center space-y-4">
          <Bell className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
            ORDER & SYSTEM NOTIFICATIONS
          </h3>
          <p className="text-xs text-amber-200/70 max-w-md mx-auto">
            Sound alerts for new customer orders and WhatsApp instant notification alerts are enabled by default.
          </p>
        </div>
      )}

      {/* Tab 4: Security Section */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Admin Account Card */}
          <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-amber-900/30">
              <User className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="font-bebas text-xl tracking-wider text-amber-100">
                  ADMIN ACCOUNT DETAILS
                </h3>
                <p className="text-[11px] text-amber-200/60">
                  Authenticated administrator account status and credentials summary.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#0d0907] rounded-xl border border-amber-900/30">
                <span className="text-[#9F9589] block text-[10px] uppercase font-bold tracking-wider">
                  Admin Name / Username
                </span>
                <span className="text-amber-100 font-bold">{currentUser?.name || 'Tawakal Admin'}</span>
              </div>
              <div className="p-3 bg-[#0d0907] rounded-xl border border-amber-900/30">
                <span className="text-[#9F9589] block text-[10px] uppercase font-bold tracking-wider">
                  Email Address
                </span>
                <span className="text-amber-100 font-bold">{currentUser?.email || 'admin@tawakalbbq.com'}</span>
              </div>
              <div className="p-3 bg-[#0d0907] rounded-xl border border-amber-900/30">
                <span className="text-[#9F9589] block text-[10px] uppercase font-bold tracking-wider">
                  Assigned Role
                </span>
                <span className="text-emerald-400 font-bold">{currentUser?.roleName || 'SUPER_ADMIN'}</span>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-amber-900/30">
              <Lock className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="font-bebas text-2xl tracking-wider text-amber-100">
                  ADMIN PASSWORD CHANGE
                </h3>
                <p className="text-xs text-amber-200/60 font-serif italic">
                  Update your admin account password using a secure 8+ character hashed format.
                </p>
              </div>
            </div>

            {/* Error & Success Messages */}
            {passError && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300/80 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl p-3 text-xs text-amber-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-amber-900/30">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPassError('');
                    setPassSuccess('');
                  }}
                  className="px-5 py-2.5 rounded-xl border border-amber-900/40 text-xs font-semibold text-amber-300/80 hover:bg-amber-950/40 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>{passLoading ? 'Updating Password...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Session Management Card */}
          <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <h4 className="font-bebas text-xl text-amber-100 tracking-wider">
                SESSION SECURITY
              </h4>
              <p className="text-xs text-amber-200/60">
                Immediately invalidate your current admin token and force re-authentication.
              </p>
            </div>
            <button
              onClick={handleLogoutAllSessions}
              className="bg-red-950/80 border border-red-800 text-red-300 hover:bg-red-900/80 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout All Sessions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
