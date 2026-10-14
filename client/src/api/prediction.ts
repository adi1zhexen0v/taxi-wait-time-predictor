import { axiosInstance } from "./instance";
import type { Location, Prediction, Weather } from "@/types";

export async function fetchPrediction(input: {
  driver: Location;
  passenger: Location;
  driversNearby: number;
  hour: string;
  weather: Weather;
}) {
  const { data } = await axiosInstance.post<Prediction>("/predict/taxi", {
    driver: { lat: input.driver.lat, lon: input.driver.lon },
    passenger: { lat: input.passenger.lat, lon: input.passenger.lon },
    drivers_nearby: input.driversNearby,
    hour: input.hour === "auto" ? null : Number(input.hour),
    weather: input.weather
  });
  return data;
}
