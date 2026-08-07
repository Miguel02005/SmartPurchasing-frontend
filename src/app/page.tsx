import Link from "next/link";
import {
  Package,
  Building2,
  Truck,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white fixed w-full">
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#164b8a] flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">SmartPurchasing</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-[#164b8a] text-white px-4 py-2 rounded-lg hover:bg-[#0f3a6e] transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden dot-grid bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-40 md:pb-56 text-center relative">
          {/* Floating cards */}
          <div
            className="float-card hidden lg:block absolute left-0 top-4 bg-amber-50 border border-amber-100 rounded-2xl shadow-lg p-4 w-56 text-left"
            style={{ ["--rot" as string]: "-6deg" } as React.CSSProperties}
          >
            <p className="text-sm text-amber-900 leading-snug">
              Registra proveedores y aprueba órdenes de compra en minutos.
            </p>
            <div className="mt-3 w-7 h-7 rounded-lg bg-[#164b8a] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div
            className="float-card float-card-delay-1 hidden lg:block absolute right-0 top-5 bg-white rounded-2xl shadow-xl p-4 w-56 text-left"
            style={{ ["--rot" as string]: "4deg" } as React.CSSProperties}
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
              <Package className="w-4 h-4 text-blue-600" />
              Purchase Order
            </div>
            <p className="text-xl font-bold text-slate-900">$12,450</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Approved · PO-4521</p>
          </div>

          <div
            className="float-card float-card-delay-2 hidden lg:block absolute left-6 bottom-35 bg-white rounded-2xl shadow-xl p-4 w-60 text-left"
            style={{ ["--rot" as string]: "-3deg" } as React.CSSProperties}
          >
            <p className="text-xs font-semibold text-slate-400 mb-3">Proveedores</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700">Distribuidora ABC</span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Activo
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Proveedora XYZ</span>
              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Pendiente
              </span>
            </div>
          </div>

          <div
            className="float-card hidden lg:block absolute right-4 bottom-30 bg-white rounded-2xl shadow-xl p-4 w-56 text-left"
            style={{ ["--rot" as string]: "5deg" } as React.CSSProperties}
          >
            <p className="text-xs font-semibold text-slate-400 mb-3">3 módulos conectados</p>
            <div className="flex gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Contenido central */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl bg-[#164b8a] flex items-center justify-center mb-6 shadow-lg shadow-blue-900/10">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>

            <span className="text-xs font-semibold tracking-[0.25em] text-blue-600 mb-3">
              SMARTPURCHASING
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight max-w-2xl">
              Organiza, aprueba y{" "}
              <span className="text-slate-400">rastrea tus órdenes de compra</span>
            </h1>

            <p className="mt-5 text-slate-500 max-w-md">
              Administra proveedores y órdenes de compra en un solo lugar.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="h-11 px-6 rounded-lg bg-[#164b8a] text-white font-medium flex items-center justify-center hover:bg-[#0f3a6e] transition-colors"
              >
                Crear cuenta
              </Link>
              <Link
                href="/login"
                className="h-11 px-6 rounded-lg border border-slate-200 text-slate-700 font-medium flex items-center justify-center hover:bg-white transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
