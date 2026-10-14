import { useEffect, useMemo, useRef } from "react";
import type { Marker as LeafletMarker } from "leaflet";
import { Marker, useMap } from "react-leaflet";
import { carIcon, routeLines } from "@/utils";
import type { Geometry } from "@/types";

export default function MovingCar({ geometry, minutes }: { geometry: Geometry; minutes: number }) {
  const map = useMap();
  const marker = useRef<LeafletMarker | null>(null);
  const points = useMemo(() => routeLines(geometry).flat(), [geometry]);

  useEffect(() => {
    if (!marker.current || points.length < 2) return;
    const lengths = points.slice(1).map((point, index) => map.distance(points[index], point));
    const total = lengths.reduce((sum, length) => sum + length, 0);
    const start = performance.now();
    let frame = 0;

    function animate(now: number) {
      let remaining = Math.min(1, ((now - start) % 15500) / 14000) * total;
      let index = 0;
      while (index < lengths.length - 1 && remaining > lengths[index]) {
        remaining -= lengths[index];
        index += 1;
      }
      const fraction = lengths[index] ? Math.min(1, remaining / lengths[index]) : 0;
      const from = points[index];
      const to = points[index + 1];
      marker.current?.setLatLng([
        from[0] + (to[0] - from[0]) * fraction,
        from[1] + (to[1] - from[1]) * fraction
      ]);
      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [map, points]);

  if (!points.length) return null;
  return (
    <Marker
      ref={marker}
      position={points[0]}
      icon={carIcon(minutes)}
      interactive={false}
      zIndexOffset={1000}
    />
  );
}
