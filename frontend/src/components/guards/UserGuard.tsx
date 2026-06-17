"use client";

import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserGuard({
  children,
}: {
  children: React.ReactNode;
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

    setChecking(false);
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Checking authentication...
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}