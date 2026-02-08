import { StatusBadge } from "./StatusBadge";

export function StoryPanel({ place, onClose }) {
  if (!place) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-30 transition-opacity duration-300 ease-out"
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-base)] shadow-xl z-40 flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label={`Story: ${place.name}`}
      >
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-lg font-medium text-[var(--text-primary)] m-0 pr-4">
            {place.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] transition-colors duration-200"
            aria-label="Close panel"
          >
            <span className="text-lg leading-none" aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <p className="text-sm text-[var(--text-secondary)]">
            {place.city} · {place.years}
          </p>
          <div>
            <StatusBadge status={place.status} />
          </div>

          <div className="pt-2">
            <p className="text-[1.05rem] leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap">
              {place.story}
            </p>
          </div>

          {place.quote && (
            <blockquote className="text-[var(--text-muted)] italic text-base border-l-2 border-[var(--border-subtle)] pl-4 py-1">
              "{place.quote}"
            </blockquote>
          )}

          {place.audioUrl && (
            <div className="pt-2">
              <p className="text-sm text-[var(--text-secondary)] mb-2">Listen</p>
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
        </div>

        <footer className="shrink-0 px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
          <p className="text-xs text-[var(--text-muted)]">
            AI assists with summaries and narration. Original stories remain the source of truth.
          </p>
        </footer>
      </aside>
    </>
  );
}
