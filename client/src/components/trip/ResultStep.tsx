import RouteSummary from "./RouteSummary";
import type { Location, Prediction } from "@/types";

export default function ResultStep({
  driver,
  passenger,
  prediction,
  driversNearby,
  onAdjust,
  onNewTrip
}: {
  driver: Location;
  passenger: Location;
  prediction: Prediction;
  driversNearby: number;
  onAdjust: () => void;
  onNewTrip: () => void;
}) {
  const statItems = [
    ["Route", prediction.distance_km.toFixed(1) + " km"],
    ["Time", String(prediction.hour).padStart(2, "0") + ":00"],
    ["Weather", prediction.weather.charAt(0).toUpperCase() + prediction.weather.slice(1)],
    ["Drivers", String(driversNearby)]
  ];
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[15px] font-semibold text-muted">Your driver is on the way</p>
        <h1 className="mt-0.5 text-[28px] leading-tight font-extrabold tracking-tight">
          Arrives in {prediction.wait_minutes.toFixed(1)} min
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {statItems.map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-xl bg-soft p-2.5">
            <div className="text-[11px] font-semibold text-muted">{label}</div>
            <div className="truncate text-sm font-extrabold" title={value}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <RouteSummary driver={driver} passenger={passenger} />
      <div className="grid grid-cols-[1fr_1.4fr] gap-2.5">
        <button
          type="button"
          className="h-13.5 rounded-control bg-soft text-base font-bold hover:bg-soft-hover"
          onClick={onAdjust}
        >
          Adjust
        </button>
        <button
          type="button"
          className="h-13.5 rounded-control bg-ink text-base font-bold text-white hover:bg-ink-hover"
          onClick={onNewTrip}
        >
          New estimate
        </button>
      </div>
    </div>
  );
}
