import { Send, Bell } from "lucide-react";
import WeatherWidget from "./WeatherWidget";

export default function TopBar({ prompt, onPromptChange, onSubmit, userName, city = "Jaipur" }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-(--color-border) bg-(--color-surface)">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        className="flex-1 flex items-center gap-3 bg-(--color-bg) border border-(--color-border) rounded-xl px-4 py-2.5"
      >
        <input
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Plan a 2 day trip to Jaipur for me. I love photography, street food and hate crowds."
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-(--color-text-muted)"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-lg bg-(--color-primary) hover:bg-(--color-primary-hover) flex items-center justify-center transition-colors shrink-0"
        >
          <Send size={15} className="text-white" />
        </button>
      </form>

      <WeatherWidget city={city} />

      <button className="relative w-9 h-9 rounded-lg border border-(--color-border) flex items-center justify-center text-(--color-text-secondary) hover:bg-(--color-surface-hover) transition-colors shrink-0">
        <Bell size={16} />
      </button>

      <div className="w-9 h-9 rounded-full bg-(--color-primary) flex items-center justify-center text-sm font-medium shrink-0">
        {userName?.[0] ?? "U"}
      </div>
    </div>
  );
}