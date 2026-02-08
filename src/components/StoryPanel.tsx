import { useState } from "react";
import type { Place } from "../types";
import { ExperienceForm } from "./ExperienceForm";

type StoryPanelProps = {
  place: Place | null;
  onClose: () => void;
};

function getPlaceDisplay(place: Place): { name: string; location: string } {
  const p = place as Record<string, unknown>;
  const location =
    typeof p.location === "string"
      ? p.location
      : typeof p.city === "string"
        ? p.city
        : "";
  return {
    name: typeof p.name === "string" ? p.name : "This place",
    location,
  };
}

/** Story panel with optional personal memory (local only). */
export function StoryPanel({ place, onClose }: StoryPanelProps) {
  const [showExperienceForm, setShowExperienceForm] = useState(false);

  if (!place) return null;

  const { name: placeName, location: placeLocation } = getPlaceDisplay(place);

  return (
    <div
      className="absolute inset-x-4 top-24 bottom-4 z-10 max-w-md rounded-lg bg-zinc-900/95 p-4 shadow-xl backdrop-blur sm:inset-x-auto sm:left-4 sm:top-24 flex flex-col"
      role="dialog"
      aria-label="Story"
    >
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-2">
        {/* Story content area — placeholder for teammate */}

        <section className="mt-auto pt-4" aria-label="Personal quote">
          <p className="text-sm text-zinc-400">
            Add a quote.
          </p>
          
          {!showExperienceForm ? (
            <button
              type="button"
              onClick={() => setShowExperienceForm(true)}
              className="mt-2 rounded bg-zinc-700 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Add a quote
            </button>
          ) : (
            <ExperienceForm
              placeId={place.id}
              placeName={placeName}
              placeLocation={placeLocation}
              onClose={() => setShowExperienceForm(false)}
            />
          )}
        </section>
      </div>
    </div>
  );
}
