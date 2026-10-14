import type { Map as LeafletMap } from "leaflet";
import { PIN_Y } from "./consts";
import type { Geometry, Location, Route } from "@/types";

export function coordinates(location: Location) {
  return location.lat.toFixed(5) + ", " + location.lon.toFixed(5);
}

export function clockInAstana(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Almaty",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

export function routeLines(geometry: Geometry): [number, number][][] {
  const lines =
    geometry.type === "LineString"
      ? [geometry.coordinates as number[][]]
      : (geometry.coordinates as number[][][]);
  return lines.map((line) => line.map(([lon, lat]) => [lat, lon]));
}

export function centerOnPin(map: LeafletMap, location: Location) {
  map.setView([location.lat, location.lon], 15, { animate: false });
  map.panBy([0, map.getSize().y / 2 - PIN_Y], { animate: false });
}

export function fitTrip(
  map: LeafletMap,
  driver: Location,
  passenger: Location,
  route: Route | null
) {
  const points = route
    ? routeLines(route.route).flat()
    : [
        [driver.lat, driver.lon],
        [passenger.lat, passenger.lon]
      ];
  const bottomPadding = Math.min(440, Math.max(180, map.getSize().y - 230));
  map.fitBounds(points as [number, number][], {
    paddingTopLeft: [40, 120],
    paddingBottomRight: [40, bottomPadding],
    maxZoom: 16
  });
}
