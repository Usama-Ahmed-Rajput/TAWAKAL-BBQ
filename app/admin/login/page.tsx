'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0907] flex items-center justify-center p-4 relative overflow-hidden text-amber-50">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#18110e]/90 backdrop-blur-md border border-amber-900/40 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Tawakal BBQ Official Logo"
            className="w-20 h-20 object-contain rounded-full border-2 border-amber-500/50 p-1 mx-auto mb-4 bg-[#0d0907] shadow-xl"
          />
          <h1 className="font-bebas text-4xl tracking-wider text-amber-50 drop-shadow">
            TAWAKAL <span className="text-amber-500">BBQ</span>
          </h1>
          <p className="text-sm font-serif italic text-amber-200/60 mt-1">
            Management Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/70 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="Enter admin email"
                className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl py-3 pl-11 pr-4 text-amber-100 placeholder-amber-900 focus:outline-none focus:border-amber-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/70 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#0d0907] border border-amber-900/50 rounded-xl py-3 pl-11 pr-4 text-amber-100 placeholder-amber-900 focus:outline-none focus:border-amber-500 transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center space-x-2 group disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-amber-900/30 text-center">
          <p className="text-xs text-amber-400/50">
            Protected Platform • Authorized Admin Access Only
          </p>
        </div>
      </div>
    </div>
  );
}
