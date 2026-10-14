import { PlaceSearch } from "@/components/controls";
import StepProgress from "./StepProgress";
import type { Location, Point } from "@/types";

export default function PickStep({
  point,
  candidate,
  query,
  reverseLoading,
  error,
  onQueryChange,
  onSelect,
  onConfirm
}: {
  point: Point;
  candidate: Location;
  query: string;
  reverseLoading: boolean;
  error: string;
  onQueryChange: (value: string) => void;
  onSelect: (location: Location) => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <StepProgress point={point} />
        <h1 className="mt-2 text-2xl leading-tight font-extrabold tracking-tight">
          Where is the {point}?
        </h1>
        <p className="mt-1 text-sm leading-snug font-medium text-muted">
          Move the map, tap, or search to place the pin
        </p>
      </div>
      <PlaceSearch
        point={point}
        location={candidate}
        query={query}
        reverseLoading={reverseLoading}
        onQueryChange={onQueryChange}
        onSelect={onSelect}
      />
      {error && (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      )}
      <button
        type="button"
        className="h-14 rounded-control bg-ink text-[17px] font-bold text-white hover:bg-ink-hover active:scale-[.985]"
        onClick={onConfirm}
      >
        Confirm {point} location
      </button>
    </div>
  );
}
