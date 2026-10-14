import os
from pathlib import Path
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

SERVER_DIR = Path(__file__).resolve().parent.parent
load_dotenv(SERVER_DIR / ".env")

GEOAPIFY_URL = "https://api.geoapify.com/v1"
OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
ASTANA_TIME_ZONE = ZoneInfo("Asia/Almaty")
FEATURES = ["driver_distance_km", "drivers_nearby", "hour", "weather"]
WEATHER_CODES = {"clear": 0, "rain": 1, "snow": 2}

MODEL_PATH = SERVER_DIR / "taxi_app_model.joblib"

CLIENT_ORIGINS = [
    origin.strip() for origin in os.getenv("CLIENT_ORIGINS", "http://localhost:5173").split(",") if origin.strip()
]
