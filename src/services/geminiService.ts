import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getChatResponse(history: { role: "user" | "model"; parts: { text: string }[] }[]) {
  // Convert history to the format expected by generateContent if needed, 
  // but generateContent takes a contents array.
  // The skill shows: contents: "prompt" or contents: { parts: [...] }
  
  // For chat-like history, we can pass the entire history as the contents array.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: history.map(item => ({
      role: item.role,
      parts: item.parts
    }))
  });

  return response.text || "No response generated.";
}
