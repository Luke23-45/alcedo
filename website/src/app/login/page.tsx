"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (opts: {
            client_id: string;
            callback: (resp: { credential?: string }) => void;
          }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  useEffect(() => {
    // Already signed in? Go home.
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => {
        if (r.ok) router.replace("/account");
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onerror = () => {
      setError("Could not load Google sign-in. Check your connection and try again.");
    };
    script.onload = () => {
      window.google?.accounts.id.initialize({
        callback: async (resp) => {
          if (!resp.credential) {
            setError("Google did not return a credential. Please try again.");
            return;
          }
          setBusy(true);
          setError(null);
          try {
            const r = await fetch("/api/auth/google", {
              body: JSON.stringify({ idToken: resp.credential }),
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              method: "POST",
            });
            if (!r.ok) throw new Error("Sign-in failed.");
            router.replace("/account");
          } catch {
            setError("Sign-in failed. Please try again.");
          } finally {
            setBusy(false);
          }
        },
        client_id: clientId,
      });
      if (buttonRef.current) {
        window.google?.accounts.id.renderButton(buttonRef.current, {
          size: "large",
          text: "continue_with",
          theme: "filled_black",
          width: 320,
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, router]);

  return (
    <div className="flex min-h-full flex-col">
      <Nav />
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-10 text-center shadow-xl dark:border-white/10 dark:bg-white/5">
          <span className="brand-gradient mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white">
            A
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Welcome to Alcedo</h1>
          <p className="mt-3 leading-7 text-foreground/60">
            Sign in with your Google account — the same one you use in the app.
            Premium follows your account everywhere.
          </p>
          <div className="mt-8 flex justify-center">
            {!clientId ? (
              <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                Google sign-in is not configured yet. Set
                NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable it.
              </p>
            ) : (
              <div ref={buttonRef} className="min-h-[44px]" />
            )}
          </div>
          {busy && <p className="mt-4 text-sm text-foreground/50">Signing you in…</p>}
          {error && (
            <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}
          <p className="mt-8 text-xs leading-5 text-foreground/40">
            By continuing you agree to the{" "}
            <Link href="/privacy" className="underline hover:text-foreground/70">
              Privacy Policy
            </Link>
            . We only use your Google account to identify you — nothing else.
          </p>
        </div>
      </main>
    </div>
  );
}
