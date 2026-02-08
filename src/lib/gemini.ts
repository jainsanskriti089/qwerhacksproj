// AI summaries are assistive and may miss cultural nuance.
// Original stories remain the source of truth.

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-2.5-flash-lite";

/** Minimal place context for expanding a story (avoids depending on shared types). */
export type ExpandStoryPlace = {
  name: string;
  city: string;
  years: string;
  reason: string;
  communities: string[];
  story: string;
};

/**
 * Expands a short place story into a richer narrative. Calls the backend
 * /api/expand-story proxy (which uses Gemini) to avoid CORS. The API key
 * stays server-side. If the server isn't running or the request fails,
 * returns the original story.
 */
export async function expandStory(place: ExpandStoryPlace): Promise<string> {
  const trimmed =
    typeof place.story === "string" ? place.story.trim() : "";
  if (!trimmed) return trimmed;

  try {
    console.log("[expandStory] Calling /api/expand-story for:", place.name);
    const res = await fetch("/api/expand-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(place),
    });
    const data = (await res.json()) as { text?: string };
    if (data?.text?.trim()) {
      console.log("[expandStory] Got expanded text, length:", data.text.length);
      return data.text.trim();
    }
    console.log("[expandStory] No expanded text in response, using original");
  } catch (err) {
    console.warn("[expandStory] Request failed (is the API server running?):", err);
  }
  return trimmed;
}

/** Get text from Gemini response; works even when .text() throws (e.g. blocked). */
function getResponseText(response: {
  text?: () => string;
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}): string {
  try {
    const fromMethod = response.text?.();
    if (fromMethod?.trim()) return fromMethod;
  } catch {
    // .text() throws if blocked or no candidate
  }
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const fromParts = parts
    .map((p) => (typeof p.text === "string" ? p.text : ""))
    .join("");
  return fromParts.trim() || "";
}

/**
 * Summarizes a long story string into a respectful, concise summary.
 * Uses Gemini when VITE_GEMINI_API_KEY is set; otherwise uses fallback.
 */
export async function summarizeStory(story: string): Promise<string> {
  // Step 1: Input validation — short stories returned unchanged
  const trimmed = typeof story === "string" ? story.trim() : "";
  if (!trimmed || trimmed.length < 200) {
    return trimmed;
  }

  // LOCKED PROMPT — do not change
  const prompt = `Summarize the following story respectfully, preserving cultural context,
community significance, and historical meaning. Avoid reducing it to
purely factual bullet points.

${trimmed}`;

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && typeof apiKey === "string") {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const result = await model.generateContent(prompt);
      const text = getResponseText(result.response);
      if (text.trim()) return text.trim();
    }
    // No key or empty response: use fallback after short delay
    await new Promise((resolve) =>
      setTimeout(resolve, 600 + Math.random() * 300)
    );
    return fallbackSummary(trimmed);
  } catch {
    return fallbackSummary(trimmed);
  }
}

/**
 * Deterministic fallback: first two sentences of the story.
 * Safe when API fails or is unavailable.
 */
function fallbackSummary(story: string): string {
  const sentences = story
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length === 0) return story;
  if (sentences.length === 1) return sentences[0];
  return `${sentences[0]} ${sentences[1]}`.trim();
}

// Example usage:
// const summary = await summarizeStory(place.story)
