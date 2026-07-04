import { Camera, Clock, MapPin, Wallet } from "lucide-react";
import MapView from "./MapView";

export default function ItineraryCard({ itinerary, loading, error }) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-6 animate-pulse">
        <div className="h-4 w-40 bg-(--color-border) rounded mb-4" />
        <div className="h-48 bg-(--color-border) rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-6">
        <p className="text-sm text-(--color-text-secondary)">
          Couldn't reach the itinerary service — is the backend running on{" "}
          <code className="text-(--color-accent-teal)">localhost:8000</code>?
        </p>
      </div>
    );
  }

  if (!itinerary || itinerary.itinerary.length === 0) {
    return (
      <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-6">
        <p className="text-sm text-(--color-text-secondary)">
          Tell VoyaAI where you're headed and what you love — your
          personalized itinerary will show up here.
        </p>
      </div>
    );
  }

  const firstDay = itinerary.itinerary[0];
  const firstPlace = firstDay.places[0];

  return (
    <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium">Your Personalized Itinerary</p>
          <p className="text-xs text-(--color-text-secondary)">
            {itinerary.city} · {itinerary.days} Days · Offbeat &amp; Local
          </p>
        </div>
      </div>

      {firstPlace && (
        <div className="mb-4">
          <div className="relative h-40 rounded-xl bg-gradient-to-br from-(--color-primary) to-(--color-bg) flex items-center justify-center mb-3">
            <span className="absolute top-3 left-3 text-[11px] px-2 py-1 rounded-full bg-black/40">
              Day {firstDay.day_number}
            </span>
            <Camera size={28} className="text-white/60" />
          </div>
          <p className="text-sm font-semibold mb-1">{firstPlace.name}</p>
          <p className="text-xs text-(--color-text-secondary) mb-3">
            {firstPlace.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-(--color-text-secondary) mb-3">
            {firstPlace.best_time && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {firstPlace.best_time}
              </span>
            )}
            {firstPlace.distance_km != null && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {firstPlace.distance_km} km from city center
              </span>
            )}
            {firstPlace.est_cost_inr && (
              <span className="flex items-center gap-1">
                <Wallet size={12} /> ₹{firstPlace.est_cost_inr}
              </span>
            )}
          </div>
          {firstPlace.why_it_matches && (
            <p className="text-xs bg-(--color-surface-hover) border border-(--color-border) rounded-lg px-3 py-2 text-(--color-text-secondary)">
              💡 {firstPlace.why_it_matches}
            </p>
          )}
        </div>
      )}

      {firstDay.places.some((p) => p.lat && p.lon) && (
        <div className="mb-4">
          <MapView
            places={firstDay.places
              .filter((p) => p.lat && p.lon)
              .map((p) => ({ name: p.name, lat: p.lat, lon: p.lon }))}
            heightClass="h-48"
          />
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {(firstDay.places.slice(1, 5)).map((p) => (
          <div key={p.name} className="rounded-lg bg-(--color-surface-hover) border border-(--color-border) p-2">
            <div className="h-14 rounded-md bg-(--color-bg) mb-2" />
            <p className="text-[11px] font-medium leading-tight truncate">{p.name}</p>
            <p className="text-[10px] text-(--color-text-muted) truncate">{p.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}