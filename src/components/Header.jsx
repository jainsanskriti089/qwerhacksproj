export function Header() {
  return (
    <header
      className="shrink-0 px-6 py-5 text-center relative overflow-hidden border-b border-[var(--border-subtle)]"
      style={{
        background: "linear-gradient(135deg, var(--bg-panel) 0%, #f5f0f8 50%, #fef8f2 100%)",
      }}
    >
      <div className="relative z-10">
        <h1
          className="text-2xl font-semibold tracking-tight m-0"
          style={{ color: "var(--accent-purple)" }}
        >
          What Was Here
        </h1>
        <p
          className="text-sm mt-2 max-w-md mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Preserving queer and BIPOC spaces through memory and story.
        </p>
        {/* Pride-inclusive accent bar */}
        <div
          className="h-1.5 rounded-full max-w-xs mx-auto mt-3"
          style={{
            background: "linear-gradient(90deg, var(--accent-pink), var(--accent-purple), var(--accent-blue), var(--accent-teal), var(--accent-gold))",
            opacity: 0.9,
          }}
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
