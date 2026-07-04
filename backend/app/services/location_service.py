"""
Location Service - OpenStreetMap / Nominatim

No API key required. Nominatim is a free, community-run geocoding service.
Two rules to respect (per their usage policy):
  1. Max 1 request/second on the public server
  2. Must send a descriptive User-Agent header identifying the app

Docs: https://nominatim.org/release-docs/latest/api/Overview/
"""

import time
import httpx

NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org"
USER_AGENT = "VoyaAI/1.0 (student travel-planning project)"

_last_request_time = 0.0


def _rate_limit():
    """Enforce the 1 request/second rule Nominatim requires."""
    global _last_request_time
    elapsed = time.time() - _last_request_time
    if elapsed < 1.0:
        time.sleep(1.0 - elapsed)
    _last_request_time = time.time()


def geocode_place(query: str) -> dict | None:
    """
    Turn a place name into coordinates.
    Example: geocode_place("Nahargarh Fort, Jaipur")
    Returns {"lat": float, "lon": float, "display_name": str} or None if not found.
    """
    _rate_limit()
    try:
        resp = httpx.get(
            f"{NOMINATIM_BASE_URL}/search",
            params={"q": query, "format": "json", "limit": 1},
            headers={"User-Agent": USER_AGENT},
            timeout=10.0,
        )
        resp.raise_for_status()
        results = resp.json()
        if not results:
            return None
        top = results[0]
        return {
            "lat": float(top["lat"]),
            "lon": float(top["lon"]),
            "display_name": top["display_name"],
        }
    except Exception:
        return None


def reverse_geocode(lat: float, lon: float) -> str | None:
    """Turn coordinates back into a human-readable address."""
    _rate_limit()
    try:
        resp = httpx.get(
            f"{NOMINATIM_BASE_URL}/reverse",
            params={"lat": lat, "lon": lon, "format": "json"},
            headers={"User-Agent": USER_AGENT},
            timeout=10.0,
        )
        resp.raise_for_status()
        return resp.json().get("display_name")
    except Exception:
        return None