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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server http://localhost:${PORT} (proxy /api from Vite)`);
});
