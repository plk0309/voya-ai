import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, AlertCircle } from "lucide-react";
import { getCurrentWeather } from "../api/client";

function iconFor(iconCode) {
  if (!iconCode) return Cloud;
  if (iconCode.startsWith("01")) return Sun;
  if (iconCode.startsWith("09") || iconCode.startsWith("10")) return CloudRain;
  return Cloud;
}

export default function WeatherWidget({ city }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCurrentWeather(city)
      .then((data) => !cancelled && setWeather(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [city]);

  if (error) {
    return (
      <div className="rounded-xl bg-(--color-surface-hover) border border-(--color-border) p-3 flex items-center gap-2">
        <AlertCircle size={14} className="text-(--color-text-muted)" />
        <span className="text-xs text-(--color-text-secondary)">
          Add OPENWEATHER_API_KEY to see live weather
        </span>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="rounded-xl bg-(--color-surface-hover) border border-(--color-border) p-3 animate-pulse h-14" />
    );
  }

  const Icon = iconFor(weather.icon);

  return (
    <div className="rounded-xl bg-(--color-surface-hover) border border-(--color-border) p-3 flex items-center gap-3">
      <Icon size={22} className="text-(--color-accent-gold)" />
      <div>
        <p className="text-sm font-medium">
          {Math.round(weather.temp_c)}°C · {weather.city}
        </p>
        <p className="text-[11px] text-(--color-text-secondary)">{weather.condition}</p>
      </div>
    </div>
  );
}