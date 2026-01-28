// src\app\dashboard\components\StepIndicator.tsx
"use client";

export default function StepIndicator({
  googleConnected,
  hasSheet,
  hasGroup,
}: {
  googleConnected: boolean;
  hasSheet: boolean;
  hasGroup: boolean;
}) {
  const steps = [
    { n: 1, title: "Connect Google", done: googleConnected },
    { n: 2, title: "Add Sheet", done: hasSheet },
    { n: 3, title: "Sync Group", done: hasGroup },
  ];

  return (
    <div className="rounded-2xl border bg-white p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">Setup progress</div>
          <div className="text-xs text-gray-500 mt-1">Complete these steps to sync your contacts</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-xl border p-3 flex items-center gap-3">
            <div
              className={[
                "h-8 w-8 rounded-full grid place-items-center text-sm font-semibold",
                s.done ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700",
              ].join(" ")}
            >
              {s.done ? "✓" : s.n}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{s.title}</div>
              <div className="text-xs text-black">{s.done ? "Done" : "Pending"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
