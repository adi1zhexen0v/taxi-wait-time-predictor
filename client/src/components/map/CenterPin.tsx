import cn from "classnames";
import { PIN_Y } from "@/utils";
import type { Point } from "@/types";

export default function CenterPin({ point }: { point: Point }) {
  return (
    <div className="pointer-events-none absolute left-1/2 z-950" style={{ top: PIN_Y }}>
      <div className="absolute -top-1 -left-1.5 h-1.5 w-3 rounded-full bg-black/30" />
      <div className="absolute bottom-0 -left-6 flex w-12 flex-col items-center">
        <div
          className={cn("grid size-10 place-items-center rounded-full shadow-lg", {
            "bg-ink": point === "driver",
            "bg-brand": point === "passenger"
          })}
        >
          <div className="size-3 rounded-full bg-white" />
        </div>
        <div
          className={cn("h-4 w-0.75 rounded-b-sm", {
            "bg-ink": point === "driver",
            "bg-brand": point === "passenger"
          })}
        />
      </div>
    </div>
  );
}
