import { useEffect, useState } from "react";
import { LocationDot } from "@/components/map";
import { autocomplete } from "@/api";
import type { Location, Point } from "@/types";

type Props = {
  point: Point;
  location: Location;
  query: string;
  reverseLoading: boolean;
  onQueryChange: (query: string) => void;
  onSelect: (location: Location) => void;
};

export default function PlaceSearch({
  point,
  location,
  query,
  reverseLoading,
  onQueryChange,
  onSelect
}: Props) {
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query === location.label || query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        setSuggestions(await autocomplete(query, controller.signal));
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Address search failed");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, location.label]);

  function changeQuery(value: string) {
    onQueryChange(value);
    setSuggestions([]);
    setError("");
    setLoading(false);
  }

  const addressHint = reverseLoading ? (
    <span role="status">
      Loading
      <span className="loading-dots" aria-hidden="true">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </span>
  ) : loading ? (
    "Searching…"
  ) : (
    `Astana · ${location.lat.toFixed(5)}, ${location.lon.toFixed(5)}`
  );

  return (
    <div>
      <label
        htmlFor="place-search"
        className="flex min-h-14 items-center gap-3.5 rounded-control bg-soft px-4 py-3"
      >
        <LocationDot point={point} size="medium" halo />
        <span className="min-w-0 flex-1">
          <input
            id="place-search"
            className="w-full min-w-0 bg-transparent text-base leading-snug font-bold text-ink outline-none placeholder:text-neutral-400"
            value={query}
            placeholder="Search an address"
            autoComplete="off"
            onChange={(event) => changeQuery(event.target.value)}
          />
          <span className="block truncate text-[13px] leading-snug font-medium text-muted">
            {addressHint}
          </span>
        </span>
      </label>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {suggestions.length > 0 && (
        <ul className="mt-2 max-h-36 overflow-y-auto rounded-control border border-hairline bg-white p-1 shadow-lg">
          {suggestions.map((place, index) => (
            <li key={place.lat + "-" + place.lon + "-" + index}>
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-ink hover:bg-soft focus:bg-soft"
                onClick={() => {
                  onSelect(place);
                  setSuggestions([]);
                }}
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
