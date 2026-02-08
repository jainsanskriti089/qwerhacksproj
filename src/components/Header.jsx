export function Header({ onAddPlace }) {
  return (
    <header className="relative shrink-0 overflow-hidden border-b border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(45,40,56,0.08)]">
      <div
        className="absolute inset-0 opacity-75"
        style={{
          background:
            "linear-gradient(90deg, #ef4444 0%, #f97316 16%, #eab308 33%, #22c55e 50%, #3b82f6 66%, #8b5cf6 83%, #ec4899 100%)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-4">
        <div className="flex flex-col gap-0.5 animate-fade-in-up">
          <h1
            className="m-0 text-xl font-bold tracking-tight text-white drop-shadow-sm sm:text-2xl"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
          >
            Unmapped Histories
          </h1>
          <p className="m-0 max-w-md text-sm text-white/90">
            Preserving queer and BIPOC spaces through memory and story.
          </p>
          <div
            className="mt-2 h-2 w-32 rounded-full bg-white/30 sm:mt-2.5 sm:w-40"
            aria-hidden="true"
          />
        </div>
        {onAddPlace && (
          <button
            type="button"
            onClick={onAddPlace}
            className="self-start rounded-xl border-2 border-white/50 bg-white px-4 py-2.5 text-sm font-semibold text-[#5c3d8c] shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-white/95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent sm:self-auto"
          >
            Add a place by address
          </button>
        )}
      </div>
    </header>
  );
}
