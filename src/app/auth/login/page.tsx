// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onLogin() {
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[hsl(var(--bg))]">
      <div className="mx-auto w-full max-w-6xl">
        {/* Make cards same height + aligned */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch items-start">
          {/* LEFT: Login Card */}
          <div className="h-full rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-sm flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-[hsl(var(--text))]">
                Login
              </h1>
              <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">
                Welcome back — let’s sync your contacts smoothly.
              </p>
            </div>

            <div className="space-y-4 flex-1">
              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-[hsl(var(--text))]">
                  Email address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))]">
                    ✉️
                  </span>
                  <input
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] py-3 pl-10 pr-3 text-sm text-[hsl(var(--text))] outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-[hsl(var(--text))]">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))]">
                    🔒
                  </span>
                  <input
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] py-3 pl-10 pr-3 text-sm text-[hsl(var(--text))] outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    placeholder="Your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onLogin();
                    }}
                  />
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-[hsl(var(--text-muted))]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
                  />
                  Stay signed in
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[hsl(var(--brand-700))] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error */}
              {msg && (
                <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-3">
                  <p className="text-sm text-[hsl(var(--danger))]">{msg}</p>
                </div>
              )}
            </div>

            {/* Bottom actions always aligned */}
            <div className="pt-4">
              <button
                disabled={loading || !email || !password}
                onClick={onLogin}
                className="w-full rounded-xl bg-[hsl(var(--brand))] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[hsl(var(--brand-600))] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="pt-3 text-center text-sm text-[hsl(var(--text-muted))]">
                Don’t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-[hsl(var(--brand-700))] hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT: Promo Card */}
          <div className="h-full relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-sm flex flex-col">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-[hsl(var(--text))]">
                Mailgo — built for clean syncing
              </h2>
              <p className="text-sm text-[hsl(var(--text-muted))]">
                Connect Google Sheets and Google Groups, sync safely, and track every run.
              </p>
            </div>

            {/* Soft gradient blob */}
            <div
              className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full blur-3xl"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, #ff7a18, #af002d, #319197, #00c2ff, #7a5cff, #ff7a18)",
                opacity: 0.32,
              }}
            />

            {/* Center logo area grows to balance height */}
            <div className="flex-1 flex items-center justify-center">
              <div className="grid h-28 w-28 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-[hsl(var(--border))]">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--muted))]">
                  <img
                    src="/logo.png"
                    alt="EmailHub Logo"
                    className="h-10 w-10 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Bullets pinned closer to bottom like SaaS promo cards */}
            <div className="relative mt-2 grid gap-3 text-sm text-[hsl(var(--text-muted))]">
              <div className="flex items-start gap-2">
                <span className="mt-0.5">✅</span>
                <p>Connect sources</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">✅</span>
                <p>Audit logs + sync runs</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">✅</span>
                <p>Easy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center justify-center gap-2 text-xs text-[hsl(var(--text-muted))] sm:flex-row">
          <span>© {new Date().getFullYear()} Mailgo</span>
          <span className="hidden sm:inline">•</span>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <span className="hidden sm:inline">•</span>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
