const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

router.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ msg: "Prompt is required" });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // ✅ Truncate to 100 words
    const limitWords = (text, maxWords = 100) =>
      text.split(" ").slice(0, maxWords).join(" ");

    const trimmedText = limitWords(text);

    res.json({ reply: trimmedText });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ msg: "Gemini API call failed" });
  }
});

module.exports = router;
