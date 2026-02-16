import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

// Required for ES Modules (__dirname fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");

// ============================
// STORAGE CONFIG
// ============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";

    if (file.fieldname === "note") folder = "notes";
    if (file.fieldname === "project") folder = "projects";
    if (file.fieldname === "avatar") folder = "avatars";

    cb(null, path.join(uploadsDir, folder));
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ============================
// FILE FILTER
// ============================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "image/png",
    "image/jpeg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

// ============================
// UPLOAD INSTANCE
// ============================
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20971520,
  },
  fileFilter,
});

// Error handling for multer
upload.errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds maximum limit",
      });
    }
  }
  next(err);
};

export default upload;
