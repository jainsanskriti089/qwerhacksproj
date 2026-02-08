import { useState, useEffect, useCallback } from "react";
import { getMemoriesFromStorage, saveMemoriesToStorage } from "../lib/memoriesStorage";

/**
 * Local-only type (not in types.ts).
 * @typedef {{ id: string, placeId: string, imageBase64: string, caption: string, year: number, month: number, createdAt: number }} MemoryEntry
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_OPTIONS = MONTHS.map((name, i) => ({ value: i + 1, label: name }));

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => 1900 + i).reverse();

/**
 * @param {{ placeId: string, onMemoryAdded?: () => void }} props
 */
export function MemoryTimeline({ placeId, onMemoryAdded }) {
  const [memories, setMemories] = useState([]);
  const [imageBase64, setImageBase64] = useState("");
  const [caption, setCaption] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [formKey, setFormKey] = useState(0);

  const loadMemories = useCallback(async () => {
    const record = await getMemoriesFromStorage();
    const list = record[placeId];
    setMemories(Array.isArray(list) ? list : []);
  }, [placeId]);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageBase64 || !caption.trim() || !year || !month) return;

    const record = await getMemoriesFromStorage();
    const list = record[placeId] ?? [];
    /** @type {MemoryEntry} */
    const entry = {
      id: crypto.randomUUID?.() ?? `mem-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      placeId,
      imageBase64,
      caption: caption.trim().slice(0, 200),
      year: Number(year),
      month: Number(month),
      createdAt: Date.now(),
    };
    record[placeId] = [...list, entry];
    await saveMemoriesToStorage(record);
    await loadMemories();
    onMemoryAdded?.();

    setImageBase64("");
    setCaption("");
    setYear("");
    setMonth("");
    setFormKey((k) => k + 1);
  };

  const sorted = [...memories].sort((a, b) => {
    const yearA = a.year ?? 0;
    const yearB = b.year ?? 0;
    if (yearA !== yearB) return yearA - yearB;
    const monthA = a.month ?? 0;
    const monthB = b.month ?? 0;
    if (monthA !== monthB) return monthA - monthB;
    const dayA = a.day ?? 0;
    const dayB = b.day ?? 0;
    if (dayA !== dayB) return dayA - dayB;
    return (a.createdAt ?? 0) - (b.createdAt ?? 0);
  });

  const canSubmit = imageBase64 && caption.trim() && year && month;

  return (
    <section
      className="memory-timeline pt-6 mt-6"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
      aria-label="Community memories"
    >
      <p
        className="text-sm mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        Memories help keep places alive. Add a photo or moment connected to this space.
      </p>

      <div className="relative mb-6">
        {/* Timeline line */}
        <div
          className="absolute left-3 top-0 bottom-0 w-px"
          style={{ backgroundColor: "var(--border-subtle)" }}
          aria-hidden="true"
        />
        {sorted.length === 0 ? (
          <p
            className="text-sm py-4 pl-8 relative"
            style={{ color: "var(--text-muted)" }}
          >
            No memories added yet.
          </p>
        ) : (
          <ul className="list-none p-0 m-0 space-y-6">
            {sorted.map((entry) => (
              <li
                key={entry.id}
                className="relative pl-8"
              >
                <div
                  className="absolute left-0 w-2.5 h-2.5 rounded-full border-2 top-2"
                  style={{
                    backgroundColor: "var(--bg-panel)",
                    borderColor: "var(--accent-purple)",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="rounded-lg overflow-hidden border p-0"
                  style={{
                    borderColor: "var(--border-subtle)",
                    boxShadow: "0 2px 8px rgba(45, 40, 56, 0.06)",
                  }}
                >
                  <div className="aspect-video w-full overflow-hidden bg-[var(--bg-base)]">
                    <img
                      src={entry.imageBase64}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ maxHeight: 200 }}
                    />
                  </div>
                  <div className="p-3">
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {MONTHS[(entry.month ?? 1) - 1]}
                      {entry.year != null ? ` ${entry.year}` : entry.day != null ? ` ${entry.day}` : ""}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {entry.caption}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
        Add to timeline
      </p>
      <form key={formKey} onSubmit={handleSubmit} className="memory-timeline__form space-y-3 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Photo
          </label>
          <div
            className="rounded-lg border px-3 py-2.5"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--bg-base)",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="memory-timeline__file-input block w-full text-sm"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          {imageBase64 && (
            <div className="mt-2 rounded-lg overflow-hidden" style={{ maxHeight: 120, border: "1px solid var(--border-subtle)" }}>
              <img
                src={imageBase64}
                alt="Preview"
                className="w-full h-auto object-cover"
                style={{ maxHeight: 120, objectFit: "cover" }}
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
            rows={2}
            placeholder="A moment or memory..."
            className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--bg-panel)",
              color: "var(--text-primary)",
            }}
          />
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {caption.length}/200
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-panel)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">—</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-panel)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">—</option>
              {MONTH_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: canSubmit ? "var(--border-subtle)" : "var(--bg-base)",
            color: canSubmit ? "var(--text-primary)" : "var(--text-muted)",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          Add memory
        </button>
      </form>
    </section>
  );
}
