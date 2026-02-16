import dotenv from "dotenv";
import OpenAI from "openai";

// Ensure dotenv is loaded
dotenv.config();

let openai = null;

if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY not found in environment variables");
} else {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("✅ OpenAI initialized");
  } catch (error) {
    console.error("❌ Failed to initialize OpenAI:", error.message);
  }
}

export default openai;
