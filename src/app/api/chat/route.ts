import { GoogleGenAI } from "@google/genai";
import PERSONAS from "@/prompts/personas";
import { NextResponse } from "next/server";
import { ChatMessage } from "@/types/chat";
import { generateSummaryFromChat } from "@/lib/gemini/generateSummaryFromChat";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, personaId, chatHistory = [] } = await req.json();

    generateSummaryFromChat(chatHistory as ChatMessage[])
      .then((summary) => {
        console.log("Generated summary:", summary);
      })
      .catch((error) => {
        console.error("Error generating summary:", error);
      });


    const systemMessage = {
      role: "model",
      parts: [{ text: PERSONAS.find(p => p.id == personaId)?.persona }],
    };

    const historyMessages = (chatHistory as ChatMessage[]).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));


    const contents = [
      systemMessage,
      ...historyMessages,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const reply = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Gemini" },
      { status: 500 }
    );
  }
}