import openai from "../config/openai.js";
import Embedding from "../models/Embedding.model.js";

// ==============================
// CREATE EMBEDDING
// ==============================
export const createEmbedding = async (text, sourceType, sourceId) => {
  if (!openai) return;

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  await Embedding.create({
    sourceType,
    sourceId,
    vector: response.data[0].embedding,
  });
};
