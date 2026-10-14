import type { Step } from "@/types";

export default function MapToolbar({
  step,
  goBack,
  locate
}: {
  step: Step;
  goBack: () => void;
  locate: () => void;
}) {
  return (
    <div className="absolute inset-x-4 top-14.5 z-1000 flex items-center justify-between">
      {step === "driver" ? (
        <div className="flex h-9 items-center gap-2 rounded-full bg-white py-0 pr-3.5 pl-1.5 text-[13px] font-bold shadow-toolbar">
          <span className="grid size-6 place-items-center rounded-full bg-ink text-xs font-extrabold text-white">
            T
          </span>
          Wait predictor
        </div>
      ) : (
        <button
          type="button"
          aria-label="Go back"
          className="grid size-11 place-items-center rounded-full bg-white shadow-toolbar active:scale-95"
          onClick={goBack}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
      )}
      <button
        type="button"
        aria-label="My location"
        className="grid size-11 place-items-center rounded-full bg-white shadow-toolbar active:scale-95"
        onClick={locate}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="#111" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      </button>
    </div>
  );
}
