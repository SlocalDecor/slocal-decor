const envBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
// If no env is set, default to local backend port to avoid hitting the Vite dev server (404).
const localFallback =
  !envBase &&
  typeof window !== "undefined" &&
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "";
const base = (envBase || localFallback).replace(/\/$/, "");

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
