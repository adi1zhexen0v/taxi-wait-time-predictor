import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { fetchPrediction, fetchRoute, reversePlace } from "@/api";
import {
  centerOnPin,
  clockInAstana,
  coordinates,
  DRIVER_START,
  fitTrip,
  PASSENGER_START
} from "@/utils";
import type { Location, Point, Prediction, Route, Step, Weather } from "@/types";

export function useTaxiApp() {
  const mapRef = useRef<LeafletMap | null>(null);
  const routeRequest = useRef(0);
  const [step, setStep] = useState<Step>("driver");
  const [driver, setDriver] = useState<Location | null>(null);
  const [passenger, setPassenger] = useState<Location | null>(null);
  const [candidate, setCandidate] = useState<Location>(DRIVER_START);
  const [query, setQuery] = useState(DRIVER_START.label);
  const [reverseLoading, setReverseLoading] = useState(true);
  const [route, setRoute] = useState<Route | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [timeKey, setTimeKey] = useState("auto");
  const [customHourActive, setCustomHourActive] = useState(false);
  const [weather, setWeather] = useState<Weather>("auto");
  const [driversNearby, setDriversNearby] = useState(6);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => new Date());
  const isPick = step === "driver" || step === "passenger";

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isPick || candidate.label !== coordinates(candidate)) return;
    const controller = new AbortController();
    const originalLabel = candidate.label;
    const timer = window.setTimeout(async () => {
      try {
        const label = await reversePlace(candidate, controller.signal);
        if (controller.signal.aborted) return;
        setCandidate((current) =>
          current.lat === candidate.lat && current.lon === candidate.lon && current.label !== label
            ? { ...current, label }
            : current
        );
        setQuery((current) => (current === originalLabel ? label : current));
        setReverseLoading(false);
      } catch {
        if (!controller.signal.aborted) setReverseLoading(false);
      }
    }, 400);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [candidate, isPick]);

  function moveCandidate(location: Location) {
    setCandidate(location);
    setQuery(location.label);
    setReverseLoading(true);
    setError("");
  }

  function selectAddress(location: Location) {
    setCandidate(location);
    setQuery(location.label);
    setReverseLoading(location.label === coordinates(location));
    if (mapRef.current) centerOnPin(mapRef.current, location);
  }

  async function loadRoute(from: Location, to: Location) {
    const requestId = ++routeRequest.current;
    setRouteLoading(true);
    setRoute(null);
    setError("");
    try {
      const result = await fetchRoute(from, to);
      if (requestId !== routeRequest.current) return;
      setRoute(result);
      if (mapRef.current) fitTrip(mapRef.current, from, to, result);
    } catch (cause) {
      if (requestId === routeRequest.current) {
        setError(cause instanceof Error ? cause.message : "Route calculation failed");
      }
    } finally {
      if (requestId === routeRequest.current) setRouteLoading(false);
    }
  }

  function showDetails(from: Location, to: Location) {
    setStep("details");
    setPrediction(null);
    setReverseLoading(false);
    if (mapRef.current) fitTrip(mapRef.current, from, to, null);
    void loadRoute(from, to);
  }

  function confirmLocation() {
    const location = { ...candidate, label: candidate.label || coordinates(candidate) };
    if (step === "driver") {
      setDriver(location);
      if (passenger) {
        showDetails(location, passenger);
      } else {
        setStep("passenger");
        setCandidate(PASSENGER_START);
        setQuery(PASSENGER_START.label);
        setReverseLoading(true);
        if (mapRef.current) centerOnPin(mapRef.current, PASSENGER_START);
      }
    } else if (step === "passenger" && driver) {
      setPassenger(location);
      showDetails(driver, location);
    }
  }

  function editLocation(point: Point) {
    const location = (point === "driver" ? driver : passenger) || DRIVER_START;
    routeRequest.current += 1;
    setRouteLoading(false);
    setRoute(null);
    setPrediction(null);
    setStep(point);
    setCandidate(location);
    setQuery(location.label);
    setReverseLoading(location.label === coordinates(location));
    setError("");
    if (mapRef.current) centerOnPin(mapRef.current, location);
  }

  function goBack() {
    if (step === "passenger") editLocation("driver");
    else if (step === "details") editLocation("passenger");
    else if (step === "result") setStep("details");
  }

  function locate() {
    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          label: position.coords.latitude.toFixed(5) + ", " + position.coords.longitude.toFixed(5)
        };
        if (isPick) selectAddress(location);
        else mapRef.current?.setView([location.lat, location.lon], 15);
      },
      () => setError("Location access is unavailable. You can still search or move the map."),
      { timeout: 5000 }
    );
  }

  function selectTime(value: string) {
    setTimeKey(value);
    setCustomHourActive(false);
  }

  function chooseCustomHour() {
    setTimeKey((current) =>
      current === "auto" ? String(Number(clockInAstana(new Date()).slice(0, 2))) : current
    );
    setCustomHourActive(true);
  }

  function adjustCustomHour(change: number) {
    setTimeKey((current) => String(Math.max(0, Math.min(23, Number(current) + change))));
  }

  async function predict() {
    if (!driver || !passenger || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await fetchPrediction({
        driver,
        passenger,
        driversNearby,
        hour: timeKey,
        weather
      });
      setPrediction(result);
      const resultRoute = { distance_km: result.distance_km, route: result.route };
      setRoute(resultRoute);
      setStep("result");
      if (mapRef.current) fitTrip(mapRef.current, driver, passenger, resultRoute);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  function newTrip() {
    const start = driver || DRIVER_START;
    routeRequest.current += 1;
    setDriver(null);
    setPassenger(null);
    setRoute(null);
    setPrediction(null);
    setRouteLoading(false);
    setError("");
    setStep("driver");
    setCandidate(start);
    setQuery(start.label);
    setReverseLoading(start.label === coordinates(start));
    if (mapRef.current) centerOnPin(mapRef.current, start);
  }

  return {
    mapRef,
    step,
    driver,
    passenger,
    candidate,
    query,
    setQuery,
    reverseLoading,
    route,
    routeLoading,
    timeKey,
    customHourActive,
    selectTime,
    chooseCustomHour,
    adjustCustomHour,
    weather,
    setWeather,
    driversNearby,
    setDriversNearby,
    prediction,
    loading,
    error,
    clock: clockInAstana(now),
    isPick,
    moveCandidate,
    selectAddress,
    confirmLocation,
    editLocation,
    goBack,
    locate,
    predict,
    newTrip,
    showDetails: () => setStep("details")
  };
}
