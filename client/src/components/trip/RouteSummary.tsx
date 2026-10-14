import RouteStop from "./RouteStop";
import type { Location, Point } from "@/types";

export default function RouteSummary({
  driver,
  passenger,
  onEdit
}: {
  driver: Location;
  passenger: Location;
  onEdit?: (point: Point) => void;
}) {
  const locations: { point: Point; location: Location; label: string }[] = [
    { point: "driver", location: driver, label: "Driver" },
    { point: "passenger", location: passenger, label: "Passenger" }
  ];

  return (
    <div className="rounded-control border border-hairline px-3.5 py-1">
      {locations.map(({ point, location, label }, index) => (
        <RouteStop
          key={point}
          point={point}
          location={location}
          label={label}
          hasDivider={index === 0}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
