export function Header({ onAddPlace }) {
  return (
    <header className="shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="m-0 text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
            Unmapped Histories
          </h1>
          <p className="m-0 max-w-md text-sm text-[var(--text-secondary)]">
            Preserving queer and BIPOC spaces through memory and story.
          </p>
          {/* Pride-inclusive accent bar */}
          <div
            className="mt-2 h-1 w-24 rounded-full opacity-90 sm:mt-2.5"
            style={{
              background:
                "linear-gradient(90deg, var(--accent-pink), var(--accent-purple), var(--accent-blue), var(--accent-teal), var(--accent-gold))",
            }}
            aria-hidden="true"
          />
        </div>
        {onAddPlace && (
          <button
            type="button"
            onClick={onAddPlace}
            className="self-start rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-purple)]/50 hover:bg-[var(--bg-warm)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg-panel)] sm:self-auto"
          >
            Add a place by address
          </button>
        )}
      </div>
    </header>
  );
}
