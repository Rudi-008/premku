/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useAuth } from "@/store/auth";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/products");
      return;
    }

    setChecking(false);
  }, [user, loading, router]);


  /**
   * =========================
   * LOADING STATE (SAFE)
   * =========================
   */
  if (loading || checking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-sm text-gray-500">
          Checking permissions...
        </div>
      </div>
    );
  }

  /**
   * =========================
   * FINAL GUARD (SAFE RENDER)
   * =========================
   */
  if (!user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}