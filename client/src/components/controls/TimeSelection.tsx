import Chip from "./Chip";
import HourCounter from "./HourCounter";
import { PRESET_HOURS } from "@/utils";

type Props = {
  clock: string;
  timeKey: string;
  customHourActive: boolean;
  onSelectTime: (hour: string) => void;
  onChooseCustomHour: () => void;
  onAdjustCustomHour: (change: number) => void;
};

export default function TimeSelection({
  clock,
  timeKey,
  customHourActive,
  onSelectTime,
  onChooseCustomHour,
  onAdjustCustomHour
}: Props) {
  const customTimeControl = customHourActive ? (
    <HourCounter hour={timeKey} onAdjust={onAdjustCustomHour} />
  ) : (
    <Chip selected={false} onClick={onChooseCustomHour}>
      Choose any hour
    </Chip>
  );

  return (
    <div>
      <div className="mb-2 text-sm font-bold">When</div>
      <div className="flex flex-wrap gap-2">
        <Chip
          selected={!customHourActive && timeKey === "auto"}
          onClick={() => onSelectTime("auto")}
        >
          Now · {clock}
        </Chip>
        {PRESET_HOURS.map((hour) => (
          <Chip
            key={hour}
            selected={!customHourActive && timeKey === String(hour)}
            onClick={() => onSelectTime(String(hour))}
          >
            {String(hour).padStart(2, "0")}:00
          </Chip>
        ))}
        {customTimeControl}
      </div>
    </div>
  );
}
