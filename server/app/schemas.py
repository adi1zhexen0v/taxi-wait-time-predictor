from pydantic import BaseModel, Field


class Location(BaseModel):
    lat: float = Field(ge=-90, le=90)
    lon: float = Field(ge=-180, le=180)


class PredictionRequest(BaseModel):
    driver: Location
    passenger: Location
    drivers_nearby: int = Field(ge=0, le=100)
    hour: int | None = Field(default=None, ge=0, le=23)
    weather: str = Field(default="auto", pattern="^(auto|clear|rain|snow)$")


class RouteRequest(BaseModel):
    driver: Location
    passenger: Location
