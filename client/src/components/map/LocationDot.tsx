import cn from "classnames";
import type { Point } from "@/types";

type Props = {
  point: Point;
  size?: "small" | "medium";
  halo?: boolean;
};

export default function LocationDot({ point, size = "small", halo = false }: Props) {
  return (
    <span
      className={cn("shrink-0 rounded-full", {
        "size-3": size === "medium",
        "size-2.5": size === "small",
        "bg-ink": point === "driver",
        "bg-brand": point === "passenger",
        "ring-4 ring-ink/15": halo && point === "driver",
        "ring-4 ring-blue-200": halo && point === "passenger"
      })}
      aria-hidden="true"
    />
  );
}
