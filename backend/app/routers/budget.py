from fastapi import APIRouter
from app.models.schemas import BudgetRequest, BudgetBreakdown
from app.services.budget_optimizer import optimize_budget

router = APIRouter(prefix="/api/budget", tags=["budget"])


@router.post("/optimize", response_model=BudgetBreakdown)
def optimize(req: BudgetRequest):
    return optimize_budget(req)
