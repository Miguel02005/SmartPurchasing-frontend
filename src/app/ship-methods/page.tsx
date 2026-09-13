'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Search, AlertCircle } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { getToken } from '@/services/auth.service';
import { useShipMethodStore } from '@/store/ship-method.store';
import ShipMethodTable from '@/components/ShipMethodTable';
import AppHeader from '@/components/AppHeader';

export default function ShipMethodsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { shipMethods, loading, error, fetchShipMethods } = useShipMethodStore();

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = getToken();
    if (!token) return;
    fetchShipMethods(token);
  }, [isAuthenticated, fetchShipMethods]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return shipMethods;
    return shipMethods.filter((sm) =>
      sm.name.toLowerCase().includes(term),
    );
  }, [shipMethods, search]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Cargando SmartPurchasing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-10">
          {/* HERO */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Truck className="w-4 h-4 text-blue-800" />
              </div>
              <span className="text-xs font-semibold tracking-[0.18em] text-blue-800 uppercase">
                Métodos de envío
              </span>
            </div>
            <p className="mt-2 text-slate-500 max-w-xl">
              Catálogo de métodos de envío disponibles para tus órdenes de
              compra.
            </p>
          </section>

          {/* BUSCADOR */}
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar método de envío..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>

          {/* LISTADO */}
          <section>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">
                  Métodos disponibles
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {filtered.length}{' '}
                  {filtered.length === 1 ? 'resultado' : 'resultados'}
                </p>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="py-16 flex flex-col items-center justify-center">
                    <p className="text-sm text-slate-500">
                      Cargando métodos de envío...
                    </p>
                  </div>
                ) : error ? (
                  <div className="py-10 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <Truck className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="mt-4 font-semibold text-slate-800">
                      Sin resultados
                    </h3>
                    <p className="mt-1 text-sm text-slate-400 max-w-sm">
                      No encontramos métodos de envío que coincidan con tu
                      búsqueda.
                    </p>
                  </div>
                ) : (
                  <ShipMethodTable shipMethods={filtered} />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
