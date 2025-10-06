import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// This key is managed by the execution environment. Do not change it.
const API_KEY = import.meta.env.VITE_API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates a list of facts from a given prompt using the Gemini API.
 * @param prompt The prompt to send to the Gemini API.
 * @returns A promise that resolves to an array of strings (facts).
 */
export const generateFacts = async (prompt: string): Promise<string[]> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            facts: {
              type: Type.ARRAY,
              description: "A list of exactly 5 insightful and brief facts derived from the data.",
              items: {
                type: Type.STRING,
                description: 'An insightful fact derived from the data.'
              }
            }
          },
          required: ["facts"]
        }
      }
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    if (parsed && Array.isArray(parsed.facts) && parsed.facts.length > 0) {
      return parsed.facts.slice(0, 5); // Ensure we only return up to 5 facts
    }
    
    console.warn("Gemini API returned an unexpected structure:", parsed);
    return ["Could not generate insights from the data provided."];

  } catch (error) {
    console.error("Error generating facts with Gemini:", error);
    return [
        "An error occurred while generating insights.", 
        "The AI model may be temporarily unavailable.",
        "Please check your connection and try again later."
    ];
  }
};