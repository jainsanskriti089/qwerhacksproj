/**
 * Returns a playable blob URL for narrated audio from the given text.
 * Uses ElevenLabs text-to-speech via /api/narrate (server) or direct API
 * when server is unavailable (requires VITE_ELEVENLABS_API_KEY).
 */

const ELEVENLABS_VOICE = "iCrDUkL56s3C8sCRl7wb"; //Hope
const ELEVENLABS_MODEL = "eleven_multilingual_v2";

async function narrateViaApi(text: string, apiKey: string): Promise<string> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({ text, model_id: ELEVENLABS_MODEL }),
  });
  if (!res.ok) {
    throw new Error(`ElevenLabs API error: ${res.status}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function narrateStory(text: string): Promise<string> {
  if (typeof text !== "string" || !text.trim()) {
    return "";
  }

  const trimmed = text.trim();

  // Try server first (keeps API key server-side)
  try {
    const res = await fetch("/api/narrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });
    if (res.ok) {
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    }
  } catch (err) {
    console.log("[narrateStory] Server unavailable, trying client API");
  }

  // Fallback: call ElevenLabs directly (no server needed)
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (apiKey && typeof apiKey === "string") {
    try {
      return await narrateViaApi(trimmed, apiKey);
    } catch (err) {
      console.warn("[narrateStory] ElevenLabs failed:", err);
    }
  }

  return "";
}
