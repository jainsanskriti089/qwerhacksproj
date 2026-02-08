import { useState } from "react";
import { Place } from "./types";
import { Header } from "./components/Header";
import { MapView } from "./components/MapView";
import { StoryPanel } from "./components/StoryPanel";

const places: Place[] = [
  {
    id: "stonewall",
    name: "Stonewall Inn",
    location: "New York City, NY",
  } as Place,
];

const demoPlace = places[0];

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950">
      <Header />

      <MapView
        places={places}
        selectedPlace={selectedPlace}
        onSelect={setSelectedPlace}
      />

      <StoryPanel
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />

      {!selectedPlace && demoPlace && (
        <div className="absolute bottom-4 left-4 right-4 z-10 max-w-md sm:left-4 sm:right-auto">
          <button
            type="button"
            onClick={() => setSelectedPlace(demoPlace)}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-900/95 px-4 py-3 text-left text-sm text-zinc-200 backdrop-blur hover:border-zinc-500 hover:bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            <span className="font-medium">Add a personal memory</span>
            <span className="mt-1 block text-xs text-zinc-400">
              Try writing a memory for a place (saved only on your device).
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
