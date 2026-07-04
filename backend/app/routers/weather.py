from fastapi import APIRouter, HTTPException, Query
from app.services.weather_service import get_current_weather

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("/current")
def current_weather(city: str = Query(..., description="City name, e.g. Jaipur")):
    result = get_current_weather(city)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Couldn't fetch weather for '{city}' - check the city name or that OPENWEATHER_API_KEY is set in .env",
        )
    return result