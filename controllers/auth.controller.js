import { OAuth2Client } from "google-auth-library"
import User from "../models/User.model.js"
import jwt from "jsonwebtoken"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const buildAbsoluteAvatarUrl = (req, avatar) => {
  if (!avatar) return avatar;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return `${req.protocol}://${req.get("host")}${avatar.startsWith("/") ? avatar : `/${avatar}`}`;
};

export const googleLogin = async (req, res) => {
  try {
    const idToken = req.body?.token || req.body?.credential || req.body?.idToken;
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload?.email) {
      return res.status(401).json({
        success: false,
        message: "Unable to verify Google account",
      });
    }

    const { email, name, picture } = payload

    let user = await User.findOne({ email })

    const highResAvatar = picture?.replace("=s96-c", "=s400-c")

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: highResAvatar,
        isVerified: true,
        password: Math.random().toString(36).slice(-8),
      })
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Your profile has been banned. Contact support@notexia.in or wait until revocation.",
      });
    }

    const jwtToken = generateToken(user._id)

    // Keep auth behavior consistent with email/password login
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: buildAbsoluteAvatarUrl(req, user.avatar),
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Google login error:", error.message)
    res.status(401).json({
      success: false,
      message: "Invalid Google token",
    })
  }
}


// ==============================
// GENERATE JWT
// ==============================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ==============================
// REGISTER USER
// ==============================
export const register = async (req, res, next) => {
  try {
    const { name, email, password, college, branch, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      college,
      branch,
      year,
    });

    const token = generateToken(user._id);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: buildAbsoluteAvatarUrl(req, user.avatar),
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// LOGIN USER
// ==============================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Your profile has been banned. Contact support@notexia.in or wait until revocation.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: buildAbsoluteAvatarUrl(req, user.avatar),
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET LOGGED IN USER
// ==============================
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      ...req.user.toObject(),
      avatar: buildAbsoluteAvatarUrl(req, req.user.avatar),
    },
  });
};
