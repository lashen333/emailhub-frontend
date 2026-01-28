// src\app\auth\signup\page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSignup() {
    setLoading(true);
    setMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    // If session exists → logged in immediately
    if (data.session) {
      router.push("/dashboard");
      return;
    }

    // Email confirmation case
    setMsg("Account created. Please check your email to confirm, then login.");
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[hsl(var(--bg))]">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* LEFT: Signup Card */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
              <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">
                Start syncing your emails & contacts with clean, trackable workflows.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium">Email address</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))]">
                    ✉️
                  </span>
                  <input
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] py-3 pl-10 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))]">
                    🔒
                  </span>
                  <input
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] py-3 pl-10 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    placeholder="Create a strong password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSignup();
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-[hsl(var(--text-muted))]">
                  Tip: Use 10+ characters with letters + numbers.
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
                />
                <p className="text-sm text-[hsl(var(--text-muted))]">
                  I agree to the{" "}
                  <Link href="/terms" className="font-semibold text-[hsl(var(--brand-700))] hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-[hsl(var(--brand-700))] hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              {/* Message */}
              {msg && (
                <div className="rounded-xl border border-[hsl(var(--border))] bg-white p-3">
                  {/* could be success or error; keep simple */}
                  <p className="text-sm text-[hsl(var(--danger))]">{msg}</p>
                </div>
              )}

              {/* Button */}
              <button
                disabled={loading || !email || !password || !agree}
                onClick={onSignup}
                className="mt-2 w-full rounded-xl bg-[hsl(var(--brand))] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[hsl(var(--brand-600))] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              {/* Footer */}
              <p className="pt-2 text-center text-sm text-[hsl(var(--text-muted))]">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-[hsl(var(--brand-700))] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT: Promo Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                One hub for email workflows
              </h2>
              <p className="text-sm text-[hsl(var(--text-muted))]">
                Connect Sheets, sync to Groups, and keep a full history of every run.
              </p>

              
            </div>

            {/* Gradient blob */}
            <div
              className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, #ff7a18, #af002d, #319197, #00c2ff, #7a5cff, #ff7a18)",
                opacity: 0.35,
              }}
            />

            {/* Icon tile */}
            <div className="relative mt-10 flex items-center justify-center">
              
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--muted))]">
                  <img
                    src="/logo.png"
                    alt="EmailHub Logo"
                    className="h-8 w-8"
                  />
                </div>
              
            </div>

            {/* Bullets */}
            <div className="relative mt-8 grid gap-3 text-sm text-[hsl(var(--text-muted))]">
              <div className="flex items-start gap-2">
                <span className="mt-0.5">✅</span>
                <p>Track sync runs + errors</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">✅</span>
                <p>Reconnect sources anytime</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">✅</span>
                <p>Save your time 2X</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center justify-center gap-2 text-xs text-[hsl(var(--text-muted))] sm:flex-row">
          <span>© {new Date().getFullYear()} Mailgo</span>
          <span className="hidden sm:inline">•</span>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <span className="hidden sm:inline">•</span>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </div>
    </div>
  );
}
