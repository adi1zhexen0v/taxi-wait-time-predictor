import type { RefObject } from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import MapEvents from "./MapEvents";
import MovingCar from "./MovingCar";
import { DRIVER_START, driverIcon, passengerIcon, routeLines } from "@/utils";
import type { Location, Route, Step } from "@/types";

const mapCenter: [number, number] = [DRIVER_START.lat, DRIVER_START.lon];

export default function TaxiMap({
  mapRef,
  step,
  driver,
  passenger,
  route,
  waitMinutes,
  onCandidate
}: {
  mapRef: RefObject<LeafletMap | null>;
  step: Step;
  driver: Location | null;
  passenger: Location | null;
  route: Route | null;
  waitMinutes: number | null;
  onCandidate: (location: Location) => void;
}) {
  const driverPosition: [number, number] | null =
    driver && step !== "driver" ? [driver.lat, driver.lon] : null;
  const passengerPosition: [number, number] | null =
    passenger && step !== "passenger" ? [passenger.lat, passenger.lon] : null;
  const routeSegments =
    route && (step === "details" || step === "result") ? routeLines(route.route) : [];

  return (
    <MapContainer
      ref={mapRef}
      center={mapCenter}
      zoom={15}
      zoomControl={false}
      className="absolute inset-0 z-0 h-full w-full"
    >
      <TileLayer
        attribution="Tiles © Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
      />
      <MapEvents step={step} onCandidate={onCandidate} />
      {driverPosition && <Marker position={driverPosition} icon={driverIcon} interactive={false} />}
      {passengerPosition && (
        <Marker position={passengerPosition} icon={passengerIcon} interactive={false} />
      )}
      {routeSegments.map((line, index) => (
        <Polyline
          key={index}
          positions={line}
          pathOptions={{ color: "#111", weight: 4, opacity: 0.9 }}
        />
      ))}
      {route && step === "result" && waitMinutes !== null && (
        <MovingCar geometry={route.route} minutes={waitMinutes} />
      )}
    </MapContainer>
  );
}
