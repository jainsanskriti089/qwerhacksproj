/**
 * Memory storage: JSON file via dev API when available, else localStorage.
 * Data shape: Record<placeId, MemoryEntry[]>
 * MemoryEntry = { id, placeId, imageBase64, caption, year, month (1-12), createdAt }
 */
const STORAGE_KEY = "what-was-here-memories";
const API_URL = "/api/memories";

/**
 * @returns {Promise<Record<string, Array<{ id: string, placeId: string, imageBase64: string, caption: string, year: number, month: number, createdAt: number }>>>}
 */
export async function getMemoriesFromStorage() {
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object" && !Array.isArray(data)) return data;
    }
  } catch {
    // fall through to localStorage
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    return {};
  } catch {
    return {};
  }
}

/**
 * @param {Record<string, Array<{ id: string, placeId: string, imageBase64: string, caption: string, year: number, month: number, createdAt: number }>>} record
 * @returns {Promise<void>}
 */
export async function saveMemoriesToStorage(record) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (res.ok) return;
  } catch {
    // fall through to localStorage
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // fail silently
  }
}
