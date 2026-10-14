import type { ReactNode } from "react";
import cn from "classnames";

export default function Chip({
  selected,
  children,
  onClick
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn("h-9 rounded-full px-3.5 text-[13px] font-bold transition-colors", {
        "bg-ink text-white": selected,
        "bg-soft text-ink hover:bg-soft-hover": !selected
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
