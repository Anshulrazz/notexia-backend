import Note from "../models/Note.model.js";
import User from "../models/User.model.js";

// ==============================
// GET NOTE BY ID
// ==============================
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("uploader", "name college avatar")
      .populate("comments.user", "name college avatar");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// CREATE NOTE / PROJECT
// ==============================
export const createNote = async (req, res, next) => {
  try {
    const { title, description, subject, tags, type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const note = await Note.create({
      title,
      description,
      subject,
      tags: tags ? tags.split(",") : [],
      type,
      uploader: req.user._id,
      file: {
        filename: req.file.filename,
        path: `/uploads/${type === "project" ? "projects" : "notes"}/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });

    // Award 10 points for creating a note
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          points: 10,
          "stats.notesCount": 1,
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET ALL NOTES / PROJECTS
// ==============================
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find()
      .populate("uploader", "name college avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// LIKE / UNLIKE NOTE
// ==============================
export const toggleLike = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const liked = note.likes.includes(req.user._id);

    if (liked) {
      note.likes.pull(req.user._id);
    } else {
      note.likes.push(req.user._id);
    }

    await note.save();

    res.status(200).json({
      success: true,
      likes: note.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// COMMENT ON NOTE
// ==============================
export const addComment = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.comments.push({
      user: req.user._id,
      text: req.body.text,
    });

    await note.save();

    res.status(201).json({
      success: true,
      comments: note.comments,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// INCREMENT DOWNLOAD COUNT
// ==============================
export const incrementDownload = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.downloads += 1;
    await note.save();

    res.status(200).json({
      success: true,
      downloads: note.downloads,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPDATE NOTE
// ==============================
export const updateNote = async (req, res, next) => {
  try {
    const { title, subject, tags } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only author can update note",
      });
    }

    if (title) note.title = title;
    if (subject) note.subject = subject;
    if (tags) note.tags = Array.isArray(tags) ? tags : tags.split(",");

    await note.save();

    res.status(200).json({
      success: true,
      data: { note },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// DELETE NOTE
// ==============================
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only author can delete note",
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

