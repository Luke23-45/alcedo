import Link from "next/link";
import { Nav } from "@/components/nav";

const features = [
  {
    title: "Offline-first, always",
    body: "Your workouts live on your device. The backend is a sync target, never a gate. No signal in the gym? Train anyway.",
  },
  {
    title: "An honest AI coach",
    body: "Six real coaching skills — program design, progression, form, nutrition, recovery, conditioning. Numbers carry the weight; never flattery.",
  },
  {
    title: "Premium follows you",
    body: "Buy once on the web with your Google account and premium unlocks in the app automatically. Same account, everywhere.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pt-32">
          <p className="mb-6 inline-block rounded-full border border-black/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/60 dark:border-white/10">
            The training app that respects your effort
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Train with <span className="brand-gradient-text">intent</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-foreground/60">
            Alcedo is the workout companion that treats you like an athlete, not a
            data point. Quiet, precise, and honest — the room you train in, not a
            poster on the wall.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="brand-gradient rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Go Premium
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-black/15 px-8 py-3.5 text-base font-semibold transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/30"
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-3 leading-7 text-foreground/60">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Premium CTA */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="brand-gradient rounded-3xl p-10 text-center text-white shadow-2xl sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              One account. Everywhere premium.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/85">
              Sign in with Google, pick a plan, and your phone unlocks the moment
              payment clears. No codes, no restores, no friction.
            </p>
            <Link
              href="/pricing"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              See plans
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-black/5 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-foreground/50">
          <span>© 2026 Alcedo. Train with intent.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
