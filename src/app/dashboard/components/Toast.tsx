// src\app\dashboard\components\Toast.tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: string; type: ToastType; title: string; message?: string };

type ToastCtx = {
  toast: (t: Omit<ToastItem, "id">) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

function typeStyles(type: ToastType) {
  if (type === "success") {
    return {
      border: "border-emerald-200",
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      icon: "✅",
    };
  }
  if (type === "error") {
    return {
      border: "border-red-200",
      badge: "bg-red-50 text-red-700 ring-red-100",
      icon: "⚠️",
    };
  }
  return {
    border: "border-sky-200",
    badge: "bg-sky-50 text-sky-700 ring-sky-100",
    icon: "ℹ️",
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    const item: ToastItem = { id, ...t };
    setItems((prev) => [item, ...prev].slice(0, 3));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <Ctx.Provider value={value}>
      {children}

      {/* Toast viewport */}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {items.map((t) => {
          const s = typeStyles(t.type);
          return (
            <div
              key={t.id}
              className={[
                "w-85 rounded-2xl border bg-[hsl(var(--card))] shadow-lg p-4",
                "backdrop-blur supports-backdrop-filter:bg-white/80",
                s.border,
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div
                  className={[
                    "shrink-0 grid h-8 w-8 place-items-center rounded-xl ring-1 text-sm",
                    s.badge,
                  ].join(" ")}
                >
                  {s.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[hsl(var(--text))]">{t.title}</div>
                  {t.message && (
                    <div className="mt-1 text-sm text-[hsl(var(--text-muted))]">{t.message}</div>
                  )}
                </div>

                <button
                  className="shrink-0 rounded-lg px-2 py-1 text-xs text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--text))]"
                  onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
                  aria-label="Close toast"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
