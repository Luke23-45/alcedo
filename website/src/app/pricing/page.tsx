"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Nav } from "@/components/nav";

interface Plan {
  id: string;
  priceId: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
}

function isPlan(value: unknown): value is Plan {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.priceId === "string" &&
    typeof p.name === "string" &&
    typeof p.amount === "number" &&
    Number.isFinite(p.amount) &&
    typeof p.currency === "string" &&
    typeof p.interval === "string"
  );
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    currency: currency.toUpperCase(),
    style: "currency",
  }).format(amount / 100);
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "1";
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [pricesLoading, setPricesLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => setSignedIn(r.ok))
      .catch(() => setSignedIn(false));
    // Public plan catalog from the backend — prices come from Stripe,
    // never invented by the site. Malformed entries are dropped.
    fetch("/api/billing/plans")
      .then((r) => (r.ok ? r.json() : { plans: [] }))
      .then((d: unknown) => {
        const list = (d as { plans?: unknown })?.plans;
        setPlans(Array.isArray(list) ? list.filter(isPlan) : []);
      })
      .catch(() => setPlans([]))
      .finally(() => setPricesLoading(false));
  }, []);

  async function checkout(priceId: string, planId: string) {
    if (!signedIn) {
      router.push("/login");
      return;
    }
    setBusy(planId);
    setError(null);
    try {
      const r = await fetch("/api/billing/checkout", {
        body: JSON.stringify({ priceId }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await r.json()) as { url?: string; error?: string };
      if (!r.ok || !data.url) throw new Error(data.error ?? "Checkout failed.");
      // Full-page redirect to Stripe Checkout (external URL, not a Next route).
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
      setBusy(null);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Premium</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/60">
            One purchase unlocks premium on the web and in the app — tied to your
            Google account, not your device.
          </p>
        </div>

        {cancelled && !error && (
          <p className="mx-auto mt-8 max-w-md rounded-xl bg-foreground/5 px-4 py-3 text-center text-sm text-foreground/70">
            Checkout was cancelled — no charge was made. Take your time.
          </p>
        )}

        {error && (
          <p className="mx-auto mt-8 max-w-md rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {pricesLoading ? (
            <>
              <div className="h-64 animate-pulse rounded-3xl bg-foreground/5" />
              <div className="h-64 animate-pulse rounded-3xl bg-foreground/5" />
            </>
          ) : plans.length === 0 ? (
            <p className="col-span-2 rounded-3xl border border-black/5 bg-white p-10 text-center text-foreground/60 dark:border-white/10 dark:bg-white/5">
              Plans are not configured yet. Premium billing is coming soon.
            </p>
          ) : (
            plans.map((plan) => {
              const featured = plan.id === "yearly";
              const perMonth =
                plan.interval === "year"
                  ? formatPrice(Math.round(plan.amount / 12), plan.currency)
                  : null;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl border p-8 ${
                    featured
                      ? "border-transparent bg-white shadow-2xl ring-2 ring-orange-500/60 dark:bg-white/5"
                      : "border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  {featured && (
                    <span className="brand-gradient absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                      Best value
                    </span>
                  )}
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  <p className="mt-4">
                    <span className="text-4xl font-bold tracking-tight">
                      {formatPrice(plan.amount, plan.currency)}
                    </span>
                    <span className="text-foreground/50">
                      {" "}
                      / {plan.interval === "year" ? "year" : "month"}
                    </span>
                  </p>
                  {perMonth && (
                    <p className="mt-1 text-sm text-foreground/50">
                      {perMonth} per month, billed annually
                    </p>
                  )}
                  <ul className="mt-6 space-y-3 text-sm text-foreground/70">
                    <li>✓ Full AI coach with all six skills</li>
                    <li>✓ Unlimited programs and history</li>
                    <li>✓ Premium in the mobile app, same account</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <button
                    onClick={() => checkout(plan.priceId, plan.id)}
                    disabled={busy !== null}
                    className={`mt-8 w-full rounded-full py-3.5 text-base font-semibold transition-transform active:scale-[0.98] disabled:opacity-50 ${
                      featured
                        ? "brand-gradient text-white shadow-xl hover:scale-[1.01]"
                        : "border border-black/15 hover:border-black/30 dark:border-white/15 dark:hover:border-white/30"
                    }`}
                  >
                    {busy === plan.id ? "Redirecting…" : `Choose ${plan.name}`}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-sm leading-6 text-foreground/50">
          Payments are processed securely by Stripe. Cancel anytime from your{" "}
          <Link href="/account" className="underline hover:text-foreground">
            account page
          </Link>{" "}
          — you keep premium until the end of the billing period.
        </p>
      </main>
    </div>
  );
}
