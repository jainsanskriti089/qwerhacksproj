import { useState, useEffect, useRef } from "react";
import { StatusBadge } from "./StatusBadge";
import { ExperienceForm, getStoredMemory } from "./ExperienceForm";
import { expandStory } from "../lib/gemini";

export function StoryPanel({ place, onClose }) {
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [, setMemorySaved] = useState(0);

  const [storyText, setStoryText] = useState(place?.story ?? "");
  const [isExpanding, setIsExpanding] = useState(false);
  const expandingForId = useRef(null);

  useEffect(() => {
    if (!place) return;
  
    const placeId = place.id;
    expandingForId.current = placeId;
  
    // no setIsExpanding(true) here
  
    expandStory({
      name: place.name,
      city: place.city,
      years: place.years,
      reason: place.reason ?? "",
      communities: place.communities ?? [],
      story: place.story ?? "",
    })
      .then((expanded) => {
        if (expandingForId.current === placeId && expanded?.trim()) {
          setStoryText(expanded.trim());
        }
      })
      .catch((err) => {
        console.warn("[StoryPanel] expandStory failed:", err);
      })
      .finally(() => {
        if (expandingForId.current === placeId) {
          expandingForId.current = null;
          setIsExpanding(false);
        }
      });
  }, [place]);
  


  if (!place) return null;

  const placeName = place.name ?? "This place";
  const placeLocation = place.location ?? place.city ?? "";
  const savedMemory = getStoredMemory(place.id);

  const handleMemorySaved = () => setMemorySaved((n) => n + 1);

  return (
    <>
      <div
        className="fixed inset-0 transition-opacity duration-300 ease-out"
        style={{ backgroundColor: "rgba(45, 40, 56, 0.25)", zIndex: 1000 }}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md shadow-2xl flex flex-col animate-slide-in-right"
        style={{
          backgroundColor: "var(--bg-panel)",
          borderLeft: "4px solid var(--accent-purple)",
          boxShadow: "-4px 0 24px rgba(91, 122, 158, 0.12)",
          zIndex: 1001,
        }}
        role="dialog"
        aria-label={`Story: ${place.name}`}
      >
        <div
          className="shrink-0 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <h2
            className="text-xl font-semibold m-0 pr-4"
            style={{ color: "var(--accent-purple)" }}
          >
            {place.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded-full transition-colors duration-200 hover:opacity-80 focus:opacity-80"
            style={{ color: "var(--text-secondary)", backgroundColor: "var(--border-subtle)" }}
            aria-label="Close panel"
          >
            <span className="text-xl leading-none" aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {place.city} · {place.years}
          </p>
          <div>
            <StatusBadge status={place.status} />
          </div>

          <div className="pt-1">
            {isExpanding && (
              <p
                className="text-sm mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Adding more detail…
              </p>
            )}
            {!isExpanding && storyText !== (place.story ?? "") && (
              <p
                className="text-xs mb-2"
                style={{ color: "var(--accent-purple)" }}
              >
                Expanded with AI
              </p>
            )}
            {!isExpanding && storyText === (place.story ?? "") && storyText && (
              <p
                className="text-xs mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Original story (expansion unavailable)
              </p>
            )}
            <p
              className="text-[1.1rem] leading-relaxed whitespace-pre-wrap"
              style={{ color: "var(--text-primary)" }}
            >
              {storyText}
            </p>
          </div>

          {place.quote && (
            <blockquote
              className="italic text-lg border-l-4 pl-4 py-2 my-4"
              style={{
                color: "var(--text-muted)",
                borderColor: "var(--accent-pink)",
              }}
            >
              "{place.quote}"
            </blockquote>
          )}

          {savedMemory && (savedMemory.memory?.trim() || savedMemory.monthYear) && (
            <div
              className="rounded-lg border-l-4 pl-4 py-3 pr-3"
              style={{
                backgroundColor: "var(--bg-warm)",
                borderColor: "var(--accent-purple)",
              }}
              aria-label="Your saved memory"
            >
              <p
                className="text-xs font-medium mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Your memory{savedMemory.monthYear ? ` · ${savedMemory.monthYear}` : ""}
              </p>
              <p
                className="text-[1rem] leading-relaxed whitespace-pre-wrap m-0"
                style={{ color: "var(--text-primary)" }}
              >
                {savedMemory.memory?.trim() || "(No text saved)"}
              </p>
            </div>
          )}

          {place.audioUrl && (
            <div className="pt-2">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Listen
              </p>
              <audio
                controls
                src={place.audioUrl}
                className="w-full max-w-full"
                preload="metadata"
              >
                Your browser does not support audio.
              </audio>
            </div>
          )}

          <section
            className="pt-6 mt-6 border-t"
            style={{ borderColor: "var(--border-subtle)" }}
            aria-label="Personal memory"
          >
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Add a personal memory of this place.
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              This note is saved only on your device.
            </p>
            {!showExperienceForm ? (
              <button
                type="button"
                onClick={() => setShowExperienceForm(true)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  color: "var(--bg-panel)",
                  backgroundColor: "var(--accent-purple)",
                }}
              >
                Write a Memory
              </button>
            ) : (
              <ExperienceForm
                placeId={place.id}
                placeName={placeName}
                placeLocation={placeLocation}
                onClose={() => setShowExperienceForm(false)}
                onSaved={handleMemorySaved}
              />
            )}
          </section>
        </div>

        <footer
          className="shrink-0 px-6 py-3"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-warm)",
          }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            AI assists with summaries and narration. Original stories remain the source of truth.
          </p>
        </footer>
      </aside>
    </>
  );
}
