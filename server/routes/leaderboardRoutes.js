const express = require("express");
const router = express.Router();
const { getLeaderboard, getUserScore } = require("../controllers/leaderboardController");
const auth = require("../middleware/authMiddleware");

// Get leaderboard (requires authentication)
router.get("/", auth, getLeaderboard);

// Get current user's score (requires authentication)
router.get("/my-score", auth, getUserScore);

module.exports = router; 