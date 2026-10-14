import { axiosInstance } from "./instance";
import type { Location, Route } from "@/types";

export async function fetchRoute(driver: Location, passenger: Location) {
  const { data } = await axiosInstance.post<Route>("/route", {
    driver: { lat: driver.lat, lon: driver.lon },
    passenger: { lat: passenger.lat, lon: passenger.lon }
  });
  return data;
}
