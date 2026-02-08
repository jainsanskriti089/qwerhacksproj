import { useState, useEffect } from "react";

const STORAGE_PREFIX = "what-was-here-memory";

type ExperienceFormProps = {
  placeId: string;
  placeName: string;
  placeLocation?: string;
  onClose?: () => void;
  onSaved?: () => void;
};

export function getStoredMemory(placeId: string): { monthYear: string; memory: string } | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}-${placeId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { monthYear?: string; memory?: string };
    return {
      monthYear: typeof parsed.monthYear === "string" ? parsed.monthYear : "",
      memory: typeof parsed.memory === "string" ? parsed.memory : "",
    };
  } catch {
    return null;
  }
}

function setStored(placeId: string, memory: string): void {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}-${placeId}`,
      JSON.stringify({ memory })
    );
  } catch {
    // ignore
  }
}

function buildTxtContent(
  placeName: string,
  placeLocation: string,
  memory: string
): string {
  const savedDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const lines = [
    "What Was Here — Personal Memory",
    "",
    `Place: ${placeName}`,
    ...(placeLocation.trim()
      ? [`Location: ${placeLocation.trim()}`, ""]
      : []),
    "",
    "Quote:",
    memory.trim() || "(no text)",
    "",
    `Saved locally on: ${savedDate}`,
  ];
  return lines.join("\n");
}

export function ExperienceForm({
  placeId,
  placeName,
  placeLocation = "",
  onClose,
  onSaved,
}: ExperienceFormProps) {
  const [memory, setMemory] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const stored = getStoredMemory(placeId);
    if (stored) {
      setMemory(stored.memory);
    }
  }, [placeId]);

  const handleSaveLocally = () => {
    setStored(placeId, memory);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
    onSaved?.();
  };

  const handleDownloadTxt = () => {
    const content = buildTxtContent(
      placeName,
      placeLocation,
      memory
    );
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personal-memory-${placeId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 border-t border-zinc-700 pt-4">
      <label htmlFor="experience-memory" className="sr-only">
        Your quote
      </label>
      <textarea
        id="experience-memory"
        placeholder="Add a quote or memory..."
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
        maxLength={500}
        rows={4}
        className="mb-2 w-full resize-y rounded border border-zinc-600 bg-zinc-800/80 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
        aria-describedby="memory-hint memory-count"
      />
      <p id="memory-hint" className="sr-only">
        Maximum 500 characters. Stored only on your device.
      </p>
      <p id="memory-count" className="mb-3 text-right text-xs text-zinc-500">
        {memory.length}/500
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSaveLocally}
          className="rounded bg-zinc-700 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Add
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Close
          </button>
        )}
      </div>

      {savedNotice && (
        <p className="mt-2 text-sm text-zinc-400" role="status">
          Saved on this device.
        </p>
      )}

      <p className="mt-4 text-xs text-zinc-500">
        Personal memories are stored only on your device. This project does not
        collect or publish user submissions.
      </p>
    </div>
  );
}
