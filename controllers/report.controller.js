import Report from "../models/Report.model.js";

// ==============================
// GET REPORT BY ID (ADMIN)
// ==============================
export const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reporter", "name email avatar");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// CREATE REPORT (USER)
// ==============================
export const createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, reason } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({
        success: false,
        message: "targetType, targetId and reason are required",
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
    });

    res.status(201).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET ALL REPORTS (ADMIN)
// ==============================
export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPDATE REPORT STATUS (ADMIN)
// ==============================
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};
