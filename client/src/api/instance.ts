import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "")
});

axiosInstance.interceptors.response.use(undefined, (error: unknown) => {
  if (!axios.isAxiosError<{ detail?: unknown }>(error) || error.code === "ERR_CANCELED") {
    return Promise.reject(error);
  }

  const detail = error.response?.data?.detail;
  const message =
    typeof detail === "string"
      ? detail
      : error.response
        ? "The request failed. Please try again."
        : "Cannot reach the prediction server.";
  return Promise.reject(new Error(message));
});
