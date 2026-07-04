"""
Group Trip Consensus Engine

Core algorithm: Borda count (a social-choice / voting theory method).

Why Borda count and not simple averaging:
    Averaging lets one person's extreme low score veto an activity everyone
    else loves. Borda count instead has each member RANK all candidate
    activities, then assigns points by rank position (top choice gets the
    most points). Summing points across members produces a group ranking
    that resists domination by any single member while still respecting
    everyone's ordering of preferences.

Steps:
    1. For each member, score every activity using their preference weights
       against a keyword->dimension tag map.
    2. Convert each member's scores into a RANKING of activities.
    3. Assign Borda points per rank (n-1 points for 1st choice, n-2 for 2nd, ... 0 for last).
    4. Sum Borda points across members -> final group ranking.
    5. Compute "overall happiness" = how close the winning activity is to
       each member's personal top choice, averaged.
"""

from typing import List, Dict
from app.models.schemas import GroupConsensusRequest, ActivityScore, GroupConsensusResponse

# Lightweight keyword -> preference-dimension mapping.
# Extend this as you add more activities / cities.
ACTIVITY_TAGS: Dict[str, List[str]] = {
    "trek": ["adventure"],
    "hike": ["adventure"],
    "rafting": ["adventure"],
    "paragliding": ["adventure"],
    "museum": ["culture"],
    "temple": ["culture"],
    "heritage": ["culture"],
    "fort": ["culture"],
    "workshop": ["culture"],
    "street food": ["food"],
    "food walk": ["food"],
    "cafe": ["food", "relaxation"],
    "restaurant": ["food"],
    "spa": ["relaxation"],
    "sunset": ["relaxation"],
    "sunrise": ["relaxation"],
    "lake": ["relaxation"],
    "market": ["shopping"],
    "bazaar": ["shopping"],
    "mall": ["shopping"],
}

DIMENSIONS = ["adventure", "culture", "food", "relaxation", "shopping"]


def _infer_tags(activity: str) -> List[str]:
    activity_lower = activity.lower()
    tags = set()
    for keyword, dims in ACTIVITY_TAGS.items():
        if keyword in activity_lower:
            tags.update(dims)
    if not tags:
        tags.add("culture")  # neutral default so every activity still scores something
    return list(tags)


def _member_score(member, activity_tags: List[str]) -> float:
    dim_weights = {
        "adventure": member.adventure,
        "culture": member.culture,
        "food": member.food,
        "relaxation": member.relaxation,
        "shopping": member.shopping,
    }
    if not activity_tags:
        return 0.0
    return sum(dim_weights[t] for t in activity_tags) / len(activity_tags)


def run_consensus(req: GroupConsensusRequest) -> GroupConsensusResponse:
    activities = req.candidate_activities
    members = req.members
    n = len(activities)

    if n == 0 or not members:
        return GroupConsensusResponse(
            ranked_activities=[],
            overall_happiness_percent=0.0,
            mediation_summary="Add at least one activity and one member to run consensus.",
        )

    # Step 1 + 2: per-member raw scores, then rank -> Borda points
    borda_totals = {a: 0 for a in activities}
    satisfaction_by_member_per_activity = {a: {} for a in activities}
    member_top_choice = {}

    for member in members:
        scored = [
            (a, _member_score(member, _infer_tags(a)))
            for a in activities
        ]
        # Sort descending by score -> ranking for this member
        ranked = sorted(scored, key=lambda x: x[1], reverse=True)
        member_top_choice[member.name] = ranked[0][0]

        # Assign Borda points: top rank gets (n-1), last gets 0
        for rank_index, (activity, score) in enumerate(ranked):
            points = (n - 1) - rank_index
            borda_totals[activity] += points
            satisfaction_by_member_per_activity[activity][member.name] = round(score, 1)

    # Step 4: final ranking by total Borda points
    final_ranking = sorted(borda_totals.items(), key=lambda x: x[1], reverse=True)

    ranked_activities = [
        ActivityScore(
            activity=activity,
            borda_score=points,
            satisfaction_by_member=satisfaction_by_member_per_activity[activity],
        )
        for activity, points in final_ranking
    ]

    # Step 5: overall happiness = % of members whose top choice is
    # either the winner, or scores within 1 point of their personal best
    winner = final_ranking[0][0]
    happy_count = sum(
        1 for name, top in member_top_choice.items() if top == winner
    )
    # partial credit for members who didn't get their #1 pick
    partial_credit = 0.0
    for member in members:
        if member_top_choice[member.name] != winner:
            winner_score = satisfaction_by_member_per_activity[winner][member.name]
            top_score = satisfaction_by_member_per_activity[member_top_choice[member.name]][member.name]
            if top_score > 0:
                partial_credit += winner_score / top_score

    happiness_raw = happy_count + partial_credit
    overall_happiness_percent = round((happiness_raw / len(members)) * 100, 1)
    overall_happiness_percent = min(overall_happiness_percent, 100.0)

    # Human-readable mediation summary
    conflicting = [
        m.name for m in members if member_top_choice[m.name] != winner
    ]
    if conflicting:
        summary = (
            f"'{winner}' won the group vote. "
            f"{', '.join(conflicting)} preferred something else, but '{winner}' "
            f"scored close enough on their priorities to be a fair compromise."
        )
    else:
        summary = f"'{winner}' was every member's top choice — no compromise needed."

    return GroupConsensusResponse(
        ranked_activities=ranked_activities,
        overall_happiness_percent=overall_happiness_percent,
        mediation_summary=summary,
    )
