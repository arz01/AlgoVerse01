const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache

async function fetchUserInfo(handle) {
  const cacheKey = `userinfo:${handle}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://codeforces.com/api/user.info?handles=${handle}`;
    const { data } = await axios.get(url, { timeout: 10000 });
    
    if (data.status !== "OK") {
      throw new Error(data.comment || "Codeforces API error");
    }
    
    const userInfo = data.result[0];
    cache.set(cacheKey, userInfo);
    return userInfo;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch user info from Codeforces");
  }
}

async function fetchUserStatus(handle) {
  const cacheKey = `status:${handle}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://codeforces.com/api/user.status?handle=${handle}`;
    const { data } = await axios.get(url, { timeout: 10000 });
    
    if (data.status !== "OK") {
      throw new Error(data.comment || "Codeforces API error");
    }
    
    cache.set(cacheKey, data.result);
    return data.result;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch user data from Codeforces");
  }
}

function calculateUserScore(userInfo, submissions) {
  // Rating Points: Current CF Rating × 0.5
  const ratingPoints = (userInfo.rating || 0) * 0.5;
  
  // Get unique solved problems
  const solved = submissions.filter(s => s.verdict === "OK");
  const solvedSet = new Set();
  const uniqueSolved = [];
  
  for (const sub of solved) {
    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    if (!solvedSet.has(key)) {
      solvedSet.add(key);
      uniqueSolved.push(sub);
    }
  }
  
  // Problem Points: Total Solved × 10
  const problemPoints = uniqueSolved.length * 10;
  
  // Difficulty Bonus: Hard Problems (1600+) × 5
  const hardProblems = uniqueSolved.filter(sub => (sub.problem.rating || 0) >= 1600);
  const difficultyBonus = hardProblems.length * 5;
  
  // Total Score
  const totalScore = ratingPoints + problemPoints + difficultyBonus;
  
  return {
    currentRating: userInfo.rating || 0,
    totalSolved: uniqueSolved.length,
    hardProblems: hardProblems.length,
    totalScore: totalScore,
    ratingPoints: ratingPoints,
    problemPoints: problemPoints,
    difficultyBonus: difficultyBonus
  };
}

async function getUserLeaderboardData(handle) {
  try {
    const [userInfo, submissions] = await Promise.all([
      fetchUserInfo(handle),
      fetchUserStatus(handle)
    ]);
    
    const scoreData = calculateUserScore(userInfo, submissions);
    
    return {
      handle: handle,
      currentRating: scoreData.currentRating,
      totalSolved: scoreData.totalSolved,
      hardProblems: scoreData.hardProblems,
      totalScore: scoreData.totalScore,
      ratingPoints: scoreData.ratingPoints,
      problemPoints: scoreData.problemPoints,
      difficultyBonus: scoreData.difficultyBonus
    };
  } catch (error) {
    throw error;
  }
}

module.exports = { getUserLeaderboardData, calculateUserScore }; 