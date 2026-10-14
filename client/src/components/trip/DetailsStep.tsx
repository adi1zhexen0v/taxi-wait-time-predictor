import type { Dispatch, SetStateAction } from "react";
import { DriversNearby, TimeSelection, WeatherSelection } from "@/components/controls";
import RouteSummary from "./RouteSummary";
import type { Location, Point, Route, Weather } from "@/types";

type Props = {
  driver: Location;
  passenger: Location;
  route: Route | null;
  routeLoading: boolean;
  timeKey: string;
  customHourActive: boolean;
  onSelectTime: (hour: string) => void;
  onChooseCustomHour: () => void;
  onAdjustCustomHour: (change: number) => void;
  weather: Weather;
  setWeather: (weather: Weather) => void;
  driversNearby: number;
  setDriversNearby: Dispatch<SetStateAction<number>>;
  loading: boolean;
  error: string;
  onEdit: (point: Point) => void;
  onPredict: () => void;
  clock: string;
};

export default function DetailsStep({
  driver,
  passenger,
  route,
  routeLoading,
  timeKey,
  customHourActive,
  onSelectTime,
  onChooseCustomHour,
  onAdjustCustomHour,
  weather,
  setWeather,
  driversNearby,
  setDriversNearby,
  loading,
  error,
  onEdit,
  onPredict,
  clock
}: Props) {
  const distance = routeLoading ? "Routing…" : route ? `${route.distance_km.toFixed(2)} km` : "—";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="text-2xl leading-tight font-extrabold tracking-tight">Trip conditions</h1>
        <span className="whitespace-nowrap text-sm font-bold text-muted">{distance}</span>
      </div>
      <RouteSummary driver={driver} passenger={passenger} onEdit={onEdit} />
      <TimeSelection
        clock={clock}
        timeKey={timeKey}
        customHourActive={customHourActive}
        onSelectTime={onSelectTime}
        onChooseCustomHour={onChooseCustomHour}
        onAdjustCustomHour={onAdjustCustomHour}
      />
      <WeatherSelection weather={weather} onChange={setWeather} />
      <DriversNearby count={driversNearby} onChange={setDriversNearby} />
      {error && (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      )}
      <button
        type="button"
        className="h-14 rounded-control bg-ink text-[17px] font-bold text-white hover:bg-ink-hover disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
        onClick={onPredict}
      >
        {loading ? "Calculating…" : "Estimate waiting time"}
      </button>
    </div>
  );
}
