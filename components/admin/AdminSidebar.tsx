'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Calendar,
  Settings,
  LogOut,
  Flame,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Menu CMS', href: '/admin/menu', icon: UtensilsCrossed },
  { label: 'Deals CMS', href: '/admin/deals', icon: Tag },
  { label: 'Reservations', href: '/admin/reservations', icon: Calendar },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-[#140e0b] border-r border-amber-900/30 flex flex-col justify-between h-screen sticky top-0 z-40 text-amber-50">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-amber-900/30">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center shadow-lg shadow-amber-950/50">
              <Flame className="w-6 h-6 text-amber-100 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bebas text-2xl tracking-wider text-amber-50 leading-none">
                TAWAKAL <span className="text-amber-500">BBQ</span>
              </h2>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-400/60">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-inner'
                    : 'text-amber-200/70 hover:bg-amber-950/40 hover:text-amber-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-amber-400/60'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-amber-900/30 bg-[#0d0907]/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-red-950/30 border border-red-900/30 text-red-300 hover:bg-red-900/40 transition-colors text-xs font-semibold"
        >
          <span className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </span>
          <span className="text-[10px] bg-red-900/50 px-2 py-0.5 rounded text-red-200">
            SUPER_ADMIN
          </span>
        </button>
      </div>
    </aside>
  );
}
