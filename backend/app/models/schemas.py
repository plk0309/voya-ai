from pydantic import BaseModel, Field
from typing import List, Optional


# ---------- Itinerary (Module 1: Personality-based local discovery) ----------

class ItineraryRequest(BaseModel):
    city: str
    days: int = Field(gt=0, le=14)
    budget_inr: int = Field(gt=0)
    vibe_tags: List[str] = []          # e.g. ["photography", "street_food", "crowd_averse"]
    notes: Optional[str] = None        # free-text, e.g. "I hate crowds"


class Place(BaseModel):
    name: str
    category: str
    description: str
    why_it_matches: Optional[str] = None
    best_time: Optional[str] = None
    est_cost_inr: Optional[str] = None
    distance_km: Optional[float] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    tags: List[str] = []


class ItineraryDay(BaseModel):
    day_number: int
    places: List[Place]


class ItineraryResponse(BaseModel):
    city: str
    days: int
    itinerary: List[ItineraryDay]


# ---------- Budget Optimizer (Module 2) ----------

class BudgetRequest(BaseModel):
    total_budget_inr: int = Field(gt=0)
    days: int = Field(gt=0, le=14)
    city: str


class BudgetBreakdown(BaseModel):
    stay_inr: int
    food_inr: int
    transport_inr: int
    activities_inr: int
    buffer_inr: int
    total_allocated_inr: int
    percent_used: float


# ---------- Group Consensus Engine (Module 3) ----------

class MemberPreference(BaseModel):
    name: str
    # weight 1-5 for how much each person cares about each dimension
    budget_priority: int = Field(ge=1, le=5, default=3)
    adventure: int = Field(ge=1, le=5, default=3)
    culture: int = Field(ge=1, le=5, default=3)
    food: int = Field(ge=1, le=5, default=3)
    relaxation: int = Field(ge=1, le=5, default=3)
    shopping: int = Field(ge=1, le=5, default=3)
    must_haves: List[str] = []
    deal_breakers: List[str] = []


class GroupConsensusRequest(BaseModel):
    city: str
    members: List[MemberPreference]
    # candidate activities the group is choosing between
    candidate_activities: List[str]


class ActivityScore(BaseModel):
    activity: str
    borda_score: int
    satisfaction_by_member: dict


class GroupConsensusResponse(BaseModel):
    ranked_activities: List[ActivityScore]
    overall_happiness_percent: float
    mediation_summary: str