"""
Weather Service - OpenWeather (free Current Weather API)

Uses the classic /data/2.5/weather endpoint, NOT One Call 3.0/4.0.
This endpoint is covered by the no-card-required free tier:
60 calls/minute, 1,000,000 calls/month.

Docs: https://openweathermap.org/current
"""

import httpx
from app.core.config import settings

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


def get_current_weather(city: str) -> dict | None:
    """
    Returns {"city": str, "temp_c": float, "condition": str, "icon": str} or None
    if the city isn't found or the API key isn't configured yet.
    """
    if not settings.openweather_api_key:
        return None

    try:
        resp = httpx.get(
            BASE_URL,
            params={
                "q": city,
                "appid": settings.openweather_api_key,
                "units": "metric",  # Celsius
            },
            timeout=10.0,
        )
        resp.raise_for_status()
        data = resp.json()
        return {
            "city": data.get("name", city),
            "temp_c": data["main"]["temp"],
            "condition": data["weather"][0]["description"].title(),
            "icon": data["weather"][0]["icon"],  # e.g. "01d" - see OpenWeather icon docs
        }
    except Exception:
        return None