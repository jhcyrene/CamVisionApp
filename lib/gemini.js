import * as FileSystem from "expo-file-system/legacy";

/**
 * Converts a local file URI to a base64 string.
 * 
 * @param {string} uri The file URI to convert.
 * @returns {Promise<string>} The base64 encoded string.
 * 
 * 
 */

export const ANALYSIS_PROMPT = `
Analyze this image. Identify:
1. Objects - list the distinct physical objects you see
2. Context - briefly describe the setting or scene
3. Activities - what activity appears to be happening, if any
4. Recommendations - one practical suggestion based on the scene

Respond ONLY with valid JSON in this exact shape. Do not include markdown formatting, backticks, or any conversational text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`;

export async function imageToBase64(uri) {
    // Check if the URI is valid
    if (!uri || typeof uri !== "string") {
        throw new Error("Invalid URI provided");
    }

    try {
        // Read the file as a base64 string
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: "base64",
        });
        return base64;
    } catch (error) {
        console.error("Failed to convert image to base64:", error);
        throw new Error("Failed to process image");
    }
}

export const PROMPTS = {
    academic: "Act as a university professor. Analyze this image and describe what you see in detail. Identify objects, provide educational context, and offer one piece of constructive feedback.",
    safety: "Act as a workplace safety inspector. Analyze this image and identify any visible hazards. If none exist, state clearly that no hazards were found.",
    inventory: "Act as an asset management clerk. Analyze this image and provide a clean list of visible assets with no commentary."
};

// Prevent rapid requests (Rate Limiting)
let lastRequestTime = 0;
const COOLDOWN_MS = 5000; // 5 seconds

export async function analyzeImage(base64Image, prompt) {
    const now = Date.now();
    if (now - lastRequestTime < COOLDOWN_MS) {
        throw new Error(`Please wait ${Math.ceil((COOLDOWN_MS - (now - lastRequestTime)) / 1000)} seconds before making another request to prevent overload.`);
    }
    lastRequestTime = now;

    const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;

    if (!apiKey) {
        throw new Error("Missing API key. Report to the developer.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const finalPrompt = prompt + "\n\n" + ANALYSIS_PROMPT;

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: finalPrompt },
                    {
                        inline_data: {
                            mime_type: 'image/jpeg',
                            data: base64Image,
                        },
                    },
                ],
            },
        ],
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Parse the JSON response
        const data = await response.json();

        // Catch non-200 responses and handle them gracefully
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("You have exceeded your AI quota. Please try again later.");
            } else if (response.status === 403 || response.status === 401) {
                throw new Error("API Key is invalid or expired. Please check your configuration.");
            } else {
                throw new Error("The AI service encountered an error. Please try again.");
            }
        }

        return data;

    } catch (error) {
        console.error("Error in analyzeImage:", error);
        throw error;
    }
}