# VoyaAI — Plan like a local, not like a tourist

An AI travel planner built around three modules:

1. **Personality-Based Local Discovery** — hidden-gem itineraries via RAG (FAISS + all-MiniLM-L6-v2 + Groq LLaMA 3.1), with a graceful tag-matching fallback so the app runs even before you wire up embeddings.
2. **Budget Optimizer** — deterministic, explainable allocation across stay/food/transport/activities/buffer.
3. **Group Trip Consensus Engine** — Borda count social-choice algorithm that finds the fairest group itinerary and explains the compromise in plain language.

Future work (intentionally cut from v1 scope): live disruption re-planning, vernacular/Hindi RAG, travel memory personalization, gamified local challenges, crowd prediction, AI travel journal.

---

## Project structure

```
voya-ai/
├── backend/           FastAPI app (Python)
│   ├── app/
│   │   ├── main.py            entrypoint
│   │   ├── routers/           /api/itinerary, /api/budget, /api/group
│   │   ├── services/          rag_service, budget_optimizer, consensus (the real logic)
│   │   ├── models/schemas.py  pydantic request/response models
│   │   ├── core/config.py     settings from .env
│   │   └── data/               jaipur_places.json (starter dataset)
│   ├── requirements.txt
│   └── .env.example
└── frontend/           React + Vite + Tailwind v4
    └── src/
        ├── components/    Sidebar, TopBar, ItineraryCard, BudgetPanel, GroupConsensusCard
        ├── api/client.js  fetch wrapper for the backend
        └── App.jsx        wires it all together
```

---

## Setup on Windows (CMD)

### 1. Backend

```cmd
cd /d D:\voya-ai\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Open `.env` and add your Groq API key (get one free at https://console.groq.com). Without it, the itinerary endpoint still works — it just skips the AI-generated "why this matches you" line and uses a rule-based explanation instead.

Run the backend:

```cmd
uvicorn app.main:app --reload --port 8000
```

Check it's alive: open http://localhost:8000 in a browser — you should see `{"status": "ok"}`. Full interactive API docs are at http://localhost:8000/docs.

### 2. Frontend

Open a **second** CMD window:

```cmd
cd /d D:\voya-ai\frontend
npm install
npm run dev
```

Open http://localhost:5173 — the dashboard should load with a live demo trip (Jaipur, 2 days, ₹8,000, photography/street-food/crowd-averse) pulled from your running backend.

---

## What's real vs. what's a starting point

**Fully working right now:**
- Budget optimizer (`backend/app/services/budget_optimizer.py`) — real allocation logic, no mocks
- Group consensus engine (`backend/app/services/consensus.py`) — real Borda count implementation, tested end-to-end
- Itinerary generation (`backend/app/services/rag_service.py`) — real tag-matching retrieval over `jaipur_places.json`, with Groq wired in for the explanation text if you add an API key

**Needs your input to go further:**
- `app/data/jaipur_places.json` has 8 sample places to get you started — expand this to 40-60 real curated entries, and add a second city (copy the same JSON shape into e.g. `delhi_places.json`)
- Semantic search (FAISS + embeddings) is coded with a try/except fallback in `rag_service.py` — once you `pip install sentence-transformers faiss-cpu` and have internet to download the model, it'll automatically start using real embeddings instead of tag matching (see the `_USE_SEMANTIC` flag)
- The prompt-bar-to-structured-data parsing in `App.jsx` (`handlePromptSubmit`) is a regex heuristic for the demo — replace it with a Groq call that extracts `{city, days, budget, vibe_tags}` as JSON for real conversational input
- Auth, PostgreSQL persistence (saved trips, user accounts), and the "Local Challenges" tile are stubbed/hidden — build these next per your original module priority order

---

## API reference (quick)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/itinerary/generate` | POST | `{city, days, budget_inr, vibe_tags[]}` → personalized day-by-day plan |
| `/api/budget/optimize` | POST | `{total_budget_inr, days, city}` → stay/food/transport/activities/buffer split |
| `/api/group/consensus` | POST | `{city, members[], candidate_activities[]}` → ranked activities + happiness % + mediation summary |

Full request/response schemas are in `backend/app/models/schemas.py`, and interactive testing is available at `/docs` once the backend is running.
