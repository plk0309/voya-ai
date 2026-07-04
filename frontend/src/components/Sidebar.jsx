import {
  Compass,
  Home,
  Map,
  Wallet,
  Users,
  Trophy,
  Bookmark,
  Briefcase,
  User,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: Map, label: "Itineraries" },
  { icon: Wallet, label: "Budget Planner" },
  { icon: Users, label: "Group Plan" },
  { icon: Trophy, label: "Challenges", badge: "Soon" },
  { icon: Bookmark, label: "Saved Places" },
  { icon: Briefcase, label: "Trips" },
  { icon: User, label: "Profile" },
];

export default function Sidebar({ activeLabel, onSelect }) {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-(--color-surface) border-r border-(--color-border) px-4 py-5">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-(--color-primary) flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <span className="font-[var(--font-display)] font-semibold text-lg">
          VoyaAI
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map(({ icon: Icon, label, badge }) => {
          const isActive = label === activeLabel;
          return (
            <button
              key={label}
              onClick={() => onSelect?.(label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                isActive
                  ? "bg-(--color-primary) text-white"
                  : "text-(--color-text-secondary) hover:bg-(--color-surface-hover)"
              }`}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-(--color-border) text-(--color-text-muted)">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 rounded-2xl bg-(--color-surface-hover) border border-(--color-border) p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-(--color-primary) flex items-center justify-center text-xs">
            V
          </div>
          <span className="text-sm font-medium">VoyaAI Assistant</span>
        </div>
        <p className="text-xs text-(--color-text-secondary) mb-3">
          Hi there! How can I help plan your next adventure?
        </p>
        <button className="w-full text-sm bg-(--color-primary) hover:bg-(--color-primary-hover) transition-colors rounded-lg py-2 font-medium">
          Chat with AI
        </button>
      </div>
    </aside>
  );
}
