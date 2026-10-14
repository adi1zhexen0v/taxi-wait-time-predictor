import cn from "classnames";
import { LocationDot } from "@/components/map";
import type { Location, Point } from "@/types";

type Props = {
  point: Point;
  location: Location;
  label: string;
  hasDivider: boolean;
  onEdit?: (point: Point) => void;
};

export default function RouteStop({ point, location, label, hasDivider, onEdit }: Props) {
  return (
    <div
      className={cn("flex items-center gap-3.5 py-2.5", {
        "border-b border-hairline-light": hasDivider
      })}
    >
      <LocationDot point={point} />
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-muted">{label}</div>
        <div className="truncate text-[15px] leading-snug font-bold">{location.label}</div>
      </div>
      {onEdit && (
        <button
          type="button"
          className="h-8 rounded-full bg-soft px-3 text-[13px] font-bold hover:bg-soft-hover"
          onClick={() => onEdit(point)}
        >
          Edit
        </button>
      )}
    </div>
  );
}
