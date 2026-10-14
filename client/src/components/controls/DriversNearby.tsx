import type { Dispatch, SetStateAction } from "react";

type Props = {
  count: number;
  onChange: Dispatch<SetStateAction<number>>;
};

export default function DriversNearby({ count, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-sm font-bold">Drivers nearby</div>
        <div className="text-xs font-medium text-muted">Free cars within ~2 km</div>
      </div>
      <div className="flex shrink-0 items-center gap-1 rounded-full bg-soft p-1">
        <button
          type="button"
          aria-label="Fewer drivers"
          className="size-9 rounded-full bg-white text-xl font-bold disabled:opacity-40"
          disabled={count === 0}
          onClick={() => onChange((value) => value - 1)}
        >
          −
        </button>
        <span className="w-8.5 text-center text-[17px] font-extrabold">{count}</span>
        <button
          type="button"
          aria-label="More drivers"
          className="size-9 rounded-full bg-white text-xl font-bold disabled:opacity-40"
          disabled={count === 20}
          onClick={() => onChange((value) => value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
