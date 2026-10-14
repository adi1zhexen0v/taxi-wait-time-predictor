export type Location = { lat: number; lon: number; label: string };
export type Point = "driver" | "passenger";
export type Step = Point | "details" | "result";
export type Weather = "auto" | "clear" | "rain" | "snow";
export type Geometry = {
  type: "LineString" | "MultiLineString";
  coordinates: number[][] | number[][][];
};
export type Route = { distance_km: number; route: Geometry };
export type Prediction = Route & { wait_minutes: number; hour: number; weather: string };
