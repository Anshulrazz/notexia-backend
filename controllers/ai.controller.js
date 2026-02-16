import {
  generateAnswerHint,
  generateTags,
  summarizeBlog,
  generateDoubtAnswer,
} from "../services/ai.service.js";

// ==============================
// AI DOUBT HINT
// ==============================
export const getDoubtHint = async (req, res, next) => {
  console.log("📨 [getDoubtHint] Controller: Request received");
  console.log("📨 [getDoubtHint] Body:", req.body);
  
  try {
    const { question } = req.body;
    console.log("🔍 [getDoubtHint] Question extracted:", question?.substring(0, 50) + "...");

    console.log("⏳ [getDoubtHint] Calling generateAnswerHint service...");
    const hint = await generateAnswerHint(question);
    console.log("✅ [getDoubtHint] Service returned hint, length:", hint?.length);

    console.log("📤 [getDoubtHint] Sending response...");
    res.status(200).json({
      success: true,
      hint,
    });
  } catch (error) {
    console.error("❌ [getDoubtHint] Error in controller:", error.message);
    next(error);
  }
};

// ==============================
// AI TAG GENERATION
// ==============================
export const getTags = async (req, res, next) => {
  console.log("📨 [getTags] Controller: Request received");
  console.log("📨 [getTags] Body:", req.body);
  
  try {
    const { text } = req.body;
    console.log("🔍 [getTags] Text extracted, length:", text?.length);

    console.log("⏳ [getTags] Calling generateTags service...");
    const tags = await generateTags(text);
    console.log("✅ [getTags] Service returned tags:", tags);

    console.log("📤 [getTags] Sending response...");
    res.status(200).json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error("❌ [getTags] Error in controller:", error.message);
    next(error);
  }
};

// ==============================
// BLOG SUMMARY
// ==============================
export const getBlogSummary = async (req, res, next) => {
  console.log("📨 [getBlogSummary] Controller: Request received");
  console.log("📨 [getBlogSummary] Body keys:", Object.keys(req.body));
  
  try {
    const { content } = req.body;
    console.log("🔍 [getBlogSummary] Content extracted, length:", content?.length);

    console.log("⏳ [getBlogSummary] Calling summarizeBlog service...");
    const summary = await summarizeBlog(content);
    console.log("✅ [getBlogSummary] Service returned summary, length:", summary?.length);

    console.log("📤 [getBlogSummary] Sending response...");
    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("❌ [getBlogSummary] Error in controller:", error.message);
    next(error);
  }
};

// ==============================
// AI DOUBT ANSWER
// ==============================
export const getAIDoubtAnswer = async (req, res, next) => {
  console.log("📨 [getAIDoubtAnswer] Controller: Request received");
  console.log("📨 [getAIDoubtAnswer] Body:", req.body);
  
  try {
    const { question, description } = req.body;
    console.log("🔍 [getAIDoubtAnswer] Question:", question?.substring(0, 50) + "...");
    console.log("🔍 [getAIDoubtAnswer] Description provided:", !!description);

    console.log("⏳ [getAIDoubtAnswer] Calling generateDoubtAnswer service...");
    const answer = await generateDoubtAnswer(question, description);
    console.log("✅ [getAIDoubtAnswer] Service returned answer, length:", answer?.length);

    console.log("📤 [getAIDoubtAnswer] Sending response...");
    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("❌ [getAIDoubtAnswer] Error in controller:", error.message);
    next(error);
  }
};
