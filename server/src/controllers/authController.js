const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("username, email, password are required");
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409);
      throw new Error("Email already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashed });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    next(err);
  }
};