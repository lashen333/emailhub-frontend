// src\app\dashboard\components\GooglePanel.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function GooglePanel({
  onConnectedChange,
}: {
  onConnectedChange?: (connected: boolean) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function fetchStatus(token: string) {
    const res = await fetch(`${API}/google/status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return;
    const status = await res.json();
    setGoogleConnected(!!status.connected);
    setGoogleEmail(status.googleEmail ?? null);
    onConnectedChange?.(!!status.connected);
  }

  useEffect(() => {
    (async () => {
      setErr(null);
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      try {
        await fetchStatus(token);
      } catch (e: any) {
        setErr(e?.message || "Failed to load Google status");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function connectGoogle() {
    setErr(null);
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      alert("Not logged in");
      return;
    }

    const res = await fetch(`${API}/oauth/google/start`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("OAuth start failed", t);
      alert("Failed to start Google OAuth");
      return;
    }

    const j = await res.json();
    if (!j?.url) {
      console.error("No OAuth URL returned", j);
      alert("OAuth URL missing");
      return;
    }

    window.location.href = j.url;
  }

  async function disconnectGoogle() {
    setErr(null);
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      alert("Not logged in");
      return;
    }

    const res = await fetch(`${API}/google/disconnect`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      alert("Failed to disconnect Google");
      return;
    }

    setGoogleConnected(false);
    setGoogleEmail(null);
    onConnectedChange?.(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
        <div className="text-sm text-[hsl(var(--text-muted))]">Loading Google status…</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[hsl(var(--text))]">Google Account</h2>
        <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
          Connect once, then import emails from Sheets and sync to Groups securely.
        </p>
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white ring-1 ring-red-100 text-sm">
              ⚠️
            </div>
            <div>
              <div className="text-sm font-semibold text-red-700">Something went wrong</div>
              <div className="mt-1 text-sm text-red-700/80">{err}</div>
            </div>
          </div>
        </div>
      )}

      {/* Status Card */}
      <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left status */}
          <div className="flex items-start gap-3">
            <div
              className={[
                "grid h-10 w-10 place-items-center rounded-2xl ring-1",
                googleConnected
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--text))] ring-[hsl(var(--border))]",
              ].join(" ")}
            >
              {googleConnected ? "✅" : "🔒"}
            </div>

            <div>
              <div className="text-sm font-semibold text-[hsl(var(--text))]">
                {googleConnected ? "Connected" : "Not connected"}
              </div>

              {googleConnected ? (
                <div className="mt-1 text-sm text-[hsl(var(--text-muted))]">{googleEmail}</div>
              ) : (
                <div className="mt-1 text-sm text-[hsl(var(--text-muted))]">
                  Click connect to authorize your Google account.
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {googleConnected ? (
              <button
                className="rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2 text-sm font-medium text-[hsl(var(--text))] hover:bg-[hsl(var(--muted))]"
                onClick={disconnectGoogle}
              >
                Disconnect
              </button>
            ) : (
              <button
                className="rounded-xl bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[hsl(var(--brand-600))]"
                onClick={connectGoogle}
              >
                Connect Google
              </button>
            )}
          </div>
        </div>

        {/* Mini help row */}
        <div className="mt-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
          <div className="flex items-start gap-2 text-sm text-[hsl(var(--text-muted))]">
            <span className="mt-0.5">💡</span>
            <p>
              After connecting, you can add a Sheet source and configure a Group, then run a sync anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
