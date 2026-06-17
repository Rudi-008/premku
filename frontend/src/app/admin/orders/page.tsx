"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "@/services/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatus = async (id: string, status: string) => {
    await updateOrder(id, status);
    fetchData();
  };

  const filtered = orders.filter((o) =>
    o.productId?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Order Management
        </h1>
        <p className="text-gray-500 text-sm">
          All transactions overview
        </p>
      </div>

      {/* SEARCH */}
      <input
        className="border p-2 w-full rounded"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr key={o._id} className="border-t">

                {/* USER */}
                <td className="p-3">
                  <div className="font-medium">
                    {o.userId?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {o.userId?.email}
                  </div>
                </td>

                {/* PRODUCT */}
                <td className="p-3">
                  {o.productId?.name}
                </td>

                {/* AMOUNT */}
                <td className="p-3 font-semibold">
                  Rp {o.amount.toLocaleString("id-ID")}
                </td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      o.status === "paid"
                        ? "bg-green-100 text-green-600"
                        : o.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-3 text-right space-x-2">

                  <button
                    onClick={() =>
                      handleStatus(o._id, "paid")
                    }
                    className="text-green-600 text-sm"
                  >
                    Mark Paid
                  </button>

                  <button
                    onClick={() =>
                      handleStatus(o._id, "failed")
                    }
                    className="text-red-500 text-sm"
                  >
                    Cancel
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}