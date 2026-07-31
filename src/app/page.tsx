import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <Link
        href="/login"
        className="w-40 flex items-center justify-center h-11 rounded-lg bg-[#1e3a5f] text-white font-medium hover:bg-[#16293f] transition-colors"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="w-40 flex items-center justify-center h-11 rounded-lg border border-[#1e3a5f] text-[#1e3a5f] font-medium hover:bg-gray-100 transition-colors"
      >
        Register
      </Link>
    </div>
  );
}