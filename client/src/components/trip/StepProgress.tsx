import cn from "classnames";
import type { Point } from "@/types";

const steps = [1, 2, 3];

export default function StepProgress({ point }: { point: Point }) {
  const currentStep = point === "driver" ? 1 : 2;
  const indicators = steps.map((step) => {
    return (
      <span
        key={step}
        className={cn("h-1 w-5.5 rounded-sm", {
          "bg-ink": step <= currentStep,
          "bg-progress": step > currentStep
        })}
      />
    );
  });

  return (
    <div className="flex items-center gap-1.5">
      {indicators}
      <span className="ml-1 text-xs font-semibold text-muted">Step {currentStep} of 3</span>
    </div>
  );
}
