import { Users } from "lucide-react";

export default function GroupConsensusCard({ consensus, memberCount }) {
  const happiness = consensus?.overall_happiness_percent ?? 0;
  const winner = consensus?.ranked_activities?.[0];

  return (
    <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-5">
      <div className="flex items-center gap-2 mb-3">
        <Users size={16} className="text-(--color-primary)" />
        <p className="text-sm font-medium">
          Group Consensus{memberCount ? ` (${memberCount} Friends)` : ""}
        </p>
      </div>

      <p className="text-xs text-(--color-text-secondary) mb-2">Overall Happiness</p>
      <div className="w-full h-2 rounded-full bg-(--color-border) mb-1 overflow-hidden">
        <div
          className="h-full bg-(--color-accent-teal) transition-all"
          style={{ width: `${happiness}%` }}
        />
      </div>
      <p className="text-xs font-medium mb-4">{happiness}%</p>

      {winner ? (
        <div className="rounded-lg bg-(--color-surface-hover) border border-(--color-border) p-3">
          <p className="text-xs text-(--color-text-secondary) mb-1">Top pick</p>
          <p className="text-sm font-medium mb-1">{winner.activity}</p>
          <p className="text-[11px] text-(--color-text-secondary)">
            {consensus.mediation_summary}
          </p>
        </div>
      ) : (
        <p className="text-xs text-(--color-text-secondary)">
          Add your group's preferences to see the fairest plan.
        </p>
      )}
    </div>
  );
}
