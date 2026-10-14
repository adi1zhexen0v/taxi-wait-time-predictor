import Chip from "./Chip";
import { WEATHER_OPTIONS } from "@/utils";
import type { Weather } from "@/types";

export default function WeatherSelection({
  weather,
  onChange
}: {
  weather: Weather;
  onChange: (weather: Weather) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-bold">Weather</div>
      <div className="flex flex-wrap gap-2">
        {WEATHER_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            selected={weather === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
