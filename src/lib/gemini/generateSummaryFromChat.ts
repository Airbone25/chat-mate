import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "@/types/chat";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});;

const summaryPrompt = `Summarize the recent concerns, feelings, tone, and context from the user messages below. The summary will be hidden but used by another chatbot to reply empathetically.`;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function generateSummaryFromChat(chatHistory: ChatMessage[]): Promise<string> {
  try {
    const recentUserMessages = chatHistory
      .filter((msg) => msg.sender === "user")
      .slice(-5);

    if (recentUserMessages.length === 0) return "No user context available.";

    const contents = [
      { role: "user", parts: [{ text: summaryPrompt }] },
      ...recentUserMessages.map((msg) => ({
        role: "user",
        parts: [{ text: msg.content }],
      })),
    ];

    await delay(1200);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const summary = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!summary) {
      throw new Error("Empty summary from Gemini.");
    }

    return summary;
  } catch (error) {
    console.error("Gemini summarization failed:", error);

    const lastUserMessage = chatHistory
      .filter((m) => m.sender === "user")
      .slice(-1)[0]?.content || "Unknown user input";

    return `User expressed something recently: "${lastUserMessage.slice(0, 100)}..."`;
  }
}
