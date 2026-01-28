// src/app/dashboard/components/GroupPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { authedFetch } from "@/lib/authedFetch";
import { useToast } from "./Toast";

export default function GroupPanel({ onSaved }: { onSaved?: () => void }) {
  const [groupEmail, setGroupEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    authedFetch("/groups/config")
      .then((d) => {
        if (d.config?.groupEmail) setGroupEmail(d.config.groupEmail);
      })
      .catch(() => {});
  }, []);

  async function saveConfig() {
    setBusy(true);
    setMsg(null);
    try {
      const d = await authedFetch("/groups/config", {
        method: "POST",
        body: JSON.stringify({ groupEmail }),
      });

      setMsg("Group saved ✅");
      setResult(d.config);

      toast({
        type: "success",
        title: "Group saved",
        message: `Saved ${groupEmail}`,
      });

      onSaved?.();
    } catch (e: any) {
      const m = e?.message || "Failed to save group";
      setMsg(m);

      toast({
        type: "error",
        title: "Save failed",
        message: m,
      });
    } finally {
      setBusy(false);
    }
  }

  async function syncNow() {
    setBusy(true);
    setMsg(null);
    try {
      const d = await authedFetch("/groups/sync-now", { method: "POST" });
      const summary = `Added: ${d.added}, Already: ${d.already}, Failed: ${d.failed}`;

      setMsg(`Sync finished ✅ ${summary}`);
      setResult(d);

      toast({
        type: "success",
        title: "Sync finished",
        message: summary,
      });
    } catch (e: any) {
      const m = e?.message || "Sync failed";
      setMsg(m);

      toast({
        type: "error",
        title: "Sync failed",
        message: m,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[hsl(var(--text))]">Google Group</h2>
        <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
          Set your group email and sync imported contacts.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6 space-y-4">
        {/* Input */}
        <div>
          <label className="mb-1 block text-sm font-medium text-[hsl(var(--text))]">Group email</label>
          <input
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 text-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]"
            placeholder="group@yourdomain.com"
            value={groupEmail}
            onChange={(e) => setGroupEmail(e.target.value)}
          />
          <p className="mt-2 text-xs text-[hsl(var(--text-muted))]">
            Example: marketing@yourdomain.com (must be a Google Group email).
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <button
            className="rounded-xl bg-[hsl(var(--brand))] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[hsl(var(--brand-600))] disabled:opacity-50"
            onClick={saveConfig}
            disabled={busy || !groupEmail}
          >
            {busy ? "Saving…" : "Save Group"}
          </button>

          <button
            className="rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm font-medium text-[hsl(var(--text))] hover:bg-[hsl(var(--muted))] disabled:opacity-50"
            onClick={syncNow}
            disabled={busy}
          >
            {busy ? "Working…" : "Sync Now"}
          </button>
        </div>

        {/* Message */}
        {msg && (
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
            <div className="text-sm text-[hsl(var(--text))]">{msg}</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <pre className="text-xs bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl p-4 overflow-auto text-[hsl(var(--text))]">
{JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>

      {/* Helper Card */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
        <div className="flex items-start gap-2 text-sm text-[hsl(var(--text-muted))]">
          <span className="mt-0.5">🧠</span>
          <p>Best practice: save the group first, then run sync. You can sync multiple times safely.</p>
        </div>
      </div>
    </div>
  );
}
