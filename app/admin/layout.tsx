import type { Metadata } from 'next';
import { headers } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin Control Center',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // If login page, don't show sidebar shell
  if (pathname.includes('/admin/login')) {
    return <main className="min-h-screen bg-[#0d0907]">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#0d0907] flex text-amber-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-amber-900/30 bg-[#140e0b]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
          <h1 className="font-bebas text-2xl tracking-wider text-amber-100">
            TAWAKAL <span className="text-amber-500">MANAGEMENT SYSTEM</span>
          </h1>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-2 text-xs text-amber-300/80 bg-amber-950/60 px-3 py-1.5 rounded-full border border-amber-800/40">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live Engine Connected</span>
            </span>
          </div>
        </header>
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
