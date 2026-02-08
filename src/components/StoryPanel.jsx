import { useState, useEffect, useRef, useCallback } from "react";
import { StatusBadge } from "./StatusBadge";
import { ExperienceForm, getStoredMemory } from "./ExperienceForm";
import { expandStory } from "../lib/gemini";
import { narrateStory } from "../lib/elevenlabs";
import { MemoryTimeline } from "./MemoryTimeline";
import { getMemoriesFromStorage } from "../lib/memoriesStorage";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function StoryPanel({ place, onClose }) {
  const [panelView, setPanelView] = useState("story");
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [, setMemorySaved] = useState(0);
  const [quotesMemories, setQuotesMemories] = useState([]);

  const [storyText, setStoryText] = useState(place?.story ?? "");
  const [isExpanding, setIsExpanding] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isNarrating, setIsNarrating] = useState(false);
  const expandingForId = useRef(null);
  const narratingForId = useRef(null);

  useEffect(() => {
    if (!place) return;
    setPanelView("story");
    setAudioUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return "";
    });
  }, [place]);

  const loadQuotesMemories = useCallback(async () => {
    if (!place?.id) return;
    const record = await getMemoriesFromStorage();
    const list = record[place.id] ?? [];
    const sorted = [...list].sort((a, b) => {
      const yA = a.year ?? 0, yB = b.year ?? 0;
      if (yA !== yB) return yA - yB;
      return (a.month ?? 0) - (b.month ?? 0);
    });
    setQuotesMemories(sorted);
  }, [place?.id]);

  useEffect(() => {
    if (panelView === "story" && place?.id) loadQuotesMemories();
  }, [panelView, place?.id, loadQuotesMemories]);

  useEffect(() => {
    if (!place) return;
    const placeId = place.id;
    // Clear AI output and show loading until this place's expansion is ready
    setStoryText(place.story ?? "");
    setIsExpanding(true);
    expandingForId.current = placeId;

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
  const placeLocation = place.fullAddress ?? place.location ?? place.city ?? "";
  const dateRange = place.years ?? (place.startDate && place.endDate
    ? `${place.startDate} – ${place.endDate}`
    : place.startDate
      ? place.startDate + (place.endDate ? ` – ${place.endDate}` : " – present")
      : "");
  const savedMemory = getStoredMemory(place.id);
  const isUserPlace = place.source === "user";

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
        className="fixed top-0 right-0 h-full w-full max-w-md flex flex-col animate-slide-in-right shadow-2xl"
        style={{
          backgroundColor: "#e8e4f0",
          borderLeft: "4px solid var(--accent-purple)",
          boxShadow: "-4px 0 24px rgba(91, 122, 158, 0.12)",
          zIndex: 1001,
        }}
        role="dialog"
        aria-label={`Story: ${place.name}`}
      >
        <div
          className="shrink-0 flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4"
          style={{ backgroundColor: "#ddd6e8" }}
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
          {panelView === "timeline" ? (
            <>
              <button
                type="button"
                onClick={() => setPanelView("story")}
                className="flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 -ml-2 transition-colors"
                style={{ color: "var(--accent-purple)" }}
                aria-label="Back to story"
              >
                <span aria-hidden="true">←</span> Back
              </button>
              <MemoryTimeline placeId={place.id} onMemoryAdded={loadQuotesMemories} />
            </>
          ) : (
            <>
              {place.fullAddress && (
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {place.fullAddress}
                </p>
              )}
              {(place.city || dateRange) && (
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {[place.city, dateRange].filter(Boolean).join(" · ")}
                </p>
              )}
              {isUserPlace && (
                <p
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Saved locally"
                >
                </p>
              )}
              <div>
                <StatusBadge status={place.status} />
              </div>

              <div className="pt-1">
                {isExpanding && (
                  <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                    Adding more detail…
                  </p>
                )}
                {!isExpanding && storyText !== (place.story ?? "") && (
                  <p className="text-xs mb-2" style={{ color: "var(--accent-purple)" }}>
                    Expanded with AI
                  </p>
                )}
                {!isExpanding && storyText === (place.story ?? "") && storyText && (
                  <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
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
                <div
                  className="rounded-lg border-l-4 pl-4 py-3 pr-3"
                  style={{
                    backgroundColor: "var(--bg-warm)",
                    borderColor: "var(--accent-purple)",
                  }}
                  aria-label="Place quote"
                >
                  <p
                    className="text-[1rem] leading-relaxed whitespace-pre-wrap m-0"
                    style={{ color: "var(--text-primary)" }}
                  >
                    "{place.quote}"
                  </p>
                </div>
              )}


              {savedMemory && savedMemory.memory?.trim() && (
                <div
                  className="rounded-lg border-l-4 pl-4 py-3 pr-3"
                  style={{
                    backgroundColor: "var(--bg-warm)",
                    borderColor: "var(--accent-purple)",
                  }}
                  aria-label="Your saved memory"
                >
                  
                  <p
                    className="text-[1rem] leading-relaxed whitespace-pre-wrap m-0"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {savedMemory.memory?.trim() || "(No text saved)"}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <p className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Listen
                </p>
                {audioUrl ? (
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full max-w-full"
                    preload="metadata"
                  >
                    Your browser does not support audio.
                  </audio>
                ) : isNarrating ? (
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Generating narration…
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!storyText?.trim()) return;
                      const placeId = place.id;
                      narratingForId.current = placeId;
                      setIsNarrating(true);
                      try {
                        const url = await narrateStory(storyText);
                        if (narratingForId.current === placeId && url) {
                          setAudioUrl(url);
                        }
                      } catch (err) {
                        console.warn("[StoryPanel] narrateStory failed:", err);
                      } finally {
                        if (narratingForId.current === placeId) {
                          setIsNarrating(false);
                        }
                      }
                    }}
                    disabled={!storyText?.trim()}
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                    style={{
                      color: "var(--bg-panel)",
                      backgroundColor: "var(--accent-purple)",
                    }}
                  >
                    Listen to story (ElevenLabs)
                  </button>
                )}
              </div>

              {/* <section
                className="pt-6 mt-6"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
                aria-label="Quotes"
              >
                <p className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
                  Quotes
                </p>
                {quotesMemories.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No personal memories yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {quotesMemories.map((entry) => (
                      <blockquote
                        key={entry.id}
                        className="italic text-base border-l-4 pl-4 py-2"
                        style={{
                          color: "var(--text-muted)",
                          borderColor: "var(--accent-pink)",
                        }}
                      >
                        <p className="m-0">"{entry.caption}"</p>
                        <p
                          className="text-xs font-medium mt-2 not-italic"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {MONTHS[(entry.month ?? 1) - 1]}
                          {entry.year != null ? ` ${entry.year}` : entry.day != null ? ` ${entry.day}` : ""}
                        </p>
                      </blockquote>
                    ))}
                  </div>
                )}
              </section> */}

              <section
                className="pt-6 mt-6 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
                aria-label="Personal quote"
              >
                <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Add a quote.
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
                    Add a quote
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

              <button
                type="button"
                onClick={() => setPanelView("timeline")}
                className="mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium border transition-colors"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-base)",
                  color: "var(--text-primary)",
                }}
              >
                View timeline
              </button>
            </>
          )}
        </div>

        <footer
          className="shrink-0 px-6 py-3"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            backgroundColor: "#ddd6e8",
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
