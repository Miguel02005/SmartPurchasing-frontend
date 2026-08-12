"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";
import { registerVendor } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await registerVendor({
        name,
        email,
        password,
        accountNumber: "TEMP-" + Math.random().toString(36).substring(2, 9),
        creditRating: 3,
        preferredVendorStatus: true,
        activeFlag: true,
      });

      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full h-12 rounded-xl border border-slate-200 pl-11 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors";
  const inputIcon = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none";

  return (
    <div className="min-h-screen flex bg-white fixed w-full">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0a1830] via-[#0f2b52] to-[#164b8a]">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16 py-20 w-full">
          <span className="text-xs font-semibold tracking-[0.25em] text-blue-300 mb-4">
            SMARTPURCHASING
          </span>
          <h1 className="text-4xl font-bold text-white leading-tight max-w-md">
            Create your vendor account and start managing orders today.
          </h1>

          <div className="relative mt-16 h-64">
            <div
              className="float-card absolute left-0 top-0 bg-white rounded-2xl shadow-2xl p-4 w-56"
              style={{ ["--rot" as string]: "-6deg" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
                <Package className="w-4 h-4 text-blue-600" />
                Purchase Order
              </div>
              <p className="text-2xl font-bold text-slate-900">$12,450</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Approved · PO-4521</p>
            </div>

            <div
              className="float-card float-card-delay-1 absolute left-40 top-16 bg-white rounded-2xl shadow-2xl p-4 w-52"
              style={{ ["--rot" as string]: "3deg" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Active Vendors
              </div>
              <p className="text-2xl font-bold text-slate-900">128</p>
              <p className="text-xs text-blue-600 font-medium mt-1">+6 this month</p>
            </div>

          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#164b8a] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">SmartPurchasing</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
              <div className="relative">
                <User className={inputIcon} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={inputBase}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className={inputIcon} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={inputBase}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>

              <div className="relative">
                <Lock className={inputIcon} />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputBase} pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm password
              </label>

              <div className="relative">
                <ShieldCheck className={inputIcon} />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputBase} pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar confirmación de contraseña"
                      : "Mostrar confirmación de contraseña"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-10 rounded-xl bg-[#164b8a] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#0f3a6e] transition-colors disabled:opacity-60"
            >
              {loading ? "Creando cuenta..." : "Sign up"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
