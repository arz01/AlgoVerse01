const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/gemini", require("./routes/geminiRoutes"));
app.use("/api/codeforces", require("./routes/codeforcesRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
