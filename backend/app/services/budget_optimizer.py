"""
Budget Optimizer

Deterministic, explainable budget allocation. Deliberately NOT a black box:
every rupee allocated can be traced back to a simple rule, which matters
when you have to explain this in an interview.

Allocation logic:
    - Splits total budget across stay / food / transport / activities / buffer
    - Base percentages are adjusted slightly based on trip length
      (longer trips shift more weight to stay, shorter trips shift more to activities)
    - A fixed ~8% buffer is always reserved for emergencies
"""

from app.models.schemas import BudgetRequest, BudgetBreakdown

BASE_SPLIT = {
    "stay": 0.35,
    "food": 0.25,
    "transport": 0.15,
    "activities": 0.17,
    "buffer": 0.08,
}


def optimize_budget(req: BudgetRequest) -> BudgetBreakdown:
    split = dict(BASE_SPLIT)

    # Longer trips: stay dominates more, activities shrink slightly per-day
    if req.days >= 5:
        split["stay"] += 0.05
        split["activities"] -= 0.05
    elif req.days <= 2:
        split["activities"] += 0.05
        split["stay"] -= 0.05

    total = req.total_budget_inr

    stay = round(total * split["stay"])
    food = round(total * split["food"])
    transport = round(total * split["transport"])
    activities = round(total * split["activities"])
    buffer_amt = total - (stay + food + transport + activities)  # absorb rounding here

    allocated = stay + food + transport + activities + buffer_amt

    return BudgetBreakdown(
        stay_inr=stay,
        food_inr=food,
        transport_inr=transport,
        activities_inr=activities,
        buffer_inr=buffer_amt,
        total_allocated_inr=allocated,
        percent_used=round((allocated / total) * 100, 1),
    )
