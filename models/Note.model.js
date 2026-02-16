import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    file: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
    },

    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["note", "project"],
      default: "note",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    downloads: {
      type: Number,
      default: 0,
    },

    comments: [commentSchema],
  },
  { timestamps: true }
);

noteSchema.virtual("author", {
  ref: "User",
  localField: "uploader",
  foreignField: "_id",
  justOne: true,
});

noteSchema.set("toObject", { virtuals: true });
noteSchema.set("toJSON", { virtuals: true });

const Note = mongoose.model("note", noteSchema);
export default Note;
