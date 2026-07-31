"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!agreed) {
      setError("Debes aceptar los términos para continuar");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Register attempt", { name, email, password });
      alert("Registro exitoso (simulado)");
    } catch (err) {
      setError("Error al registrar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper = "relative";
  const inputIcon = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4";
  const inputBase =
    "w-full h-11 rounded-lg border border-gray-300 pl-10 pr-3 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      {/* Header fuera de la card */}
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-[#1e3a5f]" />
        <span className="text-lg font-bold text-[#1e3a5f]">SmartPurchasing</span>
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <div className={inputWrapper}>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <div className={inputWrapper}>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className={inputWrapper}>
              <Lock className={inputIcon} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputBase}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <div className={inputWrapper}>
              <ShieldCheck className={inputIcon} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputBase}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-[#1e3a5f] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#16293f] transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#1e3a5f] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}