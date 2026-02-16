import Doubt from "../models/Doubt.model.js";
import User from "../models/User.model.js";

// ==============================
// GET DOUBT BY ID
// ==============================
export const getDoubtById = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate("author", "name avatar college")
      .populate("answers.user", "name avatar college");

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    res.status(200).json({
      success: true,
      doubt,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// CREATE DOUBT
// ==============================
export const createDoubt = async (req, res, next) => {
  try {
    const { question, description, tags } = req.body;

    const doubt = await Doubt.create({
      question,
      description,
      tags: tags ? tags.split(",") : [],
      author: req.user._id,
    });

    // Award 5 points for creating a doubt
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          points: 5,
          "stats.doubtsCreated": 1,
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      doubt,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET ALL DOUBTS
// ==============================
export const getDoubts = async (req, res, next) => {
  try {
    const doubts = await Doubt.find()
      .populate("author", "name avatar college")
      .populate("answers.user", "name avatar college")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doubts.length,
      doubts,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// ANSWER DOUBT
// ==============================
export const answerDoubt = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ success: false, message: "Doubt not found" });
    }

    doubt.answers.push({
      user: req.user._id,
      text: req.body.text,
    });

    await doubt.save();

    res.status(201).json({
      success: true,
      answers: doubt.answers,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPVOTE ANSWER
// ==============================
export const upvoteAnswer = async (req, res, next) => {
  try {
    const { doubtId, answerId } = req.params;
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ success: false, message: "Doubt not found" });
    }

    const answer = doubt.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ success: false, message: "Answer not found" });
    }

    const hasUpvoted = answer.upvotes.includes(req.user._id);
    if (hasUpvoted) {
      answer.upvotes.pull(req.user._id);
    } else {
      answer.upvotes.push(req.user._id);
    }

    await doubt.save();

    res.status(200).json({
      success: true,
      upvotes: answer.upvotes.length,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// ACCEPT ANSWER
// ==============================
export const acceptAnswer = async (req, res, next) => {
  try {
    const { doubtId, answerId } = req.params;
    const doubt = await Doubt.findById(doubtId);

    if (!doubt) {
      return res.status(404).json({ success: false, message: "Doubt not found" });
    }

    if (doubt.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only author can accept answer",
      });
    }

    doubt.acceptedAnswer = answerId;
    await doubt.save();

    res.status(200).json({
      success: true,
      acceptedAnswer: answerId,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// DELETE DOUBT
// ==============================
export const deleteDoubt = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    if (doubt.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only author can delete doubt",
      });
    }

    await Doubt.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
