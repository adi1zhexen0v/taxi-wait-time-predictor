import type { Location, Weather } from "@/types";

export const PIN_Y = 300;
export const DRIVER_START: Location = {
  lat: 51.13193,
  lon: 71.40289,
  label: "51.13193, 71.40289"
};
export const PASSENGER_START: Location = {
  lat: 51.08929,
  lon: 71.41611,
  label: "51.08929, 71.41611"
};
export const PRESET_HOURS = [8, 13, 18, 23];
export const WEATHER_OPTIONS: { value: Weather; label: string }[] = [
  { value: "auto", label: "Live weather" },
  { value: "clear", label: "Clear" },
  { value: "rain", label: "Rain" },
  { value: "snow", label: "Snow" }
];
