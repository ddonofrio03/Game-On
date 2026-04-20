import { GoogleGenAI, Type } from "@google/genai";
import { Game } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askAI(query: string, zip: string, date: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User question about sports streaming: ${query}.
      Current Date: ${date}.
      User Location ZIP: ${zip}.
      Provide a concise, helpful answer about which streaming services carry the game or league mentioned. 
      Mention specific RSNs (like YES Network, NESN, Bally Sports, etc.) if they apply to the teams in that market.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't find that info right now. Try checking the official league site.";
  }
}

export async function getSportsSchedule(league: string, date: string): Promise<Game[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic schedule for ${league} on ${date}. 
      Include 5-10 games. For soccer (league: Soccer), include Premier League games. For UCL, include Champions League.
      Make sure to include realistic streaming services (e.g., ESPN+, Peacock, Paramount+, Apple TV, Amazon Prime, local RSNs, TNT, ABC).
      Current date for context: ${date}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              league: { type: Type.STRING },
              awayTeam: { type: Type.STRING },
              homeTeam: { type: Type.STRING },
              startTime: { type: Type.STRING, description: "ISO 8601 format" },
              status: { type: Type.STRING, enum: ["live", "upcoming", "finished"] },
              competition: { type: Type.STRING },
              streamingServices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    url: { type: Type.STRING }
                  },
                  required: ["name"]
                }
              }
            },
            required: ["id", "league", "awayTeam", "homeTeam", "startTime", "status", "streamingServices"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching schedule from Gemini:", error);
    return [];
  }
}
