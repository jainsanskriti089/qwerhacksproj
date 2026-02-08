/** Place type including optional fields for user-added places and date range. */
export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  fullAddress?: string;
  startDate?: string;
  endDate?: string;
  source?: "seed" | "user";
  createdAt?: string;
  city?: string;
  status?: "active" | "threatened" | "erased";
  years?: string;
  reason?: string;
  communities?: string[];
  story?: string;
  quote?: string;
  [key: string]: unknown;
}

import { places as seedPlacesRaw } from "./seedPlaces.js";

const SEED_PLACES: Place[] = (seedPlacesRaw as Place[]).map((p) => ({
  ...p,
  source: "seed" as const,
}));

const USER_PLACES_KEY = "what-was-here-user-places";

export function loadUserPlaces(): Place[] {
  try {
    const raw = localStorage.getItem(USER_PLACES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserPlace(place: Place): void {
  const existing = loadUserPlaces();
  const index = existing.findIndex((p) => p.id === place.id);
  const next =
    index >= 0
      ? existing.map((p, i) => (i === index ? place : p))
      : [...existing, place];
  localStorage.setItem(USER_PLACES_KEY, JSON.stringify(next));
}

export function loadAllPlaces(): Place[] {
  return [...SEED_PLACES, ...loadUserPlaces()];
}

export function getPlaceById(id: string): Place | undefined {
  return (
    SEED_PLACES.find((p) => p.id === id) ??
    loadUserPlaces().find((p) => p.id === id)
  );
}

export { SEED_PLACES };
/** Alias for Map.jsx and other consumers that expect PLACES. */
export const PLACES = SEED_PLACES;
export const MAP_CENTER = { lat: 39, lng: -98 };
export const MAP_ZOOM = 4;
