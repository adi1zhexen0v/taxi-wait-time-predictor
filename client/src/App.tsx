import { BottomSheet, CenterPin, MapToolbar, StatusBar, TaxiMap } from "@/components";
import { useTaxiApp } from "@/hooks";
import "leaflet/dist/leaflet.css";
import "@/assets/css/style.css";

export default function App() {
  const app = useTaxiApp();
  const selectedPoint = app.step === "driver" ? "driver" : "passenger";

  return (
    <main className="flex min-h-svh items-center justify-center bg-canvas p-8 max-[440px]:block max-[440px]:p-0">
      <div className="h-216.5 w-103 shrink-0 rounded-[60px] bg-phone p-2.75 shadow-phone ring-2 ring-phone-ring max-[440px]:h-svh max-[440px]:w-full max-[440px]:rounded-none max-[440px]:p-0 max-[440px]:shadow-none max-[440px]:ring-0">
        <div className="relative h-full w-full overflow-hidden rounded-[49px] bg-panel max-[440px]:rounded-none">
          <TaxiMap
            mapRef={app.mapRef}
            step={app.step}
            driver={app.driver}
            passenger={app.passenger}
            route={app.route}
            waitMinutes={app.prediction?.wait_minutes ?? null}
            onCandidate={app.moveCandidate}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-900 h-24 bg-linear-to-b from-white to-transparent" />
          <StatusBar clock={app.clock} />
          <MapToolbar step={app.step} goBack={app.goBack} locate={app.locate} />
          {app.isPick && <CenterPin point={selectedPoint} />}
          <BottomSheet app={app} />
        </div>
      </div>
    </main>
  );
}
