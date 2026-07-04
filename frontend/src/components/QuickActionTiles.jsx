import { Compass, Wallet, Users, Trophy } from "lucide-react";

const TILES = [
  {
    icon: Compass,
    title: "AI Itinerary",
    subtitle: "Personalized plans based on your vibe",
    color: "bg-(--color-primary)",
  },
  {
    icon: Wallet,
    title: "Budget Optimizer",
    subtitle: "Best experiences within your budget",
    color: "bg-(--color-accent-teal)",
  },
  {
    icon: Users,
    title: "Group Consensus",
    subtitle: "Plan trips that make everyone happy",
    color: "bg-(--color-primary)",
  },
  {
    icon: Trophy,
    title: "Local Challenges",
    subtitle: "Coming soon — real experiences, gamified",
    color: "bg-(--color-accent-gold)",
    disabled: true,
  },
];

export default function QuickActionTiles({ activeTitle, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {TILES.map(({ icon: Icon, title, subtitle, color, disabled }) => (
        <button
          key={title}
          disabled={disabled}
          onClick={() => onSelect?.(title)}
          className={`text-left rounded-2xl p-4 border transition-colors ${
            activeTitle === title
              ? "border-(--color-primary) bg-(--color-surface-hover)"
              : "border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-hover)"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div
            className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}
          >
            <Icon size={17} className="text-white" />
          </div>
          <p className="text-sm font-medium mb-1">{title}</p>
          <p className="text-xs text-(--color-text-secondary)">{subtitle}</p>
        </button>
      ))}
    </div>
  );
}
