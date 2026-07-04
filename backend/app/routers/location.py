from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.location_service import geocode_place

router = APIRouter(prefix="/api/location", tags=["location"])


class GeocodeRequest(BaseModel):
    query: str


@router.post("/geocode")
def geocode(req: GeocodeRequest):
    result = geocode_place(req.query)
    if result is None:
        raise HTTPException(status_code=404, detail=f"No location found for '{req.query}'")
    return result