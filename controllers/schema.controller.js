import User from "../models/User.model.js";
import Blog from "../models/Blog.model.js";
import Note from "../models/Note.model.js";
import Doubt from "../models/Doubt.model.js";
import Forum from "../models/Forum.model.js";
import Bookmark from "../models/Bookmark.model.js";
import Report from "../models/Report.model.js";
import Embedding from "../models/Embedding.model.js";

// ==============================
// GET ALL SCHEMAS DATA
// ==============================
export const getAllSchemas = async (req, res, next) => {
  try {
    // Fetch all data from all models
    const allData = {
      users: await User.find().select("-password"),
      blogs: await Blog.find().populate("author", "name avatar email").populate("likes", "name avatar"),
      notes: await Note.find().populate("uploader", "name avatar email").populate("likes", "name avatar").populate("comments.user", "name avatar"),
      doubts: await Doubt.find().populate("author", "name avatar email").populate("answers.user", "name avatar email").populate("answers.upvotes", "name avatar"),
      forums: await Forum.find().populate("creator", "name avatar email").populate("members", "name avatar").populate("threads.author", "name avatar"),
      bookmarks: await Bookmark.find().populate("user", "name avatar email"),
      reports: await Report.find().populate("reporter", "name avatar email"),
      embeddings: await Embedding.find(),
    };

    // Get counts
    const counts = {
      users: await User.countDocuments(),
      blogs: await Blog.countDocuments(),
      notes: await Note.countDocuments(),
      doubts: await Doubt.countDocuments(),
      forums: await Forum.countDocuments(),
      bookmarks: await Bookmark.countDocuments(),
      reports: await Report.countDocuments(),
      embeddings: await Embedding.countDocuments(),
    };

    res.status(200).json({
      success: true,
      counts,
      data: allData,
    });
  } catch (error) {
    next(error);
  }
};
