import User from "../models/User.model.js";
import Note from "../models/Note.model.js";
import Doubt from "../models/Doubt.model.js";
import Blog from "../models/Blog.model.js";
import Forum from "../models/Forum.model.js";
import Report from "../models/Report.model.js";

// ==============================
// DASHBOARD STATS
// ==============================
export const getStats = async (req, res, next) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      notes: await Note.countDocuments(),
      doubts: await Doubt.countDocuments(),
      blogs: await Blog.countDocuments(),
      forums: await Forum.countDocuments(),
      reports: await Report.countDocuments({ status: "pending" }),
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET ALL USERS
// ==============================
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// CHANGE USER ROLE
// ==============================
export const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// BAN / UNBAN USER
// ==============================
export const toggleBanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    user.isVerified = !user.isVerified;
    await user.save();

    res.status(200).json({
      success: true,
      banned: !user.isVerified,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// RECALCULATE USER STATS
// ==============================
export const recalculateUserStats = async (req, res, next) => {
  try {
    const users = await User.find();

    for (const user of users) {
      // Count doubts created by user
      const doubtsCreated = await Doubt.countDocuments({ author: user._id });

      // Count notes created by user
      const notesCount = await Note.countDocuments({ uploader: user._id });

      // Count blogs created by user
      const blogsCount = await Blog.countDocuments({ author: user._id });

      // Count doubts answered by user
      const doubtsAnswered = await Doubt.countDocuments({
        "answers.user": user._id,
      });

      // Count forum threads created by user
      const forumThreads = await Forum.countDocuments({
        "threads.author": user._id,
      });

      // Calculate total points
      const points =
        doubtsCreated * 5 +
        notesCount * 10 +
        doubtsAnswered * 5 +
        blogsCount * 8 +
        forumThreads * 8;

      // Update user stats
      await User.findByIdAndUpdate(user._id, {
        points,
        stats: {
          doubtsCreated,
          notesCount,
          blogsCount,
          doubtsAnswered,
          forumThreads,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "User stats recalculated successfully",
      usersUpdated: users.length,
    });
  } catch (error) {
    next(error);
  }
};
