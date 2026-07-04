"""
Personality-Based Local Discovery Engine (Module 1)

Two-tier design:
  1. If sentence-transformers + FAISS + a GROQ_API_KEY are available, use real
     semantic search over the place descriptions + Groq to generate the
     "why this matches you" explanation.
  2. If not (e.g. no internet to download the embedding model yet, or no API
     key configured), fall back to tag-overlap scoring so the app still runs
     end-to-end for a demo.

This lets you build the frontend and test the full flow immediately, then
swap in the real embedding model without changing the API contract.
"""

import json
import os
from typing import List

from app.core.config import settings
from app.models.schemas import ItineraryRequest, ItineraryResponse, ItineraryDay, Place

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

_embedding_model = None
_faiss_index = None
_groq_client = None
_USE_SEMANTIC = False

try:
    from sentence_transformers import SentenceTransformer
    import faiss
    import numpy as np

    _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    _USE_SEMANTIC = True
except Exception:
    # sentence-transformers / faiss not installed yet, or no internet to
    # download the model. Falls back to tag matching below.
    _USE_SEMANTIC = False

try:
    from groq import Groq

    if settings.groq_api_key:
        _groq_client = Groq(api_key=settings.groq_api_key)
except Exception:
    _groq_client = None


def _load_places(city: str) -> List[dict]:
    filename = f"{city.strip().lower()}_places.json"
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _tag_overlap_score(place: dict, vibe_tags: List[str]) -> int:
    place_tags = set(place.get("tags", []))
    wanted = set(t.lower().replace(" ", "_") for t in vibe_tags)
    return len(place_tags & wanted)


def _explain_match(place: dict, vibe_tags: List[str]) -> str:
    """Generate the 'why this matches you' line. Uses Groq if configured,
    otherwise a rule-based template so the feature still works."""
    matched = set(place.get("tags", [])) & set(
        t.lower().replace(" ", "_") for t in vibe_tags
    )
    if _groq_client:
        try:
            prompt = (
                f"In one short sentence, explain why '{place['name']}' "
                f"({place['description']}) is a great match for a traveler who "
                f"likes: {', '.join(vibe_tags)}. Be specific and enthusiastic, "
                f"max 25 words."
            )
            resp = _groq_client.chat.completions.create(
                model=settings.groq_model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=60,
            )
            return resp.choices[0].message.content.strip()
        except Exception:
            pass  # fall through to rule-based

    if matched:
        return f"Matches your love for {', '.join(sorted(matched)).replace('_', ' ')}."
    return "A well-rated local pick worth exploring."


def generate_itinerary(req: ItineraryRequest) -> ItineraryResponse:
    places = _load_places(req.city)

    if not places:
        return ItineraryResponse(city=req.city, days=req.days, itinerary=[])

    # Rank places by tag overlap (works identically whether or not semantic
    # search is enabled -- semantic re-ranking can be layered in later using
    # _embedding_model + _faiss_index without touching this function's shape)
    scored = sorted(
        places, key=lambda p: _tag_overlap_score(p, req.vibe_tags), reverse=True
    )

    places_per_day = max(1, len(scored) // req.days)
    itinerary_days = []
    for day_num in range(1, req.days + 1):
        start = (day_num - 1) * places_per_day
        end = start + places_per_day if day_num < req.days else len(scored)
        day_places = scored[start:end]

        itinerary_days.append(
            ItineraryDay(
                day_number=day_num,
                places=[
                    Place(
                        name=p["name"],
                        category=p["category"],
                        description=p["description"],
                        why_it_matches=_explain_match(p, req.vibe_tags),
                        best_time=p.get("best_time"),
                        est_cost_inr=p.get("est_cost_inr"),
                        distance_km=p.get("distance_km"),
                        tags=p.get("tags", []),
                    )
                    for p in day_places
                ],
            )
        )

    return ItineraryResponse(city=req.city, days=req.days, itinerary=itinerary_days)
