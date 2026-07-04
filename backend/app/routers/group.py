from fastapi import APIRouter
from app.models.schemas import GroupConsensusRequest, GroupConsensusResponse
from app.services.consensus import run_consensus

router = APIRouter(prefix="/api/group", tags=["group"])


@router.post("/consensus", response_model=GroupConsensusResponse)
def consensus(req: GroupConsensusRequest):
    return run_consensus(req)
