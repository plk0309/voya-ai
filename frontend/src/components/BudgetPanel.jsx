const ROWS = [
  { key: "stay_inr", label: "Stay" },
  { key: "food_inr", label: "Food" },
  { key: "transport_inr", label: "Transport" },
  { key: "activities_inr", label: "Activities" },
  { key: "buffer_inr", label: "Buffer" },
];

export default function BudgetPanel({ budget, totalBudget, loading }) {
  const percent = budget?.percent_used ?? 0;

  return (
    <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-5 flex flex-col gap-4">
      <p className="text-sm font-medium">At a Glance</p>

      <div className="rounded-xl bg-gradient-to-br from-(--color-primary) to-(--color-accent-teal) p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/80">Total Budget</p>
          <p className="text-xl font-semibold">₹{totalBudget?.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-white/70">
            {budget ? `For your trip` : "Set a budget to optimize"}
          </p>
        </div>
        <div className="relative w-14 h-14 rounded-full border-4 border-white/30 flex items-center justify-center text-xs font-semibold">
          {loading ? "…" : `${percent}%`}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {ROWS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <span className="text-(--color-text-secondary)">{label}</span>
            <span className="font-medium">
              {budget ? `₹${budget[key]?.toLocaleString("en-IN")}` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
