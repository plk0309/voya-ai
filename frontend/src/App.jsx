import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import QuickActionTiles from "./components/QuickActionTiles";
import ItineraryCard from "./components/ItineraryCard";
import BudgetPanel from "./components/BudgetPanel";
import GroupConsensusCard from "./components/GroupConsensusCard";
import { generateItinerary, optimizeBudget, runGroupConsensus } from "./api/client";

const DEFAULT_TRIP = {
  city: "Jaipur",
  days: 2,
  budgetInr: 8000,
  vibeTags: ["photography", "street_food", "crowd_averse"],
};

const DEMO_GROUP = {
  city: "Jaipur",
  members: [
    { name: "Rahul", adventure: 5, culture: 2, food: 3, relaxation: 1, shopping: 2, budget_priority: 3 },
    { name: "Priya", adventure: 1, culture: 4, food: 4, relaxation: 5, shopping: 3, budget_priority: 5 },
    { name: "Aman", adventure: 3, culture: 3, food: 5, relaxation: 2, shopping: 2, budget_priority: 2 },
    { name: "Neha", adventure: 2, culture: 5, food: 3, relaxation: 3, shopping: 4, budget_priority: 3 },
  ],
  candidateActivities: [
    "Trek to Nahargarh Fort",
    "Street food walk in Johari Bazaar",
    "Spa and sunset lake visit",
    "Bazaar shopping at Bapu Bazaar",
  ],
};

export default function App() {
  const [prompt, setPrompt] = useState(
    "Plan a 2 day trip to Jaipur for me. I love photography, street food and hate crowds."
  );
  const [activeTile, setActiveTile] = useState("AI Itinerary");

  const [itinerary, setItinerary] = useState(null);
  const [itineraryLoading, setItineraryLoading] = useState(true);
  const [itineraryError, setItineraryError] = useState(null);

  const [budget, setBudget] = useState(null);
  const [budgetLoading, setBudgetLoading] = useState(true);

  const [consensus, setConsensus] = useState(null);

  async function loadTrip(trip) {
    setItineraryLoading(true);
    setBudgetLoading(true);
    setItineraryError(null);
    try {
      const [itineraryRes, budgetRes] = await Promise.all([
        generateItinerary(trip),
        optimizeBudget({ totalBudgetInr: trip.budgetInr, days: trip.days, city: trip.city }),
      ]);
      setItinerary(itineraryRes);
      setBudget(budgetRes);
    } catch (err) {
      console.error(err);
      setItineraryError(err.message);
    } finally {
      setItineraryLoading(false);
      setBudgetLoading(false);
    }
  }

  useEffect(() => {
    loadTrip(DEFAULT_TRIP);
    runGroupConsensus(DEMO_GROUP).then(setConsensus).catch(console.error);
  }, []);

  function handlePromptSubmit() {
    // Lightweight heuristic parse for the demo. Swap this for a Groq call
    // that extracts {city, days, budget, vibe_tags} as structured JSON.
    const cityMatch = prompt.match(/trip to ([A-Za-z]+)/i);
    const daysMatch = prompt.match(/(\d+)\s*day/i);
    const budgetMatch = prompt.match(/₹?\s?(\d{3,6})/);

    const tags = [];
    if (/photograph/i.test(prompt)) tags.push("photography");
    if (/street food|food/i.test(prompt)) tags.push("street_food");
    if (/crowd/i.test(prompt)) tags.push("crowd_averse");

    loadTrip({
      city: cityMatch?.[1] ?? DEFAULT_TRIP.city,
      days: daysMatch ? parseInt(daysMatch[1]) : DEFAULT_TRIP.days,
      budgetInr: budgetMatch ? parseInt(budgetMatch[1]) : DEFAULT_TRIP.budgetInr,
      vibeTags: tags.length ? tags : DEFAULT_TRIP.vibeTags,
    });
  }

  return (
    <div className="flex min-h-screen bg-(--color-bg) text-(--color-text-primary)">
      <Sidebar activeLabel="Home" />

      <div className="flex-1 flex flex-col">
        <TopBar
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={handlePromptSubmit}
          userName="Palak"
        />

        <main className="flex-1 p-6 flex flex-col gap-6 max-w-6xl w-full mx-auto">
          <div>
            <h1 className="text-xl font-[var(--font-display)] font-semibold mb-1">
              Good morning, Palak 👋
            </h1>
            <p className="text-sm text-(--color-text-secondary)">
              Where are we exploring today?
            </p>
          </div>

          <QuickActionTiles activeTitle={activeTile} onSelect={setActiveTile} />

          <div className="grid grid-cols-3 gap-6 items-start">
            <div className="col-span-2 flex flex-col gap-6">
              <ItineraryCard
                itinerary={itinerary}
                loading={itineraryLoading}
                error={itineraryError}
              />
              <GroupConsensusCard consensus={consensus} memberCount={DEMO_GROUP.members.length} />
            </div>

            <BudgetPanel
              budget={budget}
              totalBudget={DEFAULT_TRIP.budgetInr}
              loading={budgetLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
