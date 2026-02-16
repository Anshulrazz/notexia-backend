import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    itemType: {
      type: String,
      enum: ["note", "doubt", "blog"],
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemType",
    },
  },
  { timestamps: true }
);

// Ensure unique bookmark per user per item
bookmarkSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;
