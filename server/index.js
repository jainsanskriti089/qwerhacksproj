import "dotenv/config";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

const GEMINI_MODEL = "gemini-2.5-flash";
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

function getResponseText(response) {
  try {
    const fromMethod = response.text?.();
    if (fromMethod?.trim()) return fromMethod;
  } catch (e) {
    console.log("[Gemini] response.text() threw:", e?.message);
  }
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const fromParts = parts
    .map((p) => (typeof p.text === "string" ? p.text : ""))
    .join("")
    .trim();
  if (!fromParts && parts.length > 0) {
    console.log("[Gemini] Could not get text from parts. Sample part keys:", Object.keys(parts[0] || {}));
  }
  return fromParts;
}

app.post("/api/expand-story", async (req, res) => {
  const place = req.body;
  const trimmed = typeof place?.story === "string" ? place.story.trim() : "";
  console.log("[Gemini] expand-story request for place:", place?.name ?? "(no name)");

  if (!trimmed) {
    console.log("[Gemini] No story text, returning empty");
    return res.json({ text: trimmed });
  }

  const context = [
    `Place: ${place.name}, ${place.city}`,
    `Years: ${place.years}`,
    `Communities: ${place.communities?.join(", ") ?? "—"}`,
    `Reason / status context: ${place.reason}`,
  ].join("\n");

  const prompt = `You are expanding a brief description of a significant LGBTQ+ or queer cultural place into a fuller narrative. Use your knowledge of history, culture, and publicly available information to add accurate, respectful detail. Do not invent quotes or specific events unless they are well-documented. Preserve the original meaning and tone.

Context:
${context}

Short story to expand:
${trimmed}

Write a longer narrative (about 3 to 4 sentences) that adds historical background, community significance, and cultural detail. Use plain text only, no bullet points or markdown.`;

  try {
    if (!apiKey) {
      console.log("[Gemini] No API key (VITE_GEMINI_API_KEY or GEMINI_API_KEY). Returning original story.");
      return res.json({ text: trimmed });
    }
    console.log("[Gemini] Calling Gemini API...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const response = result?.response;
    const text = getResponseText(response);
    console.log("[Gemini] Output length:", text?.length ?? 0, "chars");
    if (text) {
      console.log("[Gemini] Output preview:", text.slice(0, 200) + (text.length > 200 ? "..." : ""));
      return res.json({ text });
    }
    console.log("[Gemini] No text in response. Has candidates?", !!response?.candidates?.length);
    res.json({ text: trimmed });
  } catch (err) {
    console.error("[Gemini] Error:", err.message);
    res.json({ text: trimmed });
  }
});

// ElevenLabs text-to-speech — keep API key server-side
const elevenLabsKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE = "JBFqnCBsd6RMkjVDRZzb"; // George - Warm storyteller
const ELEVENLABS_MODEL = "eleven_multilingual_v2";

app.post("/api/narrate", async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }
  if (!elevenLabsKey) {
    console.log("[ElevenLabs] No API key. Set ELEVENLABS_API_KEY in .env");
    return res.status(503).json({ error: "Narration unavailable (no API key)" });
  }
  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({ text, model_id: ELEVENLABS_MODEL }),
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("[ElevenLabs] API error:", response.status, errText.slice(0, 200));
      return res.status(response.status).json({ error: "Narration failed" });
    }
    const audioBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("[ElevenLabs] Error:", err.message);
    res.status(500).json({ error: "Narration failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server http://localhost:${PORT} (proxy /api from Vite)`);
});
