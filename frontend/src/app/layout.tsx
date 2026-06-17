"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initAuth = useAuth((s) => s.initAuth);

  const [hydrated, setHydrated] = useState(false);

  // ======================
  // AUTH INIT (SAFE HYDRATION)
  // ======================
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initAuth();
      } finally {
        setHydrated(true);
      }
    };

    bootstrap();
  }, [initAuth]);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">

        {/* GLOBAL APP WRAPPER */}
        <div className="min-h-screen flex flex-col">

          {/* OPTIONAL: GLOBAL LOADING GATE */}
          {!hydrated ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-sm text-slate-500 animate-pulse">
                Initializing session...
              </div>
            </div>
          ) : (
            <div className="flex-1">
              {children}
            </div>
          )}

        </div>

        {/* GLOBAL TOASTER */}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              fontSize: "13px",
            },
          }}
        />

      </body>
    </html>
  );
}