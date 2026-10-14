export default function StatusBar({ clock }: { clock: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-1000 flex h-12.5 items-center justify-between px-9 text-[15px] font-bold">
      <span>{clock}</span>
      <div className="absolute top-2.5 left-1/2 h-8.5 w-30 -translate-x-1/2 rounded-full bg-black" />
      <div className="flex items-center gap-1.5" aria-label="Cellular signal, Wi-Fi and battery">
        <svg width="17" height="13" viewBox="0 0 17 13" fill="currentColor" aria-hidden="true">
          <rect x="1" y="9" width="2.5" height="4" rx=".5" />
          <rect x="5" y="7" width="2.5" height="6" rx=".5" />
          <rect x="9" y="4" width="2.5" height="9" rx=".5" />
          <rect x="13" y="1" width="2.5" height="12" rx=".5" />
        </svg>
        <svg width="16" height="13" viewBox="0 0 16 13" fill="currentColor" aria-hidden="true">
          <path d="M.5 4.1a12 12 0 0 1 15 0l-1.7 2a9.4 9.4 0 0 0-11.6 0zM3.5 7.2a7.4 7.4 0 0 1 9 0l-1.7 2a4.8 4.8 0 0 0-5.6 0zM8 12.5 5.8 10a3.5 3.5 0 0 1 4.4 0z" />
        </svg>
        <svg width="28" height="14" viewBox="0 0 28 14" fill="none" aria-hidden="true">
          <rect
            x=".7"
            y="1.2"
            width="23"
            height="11.6"
            rx="3.2"
            stroke="currentColor"
            strokeOpacity=".55"
            strokeWidth="1.2"
          />
          <rect x="2.8" y="3.2" width="18.2" height="7.6" rx="1.5" fill="currentColor" />
          <path
            d="M25.3 4.4c1.2.4 1.9 1.3 1.9 2.6s-.7 2.2-1.9 2.6z"
            fill="currentColor"
            opacity=".6"
          />
        </svg>
      </div>
    </div>
  );
}
