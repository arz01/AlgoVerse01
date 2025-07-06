const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });   // 5 min

const TAG_MAP = {
  implementation: [
    "implementation", "constructive algorithms", "brute force", "simulation"
  ],
  dp: [
    "dynamic programming", "dp", "memoization", "tabulation"
  ],
  datastructures: [
    "data structures", "arrays", "array", "stack", "stacks", "queue", "queues", 
    "trees", "tree", "binary search tree", "bst", "segment tree", "fenwick tree",
    "linked list", "heap", "priority queue", "disjoint set", "union find"
  ],
  algorithms: [
    "sorting", "binary search", "two pointers", "two pointer", "greedy", 
    "divide and conquer", "recursion", "backtracking", "bitmasks", "bit manipulation"
  ],
  math: [
    "math", "number theory", "combinatorics", "probability", "geometry", 
    "modular arithmetic", "prime numbers", "gcd", "lcm", "modular inverse"
  ],
  graphtheory: [
    "graphs", "graph", "dfs", "bfs", "shortest paths", "minimum spanning tree", 
    "mst", "topological sorting", "strongly connected components", "scc",
    "bipartite", "matching", "flow", "network flow"
  ]
};

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

function buildSummary(submissions) {
  const summary = {};
  // init counters
  Object.keys(TAG_MAP).forEach(k => (summary[k] = { solved: 0, maxRating: 0, problems: [] }));

  // keep only solved
  const solved = submissions.filter(s => s.verdict === "OK");

  // avoid duplicates: contestId + index
  const solvedSet = new Set();
  const uniqueSolved = [];

  for (const sub of solved) {
    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    if (!solvedSet.has(key)) {
      solvedSet.add(key);
      uniqueSolved.push(sub);
    }
  }

  for (const sub of uniqueSolved) {
    const { problem } = sub;
    const rating = problem.rating || 0;

    for (const key of Object.keys(TAG_MAP)) {
      if (problem.tags.some(t => TAG_MAP[key].includes(t))) {
        summary[key].solved += 1;
        if (rating > summary[key].maxRating) summary[key].maxRating = rating;
        summary[key].problems.push({
          name: problem.name,
          rating: rating,
          tags: problem.tags
        });
      }
    }
  }

  // clamp to 150 upper bound for the progress ring
  Object.values(summary).forEach(obj => {
    if (obj.solved > 150) obj.solved = 150;
  });

  return summary;
}

async function getUserTopicSummary(handle) {
  const submissions = await fetchUserStatus(handle);
  return buildSummary(submissions);
}

async function getUserInfo(handle) {
  const cacheKey = `info:${handle}`;
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

module.exports = { getUserTopicSummary, getUserInfo }; 