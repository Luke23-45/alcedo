"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isMeResponse, type MeResponse } from "@/lib/me";

export function Nav() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: unknown) => setMe(isMeResponse(data) ? data : null))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/80 backdrop-blur-xl dark:border-white/10">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-white">
            A
          </span>
          <span className="text-lg font-semibold tracking-tight">Alcedo</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-foreground/10" />
          ) : me ? (
            <div className="flex items-center gap-3">
              {me.isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-full border border-black/10 py-1.5 pl-1.5 pr-4 transition-colors hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
              >
                {me.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={me.picture} alt="" className="h-6 w-6 rounded-full" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold">
                    {(me.name ?? me.email ?? "?")[0].toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium">{me.name ?? "Account"}</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="brand-gradient rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
