import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const categorizeIssue = async (imageBase64: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Analyze this image of a civic issue. Identify the category (Drainage, Electrical, Roads, Garbage, Animal, Fire, or Other), provide a short descriptive title, and estimate the priority (Low, Medium, High, Urgent). Return in JSON format." },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            title: { type: Type.STRING },
            priority: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["category", "title", "priority", "description"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error categorizing issue", error);
    return null;
  }
};

export const getCivicAssistantResponse = async (query: string, history: any[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: "You are Snaptosolve's Civic Assistant. Help citizens report issues, understand local laws, and provide guidance on civic responsibilities. Be professional, helpful, and concise.",
      },
      history: history,
    });

    const response = await chat.sendMessage({ message: query });
    return response.text;
  } catch (error) {
    console.error("Error in civic assistant", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
};
