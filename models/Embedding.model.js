import mongoose from "mongoose";

const embeddingSchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      enum: ["doubt", "note", "blog"],
      required: true,
    },

    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    vector: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

const Embedding = mongoose.model("Embedding", embeddingSchema);
export default Embedding;
