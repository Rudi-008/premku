"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/admin";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getAnalytics().then(setData);
  }, []);

  if (!data) {
  return (
    <div className="space-y-6">

      {/* HEADER SKELETON */}
      <Skeleton className="h-8 w-64" />

      {/* STATS SKELETON */}
      <div className="grid md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      {/* RECENT ORDERS SKELETON */}
      <div className="bg-white border rounded-xl p-4 space-y-3">
        <Skeleton className="h-5 w-40" />

        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

    </div>
  );
}

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Dashboard Overview
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-xl font-bold">
            Rp {data.totalRevenue.toLocaleString("id-ID")}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Orders</p>
          <h2 className="text-xl font-bold">
            {data.totalOrders}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Active Subs
          </p>
          <h2 className="text-xl font-bold">
            {data.activeSubscriptions}
          </h2>
        </div>

      </div>

      {/* RECENT */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">
          Recent Orders
        </h2>

        <div className="space-y-3">
          {data.recentOrders.map((o: any) => (
            <div
              key={o._id}
              className="flex justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">
                  {o.productId?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {o.userId?.name} • {o.status}
                </p>
              </div>

              <div className="font-semibold">
                Rp {o.amount.toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}