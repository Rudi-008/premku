"use client";

import { useState } from "react";
import { register } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await register({ name, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Register failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-8">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create account
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Join premku and start your subscription
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
            placeholder="Full name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            placeholder="Email address"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-lg text-white text-sm font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 text-center mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-black hover:underline">
            Login
          </a>
        </p>

      </div>

    </main>
  );
}