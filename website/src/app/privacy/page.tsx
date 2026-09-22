import Link from "next/link";
import { Nav } from "@/components/nav";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-foreground/50">Last updated: September 2026</p>
        <div className="prose-sm mt-8 space-y-6 leading-7 text-foreground/70">
          <section>
            <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
            <p className="mt-2">
              When you sign in with Google, we receive your Google account
              identifier, email address, name, and profile picture. Your workouts
              stay on your device — the app is offline-first and only syncs what
              you choose to back up.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">Purchases</h2>
            <p className="mt-2">
              Premium purchases on this site are processed by Stripe. We never
              see or store your card details. We store which Google account holds
              an active premium entitlement and when it expires, so the mobile
              app can unlock premium for the same account.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">AI coach</h2>
            <p className="mt-2">
              If you use the AI coach, your messages are processed by our
              self-hosted AI gateway to generate coaching responses. We do not
              sell your data or use it for advertising.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">Your control</h2>
            <p className="mt-2">
              Sign out anytime from your{" "}
              <Link href="/account" className="underline hover:text-foreground">
                account page
              </Link>
              . To delete your account and data, contact us and we will remove
              everything tied to your Google account identifier.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
