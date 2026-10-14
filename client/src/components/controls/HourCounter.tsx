type Props = {
  hour: string;
  onAdjust: (change: number) => void;
};

export default function HourCounter({ hour, onAdjust }: Props) {
  return (
    <div
      role="group"
      aria-label="Choose any hour"
      className="flex h-9 w-fit items-center gap-1 rounded-full bg-ink px-1 text-[13px] font-bold text-white"
    >
      <button
        type="button"
        aria-label="Earlier hour"
        className="grid size-7 place-items-center rounded-full text-lg disabled:opacity-40"
        disabled={hour === "0"}
        onClick={() => onAdjust(-1)}
      >
        −
      </button>
      <span className="min-w-12 text-center" aria-live="polite">
        {hour.padStart(2, "0")}:00
      </span>
      <button
        type="button"
        aria-label="Later hour"
        className="grid size-7 place-items-center rounded-full text-lg disabled:opacity-40"
        disabled={hour === "23"}
        onClick={() => onAdjust(1)}
      >
        +
      </button>
    </div>
  );
}
