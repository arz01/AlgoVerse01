const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashed,
    });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        codeforcesHandle: user.codeforcesHandle,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateCodeforcesHandle = async (req, res) => {
  const { codeforcesHandle } = req.body;
  const userId = req.user.id;

  try {
    if (!codeforcesHandle || codeforcesHandle.trim() === '') {
      return res.status(400).json({ msg: "Codeforces handle is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { codeforcesHandle: codeforcesHandle.trim() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Codeforces handle updated successfully",
      codeforcesHandle: user.codeforcesHandle,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
