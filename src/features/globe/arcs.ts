import { BALIKESIR } from "./camera";

export type Arc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  label?: string;
};

export type Pin = {
  lat: number;
  lng: number;
  name: string;
};

// Bu yaylar, Balıkesir'e olan bağlantıları gösteriyor.
export const ARCS: Arc[] = [
  { startLat: 30.0444, startLng: 31.2357, endLat: BALIKESIR.lat, endLng: BALIKESIR.lng, label: "Egypt" },
  { startLat: 24.8607, startLng: 67.0011, endLat: BALIKESIR.lat, endLng: BALIKESIR.lng, label: "Pakistan" },
  { startLat: 35.6892, startLng: 51.389, endLat: BALIKESIR.lat, endLng: BALIKESIR.lng, label: "Iran" },
  { startLat: 41.2995, startLng: 69.2401, endLat: BALIKESIR.lat, endLng: BALIKESIR.lng, label: "Uzbekistan" },
  { startLat: -6.2088, startLng: 106.8456, endLat: BALIKESIR.lat, endLng: BALIKESIR.lng, label: "Indonesia" },
  { startLat: 9.082, startLng: 8.6753, endLat: BALIKESIR.lat, endLng: BALIKESIR.lng, label: "Nigeria" }
];

// Balıkesir'e pin yerleştiriliyor
export const PINS: Pin[] = [{ lat: BALIKESIR.lat, lng: BALIKESIR.lng, name: "Balıkesir" }];