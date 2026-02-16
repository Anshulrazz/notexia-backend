import Forum from "../models/Forum.model.js";
import User from "../models/User.model.js";

// ==============================
// GET FORUM BY ID
// ==============================
export const getForumById = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.id)
      .populate("creator", "name avatar")
      .populate("members", "name avatar")
      .populate("threads.author", "name avatar");

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: "Forum not found",
      });
    }

    res.status(200).json({
      success: true,
      forum,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// CREATE FORUM
// ==============================
export const createForum = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existing = await Forum.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Forum already exists",
      });
    }

    const forum = await Forum.create({
      name,
      description,
      creator: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      success: true,
      forum,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET ALL FORUMS
// ==============================
export const getForums = async (req, res, next) => {
  try {
    const forums = await Forum.find()
      .populate("creator", "name avatar")
      .populate("members", "name avatar")
      .populate("threads.author", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: forums.length,
      forums,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// JOIN FORUM
// ==============================
export const joinForum = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res.status(404).json({
        success: false,
        message: "Forum not found",
      });
    }

    if (forum.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "Already a member",
      });
    }

    forum.members.push(req.user._id);
    await forum.save();

    res.status(200).json({
      success: true,
      membersCount: forum.members.length,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET THREAD BY ID
// ==============================
export const getThread = async (req, res, next) => {
  try {
    const { forumId, threadId } = req.params;
    const forum = await Forum.findById(forumId).populate("threads.author", "name avatar");

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: "Forum not found",
      });
    }

    const thread = forum.threads.id(threadId);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    res.status(200).json({
      success: true,
      thread,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// CREATE THREAD
// ==============================
export const createThread = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: "Forum not found",
      });
    }

    if (!forum.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Join forum to create thread",
      });
    }

    forum.threads.push({
      title,
      content,
      author: req.user._id,
    });

    await forum.save();

    // Award 8 points for creating a forum thread
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          points: 8,
          "stats.forumThreads": 1,
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      threads: forum.threads,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// DELETE FORUM
// ==============================
export const deleteForum = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: "Forum not found",
      });
    }

    if (forum.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only creator can delete forum",
      });
    }

    await Forum.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
