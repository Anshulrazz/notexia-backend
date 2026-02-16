import Bookmark from "../models/Bookmark.model.js";

// ==============================
// GET ALL BOOKMARKS
// ==============================
export const getBookmarks = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user._id };

    if (type && type !== "all") {
      filter.itemType = type;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Bookmark.countDocuments(filter);

    const bookmarks = await Bookmark.find(filter)
      .populate({
        path: "itemId",
        select: "title author tags subject createdAt content",
        populate: { path: "author", select: "name avatar" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Map to include item details
    const data = bookmarks.map((b) => ({
      _id: b._id,
      user: b.user,
      itemType: b.itemType,
      itemId: b.itemId._id,
      item: b.itemId,
      createdAt: b.createdAt,
    }));

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// ADD BOOKMARK
// ==============================
export const addBookmark = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.body;

    // Validate itemType
    if (!["note", "doubt", "blog"].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid itemType. Must be 'note', 'doubt', or 'blog'",
      });
    }

    // Check if already bookmarked
    const existing = await Bookmark.findOne({
      user: req.user._id,
      itemType,
      itemId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Item already bookmarked",
      });
    }

    // Create bookmark
    const bookmark = await Bookmark.create({
      user: req.user._id,
      itemType,
      itemId,
    });

    res.status(201).json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// REMOVE BOOKMARK
// ==============================
export const removeBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// CHECK BOOKMARK STATUS
// ==============================
export const checkBookmark = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.params;

    // Validate itemType
    if (!["note", "doubt", "blog"].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid itemType. Must be 'note', 'doubt', or 'blog'",
      });
    }

    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      itemType,
      itemId,
    });

    res.status(200).json({
      success: true,
      isBookmarked: !!bookmark,
      bookmarkId: bookmark ? bookmark._id : null,
    });
  } catch (error) {
    next(error);
  }
};
