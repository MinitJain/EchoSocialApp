import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// The SDK automatically looks for process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are Echo, a helpful social media guide for the Echo platform.
Be concise, friendly, and helpful. Provide practical advice for social media success.`;

export const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // In the 1.x SDK, we send EVERYTHING in the 'contents' array
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history, // The history sent from frontend
        { role: "user", parts: [{ text: message }] }, // The new user message
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 500,
        // Optional: 'thinkingLevel' is a new 2026 feature for Gemini 3
        // thinkingConfig: { thinkingLevel: "low" }
      },
    });

    // Access text directly: response.text (property, not function)
    const responseText = response.text;

    if (!responseText) throw new Error("AI returned an empty response.");

    res.json({ response: responseText });
  } catch (error) {
    console.error("❌ AI Chat Error:", error);
    res.status(error.status || 500).json({
      error: error.message,
      code: error.status,
    });
  }
};
