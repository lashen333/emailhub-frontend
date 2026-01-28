// src/app/dashboard/components/SheetsPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { authedFetch } from "@/lib/authedFetch";
import { useToast } from "./Toast";

export default function SheetsPanel({ onSaved }: { onSaved?: () => void }) {
  const [name, setName] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [tabName, setTabName] = useState("Sheet1");
  const [emailColumn, setEmailColumn] = useState("A");
  const [sourceId, setSourceId] = useState<string | null>(null);

  const [msg, setMsg] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  const { toast } = useToast();

  //load existing sources
  async function loadSources() {
    const data = await authedFetch("/sheets");
    setSources(data.sources);
  }

  async function refreshSummary() {
    const data = await authedFetch("/contacts/summary");
    setSummary(data.summary);
  }

  useEffect(() => {
    loadSources().catch(() => {});
    refreshSummary().catch(() => {});
  }, []);

  async function addSheet() {
    setBusy(true);
    setMsg(null);
    try {
      const data = await authedFetch("/sheets", {
        method: "POST",
        body: JSON.stringify({ name, sheetUrl, tabName, emailColumn }),
      });
      setSourceId(data.source.id);
      setMsg("Sheet saved ✅ Now click Import.");
      await refreshSummary();

      toast({
        type: "success",
        title: "Sheet saved",
        message: "Now click Import Emails.",
      });

      onSaved?.();
      await loadSources();
    } catch (e: any) {
      const m = e?.message || "Failed to save sheet";
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

  async function importEmails() {
    if (!sourceId) return;
    setBusy(true);
    setMsg(null);
    try {
      const data = await authedFetch(`/sheets/${sourceId}/import`, { method: "POST" });
      setMsg(`Imported ✅ Found ${data.found} emails`);
      await refreshSummary();

      toast({
        type: "success",
        title: "Import complete",
        message: `Found ${data.found} emails`,
      });
    } catch (e: any) {
      const m = e?.message || "Import failed";
      setMsg(m);

      toast({
        type: "error",
        title: "Import failed",
        message: m,
      });
    } finally {
      setBusy(false);
    }
  }

  //disconnect button function
  async function disconnectSource(id: string) {
    setMsg(null);
    await authedFetch(`/sheets/${id}/disconnect`, { method: "POST" });
    setMsg("Disconnected ✅");
    await loadSources();

    toast({
      type: "info",
      title: "Sheet disconnected",
      message: "You can reconnect anytime.",
    });
  }

  //reconnect button function
  async function reconnectSource(id: string) {
    setMsg(null);
    await authedFetch(`/sheets/${id}/reconnect`, { method: "POST" });
    setMsg("Reconnected ✅");
    await loadSources();

    toast({
      type: "success",
      title: "Sheet reconnected",
      message: "Source is active again.",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[hsl(var(--text))]">Sheets</h2>
        <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
          Save a sheet source, then import emails.
        </p>
      </div>

      {/* Add source card */}
      <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6 space-y-4">
        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[hsl(var(--text))]">
              Source name <span className="text-[hsl(var(--text-muted))]">(optional)</span>
            </label>
            <input
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 text-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder="e.g. January leads"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[hsl(var(--text))]">
              Google Sheet URL
            </label>
            <input
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 text-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
            />
            <p className="mt-2 text-xs text-[hsl(var(--text-muted))]">
              Tip: Make sure the Google account you connected has access to this Sheet.
            </p>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[hsl(var(--text))]">Tab name</label>
              <input
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 text-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]"
                value={tabName}
                onChange={(e) => setTabName(e.target.value)}
                placeholder="Sheet1"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[hsl(var(--text))]">Email column</label>
              <input
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 text-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]"
                value={emailColumn}
                onChange={(e) => setEmailColumn(e.target.value)}
                placeholder="A"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <button
            className="rounded-xl bg-[hsl(var(--brand))] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[hsl(var(--brand-600))] disabled:opacity-50"
            onClick={addSheet}
            disabled={busy || !sheetUrl}
          >
            {busy ? "Saving…" : "Save Sheet"}
          </button>

          <button
            className="rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm font-medium text-[hsl(var(--text))] hover:bg-[hsl(var(--muted))] disabled:opacity-50"
            disabled={busy || !sourceId}
            onClick={importEmails}
          >
            {busy ? "Working…" : "Import Emails"}
          </button>
        </div>

        {/* Inline message (keep) */}
        {msg && (
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
            <div className="text-sm text-[hsl(var(--text))]">{msg}</div>
          </div>
        )}
      </div>

      {/* Connected sheets */}
      <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[hsl(var(--text))]">Connected Sheets</h3>
            <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
              Manage active and disconnected sources.
            </p>
          </div>
          <span className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 py-2 text-xs font-semibold text-[hsl(var(--text))]">
            {sources.length} sources
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {sources.length === 0 ? (
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
              <p className="text-sm text-[hsl(var(--text-muted))]">No sheets added yet.</p>
            </div>
          ) : (
            sources.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-[hsl(var(--border))] bg-white p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-[hsl(var(--text))]">
                        {s.name || "Untitled source"}
                      </div>
                      <span
                        className={[
                          "inline-flex items-center rounded-lg border px-2 py-1 text-xs font-semibold",
                          s.active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--text-muted))]",
                        ].join(" ")}
                      >
                        {s.active ? "Active" : "Disconnected"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[hsl(var(--text-muted))]">
                      {s.tabName}!{s.emailColumn}
                    </p>
                  </div>

                  {s.active ? (
                    <button
                      className="rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2 text-sm font-medium text-[hsl(var(--text))] hover:bg-[hsl(var(--muted))]"
                      onClick={() => disconnectSource(s.id)}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      className="rounded-xl bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[hsl(var(--brand-600))]"
                      onClick={() => reconnectSource(s.id)}
                    >
                      Reconnect
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contacts summary */}
      <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[hsl(var(--text))]">Contacts summary</h3>
            <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
              Current totals across your imported contacts.
            </p>
          </div>
        </div>

        {summary ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label="Total" value={summary.total} />
            <Stat label="Pending" value={summary.pending} />
            <Stat label="Added" value={summary.added} />
            <Stat label="Already member" value={summary.already_member} />
            <Stat label="Failed" value={summary.failed} />
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
            <p className="text-sm text-[hsl(var(--text-muted))]">Loading…</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-4">
      <div className="text-xs text-[hsl(var(--text-muted))]">{label}</div>
      <div className="mt-1 text-lg font-semibold text-[hsl(var(--text))]">{String(value)}</div>
    </div>
  );
}
