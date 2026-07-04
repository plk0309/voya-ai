const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request to ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function generateItinerary({ city, days, budgetInr, vibeTags, notes }) {
  return post("/api/itinerary/generate", {
    city,
    days,
    budget_inr: budgetInr,
    vibe_tags: vibeTags,
    notes,
  });
}

export function optimizeBudget({ totalBudgetInr, days, city }) {
  return post("/api/budget/optimize", {
    total_budget_inr: totalBudgetInr,
    days,
    city,
  });
}

export function runGroupConsensus({ city, members, candidateActivities }) {
  return post("/api/group/consensus", {
    city,
    members,
    candidate_activities: candidateActivities,
  });
}

export function geocodePlace(query) {
  return post("/api/location/geocode", { query });
}

export async function getCurrentWeather(city) {
  const res = await fetch(`${BASE_URL}/api/weather/current?city=${encodeURIComponent(city)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Weather request failed: ${res.status} ${text}`);
  }
  return res.json();
}