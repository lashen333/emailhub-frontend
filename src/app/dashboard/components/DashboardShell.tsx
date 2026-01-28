// src\app\dashboard\components\DashboardShell.tsx
"use client";

import { ReactNode, useMemo, useState } from "react";
import SidebarNav from "./SidebarNav";

export type TabKey = "google" | "sheets" | "group";

export default function DashboardShell({
  activeTab,
  onTabChange,
  headerRight,
  children,
  googleConnected,
}: {
  activeTab: TabKey;
  onTabChange: (t: TabKey) => void;
  headerRight?: ReactNode;
  children: ReactNode;
  googleConnected: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = useMemo(() => {
    if (activeTab === "google") return "Google Connection";
    if (activeTab === "sheets") return "Sheets";
    return "Google Group";
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm font-medium text-[hsl(var(--text))] hover:bg-[hsl(var(--muted))]"
            onClick={() => setMobileOpen((s) => !s)}
          >
            Menu
          </button>

          <div className="font-semibold text-[hsl(var(--text))]">{title}</div>
          <div>{headerRight}</div>
        </div>

        {mobileOpen && (
          <div className="border-t border-[hsl(var(--border))] px-3 py-3">
            <SidebarNav
              activeTab={activeTab}
              onTabChange={(t) => {
                onTabChange(t);
                setMobileOpen(false);
              }}
              googleConnected={googleConnected}
            />
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl md:flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block md:w-72 md:shrink-0 md:min-h-screen md:border-r md:border-[hsl(var(--border))]">
          <div className="p-6">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border ring-1 ring-[hsl(var(--border))]">
                <img
                  src="/logo.png"
                  alt="EmailHub Logo"
                  className="h-10 w-10 rounded-2xl"
                />
              </div>
              <div>
                <div className="text-lg font-semibold text-[hsl(var(--text))]">Mailgo</div>
                <p className="text-xs text-[hsl(var(--text-muted))]">
                  Manage Google, Sheets & Groups
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pb-6">
            <SidebarNav
              activeTab={activeTab}
              onTabChange={onTabChange}
              googleConnected={googleConnected}
            />
          </div>

          <div className="px-6 pb-6">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <div className="text-sm font-semibold text-[hsl(var(--text))]">Tip</div>
              <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
                Connect Google first — then unlock Sheets & Group setup.
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-8">
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[hsl(var(--text))]">
                {title}
              </h1>
              <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
                Configure everything step-by-step with clean logs.
              </p>
            </div>
            <div>{headerRight}</div>
          </div>

          {/* Content card */}
          <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-8 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
