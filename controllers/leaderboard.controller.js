import User from "../models/User.model.js";

// ==============================
// GET LEADERBOARD
// ==============================
export const getLeaderboard = async (req, res, next) => {
  try {
    const { period = "all", limit = 50 } = req.query;

    // Get all users sorted by points
    const users = await User.find()
      .select("name avatar points stats")
      .sort({ points: -1 })
      .limit(parseInt(limit));

    // Add rank to each user with comprehensive stats
    const data = users.map((user, index) => ({
      _id: user._id,
      name: user.name,
      avatar: user.avatar || null,
      points: user.points,
      rank: index + 1,
      stats: {
        notesCreated: user.stats?.notesCount || 0,
        doubtsCreated: user.stats?.doubtsCreated || 0,
        doubtsAnswered: user.stats?.doubtsAnswered || 0,
        blogsCreated: user.stats?.blogsCount || 0,
        forumThreads: user.stats?.forumThreads || 0,
      },
    }));

    res.status(200).json({
      success: true,
      data,
      period: period || "all",
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET MY RANK
// ==============================
export const getMyRank = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("points");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Count how many users have more points
    const rank =
      (await User.countDocuments({ points: { $gt: user.points } })) + 1;

    res.status(200).json({
      success: true,
      data: {
        rank,
        points: user.points,
      },
    });
  } catch (error) {
    next(error);
  }
};
