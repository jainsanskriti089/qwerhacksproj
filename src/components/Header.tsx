export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <h1 className="font-sans text-lg font-medium tracking-tight text-zinc-100 sm:text-xl">
            What Was Here
          </h1>
          <p className="mt-0.5 text-sm text-zinc-400">
            Preserving queer and BIPOC spaces that history tried to erase.
          </p>
        </div>
        <button
          type="button"
          className="rounded-md border border-zinc-600 bg-transparent px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          About
        </button>
      </div>
    </header>
  );
}
