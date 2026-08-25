'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Package, LogOut, Boxes, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Productos', icon: Boxes },
  { href: '/purchase-orders', label: 'Órdenes de compra', icon: ClipboardList },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Fila superior: logo + usuario */}
        <div className="h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#164b8a] flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-none">
                SmartPurchasing
              </p>
              <p className="text-xs text-slate-400 mt-1">Gestión de compras</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-800">
                {user?.email || 'Usuario'}
              </p>
              <p className="text-xs text-slate-400">Cuenta empresarial</p>
            </div>

            <button
              onClick={handleLogout}
              className="
                w-10 h-10
                rounded-xl
                border border-slate-200
                bg-white
                flex items-center justify-center
                text-slate-500
                hover:text-red-600
                hover:border-red-100
                hover:bg-red-50
                transition-all
              "
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fila de navegación por pestañas */}
        <nav className="flex items-center gap-1 -mb-px">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  inline-flex items-center gap-2
                  px-4 py-3
                  text-sm font-medium
                  border-b-2
                  transition-colors
                  ${
                    isActive
                      ? 'border-[#164b8a] text-[#164b8a]'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
