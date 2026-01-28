// src/app/dashboard/page.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { apiGetMe } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";

import DashboardShell, { TabKey } from "./components/DashboardShell";
import GooglePanel from "./components/GooglePanel";
import SheetsPanel from "./components/SheetsPanel";
import GroupPanel from "./components/GroupPanel";
import StepIndicator from "./components/StepIndicator";
import { ToastProvider } from "./components/Toast";
import { authedFetch } from "@/lib/authedFetch";

export default function Dashboard() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("google");

  const [googleConnected, setGoogleConnected] = useState(false);
  const [hasSheet, setHasSheet] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);

  const [lastRun, setLastRun] = useState<any>(null);
  const didAutoAdvanceRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/auth/login");
        return;
      }

      setEmail(data.session.user.email ?? "");

      try {
        await apiGetMe();
      } catch (e) {
        console.error("Dashboard bootstrap failed:", e);
      } finally {
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    authedFetch("/runs/last").then((d) => setLastRun(d.run)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "connected") {
      router.replace("/dashboard");
      setActiveTab("google");
      didAutoAdvanceRef.current = false;
    }
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  }

  const headerRight = useMemo(() => {
    return (
      <button
        onClick={logout}
        className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm font-medium text-[hsl(var(--text))] hover:bg-[hsl(var(--muted))]"
      >
        Logout
      </button>
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--bg))] p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="text-sm text-[hsl(var(--text-muted))]">Loading dashboard…</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <DashboardShell
        activeTab={activeTab}
        onTabChange={(t) => {
          if (!googleConnected && (t === "sheets" || t === "group")) return;
          setActiveTab(t);
        }}
        headerRight={headerRight}
        googleConnected={googleConnected}
      >
        <div className="space-y-6">
          {/* Signed-in card */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-3">
              <div className="text-xs text-[hsl(var(--text-muted))]">Signed in as</div>
              <div className="text-sm font-semibold text-[hsl(var(--text))]">{email}</div>
            </div>

            {/* Optional: quick status chips */}
            <div className="flex flex-wrap gap-2">
              <span
                className={[
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold",
                  googleConnected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[hsl(var(--border))] bg-white text-[hsl(var(--text-muted))]",
                ].join(" ")}
              >
                {googleConnected ? "✅ Google Connected" : "⏳ Connect Google"}
              </span>
              <span
                className={[
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold",
                  hasSheet
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[hsl(var(--border))] bg-white text-[hsl(var(--text-muted))]",
                ].join(" ")}
              >
                {hasSheet ? "✅ Sheet Saved" : "⏳ Add Sheet"}
              </span>
              <span
                className={[
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold",
                  hasGroup
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[hsl(var(--border))] bg-white text-[hsl(var(--text-muted))]",
                ].join(" ")}
              >
                {hasGroup ? "✅ Group Saved" : "⏳ Add Group"}
              </span>
            </div>
          </div>

          <StepIndicator googleConnected={googleConnected} hasSheet={hasSheet} hasGroup={hasGroup} />

          {/* Panels */}
          {activeTab === "google" && (
            <GooglePanel
              onConnectedChange={(v) => {
                setGoogleConnected(v);

                if (v && !didAutoAdvanceRef.current) {
                  didAutoAdvanceRef.current = true;
                  setActiveTab("sheets");
                }
                if (!v) {
                  didAutoAdvanceRef.current = false;
                }
              }}
            />
          )}

          {activeTab === "sheets" && <SheetsPanel onSaved={() => setHasSheet(true)} />}

          {activeTab === "group" && <GroupPanel onSaved={() => setHasGroup(true)} />}

          {/* Last Sync card */}
          {lastRun && (
            <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-[hsl(var(--text))]">Last Sync</h2>
                  <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
                    Latest run details and stats summary.
                  </p>
                </div>
                <span className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 py-2 text-xs font-semibold text-[hsl(var(--text))]">
                  Run
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-4">
                  <div className="text-xs text-[hsl(var(--text-muted))]">Started</div>
                  <div className="mt-1 text-sm font-semibold text-[hsl(var(--text))]">
                    {String(lastRun.startedAt)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-4">
                  <div className="text-xs text-[hsl(var(--text-muted))]">Finished</div>
                  <div className="mt-1 text-sm font-semibold text-[hsl(var(--text))]">
                    {String(lastRun.finishedAt)}
                  </div>
                </div>
              </div>

              <pre className="mt-4 overflow-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4 text-xs text-[hsl(var(--text))]">
{JSON.stringify(lastRun.stats, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DashboardShell>
    </ToastProvider>
  );
}
