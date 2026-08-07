"use client";

import { Package, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
    logout();
    router.push("/");
    };

    return (
    <main className="min-h-screen bg-gray-50">
        <header className="bg-[#1e3a5f] text-white shadow">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            <h1 className="text-xl font-bold">
                SmartPurchasing
            </h1>
            </div>

            <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-[#1e3a5f] px-4 py-2 rounded-lg hover:bg-gray-100"
            >
            <LogOut className="w-4 h-4" />
            Logout
            </button>
        </div>
        </header>

        <section className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-3xl font-bold text-gray-800">
            Bienvenido al Dashboard
            </h2>

            <p className="mt-3 text-gray-600">
            Has iniciado sesión correctamente.
            </p>
        </div>
        </section>
    </main>
    );
}
