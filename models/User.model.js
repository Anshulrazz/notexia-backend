import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
      default: null,
    },

    role: {
      type: String,
      enum: ["student", "moderator", "admin"],
      default: "student",
    },

    reputation: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    points: {
      type: Number,
      default: 0,
    },

    stats: {
      notesCount: {
        type: Number,
        default: 0,
      },
      doubtsCreated: {
        type: Number,
        default: 0,
      },
      doubtsAnswered: {
        type: Number,
        default: 0,
      },
      blogsCount: {
        type: Number,
        default: 0,
      },
      forumThreads: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

// ==============================
// HASH PASSWORD BEFORE SAVE
// ==============================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ==============================
// COMPARE PASSWORD
// ==============================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
