import { axiosInstance } from "./instance";
import type { Location } from "@/types";

export async function autocomplete(query: string, signal: AbortSignal) {
  const { data } = await axiosInstance.get<{ places: Location[] }>("/places/autocomplete", {
    params: { q: query.trim() },
    signal
  });
  return data.places;
}

export async function reversePlace(location: Location, signal: AbortSignal) {
  const { data } = await axiosInstance.get<{ label: string }>("/places/reverse", {
    params: { lat: location.lat, lon: location.lon },
    signal
  });
  return data.label;
}
