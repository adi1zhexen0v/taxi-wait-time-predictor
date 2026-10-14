import os

import httpx
from fastapi import HTTPException

from .config import GEOAPIFY_URL, OPENWEATHER_URL
from .schemas import Location


async def fetch_json(client: httpx.AsyncClient, url: str, params: dict) -> dict:
    try:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="External map or weather service is unavailable") from exc


def require_key(name: str) -> str:
    key = os.getenv(name, "").strip()
    if not key:
        raise HTTPException(status_code=503, detail=f"{name} is not configured on the server")
    return key


async def autocomplete_places(client: httpx.AsyncClient, query: str) -> list[dict]:
    data = await fetch_json(
        client,
        f"{GEOAPIFY_URL}/geocode/autocomplete",
        {
            "text": query,
            "filter": "countrycode:kz",
            "bias": "proximity:71.4491,51.1694",
            "limit": 5,
            "format": "json",
            "apiKey": require_key("GEOAPIFY_API_KEY"),
        },
    )
    return [
        {"label": item.get("formatted", item.get("address_line1", "")), "lat": item["lat"], "lon": item["lon"]}
        for item in data.get("results", [])
        if "lat" in item and "lon" in item
    ]


async def reverse_geocode(client: httpx.AsyncClient, lat: float, lon: float) -> str:
    data = await fetch_json(
        client,
        f"{GEOAPIFY_URL}/geocode/reverse",
        {"lat": lat, "lon": lon, "format": "json", "apiKey": require_key("GEOAPIFY_API_KEY")},
    )
    results = data.get("results", [])
    label = results[0].get("formatted") if results else None
    return label or f"{lat:.5f}, {lon:.5f}"


async def driving_route(client: httpx.AsyncClient, driver: Location, passenger: Location) -> tuple[float, dict]:
    data = await fetch_json(
        client,
        f"{GEOAPIFY_URL}/routing",
        {
            "waypoints": f"{driver.lat},{driver.lon}|{passenger.lat},{passenger.lon}",
            "mode": "drive",
            "apiKey": require_key("GEOAPIFY_API_KEY"),
        },
    )
    features = data.get("features", [])
    if not features:
        raise HTTPException(status_code=422, detail="No driving route found between these locations")
    route = features[0]
    distance = route.get("properties", {}).get("distance")
    geometry = route.get("geometry")
    if not isinstance(distance, (int, float)) or not isinstance(geometry, dict):
        raise HTTPException(status_code=502, detail="Geoapify returned an incomplete route")
    return distance / 1000, geometry


async def current_weather(client: httpx.AsyncClient, passenger: Location) -> str:
    data = await fetch_json(
        client,
        OPENWEATHER_URL,
        {"lat": passenger.lat, "lon": passenger.lon, "appid": require_key("OPENWEATHER_API_KEY")},
    )
    conditions = data.get("weather", [])
    if not conditions:
        raise HTTPException(status_code=502, detail="OpenWeather returned no conditions")
    condition = conditions[0].get("main", "").lower()
    if condition == "snow":
        return "snow"
    if condition in {"rain", "drizzle", "thunderstorm"}:
        return "rain"
    return "clear"
