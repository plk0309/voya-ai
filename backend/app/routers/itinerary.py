from fastapi import APIRouter
from app.models.schemas import ItineraryRequest, ItineraryResponse
from app.services.rag_service import generate_itinerary

router = APIRouter(prefix="/api/itinerary", tags=["itinerary"])


@router.post("/generate", response_model=ItineraryResponse)
def create_itinerary(req: ItineraryRequest):
    return generate_itinerary(req)
