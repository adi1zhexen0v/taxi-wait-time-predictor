import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { centerOnPin, DRIVER_START, PIN_Y } from "@/utils";
import type { Location, Step } from "@/types";

export default function MapEvents({
  step,
  onCandidate
}: {
  step: Step;
  onCandidate: (location: Location) => void;
}) {
  const map = useMap();
  const pick = step === "driver" || step === "passenger";

  useMapEvents({
    click(event) {
      if (!pick) return;
      const point = map.latLngToContainerPoint(event.latlng);
      map.panBy([point.x - map.getSize().x / 2, point.y - PIN_Y]);
    },
    moveend() {
      if (!pick) return;
      const point = map.containerPointToLatLng([map.getSize().x / 2, PIN_Y]);
      onCandidate({
        lat: point.lat,
        lon: point.lng,
        label: point.lat.toFixed(5) + ", " + point.lng.toFixed(5)
      });
    }
  });

  useEffect(() => {
    centerOnPin(map, DRIVER_START);
  }, [map]);

  return null;
}
