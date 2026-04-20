import { Game } from "../types";

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt: string, jsonMode = false): Promise<string> {
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  if (jsonMode) {
    body.generationConfig = { responseMimeType: "application/json" };
  }
  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function askAI(query: string, zip: string, date: string): Promise<string> {
  try {
    return await callGemini(
      `User question about sports streaming: ${query}.
      Current Date: ${date}. User Location ZIP: ${zip}.
      Provide a concise, helpful answer about which streaming services carry the game or league mentioned.
      Mention specific RSNs (like YES Network, NESN, Bally Sports, etc.) if they apply to the teams in that market.`
    );
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't find that info right now. Try checking the official league site.";
  }
}

export async function getSportsSchedule(league: string, date: string): Promise<Game[]> {
  try {
    const text = await callGemini(
      `Generate a realistic schedule for ${league} on ${date}.
      Include 5-10 games. For soccer (league: Soccer), include Premier League games. For UCL, include Champions League.
      Include realistic streaming services (e.g., ESPN+, Peacock, Paramount+, Apple TV+, Amazon Prime, TNT, ABC).
      Return ONLY a JSON array with objects containing: id (string), league (string), awayTeam (string), homeTeam (string),
      startTime (ISO 8601 string), status ("live"|"upcoming"|"finished"),
      streamingServices (array of {name: string}).`,
      true
    );
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }
}
