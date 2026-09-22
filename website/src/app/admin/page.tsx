"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";

interface ConfigEntry {
  key: string;
  value: string;
  secret: boolean;
  updatedAt: string | null;
}

function isConfigEntry(value: unknown): value is ConfigEntry {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.key === "string" &&
    typeof e.value === "string" &&
    typeof e.secret === "boolean" &&
    (e.updatedAt === null || typeof e.updatedAt === "string")
  );
}

interface AdminUser {
  googleSub: string;
  email: string | null;
  name: string | null;
  isAdmin: boolean;
  premium: { status: string; source: string | null; expiresAt: string | null };
}

function isAdminUser(value: unknown): value is AdminUser {
  if (typeof value !== "object" || value === null) return false;
  const u = value as Record<string, unknown>;
  const premium = u.premium as Record<string, unknown> | null;
  return (
    typeof u.googleSub === "string" &&
    (u.email === null || typeof u.email === "string") &&
    (u.name === null || typeof u.name === "string") &&
    typeof u.isAdmin === "boolean" &&
    typeof premium === "object" &&
    premium !== null &&
    typeof premium.status === "string"
  );
}

const SECTIONS: Array<{ title: string; prefix: string; hint: string }> = [
  {
    hint: "System prompt, skill instructions, guardrails, model alias.",
    prefix: "ai.",
    title: "AI coach",
  },
  {
    hint: "LiteLLM gateway and Mem0 base URLs and API keys.",
    prefix: "providers.",
    title: "Providers",
  },
  {
    hint: "Stripe publishable key, webhook secret, price IDs.",
    prefix: "billing.",
    title: "Billing",
  },
];

function formatUpdatedAt(updatedAt: string | null): string {
  if (!updatedAt) return "using default";
  const d = new Date(updatedAt);
  return Number.isNaN(d.getTime()) ? "using default" : d.toLocaleString();
}

export default function AdminPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ConfigEntry[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [roleBusy, setRoleBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/config", { credentials: "include" }),
      fetch("/api/admin/users?limit=50", { credentials: "include" }),
    ])
      .then(async ([configRes, usersRes]) => {
        if (configRes.status === 401 || configRes.status === 403) {
          // Not signed in, or signed in but not an admin.
          const me = await fetch("/api/auth/me", { credentials: "include" }).catch(() => null);
          if (!me || !me.ok) router.replace("/login");
          else setDenied(true);
          return;
        }
        // The backend wraps the entries: { config: [...] }.
        const configBody: unknown = await configRes.json().catch(() => null);
        const list = (configBody as { config?: unknown } | null)?.config;
        setEntries(Array.isArray(list) ? list.filter(isConfigEntry) : []);
        if (usersRes.ok) {
          const usersBody: unknown = await usersRes.json().catch(() => null);
          const userList = (usersBody as { users?: unknown } | null)?.users;
          setUsers(Array.isArray(userList) ? userList.filter(isAdminUser) : []);
        }
      })
      .catch(() => setDenied(true))
      .finally(() => setLoading(false));
  }, [router]);

  async function save(key: string) {
    const value = editing[key];
    if (value === undefined) return;
    setSaving(key);
    setNotice(null);
    try {
      const r = await fetch("/api/admin/config", {
        body: JSON.stringify({ key, value }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      if (!r.ok) throw new Error("Save failed.");
      setEntries((prev) =>
        prev.map((e) => (e.key === key ? { ...e, value: e.secret ? e.value : value } : e)),
      );
      setEditing((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setNotice(`Saved ${key}.`);
    } catch {
      setNotice(`Could not save ${key}.`);
    } finally {
      setSaving(null);
    }
  }

  async function setAdminFlag(user: AdminUser, admin: boolean) {
    setRoleBusy(user.googleSub);
    setNotice(null);
    try {
      const r = await fetch(`/api/admin/users/${encodeURIComponent(user.googleSub)}`, {
        body: JSON.stringify({ admin }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      const data = (await r.json().catch(() => null)) as { error?: string } | null;
      if (!r.ok) throw new Error(data?.error ?? "Could not update the admin flag.");
      setUsers((prev) =>
        prev.map((u) => (u.googleSub === user.googleSub ? { ...u, isAdmin: admin } : u)),
      );
      setNotice(`${user.email ?? user.googleSub} is ${admin ? "now" : "no longer"} an admin.`);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not update the admin flag.");
    } finally {
      setRoleBusy(null);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
        <p className="mt-2 text-foreground/60">
          Backend and AI configuration. Secrets are encrypted at rest and never
          shown in full.
        </p>

        {loading ? (
          <div className="mt-8 space-y-4">
            <div className="h-40 animate-pulse rounded-2xl bg-foreground/5" />
            <div className="h-40 animate-pulse rounded-2xl bg-foreground/5" />
          </div>
        ) : denied ? (
          <p className="mt-8 rounded-2xl bg-red-500/10 p-6 text-center text-red-700 dark:text-red-300">
            You don&apos;t have admin access.
          </p>
        ) : (
          <div className="mt-8 space-y-10">
            {notice && (
              <p className="rounded-xl bg-foreground/5 px-4 py-3 text-sm" role="status">
                {notice}
              </p>
            )}
            {SECTIONS.map((section) => {
              const items = entries.filter((e) => e.key.startsWith(section.prefix));
              return (
                <section key={section.prefix} aria-label={section.title}>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p className="mt-1 text-sm text-foreground/50">{section.hint}</p>
                  {items.length === 0 ? (
                    <p className="mt-4 rounded-2xl border border-dashed border-black/10 p-6 text-sm text-foreground/50 dark:border-white/10">
                      No overrides stored — the backend is using its environment
                      defaults for these keys.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {items.map((entry) => (
                        <div
                          key={entry.key}
                          className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-white/5"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-mono text-sm font-semibold">{entry.key}</p>
                              <p className="mt-0.5 text-xs text-foreground/40">
                                {entry.secret ? "Secret · masked" : "Plaintext"} ·{" "}
                                {formatUpdatedAt(entry.updatedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <input
                              type={entry.secret ? "password" : "text"}
                              aria-label={`Value for ${entry.key}`}
                              value={editing[entry.key] ?? (entry.secret ? "" : entry.value)}
                              placeholder={entry.secret ? "Enter a new value to rotate" : entry.value}
                              onChange={(e) =>
                                setEditing((prev) => ({ ...prev, [entry.key]: e.target.value }))
                              }
                              className="min-w-0 flex-1 rounded-xl border border-black/10 bg-transparent px-4 py-2.5 font-mono text-sm outline-none focus:border-orange-500 dark:border-white/10"
                            />
                            <button
                              onClick={() => save(entry.key)}
                              disabled={saving === entry.key || editing[entry.key] === undefined}
                              className="brand-gradient shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                            >
                              {saving === entry.key ? "Saving…" : "Save"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            {/* Users */}
            <section aria-label="Users">
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="mt-1 text-sm text-foreground/50">
                Google accounts with premium and admin flags.
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/5 bg-foreground/5 text-foreground/50 dark:border-white/10">
                      <th className="px-5 py-3 font-medium" scope="col">
                        User
                      </th>
                      <th className="px-5 py-3 font-medium" scope="col">
                        Premium
                      </th>
                      <th className="px-5 py-3 font-medium" scope="col">
                        Admin
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u.googleSub}
                        className="border-b border-black/5 last:border-0 dark:border-white/5"
                      >
                        <td className="px-5 py-3">
                          <p className="font-medium">{u.name ?? "—"}</p>
                          <p className="text-xs text-foreground/50">{u.email ?? u.googleSub}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              u.premium.status === "active"
                                ? "bg-green-500/15 text-green-700 dark:text-green-300"
                                : "bg-foreground/10 text-foreground/50"
                            }`}
                          >
                            {u.premium.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => setAdminFlag(u, !u.isAdmin)}
                            disabled={roleBusy === u.googleSub}
                            aria-label={`${u.isAdmin ? "Revoke" : "Grant"} admin for ${u.email ?? u.googleSub}`}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                              u.isAdmin
                                ? "bg-orange-500/15 text-orange-700 hover:bg-orange-500/25 dark:text-orange-300"
                                : "bg-foreground/10 text-foreground/60 hover:bg-foreground/15"
                            }`}
                          >
                            {roleBusy === u.googleSub ? "…" : u.isAdmin ? "Admin — revoke" : "Grant admin"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-6 text-center text-foreground/50">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
