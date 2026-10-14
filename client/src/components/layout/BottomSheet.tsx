import type { ReactNode } from "react";
import { DetailsStep, PickStep, ResultStep } from "@/components/trip";
import type { useTaxiApp } from "@/hooks";

export default function BottomSheet({ app }: { app: ReturnType<typeof useTaxiApp> }) {
  let content: ReactNode = null;

  if (app.isPick) {
    const point = app.step === "driver" ? "driver" : "passenger";
    content = (
      <PickStep
        point={point}
        candidate={app.candidate}
        query={app.query}
        reverseLoading={app.reverseLoading}
        error={app.error}
        onQueryChange={app.setQuery}
        onSelect={app.selectAddress}
        onConfirm={app.confirmLocation}
      />
    );
  } else if (app.step === "details" && app.driver && app.passenger) {
    content = (
      <DetailsStep
        driver={app.driver}
        passenger={app.passenger}
        route={app.route}
        routeLoading={app.routeLoading}
        timeKey={app.timeKey}
        customHourActive={app.customHourActive}
        onSelectTime={app.selectTime}
        onChooseCustomHour={app.chooseCustomHour}
        onAdjustCustomHour={app.adjustCustomHour}
        weather={app.weather}
        setWeather={app.setWeather}
        driversNearby={app.driversNearby}
        setDriversNearby={app.setDriversNearby}
        loading={app.loading}
        error={app.error}
        onEdit={app.editLocation}
        onPredict={app.predict}
        clock={app.clock}
      />
    );
  } else if (app.step === "result" && app.driver && app.passenger && app.prediction) {
    content = (
      <ResultStep
        driver={app.driver}
        passenger={app.passenger}
        prediction={app.prediction}
        driversNearby={app.driversNearby}
        onAdjust={app.showDetails}
        onNewTrip={app.newTrip}
      />
    );
  }

  return (
    <section className="absolute inset-x-0 bottom-0 z-1000 max-h-[calc(100%-112px)] overflow-y-auto rounded-t-3xl bg-white px-5 pt-2 pb-[max(30px,env(safe-area-inset-bottom))] shadow-sheet">
      <div className="mx-auto mb-3.5 h-1.25 w-10 rounded-full bg-handle" />
      {content}
    </section>
  );
}
