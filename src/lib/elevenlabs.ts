/**
 * Returns a URL for narrated audio from the given text.
 * Mocked for hackathon; works offline without an API key.
 */

// Real ElevenLabs integration would:
// 1. Send POST request with voice_id + text
// 2. Receive audio stream
// 3. Store or return a playable URL

export async function narrateStory(text: string): Promise<string> {
  if (typeof text !== "string" || !text.trim()) {
    return "";
  }

  try {
    // Simulate async generation (800–1200 ms)
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 400)
    );

    // Return a placeholder URL that looks like a real audio asset
    return "/audio/sample.mp3";
  } catch {
    return "";
  }
}

// Example usage:
// const audioUrl = await narrateStory(summary)
