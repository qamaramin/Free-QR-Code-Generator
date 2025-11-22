import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert QR Code Data Formatter. Your job is to translate natural language requests into standardized QR code data strings.
Do not explain. Do not include markdown code blocks. Return ONLY the raw data string.

Supported formats:
1. WiFi: WIFI:S:MySSID;T:WPA;P:password123;;
2. vCard (3.0): BEGIN:VCARD\nVERSION:3.0\nN:Doe;John\nFN:John Doe\nTEL;TYPE=CELL:555-1234\nEMAIL:john@example.com\nEND:VCARD
3. iCalendar (VEVENT): BEGIN:VEVENT...
4. Email (mailto): mailto:addr@example.com?subject=...&body=...
5. SMS: smsto:5551234:Message body
6. Geo: geo:37.7749,-122.4194
7. URL: https://... (Ensure valid URL format)

If the input is just a general question not asking for a QR payload, politely refuse and say "Please describe what you want the QR code to do (e.g., 'Connect to WiFi named Guest with password 123')."
`;

export const generateSmartQRContent = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Low temperature for deterministic formatting
      },
    });

    return response.text ? response.text.trim() : "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate smart content.");
  }
};