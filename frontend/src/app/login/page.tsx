"use client";

import { useState } from "react";
import { login } from "@/services/auth";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRedirectPath = (role: string) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "user":
      default:
        return "/products";
    }
  };

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await login({ email, password });

      if (!res?.user) {
        throw new Error("Invalid login response");
      }

      // sync state
      setUser(res.user);

      // sync cookie (middleware auth)
      document.cookie = `token=${res.token}; path=/; max-age=86400`;

      // redirect by role
      const redirectPath = getRedirectPath(res.user.role);

      router.replace(redirectPath);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Login to your premku account
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded-md">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-3">

          <input
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-lg text-white text-sm font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 text-center mt-5">
          Don’t have an account?{" "}
          <a href="/register" className="text-black hover:underline">
            Register
          </a>
        </p>

      </div>

    </main>
  );
}