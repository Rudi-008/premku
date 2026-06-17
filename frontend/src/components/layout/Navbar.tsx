"use client";

import Link from "next/link";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      // optional: call backend logout (recommended)
      await fetch("https://premku-production.up.railway.app/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // clear zustand state
      setUser(null);

      // force redirect
      router.replace("/login");
      router.refresh();
    } catch (err) {
      // fallback logout (force local clear)
      setUser(null);
      document.cookie = "token=; Max-Age=0; path=/";
      router.replace("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b">

      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* BRAND */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:opacity-80 transition"
        >
          premku
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-6 text-sm text-gray-600">

            <Link href="/" className="hover:text-black transition">
            Home
          </Link>

          <Link href="/products" className="hover:text-black transition">
            Products
          </Link>

          {user && (
            <Link href="/billing" className="hover:text-black transition">
              Billing
            </Link>
          )}

          {/* AUTH STATE */}
          {!user ? (
            <Link
              href="/login"
              className="px-3 py-1 border rounded-md hover:bg-gray-50 transition"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">

              {/* USER BADGE */}
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {user.name}
              </span>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="px-3 py-1 border rounded-md hover:bg-gray-50 transition"
              >
                Logout
              </button>

            </div>
          )}

        </nav>

      </div>

    </header>
  );
}