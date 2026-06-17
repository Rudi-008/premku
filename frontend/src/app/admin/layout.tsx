"use client";

import Link from "next/link";
import { useAuth } from "@/store/auth";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("https://premku-production.up.railway.app/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      router.replace("/login");
    } catch {
      setUser(null);
      document.cookie = "token=; Max-Age=0; path=/";
      router.replace("/login");
    }
  };

  const linkClass = (path: string) =>
    `p-2 rounded-md text-sm transition flex items-center gap-2
     ${
       pathname === path
         ? "bg-gray-100 font-medium text-black"
         : "text-gray-600 hover:bg-gray-50 hover:text-black"
     }`;

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r px-4 py-6 flex flex-col">

        {/* BRAND */}
        <div className="text-xl font-bold mb-8 tracking-tight">
          premku admin
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2 text-sm flex-1">

          <Link href="/admin" className={linkClass("/admin")}>
            📊 Dashboard
          </Link>

          <Link href="/admin/products" className={linkClass("/admin/products")}>
            📦 Products
          </Link>

          <Link href="/admin/orders" className={linkClass("/admin/orders")}>
            🧾 Orders
          </Link>


        </nav>

        {/* USER INFO */}
        <div className="mt-6 border-t pt-4">

          <div className="text-xs text-gray-500 mb-3">
            Logged in as
          </div>

          <div className="text-sm font-semibold mb-4">
            {user?.name}
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm border rounded-md hover:bg-red-50 hover:text-red-600 transition"
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}