// src\app\dashboard\components\SidebarNav.tsx
"use client";

import type { TabKey } from "./DashboardShell";

function NavItem({
  label,
  desc,
  active,
  disabled,
  onClick,
  icon,
}: {
  label: string;
  desc: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full text-left rounded-2xl px-4 py-3 border transition",
        "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]",
        active
          ? "border-[hsl(var(--border))] bg-[hsl(var(--muted))]"
          : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))]",
        disabled ? "opacity-60 cursor-not-allowed hover:bg-[hsl(var(--card))]" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={[
              "grid h-10 w-10 place-items-center rounded-2xl ring-1",
              active
                ? "bg-white ring-[hsl(var(--border))]"
                : "bg-[hsl(var(--muted))] ring-[hsl(var(--border))]",
            ].join(" ")}
          >
            <span className="text-sm">{icon}</span>
          </div>

          <div>
            <div className="font-semibold text-[hsl(var(--text))]">{label}</div>
            <div className="text-xs mt-1 text-[hsl(var(--text-muted))]">{desc}</div>
          </div>
        </div>

        {disabled && (
          <span className="shrink-0 rounded-lg border border-[hsl(var(--border))] bg-white px-2 py-1 text-[10px] font-semibold text-[hsl(var(--text-muted))]">
            Locked
          </span>
        )}
      </div>
    </button>
  );
}

export default function SidebarNav({
  activeTab,
  onTabChange,
  googleConnected,
}: {
  activeTab: TabKey;
  onTabChange: (t: TabKey) => void;
  googleConnected: boolean;
}) {
  return (
    <div className="space-y-2">
      <NavItem
        icon="🔐"
        label="Connect Google"
        desc="Authorize your Google account"
        active={activeTab === "google"}
        onClick={() => onTabChange("google")}
      />

      <NavItem
        icon="📄"
        label="Add Sheets"
        desc="Import emails from a spreadsheet"
        active={activeTab === "sheets"}
        disabled={!googleConnected}
        onClick={() => onTabChange("sheets")}
      />

      <NavItem
        icon="👥"
        label="Add Groups"
        desc="Sync to your Google Group"
        active={activeTab === "group"}
        disabled={!googleConnected}
        onClick={() => onTabChange("group")}
      />
    </div>
  );
}
