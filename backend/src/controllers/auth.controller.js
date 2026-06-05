const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

/* =========================
   COOKIE CONFIG (GLOBAL STYLE)
========================= */
const cookieOptions = {
  httpOnly: true,
  secure: false, // set true kalau HTTPS production
  sameSite: "lax",
  path: "/", // 🔥 IMPORTANT BIAR BISA DI-DELETE
};

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already used" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   LOGOUT (FIXED)
========================= */
exports.logout = (req, res) => {
  res.clearCookie("token", cookieOptions);

  res.json({
    message: "Logged out successfully",
  });
};

/* =========================
   ME (AUTH CHECK)
========================= */
exports.me = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};