import joblib
import pandas as pd

from .config import FEATURES, MODEL_PATH, WEATHER_CODES


def load_model():
    model = joblib.load(MODEL_PATH)
    if list(model.feature_names_in_) != FEATURES:
        raise RuntimeError("Model feature order does not match the Week 1 notebook")
    return model


def predict_wait_minutes(model, distance_km: float, drivers_nearby: int, hour: int, weather: str) -> float:
    features = pd.DataFrame(
        [[distance_km, drivers_nearby, hour, WEATHER_CODES[weather]]], columns=FEATURES
    )
    return float(model.predict(features)[0])
