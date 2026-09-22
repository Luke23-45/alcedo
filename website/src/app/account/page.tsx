"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Nav } from "@/components/nav";
import { isMeResponse, type MeResponse } from "@/lib/me";

export default function AccountPage() {
  return (
    <Suspense>
      <AccountContent />
    </Suspense>
  );
}

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded") === "1";
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalBusy, setPortalBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => {
        if (!r.ok) {
          router.replace("/login");
          return null;
        }
        return r.json();
      })
      .then((data: unknown) => {
        // A malformed session payload is treated as signed-out, never rendered.
        if (data === null) return;
        if (!isMeResponse(data)) {
          router.replace("/login");
          return;
        }
        setMe(data);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function signOut() {
    await fetch("/api/auth/me", { credentials: "include", method: "DELETE" }).catch(() => {});
    router.replace("/");
  }

  async function openPortal() {
    setPortalBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/billing/status", {
        credentials: "include",
        method: "POST",
      });
      const data = (await r.json()) as { url?: string | null; error?: string };
      if (!r.ok || !data.url) {
        throw new Error(data.error ?? "No subscription to manage yet.");
      }
      // Full-page redirect to the Stripe Customer Portal (external URL).
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open the billing portal.");
      setPortalBusy(false);
    }
  }

  const isPremium = me?.premium.status === "active";

  return (
    <div className="flex min-h-full flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        {upgraded && me?.premium.status === "active" && (
          <div className="mb-8 rounded-2xl bg-green-500/10 p-6 text-center">
            <p className="text-lg font-semibold text-green-700 dark:text-green-300">
              Welcome to Premium 🎉
            </p>
            <p className="mt-2 text-sm text-green-700/80 dark:text-green-300/80">
              Your purchase is tied to your Google account — open the Alcedo app
              signed in with the same account and premium unlocks automatically.
            </p>
          </div>
        )}
        {upgraded && me && me.premium.status !== "active" && (
          <div className="mb-8 rounded-2xl bg-foreground/5 p-6 text-center">
            <p className="text-lg font-semibold">Confirming your subscription…</p>
            <p className="mt-2 text-sm text-foreground/60">
              Your payment went through — we&apos;re confirming it now. This
              usually takes a moment; refresh this page shortly.
            </p>
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight">Account</h1>
        {loading ? (
          <div className="mt-8 space-y-4">
            <div className="h-20 animate-pulse rounded-2xl bg-foreground/5" />
            <div className="h-40 animate-pulse rounded-2xl bg-foreground/5" />
          </div>
        ) : me ? (
          <div className="mt-8 space-y-6">
            {/* Identity */}
            <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              {me.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={me.picture} alt={me.name ?? "Profile picture"} className="h-14 w-14 rounded-full" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/10 text-xl font-bold">
                  {(me.name ?? me.email ?? "?")[0].toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-lg font-semibold">{me.name ?? "Alcedo user"}</p>
                <p className="text-sm text-foreground/50">{me.email}</p>
              </div>
            </div>

            {/* Premium status */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Premium</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                    isPremium
                      ? "bg-green-500/15 text-green-700 dark:text-green-300"
                      : "bg-foreground/10 text-foreground/60"
                  }`}
                >
                  {isPremium ? "Active" : me.premium.status}
                </span>
              </div>
              {isPremium ? (
                <div className="mt-4">
                  <p className="text-sm text-foreground/60">
                    {me.premium.source === "stripe" && me.premium.expiresAt
                      ? `Renews ${new Date(me.premium.expiresAt).toLocaleDateString()}`
                      : me.premium.source === "revenuecat"
                        ? "Active via app store purchase"
                        : "Active"}
                  </p>
                  {me.premium.source === "stripe" ? (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={openPortal}
                        disabled={portalBusy}
                        className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-black/30 disabled:opacity-50 dark:border-white/15 dark:hover:border-white/30"
                      >
                        {portalBusy ? "Opening…" : "Manage subscription"}
                      </button>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-foreground/60">
                      {me.premium.source === "revenuecat"
                        ? "Your subscription is billed through the app store — manage or cancel it in the Alcedo app."
                        : "Contact support to manage this subscription."}
                    </p>
                  )}
                  {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-foreground/60">
                    You&apos;re on the free plan. Upgrade to unlock the full AI coach,
                    unlimited programs, and premium everywhere.
                  </p>
                  <Link
                    href="/pricing"
                    className="brand-gradient mt-4 inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    Go Premium
                  </Link>
                </div>
              )}
            </div>

            {/* Admin link */}
            {me.isAdmin && (
              <Link
                href="/admin"
                className="block rounded-2xl border border-black/5 bg-white p-6 transition-colors hover:border-black/15 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25"
              >
                <h2 className="text-lg font-semibold">Admin</h2>
                <p className="mt-1 text-sm text-foreground/60">
                  Configure the AI coach, providers, billing, and users.
                </p>
              </Link>
            )}

            <button
              onClick={signOut}
              className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-foreground/70 transition-colors hover:border-black/30 hover:text-foreground dark:border-white/15 dark:hover:border-white/30"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
