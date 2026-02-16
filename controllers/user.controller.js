import User from "../models/User.model.js";
import Note from "../models/Note.model.js";
import Doubt from "../models/Doubt.model.js";
import Blog from "../models/Blog.model.js";
import Forum from "../models/Forum.model.js";

const buildAbsoluteAvatarUrl = (req, avatar) => {
  if (!avatar) return avatar;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return `${req.protocol}://${req.get("host")}${avatar.startsWith("/") ? avatar : `/${avatar}`}`;
};

const sanitizeUser = (req, userDoc) => {
  if (!userDoc) return userDoc;
  const user = typeof userDoc.toObject === "function" ? userDoc.toObject() : { ...userDoc };
  user.avatar = buildAbsoluteAvatarUrl(req, user.avatar);
  return user;
};

// ==============================
// GET USER BY ID
// ==============================
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(req, user),
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET MY PROFILE
// ==============================
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: sanitizeUser(req, user),
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPDATE PROFILE
// ==============================
export const updateProfile = async (req, res, next) => {
  try {
    const { name, college, branch, year } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, college, branch, year },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: sanitizeUser(req, user),
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPLOAD / UPDATE AVATAR
// ==============================
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar file required",
      });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      avatar: buildAbsoluteAvatarUrl(req, avatarPath),
      user: sanitizeUser(req, user),
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// CHANGE PASSWORD
// ==============================
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET USER STATS
// ==============================
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const notesUploaded = await Note.countDocuments({ uploader: userId });
    const doubtsAsked = await Doubt.countDocuments({ author: userId });
    const blogsWritten = await Blog.countDocuments({ author: userId });
    const forumsJoined = await Forum.countDocuments({ members: userId });

    const doubtsAnswered = await Doubt.countDocuments({
      "answers.user": userId,
    });

    res.status(200).json({
      success: true,
      data: {
        notesUploaded,
        doubtsAsked,
        doubtsAnswered,
        blogsWritten,
        forumsJoined,
      },
    });
  } catch (error) {
    next(error);
  }
};
