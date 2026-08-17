'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
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
  const { toast } = useToast();
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

  // Push Notification state
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [registeredDevices, setRegisteredDevices] = useState<any[]>([]);
  const [testLoading, setTestLoading] = useState(false);

  // Live Diagnostic State
  const [diag, setDiag] = useState({
    origin: typeof window !== 'undefined' ? window.location.origin : '',
    notificationPermission: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported',
    swSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator,
    swRegistrationExists: false,
    swActive: false,
    swScope: 'None',
    pushManagerExists: typeof window !== 'undefined' && 'PushManager' in window,
    existingSubscription: false,
    vapidKeyExists: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    vapidKeyLength: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.length || 0,
    lastErrorName: 'None',
    lastErrorMessage: 'None',
    postStatus: 'Not called',
    getStatus: 'Not called',
  });
  const [diagLogs, setDiagLogs] = useState<string[]>([]);

  const addDiagLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setDiagLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const parseDeviceName = (ua: string): { icon: string; name: string } => {
    if (!ua || ua === 'Unknown Device') return { icon: '💻', name: 'Unknown Device' };
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    let os = 'Desktop';
    if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';

    let browser = 'Browser';
    if (/Edg/i.test(ua)) browser = 'Edge';
    else if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';

    const icon = isMobile ? '📱' : '💻';
    return { icon, name: `${isMobile ? 'Mobile Device' : 'Desktop'} (${os} / ${browser})` };
  };

  const getServiceWorkerRegistration = async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;

    try {
      let reg = await navigator.serviceWorker.getRegistration('/sw.js').catch(() => null);
      if (!reg) {
        addDiagLog('Registering /sw.js...');
        reg = await navigator.serviceWorker.register('/sw.js');
      }
      const readyReg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<ServiceWorkerRegistration>((res) => setTimeout(() => res(reg!), 3000)),
      ]);
      return readyReg || reg;
    } catch (err: any) {
      addDiagLog(`Error obtaining service worker registration: ${err.message || err}`);
      return null;
    }
  };

  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const fetchDevices = async () => {
    try {
      if (typeof window === 'undefined') return;
      const currentPerm = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported';
      addDiagLog(`fetchDevices() started. Origin: ${window.location.origin}, Notification.permission = "${currentPerm}"`);
      
      const reg = await getServiceWorkerRegistration();
      const sub = reg && reg.pushManager ? await reg.pushManager.getSubscription().catch(() => null) : null;
      const endpoint = sub ? sub.endpoint : '';

      setDiag((prev) => ({
        ...prev,
        origin: window.location.origin,
        notificationPermission: currentPerm,
        swSupported: 'serviceWorker' in navigator,
        swRegistrationExists: !!reg,
        swActive: !!reg?.active,
        swScope: reg?.scope || 'None',
        pushManagerExists: 'PushManager' in window,
        existingSubscription: !!sub,
        vapidKeyExists: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        vapidKeyLength: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.length || 0,
      }));

      const res = await fetch(`/api/admin/push-subscriptions${endpoint ? `?endpoint=${encodeURIComponent(endpoint)}` : ''}`);
      const statusText = `${res.status} ${res.statusText}`;
      addDiagLog(`GET /api/admin/push-subscriptions response: ${statusText}`);

      setDiag((prev) => ({ ...prev, getStatus: statusText }));
      const data = await res.json();

      if (data.devices) {
        setRegisteredDevices(data.devices);
      }

      // Calculate ON state: ON only if Notification.permission === 'granted' AND SW is active AND sub exists AND GET API confirms active === true
      const isDeviceActive = currentPerm === 'granted' && !!reg?.active && !!sub && !!data.active;
      setPushEnabled(isDeviceActive);
      addDiagLog(`Calculated device active status: ${isDeviceActive} (Perm: ${currentPerm}, SW Active: ${!!reg?.active}, Sub: ${!!sub}, API Active: ${!!data.active}), Total Admin Devices: ${data.devices?.length || 0}`);
    } catch (err: any) {
      addDiagLog(`fetchDevices() error: ${err.message || err}`);
      setPushEnabled(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSendTest = async () => {
    setTestLoading(true);
    try {
      const reg = await getServiceWorkerRegistration();
      const sub = reg && reg.pushManager ? await reg.pushManager.getSubscription().catch(() => null) : null;

      addDiagLog('Sending POST /api/admin/push-subscriptions/test...');
      const res = await fetch('/api/admin/push-subscriptions/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub ? sub.endpoint : undefined }),
      });

      const statusText = `${res.status} ${res.statusText}`;
      addDiagLog(`Test notification API response: ${statusText}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send test notification');
      }

      toast.success('🔔 Test notification sent! Check your device notifications.');
    } catch (err: any) {
      addDiagLog(`Test notification error: ${err.message || err}`);
      toast.error(err.message || 'Failed to send test notification');
    } finally {
      setTestLoading(false);
    }
  };

  const handleRemoveDevice = async (id: string) => {
    try {
      addDiagLog(`Removing device ID: ${id}`);
      const res = await fetch('/api/admin/push-subscriptions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove device');

      toast.info('Device subscription removed.');
      fetchDevices();
    } catch (err: any) {
      addDiagLog(`Remove device error: ${err.message || err}`);
      toast.error(err.message || 'Failed to remove device');
    }
  };

  const handleRefreshPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const currentPerm = Notification.permission;
    addDiagLog(`[REFRESH] Refreshing permission status. Current Notification.permission = "${currentPerm}"`);
    setDiag((prev) => ({ ...prev, notificationPermission: currentPerm }));

    if (currentPerm === 'granted') {
      toast.info('Permission is GRANTED! Registering push notifications...');
      fetchDevices();
    } else if (currentPerm === 'denied') {
      toast.error('Permission is still DENIED in Chrome settings. Please tap 🔒 icon in address bar to allow notifications.');
    } else {
      toast.info(`Permission status: ${currentPerm}`);
    }
  };

  const handleTogglePush = async () => {
    setPushLoading(true);
    setDiag((prev) => ({ ...prev, lastErrorName: 'None', lastErrorMessage: 'None' }));
    try {
      const currentOrigin = window.location.origin;
      const beforePerm = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported';
      addDiagLog(`[STEP 1] handleTogglePush started. Origin: ${currentOrigin}`);
      addDiagLog(`[STEP 2] BEFORE requestPermission: Notification.permission = "${beforePerm}"`);

      if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported on this browser/device.');
      }

      // Handle explicitly denied state directly
      if (beforePerm === 'denied') {
        addDiagLog('[STEP 3 BLOCKED] Notification.permission is "denied". Chrome blocks prompt automatically.');
        throw new Error('Notifications are blocked by Chrome. Tap the 🔒 icon next to the address bar -> Site Settings -> Notifications -> Allow, then tap Refresh Permission Status.');
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      addDiagLog(`[STEP 3] NEXT_PUBLIC_VAPID_PUBLIC_KEY present: ${!!vapidPublicKey} (length: ${vapidPublicKey?.length || 0})`);

      if (!vapidPublicKey) {
        throw new Error('VAPID Public Key is missing in environment variables.');
      }

      if (pushEnabled) {
        addDiagLog('[STEP 4] Disabling notifications (Unsubscribing)...');
        const reg = await getServiceWorkerRegistration();
        const sub = reg ? await reg.pushManager.getSubscription().catch(() => null) : null;
        if (sub) {
          await sub.unsubscribe().catch(() => {});
          const res = await fetch('/api/admin/push-subscriptions', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
          addDiagLog(`[STEP 5] DELETE subscription response: ${res.status}`);
        }
        setPushEnabled(false);
        toast.info('Admin push notifications disabled for this device.');
        fetchDevices();
      } else {
        let permission = beforePerm;
        if (permission !== 'granted') {
          addDiagLog('[STEP 4] Calling Notification.requestPermission() directly from button click...');
          permission = await Notification.requestPermission();
          addDiagLog(`[STEP 5] Notification.requestPermission() returned: "${permission}"`);
          setDiag((prev) => ({ ...prev, notificationPermission: permission }));
        } else {
          addDiagLog('[STEP 4] Notification.permission is already "granted". Continuing registration...');
        }

        if (permission !== 'granted') {
          throw new Error(`Notification permission returned "${permission}". Notifications are blocked in Chrome site settings.`);
        }

        addDiagLog('[STEP 6] Permission GRANTED! Obtaining Service Worker registration...');
        const reg = await getServiceWorkerRegistration();
        if (!reg) {
          throw new Error('Service Worker registration is not active on this device.');
        }

        addDiagLog(`[STEP 7] ServiceWorker registration active: ${!!reg.active}, scope: ${reg.scope}`);
        const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

        let sub = await reg.pushManager.getSubscription().catch(() => null);
        if (!sub) {
          addDiagLog('[STEP 8] Calling pushManager.subscribe()...');
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey as any,
          });
          addDiagLog('[STEP 9] pushManager.subscribe() SUCCEEDED!');
        } else {
          addDiagLog('[STEP 9] Existing pushManager subscription found.');
        }

        const subJson = sub.toJSON();
        addDiagLog('[STEP 10] Sending POST /api/admin/push-subscriptions...');

        const res = await fetch('/api/admin/push-subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: sub.endpoint,
            keys: subJson.keys,
            userAgent: navigator.userAgent,
          }),
        });

        const statusText = `${res.status} ${res.statusText}`;
        addDiagLog(`[STEP 11] POST /api/admin/push-subscriptions response: ${statusText}`);
        setDiag((prev) => ({ ...prev, postStatus: statusText }));

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to save push subscription on server.');
        }

        addDiagLog('[STEP 12] SUCCESS! Push subscription registered to admin account.');
        setPushEnabled(true);
        toast.success('🔔 Admin order push notifications enabled for this device!');
        fetchDevices();
      }
    } catch (err: any) {
      const errName = err.name || 'Error';
      const errMsg = err.message || String(err);
      addDiagLog(`[ERROR] ${errName}: ${errMsg}`);
      setDiag((prev) => ({ ...prev, lastErrorName: errName, lastErrorMessage: errMsg }));
      toast.error(errMsg);
    } finally {
      setPushLoading(false);
    }
  };

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
      toast.success('Restaurant configuration saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
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
      <div className="flex items-center gap-2 border-b border-amber-900/40 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {/* Tab 3: Notifications Section */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* SECTION 1: ORDER PUSH NOTIFICATIONS */}
          <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/30">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6 text-amber-500 shrink-0" />
                <div>
                  <h3 className="font-bebas text-2xl tracking-wider text-amber-100 uppercase">
                    ORDER PUSH NOTIFICATIONS
                  </h3>
                  <p className="text-xs text-amber-200/60 font-serif italic">
                    Receive instant notifications on this device whenever a new customer order is placed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                    pushEnabled
                      ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                      : 'bg-red-950/90 text-red-300 border-red-800'
                  }`}
                >
                  <span>{pushEnabled ? '🟢' : '🔴'}</span>
                  <span>{pushEnabled ? 'NOTIFICATIONS ENABLED' : 'NOTIFICATIONS OFF'}</span>
                </span>
              </div>
            </div>

            {diag.notificationPermission === 'denied' ? (
              <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl text-xs space-y-3">
                <div className="flex items-center space-x-2 text-red-300 font-bold text-sm">
                  <span>🚫</span>
                  <span>CHROME SITE NOTIFICATIONS ARE BLOCKED</span>
                </div>
                <p className="text-red-200/80 leading-relaxed text-[11px]">
                  Chrome has saved a <strong className="text-white">"Denied"</strong> permission for <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300">tawakal-bbq.vercel.app</code>. Browsers explicitly block websites from asking for permission programmatically once denied. You must manually change permission to <strong className="text-emerald-400 font-bold">Allow</strong> in Chrome settings.
                </p>

                <div className="bg-[#0b0705] p-3 rounded-lg border border-red-900/40 space-y-2 text-[11px]">
                  <span className="font-bold text-amber-300 block">📱 How to Unblock on Android Chrome:</span>
                  <ol className="list-decimal list-inside space-y-1 text-amber-200/90">
                    <li>Tap the <strong className="text-white">🔒 (Lock)</strong> or <strong className="text-white">Tune</strong> icon in the address bar next to <code className="text-amber-300 font-mono">tawakal-bbq.vercel.app</code>.</li>
                    <li>Tap <strong className="text-white">Permissions</strong> or <strong className="text-white">Site Settings</strong>.</li>
                    <li>Find <strong className="text-white">Notifications</strong> and select <strong className="text-emerald-400 font-bold">Allow</strong>.</li>
                    <li>Return here and tap <strong className="text-amber-300 font-bold">"Refresh Permission Status"</strong> below.</li>
                  </ol>
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRefreshPermission}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>🔄</span>
                    <span>Refresh Permission Status</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-300/80 bg-[#0d0907] p-3 rounded-xl border border-amber-900/30">
                {pushEnabled
                  ? '🟢 This device is registered to receive new-order alerts even when the admin dashboard is not currently open, where supported by the device/browser.'
                  : '🔴 Notifications for new orders are currently OFF for this device. Click "Enable Order Notifications" below to activate.'}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handleTogglePush}
                disabled={pushLoading}
                className={`px-6 py-3.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  pushEnabled
                    ? 'bg-red-950/80 border border-red-800 text-red-300 hover:bg-red-900/80'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>
                  {pushLoading
                    ? 'Processing...'
                    : pushEnabled
                    ? '🔕 DISABLE ORDER NOTIFICATIONS'
                    : '🔔 ENABLE ORDER NOTIFICATIONS'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSendTest}
                disabled={testLoading || !pushEnabled}
                className="px-5 py-3.5 rounded-xl border border-amber-800/50 bg-[#120c09] hover:bg-amber-950/40 text-amber-300 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🧪</span>
                <span>{testLoading ? 'Sending Test...' : 'Send Test Notification'}</span>
              </button>
            </div>

            {/* Live Diagnostic Dashboard */}
            <div className="pt-4 border-t border-amber-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛠️</span>
                  <span>PWA PUSH DIAGNOSTICS (LIVE RUNTIME)</span>
                </h4>
                <button
                  type="button"
                  onClick={fetchDevices}
                  className="text-[10px] text-amber-400/80 hover:text-amber-200 underline cursor-pointer"
                >
                  Refresh Diag
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">1. Origin</span>
                  <span className="text-amber-100 font-mono font-bold truncate block">{diag.origin || 'Unknown'}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">2. Notification.permission</span>
                  <span className={`font-mono font-bold ${diag.notificationPermission === 'granted' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {diag.notificationPermission}
                  </span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">3. SW Supported</span>
                  <span className="text-amber-100 font-mono font-bold">{diag.swSupported ? 'YES' : 'NO'}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">4. SW Reg Exists</span>
                  <span className="text-amber-100 font-mono font-bold">{diag.swRegistrationExists ? 'YES' : 'NO'}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">5. SW Active</span>
                  <span className="text-amber-100 font-mono font-bold">{diag.swActive ? 'YES' : 'NO'}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">6. SW Scope</span>
                  <span className="text-amber-100 font-mono font-bold truncate block">{diag.swScope}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">7. pushManager Exists</span>
                  <span className="text-amber-100 font-mono font-bold">{diag.pushManagerExists ? 'YES' : 'NO'}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">8. Existing Push Sub</span>
                  <span className="text-amber-100 font-mono font-bold">{diag.existingSubscription ? 'YES' : 'NO'}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">9. VAPID Public Key</span>
                  <span className="text-amber-100 font-mono font-bold">
                    {diag.vapidKeyExists ? `YES (${diag.vapidKeyLength} chars)` : 'MISSING'}
                  </span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">10. Last Error Name</span>
                  <span className="text-amber-100 font-mono font-bold">{diag.lastErrorName}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">11. Last Error Message</span>
                  <span className="text-amber-100 font-mono font-bold truncate block">{diag.lastErrorMessage}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">12. POST /push-subscriptions</span>
                  <span className="text-amber-100 font-mono font-bold">{diag.postStatus}</span>
                </div>

                <div className="p-2.5 bg-[#0a0705] border border-amber-900/30 rounded-lg sm:col-span-2 lg:col-span-3">
                  <span className="text-amber-200/50 block font-mono text-[9px] uppercase">13. GET /push-subscriptions</span>
                  <span className="text-amber-100 font-mono font-bold">{diag.getStatus}</span>
                </div>
              </div>

              {/* Real-time Diagnostic Log Console */}
              <div className="bg-[#050302] border border-amber-900/40 rounded-xl p-3 font-mono text-[10px] space-y-1 max-h-48 overflow-y-auto">
                <div className="text-amber-400 font-bold border-b border-amber-900/40 pb-1 flex justify-between">
                  <span>STEP-BY-STEP DIAGNOSTIC CONSOLE</span>
                  <button type="button" onClick={() => setDiagLogs([])} className="hover:text-amber-200 cursor-pointer">Clear</button>
                </div>
                {diagLogs.length === 0 ? (
                  <div className="text-amber-500/40 italic py-1">Click "Enable Order Notifications" to record step-by-step execution diagnostic logs.</div>
                ) : (
                  diagLogs.map((log, idx) => (
                    <div key={idx} className={log.includes('ERROR') ? 'text-red-400 font-bold' : log.includes('SUCCESS') || log.includes('GRANTED') ? 'text-emerald-400 font-bold' : 'text-amber-200/80'}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sub-Section: Registered Admin Devices */}
            <div className="pt-4 border-t border-amber-900/30 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                REGISTERED ADMIN DEVICES ({registeredDevices.length})
              </h4>

              {registeredDevices.length === 0 ? (
                <div className="text-xs text-amber-400/50 italic p-3 bg-[#0d0907] rounded-xl border border-amber-900/20">
                  No active push devices registered for your admin account.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {registeredDevices.map((dev) => {
                    const parsed = parseDeviceName(dev.userAgent);
                    return (
                      <div
                        key={dev.id}
                        className="p-3.5 bg-[#0d0907] border border-amber-900/30 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl">{parsed.icon}</span>
                          <div className="truncate">
                            <span className="font-bold text-amber-100 block truncate">
                              {parsed.name}
                            </span>
                            <span className="text-[10px] text-amber-400/60 block">
                              Registered: {new Date(dev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {dev.isCurrentDevice && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                              Current
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveDevice(dev.id)}
                            className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/40 text-red-300 hover:bg-red-900/60 transition-colors cursor-pointer"
                            title="Remove device subscription"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: SYSTEM / SOUND NOTIFICATIONS */}
          <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bebas text-xl tracking-wider text-amber-100 uppercase border-b border-amber-900/30 pb-2">
              SYSTEM / SOUND NOTIFICATIONS
            </h3>
            <p className="text-xs text-amber-200/70">
              In-browser audio chimes for new incoming orders on the active Admin Orders page are enabled by default.
            </p>
          </div>

          {/* SECTION 3: WHATSAPP NOTIFICATIONS */}
          <div className="bg-[#18110e] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bebas text-xl tracking-wider text-amber-100 uppercase border-b border-amber-900/30 pb-2">
              WHATSAPP NOTIFICATIONS
            </h3>
            <p className="text-xs text-amber-200/70">
              Instant customer WhatsApp confirmation links are generated automatically upon order placement.
            </p>
          </div>
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
                <span className="text-amber-100 font-bold">{currentUser?.email || '—'}</span>
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
