
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Achievement } from "../types";

// Helper to get API key
const getAiClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY;;
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDailyQuote = async (): Promise<{text: string, author: string}> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a real, famous, philosophical quote from history. It must be a real quote by a real person. Return strictly a JSON object with keys 'text' and 'author'. Example: {\"text\": \"Know thyself.\", \"author\": \"Socrates\"}",
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const json = JSON.parse(response.text || "{}");
    return {
        text: json.text || "The journey of a thousand miles begins with a single step.",
        author: json.author || "Lao Tzu"
    };
  } catch (error) {
    console.error("Error generating quote:", error);
    return {
        text: "Act as if what you do makes a difference. It does.",
        author: "William James"
    };
  }
};

export const generateJournalPrompt = async (
  completedTasks: Task[],
  mood: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const taskNames = completedTasks.map(t => t.title).join(", ");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `The user has completed these tasks today: ${taskNames || "None"}. 
      Their current mood is: ${mood}.
      Generate a single, short, insightful, and introspective journal prompt (max 20 words) to help them reflect on their day. 
      Make it specific to their mood and activity if possible.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "What was the most meaningful moment of your day?";
  } catch (error) {
    console.error("Error generating prompt:", error);
    return "Reflect on your achievements today. How do you feel?";
  }
};

export const generateAchievementArt = async (
  taskTitle: string,
  days: number,
  isSculpture: boolean = false
): Promise<string | null> => {
  try {
    const ai = getAiClient();
    const model = "gemini-3-pro-image-preview";

    let prompt = "";
    if (isSculpture) {
      prompt = `A 3D render of a futuristic, abstract digital sculpture commemorating the completion of the project: "${taskTitle}". 
      Bright, upbeat colors, floating islands, glass and crystal materials, placed in a virtual gallery. High quality, 4k.`;
    } else {
      prompt = `An abstract artistic collectible card representing a ${days}-day streak of "${taskTitle}". 
      The style should be generative art, bright colors, geometric patterns, white digital frame border. 
      Includes a sense of progression and rarity.`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        imageConfig: {
            aspectRatio: isSculpture ? "16:9" : "3:4", 
            imageSize: "1K"
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    return null;

  } catch (error) {
    console.error("Error generating art:", error);
    return null;
  }
};

export const analyzeSentimentAndFeedback = async (
  journalContent: string
): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze this journal entry: "${journalContent}". 
            Provide a very brief (one sentence) encouraging insight or observation about their mindset.`,
        });
        return response.text || "Keep up the great work!";
    } catch (e) {
        return "Thank you for sharing your thoughts.";
    }
}
