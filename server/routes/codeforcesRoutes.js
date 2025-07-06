const express = require("express");
const router = express.Router();
const { getUserTopicSummary, getUserInfo } = require("../services/codeforcesService");

// Import fetchUserStatus for debug endpoint
const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });

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

// GET /api/codeforces/:handle/summary
router.get("/:handle/summary", async (req, res) => {
  try {
    const summary = await getUserTopicSummary(req.params.handle.trim());
    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: err.message || "Invalid Codeforces handle or API error" });
  }
});

// GET /api/codeforces/:handle/info
router.get("/:handle/info", async (req, res) => {
  try {
    const userInfo = await getUserInfo(req.params.handle.trim());
    res.json(userInfo);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: err.message || "Invalid Codeforces handle or API error" });
  }
});

// GET /api/codeforces/:handle/debug - Debug endpoint to see all tags
router.get("/:handle/debug", async (req, res) => {
  try {
    const submissions = await fetchUserStatus(req.params.handle.trim());
    const solved = submissions.filter(s => s.verdict === "OK");
    
    // Get unique problems
    const solvedSet = new Set();
    const uniqueSolved = [];
    
    for (const sub of solved) {
      const key = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!solvedSet.has(key)) {
        solvedSet.add(key);
        uniqueSolved.push(sub);
      }
    }
    
    // Collect all unique tags
    const allTags = new Set();
    uniqueSolved.forEach(sub => {
      sub.problem.tags.forEach(tag => allTags.add(tag));
    });
    
    res.json({
      totalSolved: uniqueSolved.length,
      allTags: Array.from(allTags).sort(),
      sampleProblems: uniqueSolved.slice(0, 5).map(sub => ({
        name: sub.problem.name,
        rating: sub.problem.rating,
        tags: sub.problem.tags
      }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: err.message || "Invalid Codeforces handle or API error" });
  }
});

module.exports = router; 