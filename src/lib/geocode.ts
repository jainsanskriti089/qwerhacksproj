/**
 * Geocode a free-text address using Nominatim (OpenStreetMap).
 * No API key required.
 */

export type GeocodeResult = {
  lat: number;
  lng: number;
  fullAddress: string;
};

export async function geocodeAddress(
  address: string
): Promise<GeocodeResult | null> {
  const trimmed = address.trim();
  if (!trimmed) return null;

  const params = new URLSearchParams({
    q: trimmed,
    format: "json",
    limit: "1",
  });

  const url = `https://nominatim.openstreetmap.org/search?${params}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "WhatWasHere/1.0 (local app; respectful use)",
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      lat?: string;
      lon?: string;
      display_name?: string;
    }>;
    const first = data?.[0];
    if (!first?.lat || !first?.lon) return null;
    const lat = parseFloat(first.lat);
    const lng = parseFloat(first.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    const fullAddress =
      typeof first.display_name === "string" ? first.display_name : trimmed;
    return { lat, lng, fullAddress };
  } catch {
    return null;
  }
}
