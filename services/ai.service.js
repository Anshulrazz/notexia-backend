import axios from "axios";

// ======================================================
// CONFIGURATION
// ======================================================
const GEMINI_API_KEY = "AIzaSyDX6HBbg6CvFg8Sho-AhunHdmZeMhFHd18"; 

// ✅ Updated to Gemini 2.5 Flash-Lite
const GEMINI_MODEL = "gemini-2.5-flash"; 

const geminiClient = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// CORE GENERATE FUNCTION
// ======================================================
/**
 * @param {string} prompt - The prompt to send to the AI
 * @param {number} maxTokens - Limit for the response length
 * @returns {Promise<string>} - The AI generated text
 */
const generate = async (prompt) => {
  try {
    // Correct Path: /models/{model}:generateContent
    const response = await geminiClient.post(
      `/models/${GEMINI_MODEL}:generateContent`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are a senior software engineer and educator.
Rules:
- Give structured answers
- Use simple language
- Avoid fluff
- Be practical
- If helpful, include examples
- Keep concise but valuable

Think step by step before answering.

${prompt}
`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          topK: 64, // Optimized for 2.5 series
        },
      },
      {
        params: { key: GEMINI_API_KEY }
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) throw new Error("Empty AI response");

    return text;
  } catch (error) {
    // Extract the specific error message from Google's response
    const apiErrorMessage = error.response?.data?.error?.message || error.message;
    console.error("🔥 Gemini API Error:", apiErrorMessage);

    // Map common status codes to user-friendly errors
    const status = error.response?.status;
    if (status === 400) throw new Error("Invalid request or API key");
    if (status === 403) throw new Error("Access denied (Check API restrictions)");
    if (status === 404) throw new Error(`Model not found: ${GEMINI_MODEL}`);
    if (status === 429) throw new Error("Rate limit exceeded");
    
    throw new Error(apiErrorMessage);
  }
};

// ======================================================
// EXPORTED UTILITIES
// ======================================================

/**
 * Generates a helpful hint without revealing the answer.
 */
export const generateAnswerHint = async (question) => {
  const prompt = `Give only a short hint. Do NOT provide the final answer.\n\nQuestion:\n${question}`;
  return generate(prompt, 120);
};

/**
 * Extracts comma-separated technical tags.
 */
export const generateTags = async (text) => {
  const prompt = `Extract 3-5 relevant technical keywords.\nRules: lowercase, single word, comma-separated only, no explanation.\n\nText:\n${text}`;
  
  const result = await generate(prompt, 80);

  return result
    .toLowerCase()
    .replace(/\n/g, "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);
};

/**
 * Summarizes long content into 3 concise sentences.
 */
export const summarizeBlog = async (content) => {
  const prompt = `Summarize in 3 sharp sentences. Focus on key insights only.\n\nContent:\n${content}`;
  return generate(prompt, 200);
};

/**
 * Detailed technical doubt resolution.
 */
export const generateDoubtAnswer = async (question, description = "") => {
  const prompt = `
Answer in this structure:
1. Simple Explanation
2. Why It Works
3. Practical Example (if helpful)

Question:
${question}

${description ? `Context:\n${description}` : ""}
`;
  return generate(prompt, 400);
};