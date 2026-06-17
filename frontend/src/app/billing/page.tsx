"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMySubscriptions } from "@/services/subscription";
import { getInvoices } from "@/services/billing";
import { useAuth } from "@/store/auth";

import Navbar from "@/components/layout/Navbar"; // 🔥 reuse component

export default function BillingPage() {
  const { user } = useAuth();

  const [subs, setSubs] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH DATA
  // ======================
  useEffect(() => {
    const load = async () => {
      try {
        const [s, i] = await Promise.all([
          getMySubscriptions(),
          getInvoices(),
        ]);

        setSubs(s || []);
        setInvoices(i || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ======================
  // LOADING STATE
  // ======================
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 animate-pulse">
          Loading billing...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* ======================
          GLOBAL NAVBAR (REUSE)
      ====================== */}
      <Navbar />

      {/* ======================
          CONTENT WRAPPER
      ====================== */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* HEADER */}
        <section>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Subscriptions
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your active plans and payment history
          </p>
        </section>

        {/* ACTIVE SUBSCRIPTIONS */}
        <section className="space-y-4">

          <h2 className="text-lg font-semibold">
            Active Plans
          </h2>

          {subs.length === 0 ? (
            <div className="bg-white border rounded-xl p-6 text-sm text-gray-500">
              No active subscriptions
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">

              {subs.map((s) => {
                const expiry = new Date(s.endDate);
                const daysLeft = Math.ceil(
                  (expiry.getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={s._id}
                    className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >

                    <h3 className="font-semibold text-lg">
                      {s.productId?.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Expires: {expiry.toLocaleDateString()}
                    </p>

                    <span
                      className={`inline-block mt-3 text-xs px-2 py-1 rounded-full ${
                        daysLeft > 5
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {daysLeft} days left
                    </span>

                  </div>
                );
              })}

            </div>
          )}
        </section>

        {/* PAYMENT HISTORY */}
        <section className="space-y-4">

          <h2 className="text-lg font-semibold">
            Payment History
          </h2>

          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-3">
                      {inv.productId?.name}
                    </td>

                    <td className="p-3 font-medium">
                      Rp {inv.amount.toLocaleString("id-ID")}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-600"
                            : inv.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </section>

      </div>

    </main>
  );
}