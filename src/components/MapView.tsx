import type { Place } from "../types";

type MapViewProps = {
  places: Place[];
  selectedPlace: Place | null;
  onSelect: (place: Place | null) => void;
};

/** Placeholder for map (map logic owned by teammate). */
export function MapView({ places, selectedPlace, onSelect }: MapViewProps) {
  return (
    <div
      className="absolute inset-0 bg-zinc-950"
      aria-label="Map"
      role="application"
    />
  );
}
