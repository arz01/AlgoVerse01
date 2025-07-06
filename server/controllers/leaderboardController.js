const User = require("../models/User");
const { getUserLeaderboardData } = require("../services/leaderboardService");

exports.getLeaderboard = async (req, res) => {
  try {
    // Get all users with Codeforces handles
    const users = await User.find({ codeforcesHandle: { $exists: true, $ne: null } })
      .select('username codeforcesHandle')
      .lean();

    if (users.length === 0) {
      return res.json({ leaderboard: [] });
    }

    // Fetch leaderboard data for all users
    const leaderboardPromises = users.map(async (user) => {
      try {
        const leaderboardData = await getUserLeaderboardData(user.codeforcesHandle);
        return {
          _id: user._id,
          username: user.username,
          codeforcesHandle: user.codeforcesHandle,
          currentRating: leaderboardData.currentRating,
          totalSolved: leaderboardData.totalSolved,
          hardProblems: leaderboardData.hardProblems,
          totalScore: leaderboardData.totalScore
        };
      } catch (error) {
        console.error(`Error fetching data for ${user.codeforcesHandle}:`, error.message);
        // Return user with zero scores if API fails
        return {
          _id: user._id,
          username: user.username,
          codeforcesHandle: user.codeforcesHandle,
          currentRating: 0,
          totalSolved: 0,
          hardProblems: 0,
          totalScore: 0
        };
      }
    });

    const leaderboardData = await Promise.all(leaderboardPromises);

    // Sort by total score (descending)
    const sortedLeaderboard = leaderboardData
      .filter(user => user.totalScore > 0) // Only include users with scores
      .sort((a, b) => b.totalScore - a.totalScore);

    res.json({ leaderboard: sortedLeaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ msg: "Failed to generate leaderboard" });
  }
};

exports.getUserScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.codeforcesHandle) {
      return res.status(404).json({ msg: "User not found or no Codeforces handle set" });
    }

    const leaderboardData = await getUserLeaderboardData(user.codeforcesHandle);
    
    res.json({
      username: user.username,
      codeforcesHandle: user.codeforcesHandle,
      currentRating: leaderboardData.currentRating,
      totalSolved: leaderboardData.totalSolved,
      hardProblems: leaderboardData.hardProblems,
      totalScore: leaderboardData.totalScore,
      ratingPoints: leaderboardData.ratingPoints,
      problemPoints: leaderboardData.problemPoints,
      difficultyBonus: leaderboardData.difficultyBonus
    });
  } catch (error) {
    console.error("User score error:", error);
    res.status(500).json({ msg: "Failed to calculate user score" });
  }
}; 