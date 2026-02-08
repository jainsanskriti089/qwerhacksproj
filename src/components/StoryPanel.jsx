import { StatusBadge } from "./StatusBadge";

export function StoryPanel({ place, onClose }) {
  if (!place) return null;

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
            <p
              className="text-[1.1rem] leading-relaxed whitespace-pre-wrap"
              style={{ color: "var(--text-primary)" }}
            >
              {place.story}
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
