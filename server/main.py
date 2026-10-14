from contextlib import asynccontextmanager
from datetime import datetime

import httpx
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.config import ASTANA_TIME_ZONE, CLIENT_ORIGINS
from app.external_apis import autocomplete_places, current_weather, driving_route, reverse_geocode
from app.model import load_model, predict_wait_minutes
from app.schemas import PredictionRequest, RouteRequest


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = load_model()
    app.state.http = httpx.AsyncClient(timeout=12)
    try:
        yield
    finally:
        await app.state.http.aclose()


app = FastAPI(title="Taxi Waiting-Time Predictor", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=CLIENT_ORIGINS, allow_methods=["GET", "POST"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": hasattr(app.state, "model")}


@app.get("/places/autocomplete")
async def autocomplete(q: str = Query(min_length=2, max_length=120)):
    places = await autocomplete_places(app.state.http, q)
    return {"places": places}


@app.get("/places/reverse")
async def reverse_place(lat: float = Query(ge=-90, le=90), lon: float = Query(ge=-180, le=180)):
    label = await reverse_geocode(app.state.http, lat, lon)
    return {"label": label}


@app.post("/route")
async def route(request: RouteRequest):
    distance_km, geometry = await driving_route(app.state.http, request.driver, request.passenger)
    return {"distance_km": round(distance_km, 2), "route": geometry}


@app.post("/predict/taxi")
async def predict_taxi(request: PredictionRequest):
    distance_km, geometry = await driving_route(app.state.http, request.driver, request.passenger)
    hour = request.hour if request.hour is not None else datetime.now(ASTANA_TIME_ZONE).hour
    weather = (
        await current_weather(app.state.http, request.passenger)
        if request.weather == "auto"
        else request.weather
    )
    minutes = predict_wait_minutes(app.state.model, distance_km, request.drivers_nearby, hour, weather)
    return {
        "wait_minutes": round(minutes, 1),
        "distance_km": round(distance_km, 2),
        "hour": hour,
        "weather": weather,
        "route": geometry,
    }
