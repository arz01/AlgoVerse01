const express = require("express");
const router = express.Router();
const { registerUser, loginUser, updateCodeforcesHandle, getUserProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/codeforces-handle", authMiddleware, updateCodeforcesHandle);
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
