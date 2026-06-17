"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { createOrder, payOrder } from "@/services/checkout";
import { getMySubscriptions } from "@/services/subscription";
import { useAuth } from "@/store/auth";
import Navbar from "@/components/layout/Navbar";

type PaymentMethod = "qris" | "transfer" | null;

export default function ProductsPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [buyingId, setBuyingId] = useState<string | null>(null);

  // ======================
  // MODAL STATE
  // ======================
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [success, setSuccess] = useState(false);

  // ======================
  // FETCH DATA
  // ======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, subRes] = await Promise.all([
          api.get("/products"),
          getMySubscriptions(),
        ]);

        setProducts(prodRes.data || []);
        setSubs(subRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ======================
  // CHECK SUBSCRIPTION
  // ======================
  const isSubscribed = (productId: string) => {
    return subs?.some((s) => s?.productId?._id === productId);
  };

  // ======================
  // OPEN MODAL
  // ======================
  const openPaymentModal = (product: any) => {
    setSelectedProduct(product);
    setPaymentMethod(null);
    setSuccess(false);
    setOpenModal(true);
  };

  // ======================
  // CONFIRM PAYMENT
  // ======================
  const handleConfirmPayment = async () => {
    if (!selectedProduct || !paymentMethod) return;

    try {
      setBuyingId(selectedProduct._id);

      const order = await createOrder(selectedProduct._id);
      await payOrder(order._id);

      // refresh subscription
      const updatedSubs = await getMySubscriptions();
      setSubs(updatedSubs || []);

      // success animation
      setSuccess(true);

      setTimeout(() => {
        setOpenModal(false);
        setSelectedProduct(null);
        setSuccess(false);
      }, 1800);

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setBuyingId(null);
    }
  };

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 animate-pulse">
          Loading products...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Premium Catalog
          </h1>
          <p className="text-gray-500 mt-1">
            Choose your subscription plan
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {products.map((p) => {
            const subscribed = isSubscribed(p._id);

            return (
              <div
                key={p._id}
                className="bg-white border rounded-2xl p-6 shadow-sm"
              >
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                  {p.category}
                </span>

                <h2 className="text-lg font-semibold mt-3">
                  {p.name}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {p.description}
                </p>

                <div className="mt-5 text-xl font-bold">
                  Rp {p.price.toLocaleString("id-ID")}
                </div>

                {subscribed && (
                  <div className="mt-3">
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Active Plan
                    </span>
                  </div>
                )}

                <button
                  onClick={() => openPaymentModal(p)}
                  disabled={subscribed}
                  className={`mt-6 w-full py-2.5 rounded-lg text-sm font-medium transition ${
                    subscribed
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {subscribed ? "Already Subscribed" : "Buy Now"}
                </button>

              </div>
            );
          })}

        </div>
      </div>

      {/* ======================
          PAYMENT MODAL
      ====================== */}
      {openModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl relative">

            {/* SUCCESS STATE */}
            {success ? (
              <div className="text-center py-10 animate-pulse">
                <div className="text-green-500 text-5xl">✔</div>
                <h2 className="mt-4 font-semibold text-lg">
                  Payment Success
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Subscription activated
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">
                  Confirm Payment
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedProduct.name}
                </p>

                <div className="mt-4 text-xl font-bold">
                  Rp {selectedProduct.price.toLocaleString("id-ID")}
                </div>

                {/* PAYMENT METHOD */}
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-medium">
                    Payment Method
                  </p>

                  <button
                    onClick={() => setPaymentMethod("qris")}
                    className={`w-full border rounded-lg p-2 text-sm ${
                      paymentMethod === "qris"
                        ? "border-indigo-600 bg-indigo-50"
                        : ""
                    }`}
                  >
                    QRIS Payment
                  </button>

                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className={`w-full border rounded-lg p-2 text-sm ${
                      paymentMethod === "transfer"
                        ? "border-indigo-600 bg-indigo-50"
                        : ""
                    }`}
                  >
                    Bank Transfer
                  </button>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="w-1/2 border rounded-lg py-2 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={!paymentMethod || buyingId !== null}
                    className="w-1/2 bg-indigo-600 text-white rounded-lg py-2 text-sm disabled:opacity-50"
                  >
                    {buyingId ? "Processing..." : "Buy"}
                  </button>
                </div>
              </>
            )}

          </div>

        </div>
      )}

    </main>
  );
}