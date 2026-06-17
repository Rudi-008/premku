"use client";

import Link from "next/link";
import { useAuth } from "@/store/auth";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-white pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">

          <div className="inline-block px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full mb-6">
            SaaS Subscription Marketplace
          </div>

          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Premium Digital <br />
            <span className="text-gray-400">
              Subscription Hub
            </span>
          </h2>

          <p className="mt-6 text-gray-500 max-w-2xl mx-auto">
            Akses berbagai layanan digital premium dalam satu platform.
          </p>

          <div className="mt-10 flex gap-4 justify-center">

            <Link
              href="/products"
              className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-90 transition"
            >
              Explore Products
            </Link>

            <Link
              href="/billing"
              className="px-6 py-3 border rounded-xl hover:bg-gray-50 transition"
            >
              Manage Billing
            </Link>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">

          {[
            {
              title: "All Premium Tools",
              desc: "ChatGPT, Netflix, Spotify, dll",
            },
            {
              title: "Instant Access",
              desc: "Auto activation after payment",
            },
            {
              title: "Affordable Pricing",
              desc: "Cheaper than official subscription",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-6 hover:shadow-md transition"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-2">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

    </main>
  );
}