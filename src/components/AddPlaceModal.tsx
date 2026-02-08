import { useState, useId } from "react";
import type { Place } from "../data/places";
import { geocodeAddress } from "../lib/geocode";

type StatusOption = "active" | "threatened" | "erased";

type AddPlaceModalProps = {
  onClose: () => void;
  onAdd: (place: Place) => void;
};

function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AddPlaceModal({ onClose, onAdd }: AddPlaceModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [story, setStory] = useState("");
  const [quote, setQuote] = useState("");
  const [status, setStatus] = useState<StatusOption>("active");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nameId = useId();
  const addressId = useId();
  const storyId = useId();
  const quoteId = useId();
  const statusId = useId();
  const startDateId = useId();
  const endDateId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeocodeError(null);

    const nameTrim = name.trim();
    const addressTrim = address.trim();
    const storyTrim = story.trim();

    if (!nameTrim || !addressTrim || !storyTrim || !startDate.trim()) return;

    setSubmitting(true);
    const result = await geocodeAddress(addressTrim);
    setSubmitting(false);

    if (!result) {
      setGeocodeError("We couldn’t find that address. Please check it and try again.");
      return;
    }

    const place: Place = {
      id: generateId(),
      name: nameTrim,
      lat: result.lat,
      lng: result.lng,
      fullAddress: result.fullAddress,
      story: storyTrim,
      quote: quote.trim() || undefined,
      status,
      startDate: startDate.trim(),
      endDate: endDate.trim() || undefined,
      source: "user",
      createdAt: new Date().toISOString(),
    };

    onAdd(place);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-place-title"
    >
      <div className="w-full max-w-md rounded-lg bg-[var(--bg-panel)] shadow-xl border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
          <h2 id="add-place-title" className="text-lg font-medium text-[var(--text-primary)]">
            Add a place by address
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 rounded"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor={nameId} className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Place name <span className="text-[var(--status-erased)]">*</span>
            </label>
            <input
              id={nameId}
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-white px-3 py-2 text-[var(--text-primary)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/50"
              placeholder="e.g. The Stud"
            />
          </div>

          <div>
            <label htmlFor={addressId} className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Address <span className="text-[var(--status-erased)]">*</span>
            </label>
            <input
              id={addressId}
              type="text"
              required
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setGeocodeError(null);
              }}
              className="w-full rounded border border-[var(--border-subtle)] bg-white px-3 py-2 text-[var(--text-primary)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/50"
              placeholder="Street, city, or region"
              autoComplete="off"
            />
            {geocodeError && (
              <p className="mt-1 text-sm text-[var(--status-erased)]" role="alert">
                {geocodeError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={storyId} className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Story / description <span className="text-[var(--status-erased)]">*</span>
            </label>
            <textarea
              id={storyId}
              required
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={3}
              className="w-full rounded border border-[var(--border-subtle)] bg-white px-3 py-2 text-[var(--text-primary)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/50 resize-y"
              placeholder="What happened here? Why does it matter?"
            />
          </div>

          <div>
            <label htmlFor={quoteId} className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Quote <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <input
              id={quoteId}
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-white px-3 py-2 text-[var(--text-primary)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/50"
              placeholder="A short quote or memory"
            />
          </div>

          <div>
            <label htmlFor={statusId} className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Status <span className="text-[var(--status-erased)]">*</span>
            </label>
            <select
              id={statusId}
              required
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusOption)}
              className="w-full rounded border border-[var(--border-subtle)] bg-white px-3 py-2 text-[var(--text-primary)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/50"
            >
              <option value="active">Active</option>
              <option value="threatened">Threatened</option>
              <option value="erased">Erased</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={startDateId} className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Start date <span className="text-[var(--status-erased)]">*</span>
              </label>
              <input
                id={startDateId}
                type="text"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border border-[var(--border-subtle)] bg-white px-3 py-2 text-[var(--text-primary)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/50"
                placeholder="YYYY or YYYY-MM"
              />
            </div>
            <div>
              <label htmlFor={endDateId} className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                End date <span className="text-[var(--text-muted)]">(optional)</span>
              </label>
              <input
                id={endDateId}
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded border border-[var(--border-subtle)] bg-white px-3 py-2 text-[var(--text-primary)] focus:border-[var(--focus-ring)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/50"
                placeholder="YYYY or YYYY-MM"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded px-4 py-2 text-sm font-medium text-white bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/90 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
            >
              {submitting ? "Finding address…" : "Add place"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
